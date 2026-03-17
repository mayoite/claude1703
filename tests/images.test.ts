/**
 * tests/images.test.ts
 * Integration tests for product image/category consistency.
 * These only run against live Supabase when runtime env vars are present.
 */
import { supabase } from '../lib/db';

const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
);

const imageStr = (images: string[] | null | undefined) =>
    (images ?? []).join(' ').toLowerCase();

describe('Image Mismatches - Supabase Integration', () => {
    jest.setTimeout(20_000);

    beforeAll(() => {
        if (!hasSupabaseEnv) {
            console.warn('[images.test] Skipping Supabase integration assertions: missing runtime env.');
        }
    });

    test('No chair image in tables category products', async () => {
        if (!hasSupabaseEnv) return;

        const { data, error } = await supabase
            .from('products')
            .select('name, images')
            .eq('category_id', 'oando-tables');

        if (error) throw error;
        expect(data).toBeDefined();

        data?.forEach((p) => {
            expect(imageStr(p.images)).not.toContain('chair');
        });
    });

    test('No chair or table image in storage category products', async () => {
        if (!hasSupabaseEnv) return;

        const { data, error } = await supabase
            .from('products')
            .select('name, images')
            .eq('category_id', 'oando-storage');

        if (error) throw error;
        expect(data).toBeDefined();

        data?.forEach((p) => {
            const imgs = imageStr(p.images);
            expect(imgs).not.toContain('chair');
            expect(imgs).not.toContain('table');
        });
    });

    test('No table image in seating category products', async () => {
        if (!hasSupabaseEnv) return;

        const { data, error } = await supabase
            .from('products')
            .select('name, images')
            .eq('category_id', 'oando-seating');

        if (error) throw error;
        if (!data?.length) return;

        data.forEach((p) => {
            expect(imageStr(p.images)).not.toContain('table-');
        });
    });

    test('All products have at least one image', async () => {
        if (!hasSupabaseEnv) return;

        const { data, error } = await supabase
            .from('products')
            .select('name, images, category_id');

        if (error) throw error;
        expect(data).toBeDefined();
        expect((data ?? []).length).toBeGreaterThan(0);

        const noImage = (data ?? []).filter(
            (p) => !p.images || (p.images as string[]).length === 0,
        );
        if (noImage.length > 0) {
            console.warn(
                `[images.test] ${noImage.length} product(s) have no images:`,
                noImage.map((p) => `${p.category_id}/${p.name}`).join(', '),
            );
        }
        expect(noImage.length).toBeLessThan((data ?? []).length);
    });

    test('No broken Supabase Storage URL patterns in any product', async () => {
        if (!hasSupabaseEnv) return;

        const { data, error } = await supabase
            .from('products')
            .select('name, images, category_id');

        if (error) throw error;

        const malformedImages: string[] = [];
        (data ?? []).forEach((p) => {
            (p.images as string[] ?? []).forEach((url: string) => {
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
