# Release Log (2026-02-28)

## Scope
- Objective: Push existing cleanup commit `1caba638` to `origin/main` without bundling unrelated local changes.

## Preconditions Verified
- Branch: `main`
- `origin` URL: `https://github.com/pglcarpets-cmyk/Antigravity26022026.git`
- Local unrelated modified files remain unstaged/uncommitted:
  - `.env.local`
  - `.gitignore`
  - `.vscode/settings.json`
  - `package-lock.json`
  - `package.json`

## Commit Scope Verification
- `git show --name-status 1caba638` confirms cleanup-only scope:
  - markdown/task/checklist deletions
  - temp artifact deletions
  - tracked cleanup manifests in `docs/cleanup/*`

## Push Attempt
- Command: `git push origin main`
- Result: **FAILED**
- Error:
  - `remote: Permission to pglcarpets-cmyk/Antigravity26022026.git denied to ayushmayoite.`
  - `fatal: ... The requested URL returned error: 403`

## Remote Head Check
- `git ls-remote origin main` -> `044e023052e1df04df7a0f4e437092c75cd49c5d`
- Local `HEAD` remains `1caba638`; remote has not advanced.

## Required Remediation (Auth/Access)
1. Grant `write` access for GitHub user `ayushmayoite` on repo `pglcarpets-cmyk/Antigravity26022026`.
2. Or switch local git credentials to an account that already has write permission.
3. Re-run:
   - `git push origin main`
4. Re-verify:
   - `git ls-remote origin main`
   - confirm remote head equals local `1caba638`.

## Status
- Cleanup commit preserved locally and ready to push once permissions are corrected.

---

# Release Log (2026-03-01)

## Scope
- Objective: Deploy and verify dynamic filters + accessibility hardening + rollout checks on current active repo.
- Branch used: `feat/full-website-sync-20260301`.

## Deployments
- Preview:
  - `https://oofplpatna-up3bfggla-ayushs-projects-850dfd33.vercel.app`
  - Build status: passed.
- Production:
  - Deployment URL: `https://oofplpatna-3i908yeit-ayushs-projects-850dfd33.vercel.app`
  - Alias: `https://oofplpatna.vercel.app`
  - Build status: passed.

## Verification
- Local gates:
  - `npm run lint` -> pass
  - `npm run build` -> pass
  - `npm run test:e2e:filters` -> pass
  - `npm run test:e2e:nav` -> pass
  - `npm run test:a11y` -> pass
- Production HTTP checks:
  - `/` -> 200
  - `/products/` -> 200
  - `/products/seating/` -> 200
  - `/api/nav-categories/` -> 200
  - `/robots.txt` -> 200
  - `/sitemap.xml` -> 200
- Production smoke:
  - Navigation Playwright suite -> 5/5 pass.

## Operational Note
- `scripts/sync-missing-alt-text.ts` updated to support:
  - `.env.local` loading in local environments
  - Supabase installations with or without `products.alt_text` column
- Dry run result: 145 products scanned, 0 missing alt text.

## Status
- Deployment and verification complete.
- Branch is ready for merge to `main`.

## Post-Merge Closure (2026-03-01)
- Branch `feat/full-website-sync-20260301` fast-forward merged into `main`.
- `origin/main` updated from `dfa72a53` to `0b230acd`.
- Git-triggered Vercel production deployment observed and verified:
  - Deployment id: `dpl_YBkd3zcVqpjX1KfaRf8tsqeSp6vB`
  - URL: `https://oofplpatna-dzacjm218-ayushs-projects-850dfd33.vercel.app`
  - Alias: `https://oofplpatna.vercel.app`
  - Status: `Ready`
- Post-merge production smoke:
  - `/` -> 200
  - `/products/` -> 200
  - `/products/seating/` -> 200
  - `/api/nav-categories/` -> 200
  - `/robots.txt` -> 200
  - `/sitemap.xml` -> 200
  - Playwright navigation smoke -> 5/5 pass.
