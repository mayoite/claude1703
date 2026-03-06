/**
 * scripts/fix-missing-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Finds the 10 products with empty `images` columns in Supabase and patches
 * them with the correct local image paths sourced from public/images/products/.
 *
 * Run:  npx ts-node scripts/fix-missing-images.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const PUBLIC_IMAGES = path.resolve(__dirname, '../public/images/products/imported');
const URL_BASE = '/images/products/imported';

/** Return sorted image-N.webp paths for a given imported subfolder (max images). */
function getImagesFromFolder(folderName: string, maxImages = 8): string[] {
    const dir = path.join(PUBLIC_IMAGES, folderName);
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter(f => f.match(/^image-\d+\.webp$/))
        .sort((a, b) => {
            const n = (s: string) => parseInt(s.replace(/\D/g, ''), 10);
            return n(a) - n(b);
        })
        .slice(0, maxImages)
        .map(f => `${URL_BASE}/${folderName}/${f}`);
}

/**
 * Mapping: product name (as stored in Supabase) → local image folder.
 * Derived from the test warning + public/images/products/imported/ contents.
 */
const IMAGE_MAP: Record<string, string[]> = {
    // oando-soft-seating
    'Luna': getImagesFromFolder('relax'),       // closest soft-seating match
    'Cocoon Lounge Chair': getImagesFromFolder('cocoon'),

    // oando-seating
    'Fluid X': getImagesFromFolder('fluid-x'),
    'Fluid Task': getImagesFromFolder('fluid'),
    'Classy Executive': getImagesFromFolder('classy'),

    // oando-educational
    'Accent Study Chair': getImagesFromFolder('accent'),

    // oando-workstations
    'Cabin 60×30': getImagesFromFolder('cabin').slice(0, 6),
    'Cabin L-Shape': getImagesFromFolder('cabin').slice(6, 12),

    // oando-tables
    'Conference Table 8-Seater': getImagesFromFolder('meeting-table').slice(0, 6),

    // oando-storage
    'Mobile Pedestal 3-Drawer': getImagesFromFolder('storage').slice(0, 6),
};

async function main() {
    console.log('\n🔍 Fetching products with empty images from Supabase…\n');

    const { data: allProducts, error } = await supabase
        .from('products')
        .select('id, name, category_id, images');

    if (error) {
        console.error('❌ Supabase fetch error:', error.message);
        process.exit(1);
    }

    // Filter client-side: null, empty array, or array of empty strings
    const products = (allProducts ?? []).filter(p => {
        const imgs = p.images as string[] | null;
        return !imgs || imgs.length === 0 || imgs.every(i => !i);
    });

    if (!products?.length) {
        console.log('✅ No products with missing images found. Nothing to do.');
        return;
    }

    console.log(`Found ${products.length} product(s) with no images:\n`);

    let patched = 0;
    let skipped = 0;

    for (const p of products) {
        const images = IMAGE_MAP[p.name];

        if (!images || images.length === 0) {
            console.warn(`  ⚠️  SKIP  [${p.category_id}] "${p.name}" — no folder mapping found`);
            skipped++;
            continue;
        }

        const { error: updateError } = await supabase
            .from('products')
            .update({ images, flagship_image: images[0] })
            .eq('id', p.id);

        if (updateError) {
            console.error(`  ❌ FAIL  [${p.category_id}] "${p.name}":`, updateError.message);
        } else {
            console.log(`  ✅ PATCH [${p.category_id}] "${p.name}" → ${images.length} image(s)`);
            patched++;
        }
    }

    console.log(`\n────────────────────────────────────────`);
    console.log(`  Patched : ${patched}`);
    console.log(`  Skipped : ${skipped}`);
    console.log(`  Total   : ${products.length}`);
    console.log(`────────────────────────────────────────`);

    if (patched > 0) {
        console.log('\n✅ Done. Re-run `npm test` to confirm the warning is gone.\n');
    }
}

main().catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
});
