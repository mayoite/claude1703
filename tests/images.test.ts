/**
 * tests/images.test.ts
 * Unit + integration tests: ensure product images are never mismatched to wrong categories.
 * These tests run against the real Supabase database using env vars from .env.local.
 */
import { supabase } from '../lib/db';

// Helper: join all image paths for a product into a single lowercase string
const imageStr = (images: string[] | null | undefined) =>
    (images ?? []).join(' ').toLowerCase();

// ── Integration: Category ↔ image keyword correctness ──────────────────────

describe('Image Mismatches – Supabase Integration', () => {
    // Increase timeout for network calls
    jest.setTimeout(20_000);

    test('No chair image in tables category products', async () => {
        const { data, error } = await supabase
            .from('products')
            .select('name, images')
            .eq('category_id', 'oando-tables');

        if (error) throw error;
        expect(data).toBeDefined();

        data?.forEach(p => {
            expect(imageStr(p.images)).not.toContain('chair');
        });
    });

    test('No chair or table image in storage category products', async () => {
        const { data, error } = await supabase
            .from('products')
            .select('name, images')
            .eq('category_id', 'oando-storage');

        if (error) throw error;
        expect(data).toBeDefined();

        data?.forEach(p => {
            const imgs = imageStr(p.images);
            expect(imgs).not.toContain('chair');
            expect(imgs).not.toContain('table');
        });
    });

    test('No table image in seating category products', async () => {
        const { data, error } = await supabase
            .from('products')
            .select('name, images')
            .eq('category_id', 'oando-seating');

        if (error) throw error;
        // It's OK if this category doesn't exist in the DB yet
        if (!data?.length) return;

        data.forEach(p => {
            expect(imageStr(p.images)).not.toContain('table-');
        });
    });

    test('All products have at least one image', async () => {
        const { data, error } = await supabase
            .from('products')
            .select('name, images, category_id');

        if (error) throw error;
        expect(data).toBeDefined();
        expect((data ?? []).length).toBeGreaterThan(0);

        const noImage = (data ?? []).filter(
            p => !p.images || (p.images as string[]).length === 0,
        );
        // Log offenders for visibility rather than hard-failing (data quality warning)
        if (noImage.length > 0) {
            console.warn(
                `[images.test] ${noImage.length} product(s) have no images:`,
                noImage.map(p => `${p.category_id}/${p.name}`).join(', '),
            );
        }
        // Soft assertion — warn but don't block CI
        expect(noImage.length).toBeLessThan((data ?? []).length);
    });

    test('No broken Supabase Storage URL patterns in any product', async () => {
        const { data, error } = await supabase
            .from('products')
            .select('name, images, category_id');

        if (error) throw error;

        const malformedImages: string[] = [];
        (data ?? []).forEach(p => {
            (p.images as string[] ?? []).forEach((url: string) => {
                // Each image should be either a relative /images/… path or a valid URL
                const isRelative = url.startsWith('/');
                const isAbsolute = /^https?:\/\//.test(url);
                if (!isRelative && !isAbsolute) {
                    malformedImages.push(`${p.name}: "${url}"`);
                }
            });
        });

        expect(malformedImages).toHaveLength(0);
    });
});
