import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

type ProductRow = {
  id: string;
  flagship_image?: string | null;
  images?: unknown;
  scene_images?: unknown;
  variants?: unknown;
  metadata?: unknown;
  specs?: unknown;
};

type Counts = {
  scannedImages: number;
  convertedImages: number;
  skippedImages: number;
  failedImages: number;
  textFilesScanned: number;
  textFilesUpdated: number;
  supabaseRowsUpdated: number;
  nhostRowsUpdated: number;
};

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IGNORE_DIRS = new Set([".git", ".next", "node_modules", "out", "build"]);
const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);
const TEXT_FILE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".sql",
  ".csv",
  ".html",
  ".css",
  ".txt",
  ".yml",
  ".yaml",
]);

const APPLY = process.argv.includes("--apply");
const KEEP_ORIGINAL = process.argv.includes("--keep-original");
const QUALITY_ARG = process.argv.find((arg) => arg.startsWith("--quality="));
const WEBP_QUALITY = QUALITY_ARG ? Number.parseInt(QUALITY_ARG.split("=")[1] || "82", 10) : 82;

const counts: Counts = {
  scannedImages: 0,
  convertedImages: 0,
  skippedImages: 0,
  failedImages: 0,
  textFilesScanned: 0,
  textFilesUpdated: 0,
  supabaseRowsUpdated: 0,
  nhostRowsUpdated: 0,
};

const pathMap = new Map<string, string>();
const textFileSkipSegments = [
  `${path.sep}.git${path.sep}`,
  `${path.sep}.next${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}test-results${path.sep}`,
];

function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

function normalizePosixAbsoluteFromPublic(filePath: string): string {
  const rel = path.relative(PUBLIC_DIR, filePath).split(path.sep).join("/");
  return `/${rel}`;
}

function lowerPath(value: string): string {
  return value.trim().replace(/\\/g, "/").toLowerCase();
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

async function walkFiles(dir: string, collector: string[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      await walkFiles(fullPath, collector);
      continue;
    }
    collector.push(fullPath);
  }
}

