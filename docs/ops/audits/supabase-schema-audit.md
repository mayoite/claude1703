# Supabase Schema Audit

- Generated at: 2026-03-16T03:00:07.438Z
- Supabase host: erpweaiypimorcunaimz.supabase.co

## Table Probes
- categories: present, rows=6
- products: present, rows=145
- product_specs: present, rows=145
- product_images: present, rows=635
- product_slug_aliases: present, rows=716
- business_stats_current: present, rows=1
- customer_queries: present, rows=2
- catalog_categories: present, rows=0
- catalog_products: present, rows=0
- catalog_product_specs: present, rows=0
- catalog_product_images: present, rows=0
- catalog_product_slug_aliases: present, rows=0

## Runtime Query Checks
- Products list: ok (ok)
- Categories list: ok (ok)
- Product specs: ok (ok)
- Product images: ok (ok)
- Alias table: ok (ok)
- Business stats: ok (ok)
- Customer queries: ok (ok)

## Data Quality Summary
- products: 145
- categories: 6
- blank slugs: 0
- duplicate slugs: 0
- missing category IDs: 0
- missing subcategory slug/id: 2
- missing alt text: 18
- missing primary image: 1
- duplicate normalized name keys by category: 3
- alias rows: 716
- blank alias rows: 0
- self alias rows: 0
- missing business stats rows: 0
- active business stats rows: 1

## Duplicate Name Keys By Category
- seating / fluid-x: 2 (fluid-x, oando-seating--fluid-x)
- soft-seating / casca: 2 (oando-seating--casca, oando-soft-seating--casca)
- soft-seating / halo: 2 (oando-seating--halo, oando-soft-seating--halo)
