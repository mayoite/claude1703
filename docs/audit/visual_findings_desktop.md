# Visual Findings - Desktop

## Coverage
- Audited routes: 196
- Routes with one or more flags: 196
- Issue breakdown: {"request_failed":194,"missing_h1":135,"console_error":11,"text_sparse":3,"broken_images":3}

## Confirmed Runtime Failures (Actionable)
- None

## Broken Image Hotspots (Top)
- /products/seating/oando-seating--fusion (brokenImages=1)
- /products/soft-seating/oando-soft-seating--armora (brokenImages=1)
- /products/tables/oando-seating--cafe-sleek (brokenImages=1)

## Notes
- console_error is inflated by expected fallback logging ([business-stats] fallback...) and should be triaged separately from true JS runtime crashes.
- missing_h1 for /robots.txt and /sitemap.xml is expected for non-HTML routes.
