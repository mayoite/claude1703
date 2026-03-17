/**
 * Audit Supabase `products` table for cross-category image mismatches.
 *
 * Usage:
 *   npx tsx scripts/audit-mismatches.ts          # dry run
 *   npx tsx scripts/audit-mismatches.ts --fix    # audit + upsert fixes
 */

import { config } from "dotenv";
import { resolve } from "path";
import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";

config({
  path: [resolve(process.cwd(), "local.env"), resolve(process.cwd(), ".env.local")],
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or service key.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const shouldFix = process.argv.includes("--fix");

const CATEGORY_SEGMENTS: Record<string, string> = {
  "oando-workstations": "workstations",
  "oando-tables": "tables",
  "oando-storage": "storage",
  "oando-seating": "seating",
  "oando-chairs": "seating",
  "oando-other-seating": "seating",
  "oando-soft-seating": "soft-seating",
  "oando-educational": "educational",
  "oando-collaborative": "collaborative",
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "oando-tables": ["chair", "seating", "sofa", "lounge"],
  "oando-workstations": ["chair", "seating", "sofa", "table", "lounge"],
  "oando-storage": ["chair", "seating", "sofa", "table", "desk"],
  "oando-seating": ["table", "storage", "cabinet", "locker", "workstation"],
  "oando-chairs": ["table", "storage", "cabinet", "locker", "workstation"],
  "oando-soft-seating": ["table", "storage", "cabinet", "locker", "workstation"],
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  category_id: string | null;
  images: string[] | null;
};

type AuditRow = {
  productId: string;
  productName: string;
  category: string;
  slug: string;
  mismatchedImage: string;
  fixedImage: string;
};

type AuditReport = {
  generatedAt: string;
  scannedProducts: number;
  mismatchCount: number;
  fixedProductCount: number;
  columns: Array<keyof AuditRow>;
  rows: AuditRow[];
};

function containsKeywordToken(pathValue: string, keyword: string): boolean {
  const lower = pathValue.toLowerCase();
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return re.test(lower);
}

function isMismatchedForCategory(categoryId: string, imagePath: string): boolean {
  const forbidden = CATEGORY_KEYWORDS[categoryId] || [];
  if (forbidden.length === 0) return false;
  return forbidden.some((kw) => containsKeywordToken(imagePath, kw));
}

function expectedSegment(categoryId: string): string {
  if (CATEGORY_SEGMENTS[categoryId]) return CATEGORY_SEGMENTS[categoryId];
  return categoryId.replace(/^oando-/, "");
}

function buildFixedPath(currentPath: string, segment: string): string {
  const filename = currentPath.split("/").pop() || "image-1.webp";
  return `/images/${segment}/${filename}`;
}

async function main() {
  console.log(`Image mismatch audit started (${shouldFix ? "fix mode" : "dry run"})`);

  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, category, category_id, images")
    .order("category_id", { ascending: true });

  if (error) {
    throw new Error(`Supabase read failed: ${error.message}`);
  }

  const products = (data || []) as ProductRow[];
  const auditRows: AuditRow[] = [];
  const fixedProducts: Array<{ id: string; images: string[] }> = [];

  for (const p of products) {
    const catId = (p.category_id || p.category || "").trim();
    if (!catId) continue;

    const images = Array.isArray(p.images) ? p.images : [];
    if (images.length === 0) continue;

    const fixedImages: string[] = [];
    let hasMismatch = false;
    const segment = expectedSegment(catId);

    for (const img of images) {
      if (!img || typeof img !== "string") continue;
      if (img.startsWith("http://") || img.startsWith("https://")) {
        fixedImages.push(img);
        continue;
      }

      const mismatch = isMismatchedForCategory(catId, img);
      if (!mismatch) {
        fixedImages.push(img);
        continue;
      }

      const fixed = buildFixedPath(img, segment);
      hasMismatch = true;
      fixedImages.push(fixed);
      auditRows.push({
        productId: p.id,
        productName: p.name,
        category: catId,
        slug: p.slug,
        mismatchedImage: img,
        fixedImage: fixed,
      });
    }

    if (hasMismatch) {
      fixedProducts.push({ id: p.id, images: fixedImages });
    }
  }

  const report: AuditReport = {
    generatedAt: new Date().toISOString(),
    scannedProducts: products.length,
    mismatchCount: auditRows.length,
    fixedProductCount: fixedProducts.length,
    columns: [
      "productId",
      "productName",
      "category",
      "slug",
      "mismatchedImage",
      "fixedImage",
    ],
    rows: auditRows,
  };

  const outPath = resolve(process.cwd(), "scripts", "audit-results.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  console.log(`Scanned: ${products.length} products`);
  console.log(`Mismatches: ${auditRows.length}`);
  console.log(`JSON output: ${outPath}`);

  if (auditRows.length > 0) {
    console.log("Sample rows:");
    for (const row of auditRows.slice(0, 10)) {
      console.log(
        `${row.category.padEnd(20)} | ${row.productName.padEnd(24)} | ${row.mismatchedImage} -> ${row.fixedImage}`
      );
    }
  }

  if (shouldFix && fixedProducts.length > 0) {
    const batchSize = 50;
    let updated = 0;

    for (let i = 0; i < fixedProducts.length; i += batchSize) {
      const batch = fixedProducts.slice(i, i + batchSize);
      const { error: upsertError } = await supabase
        .from("products")
        .upsert(batch, { onConflict: "id" });
      if (upsertError) {
        throw new Error(`Upsert batch ${i}-${i + batch.length} failed: ${upsertError.message}`);
      }
      updated += batch.length;
      console.log(`Updated ${updated}/${fixedProducts.length}`);
    }
  }

  if (auditRows.length > 0 && !shouldFix) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
