const fs = require("node:fs");
const path = require("node:path");
const { config: loadEnv } = require("dotenv");
const { createClient } = require("@supabase/supabase-js");
const cheerio = require("cheerio");

loadEnv({ path: ".env.local", override: false, quiet: true });

const APPLY = process.argv.includes("--apply");
const REFRESH_SOURCES = process.argv.includes("--refresh-sources");
const ONLY_SLUG = (process.argv.find((arg) => arg.startsWith("--slug=")) || "").slice("--slug=".length).trim();
const LIMIT_ARG = Number.parseInt(
  (process.argv.find((arg) => arg.startsWith("--limit=")) || "").slice("--limit=".length),
  10,
);
const LIMIT = Number.isFinite(LIMIT_ARG) && LIMIT_ARG > 0 ? LIMIT_ARG : 0;
const OFFSET_ARG = Number.parseInt(
  (process.argv.find((arg) => arg.startsWith("--offset=")) || "").slice("--offset=".length),
  10,
);
const OFFSET = Number.isFinite(OFFSET_ARG) && OFFSET_ARG > 0 ? OFFSET_ARG : 0;

const REPO_ROOT = process.cwd();
const AUDIT_DIR = path.join(REPO_ROOT, "docs", "audit");
const LOCAL_IMAGE_ROOT = path.join(REPO_ROOT, "public", "images", "catalog");
const AFC_SITEMAP_URL = "https://www.afcindia.in/sitemap.xml";
const AFC_PLACEHOLDER_PATTERN = /\/plugins\/Basic\/assets\/placeholder\.[^/]+$/i;
const AFC_SOURCES_CACHE_PATH = path.join(AUDIT_DIR, "afc-product-sources-2026-03-15.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

const SUBCATEGORY_MAP = {
  "desking-series": { categoryId: "workstations", categoryLabel: "Workstations", subcategoryId: "desking", subcategoryLabel: "Desking Series" },
  "height-adjustable-series": { categoryId: "workstations", categoryLabel: "Workstations", subcategoryId: "height-adjustable", subcategoryLabel: "Height Adjustable Series" },
  "panel-series": { categoryId: "workstations", categoryLabel: "Workstations", subcategoryId: "panel", subcategoryLabel: "Panel Series" },
  "cabin-tables": { categoryId: "tables", categoryLabel: "Tables", subcategoryId: "cabin", subcategoryLabel: "Cabin Tables" },
  "meeting-tables": { categoryId: "tables", categoryLabel: "Tables", subcategoryId: "meeting", subcategoryLabel: "Meeting Tables" },
  "cafe-tables": { categoryId: "tables", categoryLabel: "Tables", subcategoryId: "cafe", subcategoryLabel: "Cafe Tables" },
  "training-tables": { categoryId: "tables", categoryLabel: "Tables", subcategoryId: "training", subcategoryLabel: "Training Tables" },
  "prelam-storage": { categoryId: "storages", categoryLabel: "Storage", subcategoryId: "prelam", subcategoryLabel: "Prelam Storage" },
  "metal-storage": { categoryId: "storages", categoryLabel: "Storage", subcategoryId: "metal", subcategoryLabel: "Metal Storage" },
  "compactor-storage": { categoryId: "storages", categoryLabel: "Storage", subcategoryId: "compactor", subcategoryLabel: "Compactor Storage" },
  locker: { categoryId: "storages", categoryLabel: "Storage", subcategoryId: "locker", subcategoryLabel: "Locker" },
  "mesh-chair": { categoryId: "seating", categoryLabel: "Seating", subcategoryId: "mesh", subcategoryLabel: "Mesh Chair" },
  "leather-chair": { categoryId: "seating", categoryLabel: "Seating", subcategoryId: "leather", subcategoryLabel: "Leather Chair" },
  "training-chair": { categoryId: "seating", categoryLabel: "Seating", subcategoryId: "study", subcategoryLabel: "Training Chair" },
  "cafe-chair": { categoryId: "seating", categoryLabel: "Seating", subcategoryId: "cafe", subcategoryLabel: "Cafe Chair" },
  lounge: { categoryId: "soft-seating", categoryLabel: "Soft Seating", subcategoryId: "lounge", subcategoryLabel: "Lounge" },
  sofa: { categoryId: "soft-seating", categoryLabel: "Soft Seating", subcategoryId: "sofa", subcategoryLabel: "Sofa" },
  collaborative: { categoryId: "soft-seating", categoryLabel: "Soft Seating", subcategoryId: "collaborative", subcategoryLabel: "Collaborative" },
  pouffee: { categoryId: "soft-seating", categoryLabel: "Soft Seating", subcategoryId: "pouffee", subcategoryLabel: "Pouffee" },
  "occasional-tables": { categoryId: "soft-seating", categoryLabel: "Soft Seating", subcategoryId: "occasional-tables", subcategoryLabel: "Occasional Tables" },
  classroom: { categoryId: "education", categoryLabel: "Educational", subcategoryId: "classroom", subcategoryLabel: "Classroom" },
  library: { categoryId: "education", categoryLabel: "Educational", subcategoryId: "library", subcategoryLabel: "Library" },
  hostel: { categoryId: "education", categoryLabel: "Educational", subcategoryId: "hostel", subcategoryLabel: "Hostel" },
  auditorium: { categoryId: "education", categoryLabel: "Educational", subcategoryId: "auditorium", subcategoryLabel: "Auditorium" },
  "accessories-all": { categoryId: "accessories", categoryLabel: "Accessories", subcategoryId: "accessories-all", subcategoryLabel: "Accessories All" },
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function sanitizeText(value) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (!/[Ãâ€]/.test(normalized)) {
    return normalized;
  }
  try {
    const repaired = Buffer.from(normalized, "latin1").toString("utf8").replace(/\s+/g, " ").trim();
    return repaired || normalized;
  } catch {
    return normalized;
  }
}

function repairImportedText(value) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  const commonFixed = normalized
    .replace(/â€”/g, "—")
    .replace(/â€“/g, "–")
    .replace(/â€™|â€˜/g, "'")
    .replace(/â€œ|â€/g, "\"")
    .replace(/â€¦/g, "...");
  if (!/[Ãâ]/.test(commonFixed)) {
    return commonFixed;
  }
  try {
    const repaired = Buffer.from(commonFixed, "latin1")
      .toString("utf8")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/â€”/g, "—")
      .replace(/â€“/g, "–")
      .replace(/â€™|â€˜/g, "'")
      .replace(/â€œ|â€/g, "\"")
      .replace(/â€¦/g, "...");
    return repaired || commonFixed;
  } catch {
    return commonFixed;
  }
}

