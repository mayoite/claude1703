# CLAUDE.md — Project Instructions

## Project Context

Total design + IA revamp to match cisco.com's enterprise feel: clean, modular, confident, proof-driven.

**Stack:** Next.js + Tailwind + Supabase.

---

## Routing

Keep routing stable unless explicitly told otherwise. **Do not break `/products/*`.**

---

## Non-Negotiables

- Remove any user-visible debug/fallback text, e.g. `"Safe default while stats service is unavailable."`
- Homepage must start with brand promise. Project spotlights belong in the Projects section.
- If copy claims personalization ("Recommended for You"), either implement real logic or rename it honestly.
- **Accessibility:** keyboard nav, focus states, semantic landmarks. Run `npm run test:a11y` before final.
- **Performance:** no heavy hero media; keep LCP fast.

---

## Working Style

Every response must include:

1. **File plan** — list of files to be created or modified
2. **Exact diffs** — precise code changes
3. **Acceptance checklist** — criteria to verify the change is complete and correct

If env vars are required, list them explicitly and explain failure modes.
