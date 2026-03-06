/**
 * tests/get-products.test.ts
 * Unit tests for lib/getProducts.ts helper functions.
 * Supabase is mocked so these run without a real DB connection.
 */
import { getProducts, getProductsByCategory, getProductBySlug, getCatalog, getCategoryIds } from '../lib/getProducts';

// ── Mock Supabase ──────────────────────────────────────────────────────────────
const mockSelect = jest.fn();
const mockOrder = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockFrom = jest.fn();

const chainMock: any = {
    select: mockSelect,
    order: mockOrder,
    eq: mockEq,
    single: mockSingle,
};

// Chainable builder: each method returns the chain object
mockSelect.mockReturnValue(chainMock);
mockOrder.mockReturnValue(chainMock);
mockEq.mockReturnValue(chainMock);

jest.mock('../lib/db', () => ({
    supabase: {
        from: (...args: unknown[]) => mockFrom(...args),
    },
}));

// ── Sample data fixtures ───────────────────────────────────────────────────────

const MOCK_PRODUCTS = [
    {
        id: 'prod-1',
        category_id: 'oando-seating',
        series: 'Ergo',
        name: 'Ergo Chair',
        slug: 'ergo-chair',
        images: ['/images/ergo-chair-1.webp', '/images/ergo-chair-2.webp'],
        flagship_image: '/images/ergo-chair-1.webp',
        specs: { dimensions: '70x70x120cm', materials: ['Mesh'], features: ['Lumbar support'], sustainability_score: 8 },
        series_id: 'ergo-series',
        series_name: 'Ergo Series',
        created_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 'prod-2',
        category_id: 'oando-tables',
        series: 'Executive',
        name: 'Executive Table',
        slug: 'executive-table',
        images: ['/images/exec-table-1.webp'],
        flagship_image: '/images/exec-table-1.webp',
        specs: { dimensions: '180x90x75cm', materials: ['Wood'], features: ['Cable management'], sustainability_score: 6 },
        series_id: 'exec-series',
        series_name: 'Executive Series',
        created_at: '2024-01-02T00:00:00Z',
    },
];

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('getProducts()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockImplementation(() => chainMock);
        mockSelect.mockReturnValue(chainMock);
        mockOrder.mockReturnValue(chainMock);
        mockEq.mockReturnValue(chainMock);
        chainMock.data = undefined;
        chainMock.error = undefined;
    });

    test('returns mapped products on success', async () => {
        mockOrder.mockResolvedValueOnce({ data: MOCK_PRODUCTS, error: null });

        const products = await getProducts();

        expect(products).toHaveLength(2);
        expect(products[0].name).toBe('Ergo Chair');
        expect(products[0].images).toEqual(['/images/ergo-chair-1.webp', '/images/ergo-chair-2.webp']);
    });

    test('returns empty array on Supabase error', async () => {
        mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'DB failure' } });

        const products = await getProducts();

        expect(products).toHaveLength(0);
    });

    test('returns empty array when data is null', async () => {
        mockOrder.mockResolvedValueOnce({ data: null, error: null });

        const products = await getProducts();
        expect(products).toHaveLength(0);
    });

    test('ensures images field is always an array', async () => {
        const productWithNullImages = { ...MOCK_PRODUCTS[0], images: null };
        mockOrder.mockResolvedValueOnce({ data: [productWithNullImages], error: null });

        const products = await getProducts();
        expect(products[0].images).toEqual([]);
    });
});

describe('getProductsByCategory()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockImplementation(() => chainMock);
        mockSelect.mockReturnValue(chainMock);
        mockEq.mockReturnValue(chainMock);
        mockOrder.mockReturnValue(chainMock);
        chainMock.data = undefined;
        chainMock.error = undefined;
    });

    test('filters products by category_id', async () => {
        const seatingProducts = MOCK_PRODUCTS.filter(p => p.category_id === 'oando-seating');
        mockOrder.mockResolvedValueOnce({ data: seatingProducts, error: null });

        const products = await getProductsByCategory('oando-seating');

        expect(products).toHaveLength(1);
        expect(products[0].category_id).toBe('oando-seating');
    });

    test('returns empty array on DB error', async () => {
        mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

        const products = await getProductsByCategory('non-existent');
        expect(products).toHaveLength(0);
    });

    test('preserves images array from DB row', async () => {
        mockOrder.mockResolvedValueOnce({ data: [MOCK_PRODUCTS[0]], error: null });

        const products = await getProductsByCategory('oando-seating');
        expect(Array.isArray(products[0].images)).toBe(true);
        expect(products[0].images.length).toBeGreaterThan(0);
    });
});

