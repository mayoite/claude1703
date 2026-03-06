// QA Script: Check for 404s and 7+ images minimum
// Run with: npx tsx scripts/qa_audit.ts
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import * as http from 'http';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

async function checkUrlStatus(urlPath: string): Promise<number> {
    return new Promise((resolve) => {
        http.get(`http://localhost:3000${urlPath}`, (res) => {
            resolve(res.statusCode || 500);
        }).on('error', () => {
            resolve(503); // Server unreachable
        });
    });
}

async function runAudit() {
    console.log('--- STARTING QA AUDIT ---\n');

    // --- 1. Database Image Audit ---
    console.log('1. Auditing Image Minimums (Target: 7+ per item)');
    let imageFailures = 0;

    // Check Products
    const { data: products } = await supabase.from('products').select('name, slug, category, scene_images, flagship_image');
    if (products) {
        for (const p of products) {
            // images array + 1 for flagship if it exists and isn't duplicated
            const sceneCount = Array.isArray(p.scene_images) ? p.scene_images.length : 0;
            const hasFlagship = p.flagship_image && typeof p.flagship_image === 'string' && p.flagship_image.length > 5;
            const totalImages = sceneCount + (hasFlagship ? 1 : 0);

            if (totalImages < 7) {
                console.warn(`[WARNING] Product "${p.name}" (${p.slug}) has only ${totalImages} images (needs 7).`);
                imageFailures++;
            }
        }
    }

    // Check Projects
    const { data: projects } = await supabase.from('projects').select('title, id, gallery, image_url');
    if (projects) {
        for (const p of projects) {
            const galleryCount = Array.isArray(p.gallery) ? p.gallery.length : 0;
            const hasMain = p.image_url && typeof p.image_url === 'string' && p.image_url.length > 5;
            const totalImages = galleryCount + (hasMain ? 1 : 0);

            if (totalImages < 7) {
                console.warn(`[WARNING] Project "${p.title}" (${p.id}) has only ${totalImages} images (needs 7).`);
                imageFailures++;
            }
        }
    }

    if (imageFailures === 0) {
        console.log('✅ All products and projects have 7+ images.');
    } else {
        console.log(`❌ Found ${imageFailures} items with less than 7 images.`);
    }

    // --- 2. 404 Audit ---
    console.log('\n2. Auditing Common Routes for 404s on Localhost (Ensure dev server is running!)');
    let urlFailures = 0;

    // Static routes map
    const routesToCheck = [
        '/',
        '/products',
        '/projects',
        '/service',
        '/sustainability',
        '/news',
        '/contact',
        '/about',
    ];

    // Dynamic routes (Categories)
    const { data: categories } = await supabase.from('categories').select('id');
    if (categories) {
        categories.forEach(c => routesToCheck.push(`/products/${c.id}`));
    }

    // Dynamic routes (Products)
    if (products) {
        products.forEach(p => routesToCheck.push(`/products/${p.category}/${p.slug}`));
        // Also test old routes if they were nested differently
    }

    // Verify
    console.log(`Checking ${routesToCheck.length} URLs...`);

    // We'll do batches to not overwhelm the dev server
    const BATCH_SIZE = 10;
    for (let i = 0; i < routesToCheck.length; i += BATCH_SIZE) {
        const batch = routesToCheck.slice(i, i + BATCH_SIZE);

        await Promise.all(batch.map(async (route) => {
            const status = await checkUrlStatus(route);
            if (status === 404) {
                console.error(`[404 NOT FOUND] ${route}`);
                urlFailures++;
            } else if (status >= 500) {
                // Sometimes a 500 happens if DB isn't responding fast enough
                console.error(`[${status} ERROR] ${route}`);
                urlFailures++;
            }
        }));
    }

    if (urlFailures === 0) {
        console.log('✅ No 404s found on checked routes.');
    } else {
        console.log(`❌ Found ${urlFailures} broken routes.`);
    }

    console.log('\n--- AUDIT COMPLETE ---');
}

runAudit().catch(console.error);