function normalizeDimensionLine(value) {
  return repairImportedText(value)
    .replace(/([0-9])([A-Z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([0-9)])\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*:)/g, "$1; $2")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isGenericInfoBlock(label, body) {
  const normalizedLabel = sanitizeText(label).toLowerCase();
  const normalizedBody = sanitizeText(body).toLowerCase();
  if (!normalizedLabel || !normalizedBody) return true;

  if (
    normalizedLabel === "sustainability" &&
    normalizedBody ===
      "crafted with eco-friendly materials and sustainable practices to minimize environmental impact while maximizing durability."
  ) {
    return true;
  }

  if (
    normalizedLabel === "warranty" &&
    normalizedBody ===
      "backed by our comprehensive upto 10 year warranty, ensuring lasting quality and peace of mind with every purchase."
  ) {
    return true;
  }

  return false;
}

function isLikelyFinishToken(value) {
  const normalized = sanitizeText(value).toLowerCase();
  if (!normalized) return false;
  if (/^fabric\s*\d+$/i.test(normalized)) return true;
  if (/^(black|white|blue|orange|green|grey|gray|silver|misty|slate|gothic|graphite|cadit|butter scotch|light grey|silver grey)$/i.test(normalized)) {
    return true;
  }
  if (/(teak|maple|pine|acacia)$/i.test(normalized)) return true;
  return false;
}

function extractMaterialDetails(source) {
  const candidates = [];
  const add = (value) => {
    const normalized = sanitizeText(value);
    if (!normalized) return;
    if (isLikelyFinishToken(normalized)) return;
    candidates.push(normalized);
  };

  source.materials.forEach(add);

  const bodies = source.overviewPairs.flatMap((pair) => [pair.heading, pair.body]);
  const materialKeywords =
    /\b(mesh|fabric|foam|nylon|metal|steel|aluminium|aluminum|wood|wooden|laminate|plywood|polyester|polypropylene|polyurethane|upholster|upholstery|base|frame|top)\b/i;
  for (const body of bodies) {
    const sentences = sanitizeText(body)
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sanitizeText(sentence));
    for (const sentence of sentences) {
      if (materialKeywords.test(sentence)) add(sentence);
    }
  }

  return [...new Set(candidates)].slice(0, 8);
}

