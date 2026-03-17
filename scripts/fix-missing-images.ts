import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase credentials. Expected NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  flagship_image: string | null;
  images: string[] | null;
  metadata: Record<string, unknown> | null;
};

type BackfillTarget = {
  slug: string;
  imageSet: string[];
  reason: string;
  patchWarrantyYears?: number;
  patchSustainabilityScore?: number;
};

const PUBLIC_DIR = path.resolve(__dirname, "../public");

function getImagesFromFolder(baseDir: string, start = 1, count = 6): string[] {
  const folder = path.join(PUBLIC_DIR, baseDir);
  if (!fs.existsSync(folder)) return [];
  const files = fs
    .readdirSync(folder)
    .filter((file) => /^image-\d+\.webp$/i.test(file))
    .sort((left, right) => {
      const toIndex = (value: string) => Number.parseInt(value.replace(/\D/g, ""), 10);
      return toIndex(left) - toIndex(right);
    });

  return files
    .slice(start - 1, start - 1 + count)
    .map((file) => `/${path.posix.join(baseDir.replace(/\\/g, "/"), file)}`);
}

const TARGETS: BackfillTarget[] = [
  {
    slug: "accent-study",
    imageSet: getImagesFromFolder("images/products/imported/accent", 1, 6),
    reason: "Imported accent folder already contains a six-image local set.",
  },
  {
    slug: "classy-executive",
    imageSet: getImagesFromFolder("images/products/imported/classy", 1, 6),
    reason: "Imported classy folder provides the dedicated local gallery for Classy Executive.",
  },
  {
    slug: "fluid-task",
    imageSet: getImagesFromFolder("images/products/imported/fluid", 1, 6),
    reason: "Imported fluid folder provides the dedicated local gallery for Fluid Task.",
  },
  {
    slug: "fluid-x",
    imageSet: getImagesFromFolder("images/products/imported/fluid-x", 1, 6),
    reason: "Imported fluid-x folder provides the dedicated local gallery for the legacy Fluid X row.",
  },
  {
    slug: "cocoon-lounge",
    imageSet: getImagesFromFolder("images/products/imported/cocoon", 1, 6),
    reason: "Imported cocoon folder already contains a strong local gallery set.",
  },
  {
    slug: "pedestal-3-drawer",
    imageSet: getImagesFromFolder("images/products/imported/storage", 14, 6),
    reason: "Storage imported folder can extend the current flagship sequence into a usable gallery.",
  },
  {
    slug: "cabin-60x30",
    imageSet: getImagesFromFolder("images/products/imported/cabin", 1, 6),
    reason: "Cabin imported folder supports the current flagship and nearby gallery frames.",
  },
  {
    slug: "cabin-l-shape",
    imageSet: getImagesFromFolder("images/products/imported/cabin", 4, 6),
    reason: "Cabin imported folder supports the current L-shape flagship and adjacent frames.",
  },
  {
    slug: "conference-8-seater",
    imageSet: getImagesFromFolder("images/products/imported/meeting-table", 33, 6),
    reason: "Meeting-table imported folder supports the current conference flagship and adjacent frames.",
  },
  {
    slug: "oando-seating--fluid-x",
    imageSet: getImagesFromFolder("images/catalog/oando-seating--fluid-x", 1, 7),
    reason: "Canonical Fluid X already has a complete local catalog gallery; patch metadata only.",
    patchWarrantyYears: 5,
    patchSustainabilityScore: 5,
  },
];

async function main() {
  const targetSlugs = TARGETS.map((target) => target.slug);

  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,flagship_image,images,metadata")
    .in("slug", targetSlugs);

  if (error) {
    throw new Error(`Failed loading target products: ${error.message}`);
  }

  const rows = (data ?? []) as ProductRow[];
  const rowBySlug = new Map(rows.map((row) => [row.slug, row]));
  let updated = 0;
  let skipped = 0;

  for (const target of TARGETS) {
    const row = rowBySlug.get(target.slug);
    if (!row) {
      console.warn(`SKIP ${target.slug}: product row not found`);
      skipped += 1;
      continue;
    }

    if (target.imageSet.length === 0) {
      console.warn(`SKIP ${target.slug}: no verified local image set found`);
      skipped += 1;
      continue;
    }

    const metadata = { ...(row.metadata ?? {}) } as Record<string, unknown>;
    if (target.patchWarrantyYears !== undefined) {
      metadata.warrantyYears = target.patchWarrantyYears;
    }
    if (target.patchSustainabilityScore !== undefined) {
      metadata.sustainabilityScore = target.patchSustainabilityScore;
    }

    const currentImages = Array.isArray(row.images) ? row.images.filter(Boolean) : [];
    const nextFlagship = target.imageSet[0];
    const nextImages = target.imageSet;
    const needsImagePatch =
      currentImages.length < 2 ||
      row.flagship_image !== nextFlagship ||
      JSON.stringify(currentImages) !== JSON.stringify(nextImages);
    const needsMetadataPatch =
      target.patchWarrantyYears !== undefined ||
      target.patchSustainabilityScore !== undefined;

    if (!needsImagePatch && !needsMetadataPatch) {
      console.log(`OK   ${target.slug}: already aligned`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({
        flagship_image: nextFlagship,
        images: nextImages,
        metadata,
      })
      .eq("id", row.id);

    if (updateError) {
      console.error(`FAIL ${target.slug}: ${updateError.message}`);
      skipped += 1;
      continue;
    }

    console.log(`PATCH ${target.slug}: ${target.reason}`);
    updated += 1;
  }

  console.log(
    JSON.stringify(
      {
        updated,
        skipped,
        explicitlyDeferred: ["oando-soft-seating--luna"],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
