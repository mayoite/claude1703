# Main Window Master Checklist (Parallel Tracks)

## Global Rules (Apply to all tracks)
- [x] No hardcoded keys, URLs, or provider credentials.
- [x] Supabase is primary for reads/writes.
- [x] Nhost is read-backup only.
- [ ] DB `slug` stays internal; external wording is `product URL key`.
- [ ] Public route pattern remains `/products/[category]/[product]`.

## Parallelization Map
- [ ] Track A and Track B start immediately in parallel.
- [ ] Track C splits into C-L1 and C-L2; both start immediately in parallel.
- [ ] Track D splits into D-L1 and D-L2; both start immediately in parallel.
- [ ] C-L1/C-L2 merge only after compatibility checks pass.
- [ ] D-L1/D-L2 merge only after landmark + keyboard checks pass.
- [ ] Track E starts after A+B+C merge to staging branch.
- [ ] Track F (release/ops) starts after E passes.

---

## Track A: Provider and Fallback Architecture

### A1) Env and Secrets
- [x] Confirm local: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Confirm local: `NHOST_GRAPHQL_URL`, `NHOST_ADMIN_SECRET`, `NHOST_BACKUP_ENABLED`.
- [ ] Confirm Vercel/GitHub env names match exactly.
- [ ] Ensure runtime fails safely when required vars are missing.

### A2) Read Provider Layer
- [x] Create shared read-provider contract for:
- [x] products (all / by-category / by-product URL key)
- [x] categories/nav categories
- [x] business stats
- [x] Implement Supabase read provider with retry.
- [x] Implement Nhost read provider.
- [x] Add orchestrator: `supabase -> nhost-backup -> safe-default`.
- [x] Add response/source labeling: `supabase | nhost-backup | safe-default`.

### A3) Write Path Safety
- [x] Keep write routes Supabase-only (`tracking`, history, updates).
- [x] Add explicit guard/comments to prevent accidental Nhost writes.

---

## Track B: Product Data Completeness (Specs + Images)

### B1) Data Model Stability
- [x] Keep one canonical `products` table.
- [x] Use `product_specs` and `product_images` child tables.
- [x] Keep fallback to legacy `products.specs` + legacy image fields.

### B2) Wiring
- [x] Wire `product_specs` into product detail data shape.
- [x] Wire `product_images` into product detail/category card data shape.
- [x] Ensure no empty technical blocks when legacy data exists.

### B3) Backfill
- [x] Backfill `product_specs` from legacy `products.specs`.
- [x] Backfill `product_images` from flagship/gallery columns.
- [x] Make scripts idempotent (safe rerun).
- [x] Validate sample products from every category after backfill.

---

## Track C: Naming and Contract Cleanup

### C-L1) Code Naming Lane
- [ ] Internal variable names use `productUrlKey` (not `productSlug` in new code).
- [ ] DB lookups remain `.eq("slug", productUrlKey)`.
- [ ] Replace user-facing wording `slug` -> `product URL key`.

### C-L2) API/Contract Lane
- [x] AI advisor response includes `productUrlKey` (primary).
- [x] Keep `productId` as backward-compatible alias.
- [x] Update docs/comments/examples to `product URL key`.

### C-L3) Legacy Display Cleanup Lane
- [ ] Remove display-facing AFC/Oando prefixes where not required.
- [ ] Keep redirect compatibility until full migration sign-off.

### C Merge Gates
- [ ] Payload compatibility verified for clients expecting `productId`.
- [ ] No external docs/UI copy uses `slug`.
- [ ] Route behavior unchanged for `/products/[category]/[product]`.

---

## Track D: Accessibility and Structural Integrity

### D-L1) Landmark Lane
- [x] Remove nested `<main>` conflicts.
- [x] Keep one valid main landmark per page.

### D-L2) Keyboard/Nav Lane
- [x] Keep skip link and focus ring behavior intact.
- [x] Keep keyboard nav for header/mega menu intact.

### D-L3) Mobile/Regression Lane
- [x] Confirm menu heading duplication does not regress.
- [x] Confirm mobile menu semantics and rendering are stable.

### D Merge Gates
- [x] `test:a11y` passes on homepage, products, product detail.
- [x] Keyboard traversal works for header + mega menu + mobile drawer.
- [x] Landmark tree has no nested main violations.

---

## Track E: Integrated Verification (After A+B+C merged)

### E1) Automated
- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm run test:e2e:stats-consistency`
- [x] `npm run test:a11y`

### E2) Manual Route Checks
- [ ] `/`
- [ ] `/products`
- [ ] `/products/[category]`
- [ ] `/products/[category]/[product]`
- [ ] Mobile rendering checks for menu/product/footer.

### E3) Failure Simulation
- [ ] Simulate Supabase failure; verify Nhost backup serves reads.
- [ ] Simulate both providers down; verify safe-default behavior without UI debug leakage.

---

## Track F: Delivery, Release, and Continuity

### F1) Delivery
- [ ] Commit in atomic groups by track.
- [ ] Merge to `main` after Track E passes.
- [ ] Push final state and trigger Vercel rebuild.
- [ ] Record final proof outputs in checkpoint notes.

### F2) Continuity
- [ ] Configure daily automated Supabase backup.
- [ ] Document and run monthly restore drill.
- [ ] Add/verify data-source health endpoint/report.
- [ ] Document on-call fallback diagnosis workflow.

---

## Progress Board (Quick Status)
- [ ] Track A complete
- [x] Track B complete
- [ ] Track C-L1 complete
- [x] Track C-L2 complete
- [ ] Track C-L3 complete
- [ ] Track C merged
- [x] Track D-L1 complete
- [x] Track D-L2 complete
- [x] Track D-L3 complete
- [x] Track D merged
- [ ] Track E complete
- [ ] Track F complete