function slugify(value) {
  return sanitizeText(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function normalizeLocalSlug(slug) {
  return sanitizeText(slug)
    .replace(/^oando-[a-z-]+--/, "")
    .replace(/-\d+$/, "")
    .replace(/-(?=[a-z0-9]{5}$)(?=.*\d)[a-z0-9]{5}$/, "")
    .toLowerCase();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; CodexCatalogSync/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} for ${url}`);
  }
  return response.text();
}

async function downloadBinary(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; CodexCatalogSync/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`Download failed ${response.status} for ${url}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

function extractProductCards(html, subcategorySlug) {
  const $ = cheerio.load(html);
  const info = SUBCATEGORY_MAP[subcategorySlug];
  const products = [];

  $("a.product-card-link[href*='/products/']").each((_, el) => {
    const href = sanitizeText($(el).attr("href"));
    const slug = href.replace(/\/+$/, "").split("/").pop();
    if (!slug) return;
    const text = sanitizeText($(el).text()).replace(/Seating$|Tables$|Workstations$|Storage$|Educational$|Accessories$/i, "");
    products.push({
      slug,
      inferredName: text || slug,
      href: href.startsWith("http") ? href : `https://www.afcindia.in${href}`,
      subcategorySlug,
      ...info,
    });
  });

  return products;
}

function extractProductPage(html, sourceMeta) {
  const $ = cheerio.load(html);
  const rawName =
    repairImportedText($("h1.resource-title").first().text()) ||
    repairImportedText($("h1").first().text()) ||
    sourceMeta.inferredName;
  const metaDescription = repairImportedText($('meta[name="description"]').attr("content"));
  const keywords = repairImportedText($('meta[name="keywords"]').attr("content"))
    .split(",")
    .map((item) => repairImportedText(item))
    .filter(Boolean);

  const overviewPairs = [];
  $(".overview-block").each((_, el) => {
    const heading = repairImportedText($(el).find("h2,h3").first().text());
    const body = repairImportedText($(el).find("p").first().text());
    if (heading || body) {
      overviewPairs.push({ heading, body });
    }
  });

  const galleryImages = [];
  $("a[data-fancybox='gallery'] img").each((_, el) => {
    const src = sanitizeText($(el).attr("src"));
    if (!src || !src.startsWith("https://cdn.prod.website-files.com/")) return;
    if (AFC_PLACEHOLDER_PATTERN.test(src)) return;
    galleryImages.push(src);
  });

  const materials = [];
  $(".material-title").each((_, el) => {
    const text = repairImportedText($(el).text());
    if (text) materials.push(text);
  });

  const docs = [];
  $(".product-catalogues-grid a[target='_blank']").each((_, el) => {
    const href = sanitizeText($(el).attr("href"));
    const title = repairImportedText($(el).find(".card-title").text());
    if (href) docs.push({ title, href });
  });

  const certifications = [];
  $(".catalogues-certificate-grid .card-title").each((_, el) => {
    const text = repairImportedText($(el).text());
    if (text) certifications.push(text);
  });

  const specSections = [];
  $("[data-w-tab='Specs'] .specs-item").each((_, el) => {
    const heading = repairImportedText($(el).find(".spec-heading-h3, h3").first().text());
    const lines = $(el)
      .find(".spec-dimension p, .spec-dimension li")
      .map((__, item) => normalizeDimensionLine($(item).text()))
      .get()
      .filter((line) => line && line !== "?" && /[a-z0-9]/i.test(line));
    if (heading || lines.length > 0) {
      specSections.push({ heading, lines });
    }
  });

  const infoBlocks = {};
  $(".resource-info-item-block").each((_, el) => {
    const label = repairImportedText($(el).find(".resource-title-info").text());
    const body = repairImportedText($(el).find(".resource-info-text").text());
    if (label && body && !isGenericInfoBlock(label, body)) infoBlocks[label] = body;
  });

  return {
    slug: sourceMeta.slug,
    sourceUrl: sourceMeta.href,
    name: rawName,
    categoryId: sourceMeta.categoryId,
    categoryLabel: sourceMeta.categoryLabel,
    subcategorySlug: sourceMeta.subcategorySlug,
    subcategoryId: sourceMeta.subcategoryId,
    subcategoryLabel: sourceMeta.subcategoryLabel,
    metaDescription,
    keywords,
    overviewPairs,
    galleryImages: [...new Set(galleryImages)],
    materials: [...new Set(materials)],
    docs,
    certifications: [...new Set(certifications)],
    specSections,
    infoBlocks,
  };
}

function buildFeatureList(source) {
  const values = source.overviewPairs
    .map((pair) => sanitizeText(pair.heading))
    .filter(Boolean)
    .slice(0, 6);
  return [...new Set(values)];
}

function buildOverview(source) {
  const firstParagraph = source.overviewPairs.map((pair) => pair.body).find(Boolean);
  return firstParagraph || source.metaDescription || "";
}

function singularizeLabel(value) {
  const normalized = sanitizeText(value);
  if (/series$/i.test(normalized)) {
    return normalized;
  }
  return normalized.replace(/ies$/i, "y").replace(/s$/i, "");
}

function inferProductLabel(source) {
  if (source.categoryId === "workstations") {
    return "workstation system";
  }
  return singularizeLabel(source.subcategoryLabel || source.categoryLabel || "product");
}

function extractUseCasePhrase(source) {
  const match = sanitizeText(source.metaDescription).match(/\bfor ([^.]+?)(?:\.|$)/i);
  return match?.[1] ? sanitizeText(match[1]).replace(/\bby AFC India\b/i, "") : "";
}

function buildFeatureCue(source) {
  const haystack = sanitizeText(
    source.overviewPairs
      .map((pair) => `${pair.heading} ${pair.body}`)
      .join(" "),
  ).toLowerCase();

  if (haystack.includes("cross-base")) {
    return "The cross-base layout keeps the table steady through daily use.";
  }
  if (haystack.includes("headrest")) {
    return "The chair includes dedicated head and neck support for longer work sessions.";
  }
  if (haystack.includes("lumbar")) {
    return "Integrated lumbar support helps maintain a steadier seated posture.";
  }
  if (haystack.includes("cable management")) {
    return "Cable-routing support keeps workstation layouts cleaner and easier to maintain.";
  }
  if (haystack.includes("acoustic")) {
    return "The form is suited to quieter breakout and focused collaboration zones.";
  }
  if (haystack.includes("storage")) {
    return "The layout supports organized day-to-day storage and easier access to essentials.";
  }

  return "";
}

function buildDescription(source) {
  const label = inferProductLabel(source).toLowerCase();
  const useCase = extractUseCasePhrase(source);
  const opening = useCase
    ? `${source.name} is a ${label} designed for ${useCase}.`
    : `${source.name} is a ${label} built for commercial interiors.`;
  const featureCue = buildFeatureCue(source);
  return [opening, featureCue].filter(Boolean).join(" ");
}

function buildAltText(source) {
  const label = inferProductLabel(source);
  return sanitizeText(label ? `${source.name} ${label}` : source.name);
}

function buildSeriesName(source) {
  return source.subcategoryLabel || `${source.categoryLabel} Series`;
}

function buildDimensions(source) {
  return source.specSections
    .flatMap((section) => section.lines)
    .filter(Boolean)
    .join("; ");
}

function detectHeadrest(source) {
  return /headrest/i.test(
    [
      source.metaDescription,
      ...source.overviewPairs.map((pair) => pair.heading),
      ...source.overviewPairs.map((pair) => pair.body),
      ...source.specSections.flatMap((section) => section.lines),
    ].join(" "),
  );
}

function buildSpecs(source) {
  const materialDetails = extractMaterialDetails(source);
  const finishOptions = source.materials.filter((item) => isLikelyFinishToken(item)).slice(0, 20);
  return {
    category: source.categoryLabel,
    subcategory: source.subcategoryLabel,
    features: buildFeatureList(source),
    materials: materialDetails,
    finish_options: finishOptions,
    dimensions: buildDimensions(source),
    documents: [],
    document_titles: source.docs.map((doc) => doc.title).filter(Boolean),
    certifications: source.certifications,
    overview_sections: source.overviewPairs,
    dimension_sections: source.specSections,
    warranty_text: source.infoBlocks.Warranty || "",
    sustainability_text: source.infoBlocks.Sustainability || "",
  };
}

function buildMetadata(source) {
  const certifications = source.certifications || [];
  const warrantyText = source.infoBlocks.Warranty || "";
  const warrantyYearsMatch = warrantyText.match(/(\d+)\s*year/i);
  return {
    category: source.categoryLabel,
    categoryIdCanonical: source.categoryId,
    subcategory: source.subcategoryLabel,
    subcategoryId: source.subcategoryId,
    subcategoryLabel: source.subcategoryLabel,
    subcategory_slug: source.subcategorySlug,
    certifications,
    hasHeadrest: detectHeadrest(source),
    bifmaCertified: certifications.some((item) => /bifma/i.test(item)),
    warrantyYears: warrantyYearsMatch ? Number.parseInt(warrantyYearsMatch[1], 10) : null,
    ai_alt_text: buildAltText(source),
    sourceSlug: source.slug,
  };
}

async function writeLocalImages(localSlug, imageUrls) {
  const productDir = path.join(LOCAL_IMAGE_ROOT, localSlug);
  fs.rmSync(productDir, { recursive: true, force: true });
  ensureDir(productDir);

  const saved = [];
  for (let index = 0; index < imageUrls.length; index += 1) {
    const url = imageUrls[index];
    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const filename = `image-${index + 1}${ext}`;
    const filePath = path.join(productDir, filename);
    const buffer = await downloadBinary(url);
    fs.writeFileSync(filePath, buffer);
    saved.push(`/images/catalog/${localSlug}/${filename}`);
  }
  return saved;
}

async function getLocalCatalog() {
  const [{ data: products, error: productError }, { data: specs, error: specsError }] =
    await Promise.all([
      supabase
        .from("products")
        .select("id,slug,name,category_id,series_name,description,flagship_image,images,specs,metadata,alt_text")
        .order("category_id", { ascending: true })
        .order("name", { ascending: true }),
      supabase.from("product_specs").select("product_id,specs"),
    ]);

  if (productError) throw new Error(productError.message);
  if (specsError) throw new Error(specsError.message);

  const specsMap = new Map((specs || []).map((row) => [row.product_id, row.specs || {}]));
  return (products || []).map((row) => ({
    ...row,
    specs: specsMap.get(row.id) || row.specs || {},
  }));
}

async function getAfcSources() {
  if (!REFRESH_SOURCES && fs.existsSync(AFC_SOURCES_CACHE_PATH)) {
    return JSON.parse(fs.readFileSync(AFC_SOURCES_CACHE_PATH, "utf8"));
  }

  const sitemapXml = await fetchText(AFC_SITEMAP_URL);
  const urls = parseSitemapUrls(sitemapXml);
  const subcategoryUrls = urls.filter((url) => url.includes("/sub-categories/"));

  const productMap = new Map();
  for (const subcategoryUrl of subcategoryUrls) {
    const subcategorySlug = subcategoryUrl.replace(/\/+$/, "").split("/").pop();
    const mapping = SUBCATEGORY_MAP[subcategorySlug];
    if (!mapping || mapping.categoryId === "accessories") continue;
    let html = "";
    try {
      html = await fetchText(subcategoryUrl);
    } catch (error) {
      console.warn(`[sync] skipping subcategory ${subcategorySlug}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    const cards = extractProductCards(html, subcategorySlug);
    for (const card of cards) {
      productMap.set(card.slug, card);
    }
  }

  const sources = [];
  for (const card of productMap.values()) {
    try {
      const html = await fetchText(card.href);
      sources.push(extractProductPage(html, card));
    } catch (error) {
      console.warn(`[sync] skipping product ${card.slug}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  fs.writeFileSync(AFC_SOURCES_CACHE_PATH, JSON.stringify(sources, null, 2), "utf8");
  return sources;
}

function matchSource(localRow, sourceBySlug, sourceByName) {
  const normalizedSlug = normalizeLocalSlug(localRow.slug);
  if (sourceBySlug.has(normalizedSlug)) {
    return sourceBySlug.get(normalizedSlug);
  }
  const normalizedName = slugify(localRow.name);
  return sourceByName.get(normalizedName) || null;
}

async function replaceProductImages(productId, imagePaths) {
  await supabase.from("product_images").delete().eq("product_id", productId);
  const rows = imagePaths.map((imagePath, index) => ({
    product_id: productId,
    image_url: imagePath,
    image_kind: index === 0 ? "flagship" : "gallery",
    sort_order: index,
  }));
  if (rows.length > 0) {
    const { error } = await supabase.from("product_images").insert(rows);
    if (error) throw new Error(`product_images insert failed: ${error.message}`);
  }
}

async function upsertProductSpecs(productId, specs) {
  const { error } = await supabase.from("product_specs").upsert(
    {
      product_id: productId,
      specs,
    },
    { onConflict: "product_id" },
  );
  if (error) throw new Error(`product_specs upsert failed: ${error.message}`);
}

async function run() {
  ensureDir(AUDIT_DIR);

  const localCatalog = await getLocalCatalog();
  const afcSources = await getAfcSources();

  const sourceBySlug = new Map(afcSources.map((source) => [source.slug, source]));
  const sourceByName = new Map(afcSources.map((source) => [slugify(source.name), source]));

  const candidates = localCatalog.filter((row) => !ONLY_SLUG || row.slug === ONLY_SLUG);
  const offsetCandidates = OFFSET > 0 ? candidates.slice(OFFSET) : candidates;
  const selected = LIMIT > 0 ? offsetCandidates.slice(0, LIMIT) : offsetCandidates;

  const report = {
    generatedAt: new Date().toISOString(),
    mode: APPLY ? "apply" : "dry-run",
    offset: OFFSET,
    limit: LIMIT || null,
    totalLocalProducts: localCatalog.length,
    totalAfcProducts: afcSources.length,
    selectedProducts: selected.length,
    matched: [],
    unmatched: [],
  };

  for (const row of selected) {
    const source = matchSource(row, sourceBySlug, sourceByName);
    if (!source) {
      report.unmatched.push({
        slug: row.slug,
        name: row.name,
        categoryId: row.category_id,
      });
      continue;
    }

    const description = buildDescription(source);
    const specs = buildSpecs(source, row.specs);
    const metadata = buildMetadata(source, row.metadata);
    const target = {
      id: row.id,
      slug: row.slug,
      name: source.name,
      category_id: source.categoryId,
      series_name: buildSeriesName(source),
      description,
      specs,
      metadata,
      alt_text: buildAltText(source),
      sourceSlug: source.slug,
      sourceCategory: source.categoryLabel,
      sourceSubcategory: source.subcategoryLabel,
      sourceImages: source.galleryImages,
      sourceDocs: source.docs,
      sourceCertifications: source.certifications,
    };

    if (APPLY) {
      const localImages = await writeLocalImages(row.slug, source.galleryImages.slice(0, 8));
      const updatePayload = {
        name: target.name,
        category_id: target.category_id,
        series_name: target.series_name,
        description: target.description,
        flagship_image: localImages[0] || row.flagship_image,
        images: localImages,
        specs: target.specs,
        metadata: target.metadata,
        alt_text: target.alt_text,
      };
      const { error: updateError } = await supabase.from("products").update(updatePayload).eq("id", row.id);
      if (updateError) {
        throw new Error(`products update failed for ${row.slug}: ${updateError.message}`);
      }
      await upsertProductSpecs(row.id, target.specs);
      await replaceProductImages(row.id, localImages);
      target.localImages = localImages;
    }

    report.matched.push(target);
  }

  const suffix = APPLY ? "applied" : "dry-run";
  const batchTag = ONLY_SLUG
    ? `slug-${ONLY_SLUG}`
    : `offset-${OFFSET}-limit-${LIMIT || "all"}`;
  fs.writeFileSync(
    path.join(AUDIT_DIR, `afc-sync-report-${suffix}-${batchTag}-2026-03-15.json`),
    JSON.stringify(report, null, 2),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        mode: report.mode,
        offset: report.offset,
        limit: report.limit,
        selected: report.selectedProducts,
        matched: report.matched.length,
        unmatched: report.unmatched.length,
        report: path.join(AUDIT_DIR, `afc-sync-report-${suffix}-${batchTag}-2026-03-15.json`),
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