function remapStringPath(input: string): string {
  const value = input.trim();
  if (!value) return input;

  const match = value.match(/^([^?#]+)([?#].*)?$/);
  if (!match) return input;

  const base = match[1];
  const suffix = match[2] || "";
  const normalizedBase = base.replace(/\\/g, "/");
  const lowerBase = normalizedBase.toLowerCase();

  if (pathMap.has(lowerBase)) {
    return `${pathMap.get(lowerBase)!}${suffix}`;
  }

  if (!/\.(png|jpe?g)$/i.test(normalizedBase)) return input;

  const withLeading = normalizedBase.startsWith("/") ? normalizedBase : `/${normalizedBase}`;
  const expectedWebp = withLeading.replace(/\.(png|jpe?g)$/i, ".webp");
  if (pathMap.has(expectedWebp.toLowerCase())) {
    const finalPath = normalizedBase.startsWith("/") ? expectedWebp : expectedWebp.slice(1);
    return `${finalPath}${suffix}`;
  }

  return input;
}

function remapUnknown(value: unknown): unknown {
  if (typeof value === "string") {
    return remapStringPath(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => remapUnknown(item));
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      result[key] = remapUnknown(nested);
    }
    return result;
  }
  return value;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

async function convertImagesInPublic(): Promise<void> {
  const allFiles: string[] = [];
  await walkFiles(PUBLIC_DIR, allFiles);

  for (const filePath of allFiles) {
    const ext = path.extname(filePath).toLowerCase();
    if (!SOURCE_EXTENSIONS.has(ext)) continue;
    counts.scannedImages += 1;

    const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
    const sourceWebPath = normalizePosixAbsoluteFromPublic(filePath);
    const webpWebPath = normalizePosixAbsoluteFromPublic(webpPath);

    try {
      await fs.access(webpPath);
      pathMap.set(lowerPath(sourceWebPath), webpWebPath);
      pathMap.set(lowerPath(sourceWebPath.slice(1)), webpWebPath.slice(1));
      counts.skippedImages += 1;
      continue;
    } catch {
      // Fall through.
    }

    pathMap.set(lowerPath(sourceWebPath), webpWebPath);
    pathMap.set(lowerPath(sourceWebPath.slice(1)), webpWebPath.slice(1));

    if (!APPLY) {
      counts.convertedImages += 1;
      continue;
    }

    try {
      await sharp(filePath).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
      if (!KEEP_ORIGINAL) {
        await fs.unlink(filePath);
      }
      counts.convertedImages += 1;
    } catch (error) {
      counts.failedImages += 1;
      log(`[image-fail] ${path.relative(ROOT, filePath)} :: ${String(error)}`);
    }
  }
}

async function updateRepoTextReferences(): Promise<void> {
  const allFiles: string[] = [];
  await walkFiles(ROOT, allFiles);

  for (const filePath of allFiles) {
    const normalizedPath = filePath.toLowerCase();
    if (textFileSkipSegments.some((segment) => normalizedPath.includes(segment.toLowerCase()))) {
      continue;
    }

    const ext = path.extname(filePath).toLowerCase();
    if (!TEXT_FILE_EXTENSIONS.has(ext)) continue;
    counts.textFilesScanned += 1;

    let original = "";
    try {
      original = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }

    let updated = original;
    for (const [oldPath, newPath] of pathMap.entries()) {
      const oldEscaped = oldPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(oldEscaped, "gi");
      updated = updated.replace(re, (match) => {
        const leadingSlash = match.startsWith("/");
        if (!leadingSlash && newPath.startsWith("/")) return newPath.slice(1);
        return newPath;
      });
    }

    if (updated !== original) {
      counts.textFilesUpdated += 1;
      if (APPLY) {
        await fs.writeFile(filePath, updated, "utf8");
      }
    }
  }
}

function createSupabaseAdminClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

async function updateSupabasePaths(): Promise<void> {
  const client = createSupabaseAdminClient();
  if (!client) {
    log("[supabase] skipped (missing NEXT_PUBLIC_SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY)");
    return;
  }

  const { data, error } = await client
    .from("products")
    .select("id, flagship_image, images, scene_images, variants, metadata, specs");

  if (error) {
    log(`[supabase] read failed: ${error.message}`);
    return;
  }

  for (const row of (data || []) as ProductRow[]) {
    const nextRow = {
      flagship_image: remapUnknown(row.flagship_image),
      images: remapUnknown(row.images),
      scene_images: remapUnknown(row.scene_images),
      variants: remapUnknown(row.variants),
      metadata: remapUnknown(row.metadata),
      specs: remapUnknown(row.specs),
    };

    const before = stableStringify({
      flagship_image: row.flagship_image,
      images: row.images,
      scene_images: row.scene_images,
      variants: row.variants,
      metadata: row.metadata,
      specs: row.specs,
    });
    const after = stableStringify(nextRow);
    if (before === after) continue;

    counts.supabaseRowsUpdated += 1;
    if (!APPLY) continue;

    const { error: updateError } = await client
      .from("products")
      .update(nextRow)
      .eq("id", row.id);

    if (updateError) {
      log(`[supabase] update failed for ${row.id}: ${updateError.message}`);
    }
  }
}

async function updateNhostPaths(): Promise<void> {
  const dbUrl = (process.env.NHOST_DATABASE_URL || "").trim();
  if (!dbUrl) {
    log("[nhost] skipped (missing NHOST_DATABASE_URL)");
    return;
  }

  const sql = postgres(dbUrl, {
    ssl: "require",
    max: 1,
    connect_timeout: 10,
    idle_timeout: 10,
  });

  try {
    const columnRows = await sql<Array<{ column_name: string }>>`
      select column_name
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'products'
    `;
    const columns = new Set(columnRows.map((row) => String(row.column_name || "").trim()));

    const mutableColumns = ["flagship_image", "images", "scene_images", "variants", "metadata", "specs"].filter(
      (column) => columns.has(column),
    );
    if (mutableColumns.length === 0) {
      log("[nhost] skipped (no mutable image columns found in public.products)");
      return;
    }

    const selectList = ["id", ...mutableColumns].join(", ");
    const rows = await sql.unsafe<Array<ProductRow>>(
      `select ${selectList} from public.products`,
    );

    for (const row of rows) {
      const nextRow: Record<string, unknown> = {};
      if (columns.has("flagship_image")) nextRow.flagship_image = remapUnknown(row.flagship_image);
      if (columns.has("images")) nextRow.images = remapUnknown(row.images);
      if (columns.has("scene_images")) nextRow.scene_images = remapUnknown(row.scene_images);
      if (columns.has("variants")) nextRow.variants = remapUnknown(row.variants);
      if (columns.has("metadata")) nextRow.metadata = remapUnknown(row.metadata);
      if (columns.has("specs")) nextRow.specs = remapUnknown(row.specs);

      const beforeState: Record<string, unknown> = {};
      if (columns.has("flagship_image")) beforeState.flagship_image = row.flagship_image;
      if (columns.has("images")) beforeState.images = row.images;
      if (columns.has("scene_images")) beforeState.scene_images = row.scene_images;
      if (columns.has("variants")) beforeState.variants = row.variants;
      if (columns.has("metadata")) beforeState.metadata = row.metadata;
      if (columns.has("specs")) beforeState.specs = row.specs;

      const before = stableStringify(beforeState);
      const after = stableStringify(nextRow);
      if (before === after) continue;

      counts.nhostRowsUpdated += 1;
      if (!APPLY) continue;

      const setClauses: string[] = [];
      const params: unknown[] = [];

      if (columns.has("flagship_image")) {
        params.push(nextRow.flagship_image as string | null);
        setClauses.push(`flagship_image = $${params.length}`);
      }
      if (columns.has("images")) {
        params.push(nextRow.images as unknown);
        setClauses.push(`images = $${params.length}`);
      }
      if (columns.has("scene_images")) {
        params.push(nextRow.scene_images as unknown);
        setClauses.push(`scene_images = $${params.length}`);
      }
      if (columns.has("variants")) {
        params.push(JSON.stringify(nextRow.variants ?? null));
        setClauses.push(`variants = $${params.length}::jsonb`);
      }
      if (columns.has("metadata")) {
        params.push(JSON.stringify(nextRow.metadata ?? null));
        setClauses.push(`metadata = $${params.length}::jsonb`);
      }
      if (columns.has("specs")) {
        params.push(JSON.stringify(nextRow.specs ?? null));
        setClauses.push(`specs = $${params.length}::jsonb`);
      }

      params.push(row.id);
      await sql.unsafe(
        `update public.products set ${setClauses.join(", ")} where id = $${params.length}`,
        params,
      );
    }
  } catch (error) {
    log(`[nhost] failed: ${String(error)}`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function main(): Promise<void> {
  log("== WebP migration ==");
  log(`mode=${APPLY ? "apply" : "dry-run"} quality=${WEBP_QUALITY} keep_original=${KEEP_ORIGINAL}`);

  const sampleJson = tryParseJson("{}");
  if (sampleJson == null) {
    throw new Error("unexpected json parser state");
  }

  await convertImagesInPublic();
  await updateRepoTextReferences();
  await updateSupabasePaths();
  await updateNhostPaths();

  log("== Summary ==");
  log(`images_scanned=${counts.scannedImages}`);
  log(`images_converted_or_planned=${counts.convertedImages}`);
  log(`images_skipped_existing_webp=${counts.skippedImages}`);
  log(`images_failed=${counts.failedImages}`);
  log(`text_files_scanned=${counts.textFilesScanned}`);
  log(`text_files_updated=${counts.textFilesUpdated}`);
  log(`supabase_rows_updated=${counts.supabaseRowsUpdated}`);
  log(`nhost_rows_updated=${counts.nhostRowsUpdated}`);
}

main().catch((error) => {
  log(`[fatal] ${String(error)}`);
  process.exitCode = 1;
});
