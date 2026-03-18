# Agent Handover Document
> Last updated: 2026-03-18 15:45 IST | Update this file at the end of every session.

---

## 1. Who Is the User

- **Name:** Ayush
- **GitHub:** `mayoite`
- **Working style:** Concise messages, expects you to infer intent. Does not want approval prompts for standard operations. Gives permission verbally ("go ahead", "yes", "do that").
- **Skill level:** Non-technical owner — understands product. Explain decisions simply.
- **Typos:** User makes a lot of typos in messages — infer intent, don't ask for clarification on obvious typos.
- **Tools in use:** Claude Code inside VSCode (extension), Perplexity for prompt refinement

---

## 2. Project Overview

**Client:** Oando (Indian office furniture brand)
**Goal:** Full design + IA revamp — clean, modular, confident, proof-driven.
**Live URL (preview):** https://claude1703-cgh4x48yg-ayushs-projects-1.vercel.app
**Vercel Project:** `ayushs-projects-1/claude1703`
**Stack:** Next.js 16 + Tailwind CSS + Supabase + Nhost + Framer Motion + Radix UI + React Three Fiber + GSAP + TanStack Query
> ⚠️ Stack list is incomplete — run a full audit when user asks before updating this line.
**Repo:** `https://github.com/mayoite/claude1703` (primary, set as `origin`)

---

## 3. Repository Remotes

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `github.com/mayoite/claude1703` | **Primary — push here** |
| `snapshot-origin` | `github.com/ayushonmicrosoft/oando.co.in-2026-03-09-0600` | Old snapshot, ignore |
| `truth-origin` | `github.com/ayushonmicrosoft/oandov3` | Old v3, ignore |
| `workingoando` | `github.com/ayushonmicrosoft/workingoando` | Old working copy, ignore |

**Always push to `origin` (mayoite/claude1703) on `main` branch.**

---

## 4. Claude Code Setup (Agent Environment)

### MCP Servers (`~/.claude/mcp.json`)
| Server | Purpose | Auth |
|--------|---------|------|
| `memory` | Persistent knowledge graph | None |
| `fetch` | Read web pages/docs | None |
| `filesystem` | Access `C:/Users/ayush` + `D:/Claude1703` | None |
| `github` | GitHub API (repos, PRs, issues) | Token in mcp.json |
| `ddg-search` | Web search via DuckDuckGo | None needed |

### Permissions (`~/.claude/settings.json`)
- `git:*` — allowed without prompt
- `gh:*` — allowed without prompt
- Standard bash commands — allowed

### Key Plugins Active
- `superpowers@claude-plugins-official` — brainstorm, write-plan, systematic-debugging skills
- `vercel` plugin — deployment, env, marketplace skills
- `figma` — design context tools

### User Preferences
-No approval prompts for git/standard commands
- Short, direct responses
- Clickable file links in markdown format

---

## 5. Project Architecture

```
d:/Claude1703/
├── app/                    # Next.js App Router pages
│   ├── (routes)/           # Page routes
│   └── api/                # API routes
├── components/             # Shared React components
├── data/                   # Static data files (product catalog, configs)
├── lib/                    # Shared utilities and helpers
├── hooks/                  # Custom React hooks
├── scripts/                # One-off maintenance and audit scripts (tsx)
├── supabase/               # Supabase migrations and config
├── tests/                  # Playwright e2e + Jest unit tests
├── __mocks__/              # Jest mocks (Three.js, R3F, next/image, etc.)
├── public/
│   └── images/             # Product images (WebP, LFS tracked)
├── docs/
│   ├── ops/                # Internal ops documentation and audit logs
│   └── audit/              # Product/catalog audit HTML and JSON exports
├── output/                 # Playwright screenshots and visual QA output
├── reports/                # Generated audit reports (~11 MB)
├── archive/                # Legacy code snapshots — local only, gitignored (~113 MB)
├── codex-recovery/         # Codex agent recovery files — local only, gitignored
├── unused/                 # Deprecated components pending deletion (~548 KB)
├── tmp/                    # Temporary scratch files — not committed
├── CLAUDE.md               # Project rules — READ THIS FIRST every session
└── HANDOVER.md             # This file
```

### Key Rules (from CLAUDE.md)
- **Do not break `/products/*` routing**
- No user-visible debug/fallback text
- Homepage must start with brand promise
- Accessibility: keyboard nav, focus states, semantic landmarks
- No heavy hero media — keep LCP fast

---

## 6. Git LFS Setup

Binary files tracked via Git LFS:
- `*.webp`, `*.png`, `*.jpg`, `*.jpeg`, `*.gif`, `*.svg`, `*.pdf`

