# Full Site Walkthrough (Comprehensive)

Date: 2026-03-02  
Project: One and Only Furniture (`Renameit`)  
Environment: Production + repository snapshot

## 1) Executive Summary

- Production is live and healthy on `https://renameit-five.vercel.app`.
- Latest pushed commit on `main`: `4b7573e31d6acfc8a383acee970bff39c075432e`.
- Full forced production redeploy completed successfully.
- Core live smoke tests passed:
  - Dynamic filters: `3/3`
  - Navigation smoke: `5/5`
  - Stats consistency: `1/1`
  - Accessibility smoke: `6/6`
- Supabase primary and Nhost backup connectivity both passed 3-run probes.
- OpenRouter key is valid (models endpoint responded `200`).
- Remaining data-quality issue: seating/chairs taxonomy still has legacy bleed (`Classy Series`, duplicate `Fluid X`) and requires final normalization pass.

## 2) Git + Deployment Snapshot

### Git

- Branch: `main`
- HEAD: `4b7573e31d6acfc8a383acee970bff39c075432e`
- Last commit message:
  - `Stabilize data fallbacks and add homepage section reveal animations`
- Primary remote:
  - `origin -> https://github.com/ayushonmicrosoft/Renameit.git`

### Vercel

- Current production alias:
  - `https://renameit-five.vercel.app`
- Current deployment serving alias:
  - `https://renameit-g48qsmphj-ayushs-projects-850dfd33.vercel.app`
- Deployment id:
  - `dpl_BmzVpuavMbgY6YYFE3Fz7xfrFNTh`
- Status:
  - `Ready (Production)`

## 3) Application Information Architecture (IA)

### App Pages (`/app/**/page.tsx`)

- `/`
- `/about`
- `/brochure`
- `/career`
- `/catalog`
- `/configurator`
- `/contact`
- `/download-brochure`
- `/downloads`
- `/gallery`
- `/imprint`
- `/news`
- `/ops/customer-queries`
- `/planning`
- `/privacy`
- `/products`
- `/products/oando-chairs`
- `/products/oando-chairs/[product]`
- `/products/oando-other-seating`
- `/products/oando-other-seating/[product]`
- `/products/[category]`
- `/products/[category]/[product]`
- `/projects`
- `/quote-cart`
- `/service`
- `/showrooms`
- `/social`
- `/solutions`
- `/solutions/[category]`
- `/support-ivr`
- `/sustainability`
- `/terms`
- `/tracking`
- `/workstations/configurator`

### API Routes (`/app/api/**/route.ts`)

- `/api/ai-advisor`
- `/api/business-stats`
- `/api/categories`
- `/api/customer-queries`
- `/api/customer-queries/manage`
- `/api/filter`
- `/api/generate-alt`
- `/api/nav-categories`
- `/api/nav-search`
- `/api/products/filter`
- `/api/recommendations`
- `/api/tracking`

## 4) Homepage Composition (Current)

Entrypoint: `app/page.tsx`

Current section order:

1. `HomepageHero`
2. `FeaturedCarousel`
3. `WhyUs` (journey/KPI cards)
4. `CollaborationSection`
5. `ProcessSection`
6. `Teaser` (sustainability)
7. `ServiceSection` (projects/service)
8. `PartnershipSection`
9. `ClientMarquee`
10. `ContactTeaser`

## 5) Design System (Typography + Color + Layout)

### Typography

- Global font family source of truth: `app/globals.css`
- Tailwind font family mapping aligned: `tailwind.config.ts`
- Active primary font stack:
  - `"Cisco Sans", sans-serif`
- Main type token variables defined in `:root`:
  - `--fs-100` ... `--fs-500`

### Color System

Global tokens in `app/globals.css`, including:

- `--color-primary: #1434CB`
- `--color-accent1: #fdbb0a`
- Neutral scale (`--color-neutral-50` through `--color-neutral-950`)

### Layout Width

- Utility container max-width: `1800px`
- `container-wide` uses this same extra-wide pattern.

## 6) Motion / Framer Status

### What was implemented

- New reveal wrapper: `components/shared/SectionReveal.tsx`
- Applied in homepage composition (`app/page.tsx`) around section blocks.
- Animation pattern:
  - `initial` -> `whileInView`
  - opacity + vertical offset
  - once-per-section
  - reduced-motion safe (`useReducedMotion`)

### Scope note

- Framer exists in multiple existing parts already (nav, bot, configurator), but this pass ensures visible section-level motion in the current homepage flow.

## 7) Data Architecture

### Primary: Supabase

- Base client: `lib/db.ts`
- Admin client: `lib/supabaseAdmin.ts`
- Catalog orchestration: `lib/getProducts.ts`

### Backup: Nhost

