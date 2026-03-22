import OpenAI from "openai";
import { NextRequest } from "next/server";
import { LIBRARY } from "@/lib/planner/catalog";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Compact catalog snapshot sent in the system prompt */
const CATALOG_SNAPSHOT = LIBRARY.map((p) => ({
  id: p.id,
  name: p.name,
  category: p.category,
  tags: p.tags,
  variants: p.variants.map((v) => ({
    id: v.id,
    label: v.label,
    widthMm: v.widthMm,
    depthMm: v.depthMm,
    seatCount: v.seatCount ?? 0,
    priceInr: v.priceInr,
  })),
}));

const SYSTEM_PROMPT = `You are an expert office furniture planner assistant for an Indian furniture brand.
You help users plan office layouts by suggesting specific products from the catalog below.

CATALOG (JSON):
${JSON.stringify(CATALOG_SNAPSHOT, null, 2)}

When the user describes what they need, respond with a JSON object matching this exact schema:
{
  "thoughts": "brief reasoning in 1-2 sentences",
  "suggestions": [
    {
      "productId": "exact product id from catalog",
      "variantId": "exact variant id from catalog",
      "badge": "short label e.g. '6 seats' or 'Premium pick'",
      "reason": "one sentence explaining why this suits the user's request",
      "xMm": <suggested x position in mm from room left edge, or null>,
      "yMm": <suggested y position in mm from room top edge, or null>,
      "rotation": <0 or 90>
    }
  ]
}

Rules:
- Return 2–4 suggestions maximum.
- Only use productId and variantId values that exist in the catalog above.
- Suggest positions (xMm, yMm) only when the room dimensions are provided and you can reason about placement; otherwise set null.
- Keep rotation as 0 unless rotating 90° clearly improves fit.
- Respond ONLY with the JSON object, no markdown code fences, no extra text.`;

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    query: string;
    roomWidthMm: number;
    roomDepthMm: number;
    seatTarget: number;
    currentItemCount: number;
  };

  const { query, roomWidthMm, roomDepthMm, seatTarget, currentItemCount } = body;

  if (!query?.trim()) {
    return new Response(JSON.stringify({ error: "query is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userMessage = `Room: ${roomWidthMm / 1000}m wide × ${roomDepthMm / 1000}m deep. Target: ${seatTarget} seats. Currently ${currentItemCount} items placed.\n\nUser request: ${query}`;

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 1024,
    stream: true,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