LFS is initialized and `.gitattributes` is committed. Always run `git lfs install` if cloning fresh.

---

## 7. Current State (as of 2026-03-18)

### Done This Session
- [x] Set `origin` to `github.com/mayoite/claude1703`
- [x] Git LFS initialized and binary assets tracked
- [x] GitHub MCP server configured with auth token
- [x] DuckDuckGo MCP search server configured (replaced Brave)
- [x] Full project pushed to `mayoite/claude1703`
- [x] VSCode extensions recommended: Tailwind IntelliSense, ESLint, Prettier, GitLens, Error Lens, etc.
- [x] Phase 4 Slice 3 route consistency pass complete — sustainability, contact, solutions, ProductViewer all aligned to token system
- [x] **Homepage design improvements** — sector badges + outcome lines on project cards; micro-copy on process steps; FAQ accordion (ARIA-correct); testimonials strip (3-col); hero secondary CTA → "Browse Seating"
- [x] **Repo cleanup** — removed `Rreeadme`, `dont touch oando_website.zip` (7.8MB), `codex-recovery/` (136 files), `archive/` (57 files) from git tracking; all gitignored; `docs/ops/CONTRIBUTING.md` created

### Known Pre-Existing Test Failures (not caused by this session)

Confirmed pre-existing by running `npm test` with all session changes stashed — same failures occurred.

#### 1. `tests/contact-teaser.test.tsx` — 1 failure

**Test:** `ContactTeaser › dispatches guided planner open event`

**Error:**
```
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name /open guided planner/i
```

**Root cause:** The test queries `getByRole("button", { name: /open guided planner/i })` but the ContactTeaser component does not render a button with accessible text matching "open guided planner". The component likely renders the button with label text "Guided Planner" (not "Open Guided Planner") or without an `aria-label`.

**Fix options (pick one):**
- Add `aria-label="Open Guided Planner"` to the trigger button in `components/shared/ContactTeaser.tsx`
- Update the test query to match the actual button text: `getByRole("button", { name: /guided planner/i })`

---

#### 2. `tests/images.test.ts` — 5 failures

**Tests:** All 5 under `Image Mismatches – Supabase Integration`

**Error (all 5):**
```
Missing Supabase runtime env vars: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and NEXT_PUBLIC_SUPABASE_ANON_KEY/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

**Root cause:** These integration tests connect to a live Supabase instance but Jest does not load `.env.local` automatically. The required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are present in `.env.local` but not visible to the test runner.

**Fix options (pick one):**
- Add `dotenv` loading to `jest.config.js`: `require('dotenv').config({ path: '.env.local' })`
- Or install `jest-environment-jsdom` with a setup file that calls `dotenv.config()`
- Or mark these tests as integration-only and skip in CI with `test.skip` / `--testPathIgnorePatterns`

### Pending / Next Steps
- [ ] Vercel CLI not installed — run `npm i -g vercel` to unlock deploy skills
- [ ] Fix pre-existing test failures (`contact-teaser.test.tsx`, `images.test.ts`) if needed
- [ ] Review CLAUDE.md for any outdated rules

---

## 8. Known Issues / Watch Out For

- **Permission dialogs:** User has approved standard git/bash operations verbally. Don't re-prompt.
- **LFS push time:** Pushing binary-heavy commits takes several minutes — normal.
- **Multiple remotes:** Only use `origin`. The other remotes (`snapshot-origin`, `truth-origin`, `workingoando`) are legacy — do not push to them.
- **Routing:** `/products/*` is critical — never restructure without explicit instruction.

---

## 9. How to Start a New Session

1. Read `CLAUDE.md` (project rules)
2. Read this `HANDOVER.md` (context)
3. Run `git status` to see current state
4. Ask user what they want to work on
5. Update the **Current State** section above at end of session

---

## 10. Contacts / Accounts

| Service | Account |
|---------|---------|
| GitHub | `mayoite` |
| VSCode | Local install, Windows 11 |
| Perplexity | User's personal account |

---

---

## 11. Handover Commands (Run These to Resume Work)

```bash
# 1. Check repo status
git status && git log --oneline -5

# 2. Check what's deployed
vercel ls

# 3. Deploy a new preview
vercel deploy --yes --name claude1703

# 4. Deploy to production
vercel deploy --prod --yes --name claude1703

# 5. Push latest changes to GitHub
git add -A && git commit -m "your message" && git push origin main

# 6. Check MCP servers are configured
cat ~/.claude/mcp.json

# 7. Start dev server
npm run dev

# 8. Check Vercel logs
vercel logs
```

---

*Edit this file freely. It exists to be updated — not preserved.*
