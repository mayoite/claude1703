# Deployment Failure Audit Report (For OpenAI Team + Sam Altman)
Date: March 17, 2026  
Repository: `e:\new-repo-20260306-235837`

## 1) Executive Summary
Production deploys failed because multiple Vercel serverless functions exceeded the 300 MB limit.  
Primary blocker reported by Vercel: `api/nav-categories` (~529.6 MB in user-provided output).

Root cause was architectural: API routes imported `@/lib/getProducts`, which imported `@/lib/assetPaths`, and `assetPaths` used local filesystem checks (`node:fs`, `process.cwd()`, `public`). This can cause function tracing to pull far more content than expected.

## 2) Scope and Method
- Audited repository footprint and high-risk import chains.
- Audited API route dependencies for bundle-size risk.
- Ran local quality checks (`lint`, `next build`).
- Applied targeted code fix to remove filesystem/public tracing from shared asset normalization.

## 3) Repository Size Findings
Top directory sizes at audit time:
- `.git`: ~1240.13 MB
- `public`: ~909.11 MB
- `node_modules`: ~779.54 MB
- `.next`: ~578.78 MB
- `output`: ~362.15 MB

Largest `public` subfolders:
- `public/images`: ~749.01 MB
- `public/ClientPhotos`: ~93.41 MB
- `public/models`: ~20.36 MB
- `public/products`: ~16.65 MB
- `public/Showroom`: ~16.02 MB

Conclusion: repo is large, but deployment failure was primarily due to serverless trace path, not only raw repo size.

## 4) Critical Findings (Severity Ranked)

### Critical-1: Serverless trace path to local assets
Evidence:
- `app/api/nav-categories/route.ts` imports `@/lib/getProducts`
- `app/api/nav-search/route.ts` imports `@/lib/getProducts`
- `app/api/products/filter/route.ts` imports `@/lib/getProducts`
- `app/api/recommendations/route.ts` imports `@/lib/getProducts`

Previous (pre-fix) risk path:
`API route -> getProducts/getCatalog -> assetPaths(fs/public checks) -> oversized trace`

### High-1: Admin token handled in browser and sent in request header
Evidence:
- `app/ops/customer-queries/page.tsx` stores token in `localStorage` and sends `x-admin-token`.
- `app/api/customer-queries/manage/route.ts` trusts `x-admin-token` against env token.

Risk: browser-exposed operational credential flow is fragile and easier to leak.

### Medium-1: Recommendations endpoint accepts arbitrary `userId`
Evidence:
- `app/api/recommendations/route.ts` accepts `userId` from request body and queries `user_history`.

Risk: potential profile/history cross-access if no stronger auth binding is enforced upstream.

## 5) Fixes Applied in This Session
### Applied fix: removed filesystem/public checks from shared asset normalization
File changed:
- `lib/assetPaths.ts`

What changed:
- Removed `node:fs` and `node:path` imports.
- Removed `process.cwd()` + `public` file-existence lookup logic.
- Kept normalization as pure string/path mapping.

Expected impact:
- Breaks the heavy trace chain that could drag local asset tree into serverless bundles.

## 6) Validation Performed
- `npm run lint`: passed
- `npm run build`: passed (Next.js production build successful)

## 7) Validation Pending (Blocking Factor)
Could not run final Vercel function-size verification in this session because local project linking/auth was missing:
- `npx vercel build --prod` returned:
  - `No Project Settings found locally. Run vercel pull --yes ... set VERCEL_TOKEN`

## 8) Required Final Verification (Team Action)
Run in a Vercel-linked environment:

```powershell
vercel pull --yes --environment=production
vercel build --prod
```

Success criteria:
- `api/nav-categories` and all serverless functions < 300 MB.
- No “Max serverless function size exceeded” errors.

## 9) Recommended Next Remediations
1. Fully decouple API routes from `getProducts/getCatalog` compatibility layer used by heavy catalog transforms.
2. Move admin operations to server-authenticated session/role checks; remove browser token storage pattern.
3. Bind recommendation history reads to authenticated user identity, not caller-provided arbitrary `userId`.
4. Add CI guard: fail build if any function approaches size threshold (e.g., >250 MB).

## 10) Current Status
- Root architectural trace trigger in shared asset path code: addressed.
- Local build quality gate: passing.
- Final production function-size gate on Vercel: pending linked-environment verification.

