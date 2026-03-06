import "server-only";

import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/db";
import type { BusinessStats, BusinessStatsResult } from "@/lib/types/businessStats";
import { fetchNhostBusinessStats } from "@/lib/nhostBackup";

interface BusinessStatsRow {
  projects_delivered: number;
  client_organisations: number;
  sectors_served: number;
  locations_served: number;
  years_experience: number;
  as_of_date: string;
}

const FETCH_TIMEOUT_MS = 1200;
const STATS_REVALIDATE_SECONDS = 300;

const SAFE_DEFAULT_STATS: BusinessStats = {
  projectsDelivered: 259,
  clientOrganisations: 120,
  sectorsServed: 18,
  locationsServed: 20,
  yearsExperience: 15,
  asOfDate: "2026-03-01",
};

let lastKnownGoodStats: BusinessStats | null = null;
const loggedBusinessStatsFallbacks = new Set<string>();

function isExpectedStatsFallback(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("public.business_stats_current") ||
    normalized.includes("missing_active_business_stats")
  );
}

function normalizeAsOfDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return SAFE_DEFAULT_STATS.asOfDate;
  }
  return parsed.toISOString().slice(0, 10);
}

function normalizeRow(row: BusinessStatsRow): BusinessStats {
  return {
    projectsDelivered: Math.max(0, Number(row.projects_delivered) || 0),
    clientOrganisations: Math.max(0, Number(row.client_organisations) || 0),
    sectorsServed: Math.max(0, Number(row.sectors_served) || 0),
    locationsServed: Math.max(0, Number(row.locations_served) || 0),
    yearsExperience: Math.max(0, Number(row.years_experience) || 0),
    asOfDate: normalizeAsOfDate(row.as_of_date),
  };
}

async function fetchLiveBusinessStats(): Promise<BusinessStats> {
  const dbQuery = supabase
    .from("business_stats_current")
    .select(
      "projects_delivered, client_organisations, sectors_served, locations_served, years_experience, as_of_date",
    )
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`timeout>${FETCH_TIMEOUT_MS}ms`)), FETCH_TIMEOUT_MS);
  });

  const result = await Promise.race([dbQuery, timeout]);
  const { data, error } = result as Awaited<typeof dbQuery>;

  if (error) {
    throw new Error(`supabase:${error.message}`);
  }

  if (!data) {
    throw new Error("supabase:missing_active_business_stats");
  }

  return normalizeRow(data as BusinessStatsRow);
}

const getCachedLiveBusinessStats = unstable_cache(fetchLiveBusinessStats, ["business-stats-live"], {
  revalidate: STATS_REVALIDATE_SECONDS,
  tags: ["business-stats"],
});

export async function getBusinessStats(options?: {
  forceLive?: boolean;
}): Promise<BusinessStatsResult> {
  const fetchedAt = new Date().toISOString();

  try {
    const stats = options?.forceLive
      ? await fetchLiveBusinessStats()
      : await getCachedLiveBusinessStats();
    lastKnownGoodStats = stats;
    return { stats, source: "supabase", fetchedAt };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const summarized = message.slice(0, 180);
    if (!isExpectedStatsFallback(summarized) && !loggedBusinessStatsFallbacks.has(summarized)) {
      loggedBusinessStatsFallbacks.add(summarized);
      if (process.env.NODE_ENV !== "production") {
        console.error(`[business-stats] fallback: ${summarized}`);
      }
    }

    const nhostStats = await fetchNhostBusinessStats(SAFE_DEFAULT_STATS.asOfDate);
    if (nhostStats) {
      lastKnownGoodStats = nhostStats;
      return { stats: nhostStats, source: "nhost-backup", fetchedAt };
    }

    if (lastKnownGoodStats) {
      return { stats: lastKnownGoodStats, source: "stale-cache", fetchedAt };
    }

    return { stats: SAFE_DEFAULT_STATS, source: "safe-default", fetchedAt };
  }
}
