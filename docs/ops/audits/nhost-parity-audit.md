# Nhost Parity Audit

- Generated at: 2026-03-17T10:06:25.679Z
- Supabase host: erpweaiypimorcunaimz.supabase.co
- Nhost DB host: bggcbrfwssqgflkuhgkg.db.ap-south-1.nhost.run:5432

## Count Diffs
- categories -> categories: supabase=6, nhost=6, diff=0
- products -> products: supabase=145, nhost=145, diff=0
- product_specs -> product_specs: supabase=145, nhost=145, diff=0
- product_images -> product_images: supabase=635, nhost=635, diff=0
- product_slug_aliases -> product_slug_aliases: supabase=716, nhost=698, diff=-18
- business_stats_current -> business_stats_current: supabase=1, nhost=1, diff=0
- categories -> catalog_categories: supabase=6, nhost=6, diff=0
- products -> catalog_products: supabase=145, nhost=145, diff=0
- product_specs -> catalog_product_specs: supabase=145, nhost=145, diff=0
- product_images -> catalog_product_images: supabase=635, nhost=635, diff=0
- product_slug_aliases -> catalog_product_slug_aliases: supabase=716, nhost=698, diff=-18

## GraphQL Checks
- products: ok (ok)
- product_slug_aliases: ok (ok)
- business_stats_current: ok (ok)

## Sampled Canonical Slug Checks
- education-classroom-accent-study-chair: canonicalInNhost=yes, aliasInNhost=no
- fluid-x: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--academia: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--audi-chair: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--classcraft: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--connecta: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--forma: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--learnix: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--magazine-rack: canonicalInNhost=yes, aliasInNhost=no
- oando-educational--metal-bed: canonicalInNhost=yes, aliasInNhost=no

## Sampled Alias Checks
- education-classroom-academia -> oando-educational--academia: resolvesInNhost=yes
- soft-seating-lounge-accent -> oando-soft-seating--accent: resolvesInNhost=yes
- education-classroom-accent-study-chair -> accent-study: resolvesInNhost=no
- soft-seating-lounge-adam -> oando-soft-seating--adam: resolvesInNhost=yes
- workstations-height-adjustable-adaptable -> oando-workstations--adaptable: resolvesInNhost=yes
- soft-seating-sofa-alonzo -> oando-soft-seating--alonzo: resolvesInNhost=yes
- tables-cabin-apex -> oando-tables--apex: resolvesInNhost=yes
- soft-seating-lounge-arcana -> oando-soft-seating--arcana: resolvesInNhost=yes
- soft-seating-lounge-arco -> oando-soft-seating--arco: resolvesInNhost=yes
- soft-seating-sofa-armora -> oando-soft-seating--armora: resolvesInNhost=yes
