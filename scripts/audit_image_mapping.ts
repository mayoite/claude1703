/**
 * Audit: Verify no cross-category image mismatches in Supabase.
 * 
 * Checks that every product's `images` array only contains paths
 * matching its category (e.g., oando-tables products should only have
 * paths containing /tables/, not /seating/ or /chairs/).
 *
 * Usage: npx tsx scripts/audit_image_mapping.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

// Map category IDs to their expected path segments
const CATEGORY_PATH_MAP: Record<string, string[]> = {
    'oando-workstations': ['/workstations/'],
    'oando-tables': ['/tables/'],
    'oando-storage': ['/storage/'],
    'oando-seating': ['/seating/'],
    'oando-chairs': ['/chairs/', '/seating/'],
    'oando-other-seating': ['/seating/', '/other-seating/'],
    'oando-soft-seating': ['/soft-seating/'],
    'oando-educational': ['/educational/'],
    'oando-collaborative': ['/collaborative/'],
};

// These path segments should NEVER appear in another category
const CROSS_CHECK: Record<string, string[]> = {
    'oando-tables': ['/chairs/', '/seating/'],
    'oando-workstations': ['/chairs/', '/seating/', '/tables/'],
    'oando-storage': ['/chairs/', '/seating/', '/tables/'],
    'oando-seating': ['/tables/', '/storage/', '/workstations/'],
    'oando-chairs': ['/tables/', '/storage/', '/workstations/'],
};

interface AuditResult {
    category: string;
    product: string;
    slug: string;
    mismatchCount: number;
    mismatchedPaths: string[];
    status: 'Pass' | 'Fail';
}

async function runAudit() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  IMAGE MAPPING AUDIT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    const { data: products, error } = await supabase
        .from('products')
        .select('name, slug, category, category_id, images')
        .order('category');

    if (error) {
        console.error('❌ Failed to fetch products:', error.message);
        process.exit(1);
    }

    if (!products || products.length === 0) {
        console.log('⚠️  No products found in database.');
        process.exit(0);
    }

    const results: AuditResult[] = [];
    let totalMismatches = 0;

    for (const p of products) {
        const catId = p.category_id || p.category;
        const images: string[] = Array.isArray(p.images) ? p.images : [];
        const forbidden = CROSS_CHECK[catId] || [];

        const mismatched: string[] = [];

        for (const img of images) {
            // Skip external URLs (CDN links are OK)
            if (img.startsWith('http')) continue;

            // Check that image path doesn't contain forbidden segments
            for (const seg of forbidden) {
                if (img.includes(seg)) {
                    mismatched.push(img);
                    break;
                }
            }
        }

        results.push({
            category: catId,
            product: p.name,
            slug: p.slug,
            mismatchCount: mismatched.length,
            mismatchedPaths: mismatched,
            status: mismatched.length === 0 ? 'Pass' : 'Fail',
        });

        totalMismatches += mismatched.length;
    }

    // Print results table
    console.log('Category                  | Product               | Mismatches | Status');
    console.log('─────────────────────────-+-──────────────────────+────────────+───────');

    for (const r of results) {
        const cat = r.category.padEnd(25);
        const name = r.product.padEnd(21);
        const count = String(r.mismatchCount).padStart(10);
        const status = r.status === 'Pass' ? '✅ Pass' : '❌ Fail';
        console.log(`${cat} | ${name} | ${count} | ${status}`);

        if (r.mismatchedPaths.length > 0) {
            for (const path of r.mismatchedPaths) {
                console.log(`                          |   → ${path}`);
            }
        }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Summary by category
    const catSummary = new Map<string, { total: number; mismatched: number }>();
    for (const r of results) {
        const s = catSummary.get(r.category) || { total: 0, mismatched: 0 };
        s.total++;
        if (r.status === 'Fail') s.mismatched++;
        catSummary.set(r.category, s);
    }

    console.log('\nSummary by Category:');
    for (const [cat, s] of catSummary) {
        const icon = s.mismatched === 0 ? '✅' : '❌';
        console.log(`  ${icon} ${cat}: ${s.total} products, ${s.mismatched} with mismatches`);
    }

    console.log(`\nTotal: ${products.length} products, ${totalMismatches} mismatched image paths`);

    if (totalMismatches === 0) {
        console.log('\n✅ AUDIT PASSED — No cross-category image mismatches found.');
        process.exit(0);
    } else {
        console.log(`\n❌ AUDIT FAILED — ${totalMismatches} cross-category image mismatches found.`);
        process.exit(1);
    }
}

runAudit().catch((err) => {
    console.error('Fatal:', err.message);
    process.exit(1);
});