describe('getProductBySlug()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockImplementation(() => chainMock);
        mockSelect.mockReturnValue(chainMock);
        mockEq.mockReturnValue(chainMock);
        mockSingle.mockReturnValue(chainMock);
        chainMock.data = undefined;
        chainMock.error = undefined;
    });

    test('returns product data when slug matches', async () => {
        mockSingle.mockResolvedValueOnce({ data: MOCK_PRODUCTS[0], error: null });

        const product = await getProductBySlug('ergo-chair');

        expect(product).not.toBeNull();
        expect(product?.slug).toBe('ergo-chair');
        expect(product?.name).toBe('Ergo Chair');
    });

    test('returns null when slug not found', async () => {
        mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found', code: 'PGRST116' } });

        const product = await getProductBySlug('non-existent-slug');
        expect(product).toBeNull();
    });
});

describe('getCatalog()', () => {
    const CATEGORIES = [
        { id: 'oando-seating', name: 'Seating' },
        { id: 'oando-storage', name: 'Storage' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockSelect.mockReturnValue(chainMock);
        mockEq.mockReturnValue(chainMock);
        mockOrder.mockReturnValue(chainMock);
        mockFrom.mockImplementation((table: string) => {
            if (table === 'categories') {
                return chainMock;
            }
            return chainMock;
        });
        chainMock.data = undefined;
        chainMock.error = undefined;
    });

    test('groups products by category and series in compat shape', async () => {
        const productsForCatalog = [
            {
                ...MOCK_PRODUCTS[0],
                series_id: '',
                series_name: '',
                description: '',
                flagship_image: '',
                metadata: { source: 'seed' },
                specs: { dimensions: '', materials: [], features: [] },
                images: null,
                '3d_model': '/models/seating/task.glb',
            },
            {
                ...MOCK_PRODUCTS[1],
                category_id: 'unknown-category',
            },
        ];

        chainMock.data = CATEGORIES;
        chainMock.error = null;
        mockOrder.mockResolvedValueOnce({ data: productsForCatalog, error: null });

        const catalog = await getCatalog();

        expect(catalog).toHaveLength(1);
        expect(catalog[0].id).toBe('oando-seating');
        expect(catalog[0].series).toHaveLength(1);
        expect(catalog[0].series[0].id).toBe('oando-seating-series');
        expect(catalog[0].series[0].name).toBe('Series');
        expect(catalog[0].series[0].products[0].images).toEqual([]);
        expect(catalog[0].series[0].products[0].metadata.sustainabilityScore).toBe(5);
        expect(catalog[0].series[0].products[0]['3d_model']).toBe('/models/seating/task.glb');
    });

    test('returns empty array when categories query fails', async () => {
        chainMock.data = null;
        chainMock.error = { message: 'Categories failed' };
        mockOrder.mockResolvedValueOnce({ data: MOCK_PRODUCTS, error: null });

        const catalog = await getCatalog();
        expect(catalog).toEqual([]);
    });

    test('returns empty array when products query fails', async () => {
        chainMock.data = CATEGORIES;
        chainMock.error = null;
        mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'Products failed' } });

        const catalog = await getCatalog();
        expect(catalog).toEqual([]);
    });
});

describe('getCategoryIds()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFrom.mockImplementation(() => chainMock);
        mockSelect.mockReturnValue(chainMock);
        mockOrder.mockReturnValue(chainMock);
        chainMock.data = undefined;
        chainMock.error = undefined;
    });

    test('returns unique category ids from product rows', async () => {
        mockOrder.mockResolvedValueOnce({
            data: [
                { category_id: 'oando-seating' },
                { category_id: 'oando-seating' },
                { category_id: 'oando-storage' },
            ],
            error: null,
        });

        const ids = await getCategoryIds();
        expect(ids).toEqual(['oando-seating', 'oando-storage']);
    });

    test('returns empty array on query error', async () => {
        mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'No access' } });

        const ids = await getCategoryIds();
        expect(ids).toEqual([]);
    });
});
