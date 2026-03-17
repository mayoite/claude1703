// Seed script using JSON data directly from lib/catalog.ts and lib/products.ts
// Run with: npx tsx scripts/seed_all_rest.ts
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { oandoCatalog } from '../lib/catalog';
import { featuredProjects } from '../lib/products';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
});

async function run() {
    console.log('Seeding products directly via REST API...\n');

    const productsToUpsert: any[] = [];

    // Iterate over oandoCatalog to build the products array
    for (const catKey of Object.keys(oandoCatalog)) {
        const category = oandoCatalog[catKey as keyof typeof oandoCatalog];
        const catId = category.id;

        for (const series of category.series) {
            const seriesId = series.id;
            const seriesName = series.name;

            for (const prod of (series as any).products) {
                // Build the row exactly as expected by Supabase
                productsToUpsert.push({
                    name: prod.name,
                    slug: prod.slug,
                    category: catId,     // Legacy field
                    category_id: catId,  // New foreign key
                    series_id: seriesId,
                    series_name: seriesName,
                    flagship_image: prod.flagshipImage || (prod.sceneImages && prod.sceneImages[0]) || '',
                    description: (prod.detailedInfo && prod.detailedInfo.overview) || '',
                    scene_images: prod.sceneImages || [],
                    variants: prod.variants || [],
                    detailed_info: prod.detailedInfo || {},
                    metadata: prod.metadata || {},
                    specs: prod.specs || {}
                });
            }
        }
    }

    console.log(`Prepared ${productsToUpsert.length} products to upsert.`);

    // Upsert in batches of 50 to avoid payload size limits
    const BATCH_SIZE = 50;
    let totalUpserted = 0;
    let totalErrors = 0;

    for (let i = 0; i < productsToUpsert.length; i += BATCH_SIZE) {
        const batch = productsToUpsert.slice(i, i + BATCH_SIZE);

        const { error, count } = await supabase
            .from('products')
            .upsert(batch, { onConflict: 'slug', count: 'exact' });

        if (error) {
            console.error(`❌ Batch ${i / BATCH_SIZE + 1} failed:`, error.message);
            totalErrors++;
        } else {
            totalUpserted += (count ?? batch.length);
            console.log(`✅ Batch ${i / BATCH_SIZE + 1}: upserted ${count ?? batch.length} products (${totalUpserted}/${productsToUpsert.length})`);
        }
    }

    console.log(`\n🎉 Product Seeding Complete.`);
    console.log(`   Total products upserted: ${totalUpserted}`);
    if (totalErrors > 0) console.log(`   Total batch errors: ${totalErrors}`);

    // Now seed projects from lib/products.ts
    console.log('\nSeeding projects...');
    const projectsToUpsert = featuredProjects.map(p => ({
        id: p.id,
        title: p.title,
        client: p.client,
        location: p.location,
        year: p.year,
        area: p.area,
        category: p.category,
        image_url: p.imageUrl,
        gallery: p.gallery || [],
        description: p.description,
        featured: p.featured || false,
        challenge: p.challenge || '',
        solution: p.solution || ''
    }));

    const { error: projErr, count: projCount } = await supabase
        .from('projects')
        .upsert(projectsToUpsert, { onConflict: 'id', count: 'exact' });

    if (projErr) {
        console.error(`❌ Projects failed:`, projErr.message);
    } else {
        console.log(`✅ Projects seeded: ${projCount ?? projectsToUpsert.length} rows`);
    }

}

run().catch(console.error);
