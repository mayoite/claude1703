# AGENTS.md

## Project Context

Enterprise design + IA revamp (cisco.com aesthetic): clean, modular, confident, proof-driven.

**Stack:** Next.js · Tailwind CSS · Supabase

---

## Core Rules

- No debug/fallback text visible to users.
- Never break `/products/*` routing.
- Homepage leads with brand promise — spotlights go in Projects section.
- No fake personalization — implement it or rename it honestly.
- Accessibility: keyboard nav, focus states, semantic landmarks.
- Performance: no heavy hero media, keep LCP fast.

---

## Working Rules

- Make focused, minimal changes. Do not touch unrelated files.
- Match existing code style and conventions.
- Run relevant checks before finishing (`npm run lint`, `npm run build`, `npm run test:a11y`).
- Parallel reads, analysis, and validation where tasks are independent.
- Serialize only when one step depends on another.
- Ask before destructive actions (deletes, resets, force pushes).
- Never push to remote unless explicitly instructed.

---

## Response Format

Every response must include:

1. **File plan** — files to be created or modified
2. **Exact diffs** — precise code changes
3. **Acceptance checklist** — criteria to verify the change is complete

If env vars are required, list them and explain failure modes.

---

## Commands

```bash
npm install       # install deps
npm run dev       # dev server
npm run build     # production build
npm run lint      # lint
npm test          # unit tests
npm run test:a11y # accessibility tests
```
