/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
require("dotenv").config({ path: ["local.env", ".env.local"] });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openAiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or service role key in local.env/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openAiKey ? new OpenAI({ apiKey: openAiKey }) : null;

const CATEGORY_CONTEXT = {
  "oando-workstations": {
    label: "office workstation desk system",
    avoid: ["chair", "seating", "sofa"],
  },
  "oando-tables": {
    label: "office conference table",
    avoid: ["chair", "seating", "sofa", "workstation"],
  },
  "oando-storage": {
    label: "office storage cabinet locker",
    avoid: ["chair", "seating", "table", "desk"],
  },
  "oando-seating": {
    label: "ergonomic office chair",
    avoid: ["table", "desk", "storage", "cabinet"],
  },
  "oando-chairs": {
    label: "ergonomic office chair",
    avoid: ["table", "desk", "storage", "cabinet"],
  },
};

function fallbackAlt(product) {
  const ctx = CATEGORY_CONTEXT[product.category_id] || {
    label: (product.category_id || "furniture").replace("oando-", "").replace(/-/g, " "),
    avoid: [],
  };
  return `${product.name} ${ctx.label}`.replace(/\s+/g, " ").trim().slice(0, 120);
}

async function generateAltText(product) {
  if (!openai) return fallbackAlt(product);

  const ctx = CATEGORY_CONTEXT[product.category_id] || {
    label: (product.category_id || "furniture").replace("oando-", "").replace(/-/g, " "),
    avoid: [],
  };

  const prompt = [
    "Generate concise alt text for a furniture product image.",
    "Maximum 15 words. Output only plain text.",
    `Category: ${ctx.label}`,
    `Name: ${product.name}`,
    product.description ? `Description: ${product.description}` : "",
    ctx.avoid.length ? `Avoid these words: ${ctx.avoid.join(", ")}.` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 60,
    });
    return completion.choices?.[0]?.message?.content?.trim() || fallbackAlt(product);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`AI alt generation failed for "${product.name}": ${msg}`);
    return fallbackAlt(product);
  }
}

async function run() {
  let hasAltTextColumn = true;
  const altProbe = await supabase.from("products").select("alt_text").limit(1);
  if (altProbe.error && /column .*alt_text.* does not exist/i.test(altProbe.error.message)) {
    hasAltTextColumn = false;
  } else if (altProbe.error) {
    console.error(`Failed to probe alt_text column: ${altProbe.error.message}`);
    process.exit(1);
  }

  const selectFields = hasAltTextColumn
    ? "id, name, category_id, description, alt_text, metadata"
    : "id, name, category_id, description, metadata";

  const { data: products, error } = await supabase
    .from("products")
    .select(selectFields);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    process.exit(1);
  }

  if (!products || products.length === 0) {
    console.log("No products found.");
    return;
  }

  console.log(`Generating/updating alt text for ${products.length} products...`);
  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const altText = await generateAltText(p);
    const payload = hasAltTextColumn
      ? { alt_text: altText }
      : { metadata: { ...(p.metadata || {}), ai_alt_text: altText } };

    const { error: updateError } = await supabase.from("products").update(payload).eq("id", p.id);

    if (updateError) {
      console.error(`Update failed (${p.name}): ${updateError.message}`);
      continue;
    }

    updated += 1;
    if ((i + 1) % 20 === 0 || i === products.length - 1) {
      console.log(`Progress: ${i + 1}/${products.length}, updated: ${updated}`);
    }

    if (openai) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  console.log(
    `Done. Updated alt text for ${updated}/${products.length} products via ${
      hasAltTextColumn ? "alt_text column" : "metadata.ai_alt_text fallback"
    }.`
  );
}

run().catch((err) => {
  console.error("Fatal:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
