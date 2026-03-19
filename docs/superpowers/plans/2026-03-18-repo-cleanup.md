# Repo Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove stray tracked files, large assets, and legacy folders from git history surface, tighten .gitignore, and add a CONTRIBUTING guide.

**Architecture:** All changes are git-level or filesystem-level — no code changes. Each task is a self-contained git commit. No routes, no components, no data files are touched. The `.gitignore` is extended to prevent re-tracking of removed items.

**Tech Stack:** git, bash

---

## Audit Findings — What Was Confirmed vs. Claimed

The audit script proposed 20 items. Code review reduced this to 5 real actionable gaps:

| Item | Claimed | Reality | Action |
|------|---------|---------|--------|
| `Rreeadme` | Stray file | ✅ Confirmed tracked, 2 bytes | Remove from git |
| `dont touch oando_website.zip` | Large tracked asset | ✅ Confirmed tracked, 7.8MB | Remove from git + gitignore |
| `codex-recovery/` | Legacy folder | ✅ Confirmed 136 tracked files | Remove from git + gitignore |
| `archive/` | Legacy folder | ✅ Confirmed 57 tracked files, 113MB | Remove from git + gitignore |
| `CONTRIBUTING.md` | Missing | ✅ Confirmed absent | Create at `docs/ops/CONTRIBUTING.md` |
| Next.js version mismatch | Claimed wrong | ❌ Already correct — `^16.1.6` = "Next.js 16" | No action |
| `__mocks__/`, `data/` undocumented | Claimed missing | ❌ Already in HANDOVER.md lines 78+84 | No action |

---

## File Structure

**Modified files:**
- `.gitignore` — add rules to prevent re-tracking of removed paths

**New files:**
- `docs/ops/CONTRIBUTING.md` — developer setup guide

**Removed from git tracking:**
- `Rreeadme`
- `dont touch oando_website.zip`
- `codex-recovery/` (136 files)
- `archive/` (57 tracked files, 113MB total)

---

### Task 1: Remove stray `Rreeadme` file

**Files:**
- Remove from git: `Rreeadme`

- [ ] **Step 1: Verify file is tracked**

```bash
git ls-files Rreeadme
```

Expected output: `Rreeadme`

- [ ] **Step 2: Remove from git and filesystem**

```bash
git rm Rreeadme
```

Expected: `rm 'Rreeadme'`

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: delete stray Rreeadme file"
```

---

### Task 2: Remove large zip from git tracking

**Files:**
- Remove from git: `dont touch oando_website.zip`
- Modify: `.gitignore`

The zip file (7.8MB) should not be in git. We remove it from tracking but keep it on disk (it may be needed locally).

- [ ] **Step 1: Verify file is tracked**

```bash
git ls-files "dont touch oando_website.zip"
```

Expected output: `dont touch oando_website.zip`

- [ ] **Step 2: Untrack without deleting local copy**

```bash
git rm --cached "dont touch oando_website.zip"
```

Expected: `rm 'dont touch oando_website.zip'`

- [ ] **Step 3: Add to .gitignore**

Open `.gitignore` and append at the bottom:

```
# Large local assets — not for version control
dont touch oando_website.zip
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: remove large zip from git tracking, add to gitignore"
```

- [ ] **Step 5: Verify file is no longer tracked**

```bash
git ls-files "dont touch oando_website.zip"
```

Expected output: *(empty — nothing printed)*

---

### Task 3: Remove `codex-recovery/` from git tracking

**Files:**
- Remove from git: `codex-recovery/` (136 tracked files — recovery notes, chat snapshots, handover text)
- Modify: `.gitignore`

This folder is agent recovery state from a prior session. It has 136 tracked files and should not be in version control.

- [ ] **Step 1: Verify tracked file count**

```bash
git ls-files codex-recovery/ | wc -l
```

Expected: `136` (or similar non-zero number)

- [ ] **Step 2: Remove from git (keep local copies)**

```bash
git rm -r --cached codex-recovery/
```

Expected: many `rm 'codex-recovery/...'` lines

- [ ] **Step 3: Add to .gitignore**

Append to `.gitignore`:

```
# Agent recovery state — local only
codex-recovery/
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: remove codex-recovery/ from git tracking"
```

- [ ] **Step 5: Verify**

```bash
git ls-files codex-recovery/ | wc -l
```

Expected: `0`

---

### Task 4: Remove `archive/` from git tracking

**Files:**
- Remove from git: `archive/` (57 tracked files, 113MB total — legacy CSS, HTML, JS migration tools, old fonts)
- Modify: `.gitignore`

> **Note:** This removes legacy files (pre-2025 HTML templates, old CSS, old migration scripts, old fonts) from git tracking. Local copies remain on disk. If any file is needed in future, it can be retrieved from git history.

- [ ] **Step 1: List what will be removed**

```bash
git ls-files archive/
```

Review the list. Confirm it is only legacy/archived content.

- [ ] **Step 2: Remove from git tracking (keep local)**

```bash
git rm -r --cached archive/
```

Expected: many `rm 'archive/...'` lines

- [ ] **Step 3: Add to .gitignore**

The `.gitignore` already has some `archive/` sub-paths. Add a top-level rule alongside them. Find these lines in `.gitignore`:

```
archive/tool-state/
archive/test-artifacts/
archive/duplicate-assets/
```

And add above them:

```
# Full archive directory — legacy content, local only
archive/
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: remove archive/ from git tracking, add to gitignore"
```

- [ ] **Step 5: Verify**

```bash
git ls-files archive/ | wc -l
```

Expected: `0`

---

### Task 5: Add CONTRIBUTING guide

**Files:**
- Create: `docs/ops/CONTRIBUTING.md`

- [ ] **Step 1: Create the file**

Create `docs/ops/CONTRIBUTING.md` with this content:

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/ops/CONTRIBUTING.md
git commit -m "docs: add contributing guide"
```

- [ ] **Step 3: Verify**

```bash
cat docs/ops/CONTRIBUTING.md | head -5
```

Expected: `# Contributing`

---

## Verification Checklist

After all tasks complete:

- [ ] `git ls-files Rreeadme` — empty
- [ ] `git ls-files "dont touch oando_website.zip"` — empty
- [ ] `git ls-files codex-recovery/ | wc -l` — 0
- [ ] `git ls-files archive/ | wc -l` — 0
- [ ] `cat docs/ops/CONTRIBUTING.md` — shows the guide
- [ ] `git log --oneline -5` — 5 clean chore/docs commits
- [ ] `git status` — working tree clean (no unintended staged changes)
