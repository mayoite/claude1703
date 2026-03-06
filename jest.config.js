/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Map next/image to our plain-img stub (.tsx with JSX)
    '^next/image$': '<rootDir>/__mocks__/next-image.tsx',
    // Stub out CSS / static assets
    '\.css$': '<rootDir>/__mocks__/styleMock.js',
    '\.(jpg|jpeg|png|gif|webp|svg|ico|mp4|mp3|woff|woff2|ttf|eot)$':
      '<rootDir>/__mocks__/fileMock.js',
    // Stub Three.js and related WebGL packages (not available in jsdom)
    '^three$': '<rootDir>/__mocks__/three.js',
    '^@react-three/fiber$': '<rootDir>/__mocks__/r3f.js',
    '^@react-three/drei$': '<rootDir>/__mocks__/drei.js',
    // Stub @google/model-viewer
    '^@google/model-viewer$': '<rootDir>/__mocks__/modelViewer.js',
  },
  // Only run Jest unit/integration tests – Playwright handles *.spec.ts
  testMatch: ['**/tests/**/?(*.)+(test).[jt]s?(x)', '**/__tests__/**/?(*.)+(test).[jt]s?(x)'],
  testPathIgnorePatterns: ['\\.spec\\.ts$', '/node_modules/', '/.next/'],
  // Coverage configuration — scoped to files that have active Jest unit/integration tests.
  // Playwright e2e covers the rest (pages, server components).
  collectCoverageFrom: [
    'components/SafeImage.tsx',
    'components/3DViewer.tsx',
    'components/ThreeViewer.tsx',
    'lib/db.ts',
    'lib/getProducts.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 55,
      branches: 30,
      functions: 55,
      lines: 55,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
  // Transform settings allowing ts-jest to pick up Next paths
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  // Ignore heavy node_module binaries in transform
  transformIgnorePatterns: [
    '/node_modules/(?!(yet-another-react-lightbox|swiper|embla-carousel|framer-motion)/)',
  ],
}

module.exports = createJestConfig(customJestConfig)
