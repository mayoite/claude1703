# Contributing

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```bash
npm ci
```

Copy `.env.example` to `.env.local` and fill in values (ask team for Supabase keys).

## Development

```bash
npm run dev
# → http://localhost:3000
```

## Testing

```bash
npm test           # unit tests (Jest)
npm run test:a11y  # accessibility checks
npx tsc --noEmit   # TypeScript check
```

## Build

```bash
npm run build
```

Build must complete without errors before opening a PR.

## Lint

```bash
npm run lint
```

## Commit style

Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`

## Branch naming

`feat/<name>`, `fix/<name>`, `chore/<name>`
