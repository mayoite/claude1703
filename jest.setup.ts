import '@testing-library/jest-dom';
import 'whatwg-fetch';
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config({ path: '.env.local' });

// ── Browser APIs not in jsdom ─────────────────────────────────────────────────

// IntersectionObserver stub (Embla Carousel, Framer Motion, etc.)
global.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
    takeRecords = jest.fn().mockReturnValue([]);
} as unknown as typeof IntersectionObserver;

// ResizeObserver stub (Embla, R3F canvas sizing, etc.)
global.ResizeObserver = class ResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
} as unknown as typeof ResizeObserver;

// matchMedia stub (Radix UI, Swiper responsive breakpoints)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Element.prototype.scrollIntoView = jest.fn();
Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

// next/image is automatically remapped by next/jest to a plain <img> stub.
// No manual jest.mock() override needed here — the moduleNameMapper in jest.config.js handles it.

// ── next/navigation stub ──────────────────────────────────────────────────────
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
        refresh: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// ── Console noise suppression ─────────────────────────────────────────────────
const NOISE_PATTERNS = [
    /Warning: ReactDOM.render/,
    /act\(\.\.\.\)/,
    /Warning: An update/,
];

const originalError = console.error.bind(console);
const originalWarn = console.warn.bind(console);

beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && NOISE_PATTERNS.some(p => p.test(args[0] as string))) return;
        originalError(...args);
    };
    console.warn = (...args: unknown[]) => {
        if (typeof args[0] === 'string' && NOISE_PATTERNS.some(p => p.test(args[0] as string))) return;
        originalWarn(...args);
    };
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});