- Catalog backup path: `lib/nhostCatalog.ts`
- Business stats backup path: `lib/nhostBackup.ts`
- Backup enable switch:
  - `NHOST_BACKUP_ENABLED=true`

### Product split-table support

Implemented reader supports:

- `product_specs`
- `product_images`

File:

- `lib/productDataTables.ts`

### User history table migration

- Added migration:
  - `supabase/migrations/20260302193000_create_user_history.sql`

## 8) Environment Keys Inventory (Redacted Snapshot)

Source: local `.env.local`  
Note: values are intentionally redacted in this document to avoid leaking secrets in tracked files.

| Key | Purpose | Status |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Present |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Present |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin/service role operations | Present |
| `SUPABASE_URL` | Alternative Supabase URL ref | Present |
| `OPENROUTER_API_KEY` | AI chat/search route integration | Present |
| `OPENAI_API_KEY` | OpenAI fallback/alt generation routes | Empty in local snapshot |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL source | Present (`localhost` locally) |
| `SITE_URL` | Canonical URL fallback | Present (`localhost` locally) |
| `DATABASE_URL` | Direct Postgres connection | Empty in local snapshot |
| `NHOST_GRAPHQL_URL` | Nhost GraphQL endpoint | Present |
| `NHOST_GRAPHQL_ENDPOINT` | Nhost endpoint alias | Present |
| `NHOST_ADMIN_SECRET` | Nhost Hasura admin secret | Present |
| `NHOST_SERVICE_ROLE_KEY` | Nhost service role fallback | Present |
| `NHOST_BACKUP_ENABLED` | Enable Nhost backup path | Present (`true`) |
| `NHOST_DATABASE_URL` | Nhost Postgres connection string | Present |

Security note:

- Do not store raw secrets in committed docs.
- Rotate any key previously shared over chat.

## 9) Live Health Validation (Production)

Target base URL:

- `https://renameit-five.vercel.app`

### Test results

- Dynamic filters: `3 passed`
- Navigation smoke: `5 passed`
- Stats consistency: `1 passed`
- Accessibility smoke: `6 passed`

### Database probes (3 runs)

#### Supabase

- categories count: `6`
- products count: `145`
- active `business_stats_current`: present
- `user_history` query path: reachable

#### Nhost

- products aggregate: `145`
- active `business_stats_current`: present

### OpenRouter probe

- endpoint: `https://openrouter.ai/api/v1/models`
- result: `200 OK`
- model list returned successfully

## 10) Known Problems / Risks

1. Seating/chairs data remains partially legacy-mixed:
   - legacy row example: `Classy Executive` in `Classy Series`
   - duplicate naming example: `Fluid X` appears in both legacy and canonical-like rows
2. Local dev tests can still fail intermittently due external upstream fetch instability (Cloudflare HTML error responses during Supabase fetch retries), even when live deployment is healthy.
3. Vercel build logs show repeated lockfile integrity warnings (`invalid or damaged lockfile`) and should be cleaned to reduce CI/deploy volatility.
4. Local canonical URL env is `localhost`; production Vercel env should retain real public URL.

## 11) Chairs-Specific Findings (Current)

Observed in `seating`:

- total rows: `44`
- subcategories currently surfaced: `Cafe chairs`, `Leather chairs`, `Mesh chairs`, `Training/Study chairs` variants
- non-canonical leakage:
  - `Classy Executive` (`slug: classy-executive`, `series: Classy Series`)
- duplicate model presence:
  - `Fluid X` appears as:
    - `fluid-x` (`Fluid Series`)
    - `oando-seating--fluid-x` (`Seating Series`)

Pending local patch (not committed yet in this snapshot):

- `lib/catalogCategories.ts`
- `app/api/nav-categories/route.ts`

Intended effect:

- normalize label to `Study chairs` consistently
- unify seating series label in IA mapping
- align nav subcategory slug mapping

## 12) File-Level Change Record (Recent Major Work)

Recent commit `4b7573e3` touched:

- `app/api/ai-advisor/route.ts`
- `app/api/recommendations/route.ts`
- `app/api/tracking/route.ts`
- `app/page.tsx`
- `app/products/[category]/FilterGrid.tsx`
- `components/shared/SectionReveal.tsx`
- `supabase/migrations/20260302193000_create_user_history.sql`

## 13) Operational Checklist (Next Practical Steps)

1. Commit and deploy pending chairs normalization patch.
2. Run production smoke suite again after chairs deploy:
   - dynamic filters
   - navigation smoke
   - accessibility smoke
3. Clean lockfile and re-run full install + build to eliminate deploy warnings.
4. Confirm Vercel env values:
   - canonical site URL
   - Supabase keys
   - Nhost backup keys
   - OpenRouter key
5. Rotate all secrets that were exposed during troubleshooting.

