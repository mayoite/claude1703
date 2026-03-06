import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

type PreferredContact = "email" | "whatsapp" | "phone" | "any";

type CustomerQueryPayload = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  preferredContact?: PreferredContact;
  message?: string;
  requirement?: string;
  budget?: string;
  timeline?: string;
  source?: string;
  sourcePath?: string;
};

const preferredContactValues: PreferredContact[] = [
  "email",
  "whatsapp",
  "phone",
  "any",
];

function normalizeText(value: unknown, max = 3000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function normalizePreferredContact(value: unknown): PreferredContact {
  if (typeof value !== "string") return "any";
  return preferredContactValues.includes(value as PreferredContact)
    ? (value as PreferredContact)
    : "any";
}

function normalizePhoneForWhatsApp(value: string): string {
  return value.replace(/[^\d]/g, "");
}

async function parsePayload(req: NextRequest): Promise<CustomerQueryPayload> {
  try {
    return (await req.json()) as CustomerQueryPayload;
  } catch {
    return {};
  }
}

export async function POST(req: NextRequest) {
  const payload = await parsePayload(req);

  const name = normalizeText(payload.name, 180);
  const message = normalizeText(payload.message, 5000);
  const company = normalizeText(payload.company, 180);
  const email = normalizeText(payload.email, 180);
  const phone = normalizeText(payload.phone, 50);
  const requirement = normalizeText(payload.requirement, 300);
  const budget = normalizeText(payload.budget, 120);
  const timeline = normalizeText(payload.timeline, 120);
  const source = normalizeText(payload.source, 60) || "website";
  const sourcePath = normalizeText(payload.sourcePath, 200);
  const preferredContact = normalizePreferredContact(payload.preferredContact);

  if (!name || !message) {
    return NextResponse.json(
      { error: "Name and message are required." },
      { status: 400 },
    );
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: "Please provide email or phone." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("customer_queries")
    .insert({
      name,
      company: company || null,
      email: email || null,
      phone: phone || null,
      preferred_contact: preferredContact,
      message,
      requirement: requirement || null,
      budget: budget || null,
      timeline: timeline || null,
      source,
      source_path: sourcePath || null,
    })
    .select("id, created_at, email, phone")
    .single();

  if (error || !data) {
    console.error("customer_queries insert failed:", error?.message || "unknown");
    return NextResponse.json(
      { error: "Unable to save query right now." },
      { status: 500 },
    );
  }

  const whatsappPhone = data.phone ? normalizePhoneForWhatsApp(data.phone) : "";
  const queryId = data.id;
  const queryRefText = encodeURIComponent(
    `Hello, we received your query ${queryId}.`,
  );

  return NextResponse.json(
    {
      success: true,
      queryId,
      createdAt: data.created_at,
      followUp: {
        email: data.email ? `mailto:${data.email}?subject=Query%20${queryId}` : null,
        whatsapp:
          whatsappPhone.length >= 8
            ? `https://wa.me/${whatsappPhone}?text=${queryRefText}`
            : null,
      },
    },
    { status: 201 },
  );
}
