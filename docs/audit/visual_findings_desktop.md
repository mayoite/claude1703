# Visual Findings - Desktop

## Coverage
- Audited routes: 199
- Routes with one or more flags: 139
- Issue breakdown: {"missing_h1":70,"console_error":69,"text_sparse":69,"navigation_error":68,"request_failed":68,"missing_main":68,"broken_images":67}

## Confirmed Runtime Failures (Actionable)
- None

## Broken Image Hotspots (Top)
- /gallery (brokenImages=1)
- /products/education/oando-educational--academia (brokenImages=1)
- /products/education/oando-educational--audi-chair (brokenImages=1)
- /products/education/oando-educational--classcraft (brokenImages=1)
- /products/education/oando-educational--connecta (brokenImages=1)
- /products/education/oando-educational--forma (brokenImages=1)
- /products/education/oando-educational--learnix (brokenImages=1)
- /products/education/oando-educational--metal-bed (brokenImages=1)
- /products/education/oando-educational--performer (brokenImages=1)
- /products/education/oando-educational--podium (brokenImages=1)
- /products/education/oando-educational--wooden-bed (brokenImages=1)
- /products/education/oando-educational--xplorer (brokenImages=1)
- /products/seating/oando-seating--arvo (brokenImages=1)
- /products/seating/oando-seating--breeze (brokenImages=1)
- /products/seating/oando-seating--cafe-sleek (brokenImages=1)
- /products/seating/oando-seating--canaret (brokenImages=1)
- /products/seating/oando-seating--caneva (brokenImages=1)
- /products/seating/oando-seating--casca (brokenImages=1)
- /products/seating/oando-seating--dive (brokenImages=1)
- /products/seating/oando-seating--ember (brokenImages=1)
- /products/seating/oando-seating--flare (brokenImages=1)
- /products/seating/oando-seating--flex (brokenImages=1)
- /products/seating/oando-seating--flip (brokenImages=1)
- /products/seating/oando-seating--fluid (brokenImages=1)
- /products/seating/oando-seating--fluid-x (brokenImages=1)
- /products/seating/oando-seating--fusion (brokenImages=1)
- /products/seating/oando-seating--halo (brokenImages=1)
- /products/seating/oando-seating--leaf (brokenImages=1)
- /products/seating/oando-seating--lexus (brokenImages=1)
- /products/seating/oando-seating--lisbo (brokenImages=1)
- /products/seating/oando-seating--logica (brokenImages=1)
- /products/seating/oando-seating--moonlight (brokenImages=1)
- /products/seating/oando-seating--myel (brokenImages=1)
- /products/seating/oando-seating--nordic (brokenImages=1)
- /products/seating/oando-seating--nuvic (brokenImages=1)
- /products/seating/oando-seating--orbit (brokenImages=1)
- /products/seating/oando-seating--phoenix (brokenImages=1)
- /products/seating/oando-seating--pinnacle (brokenImages=1)
- /products/seating/oando-seating--revoq (brokenImages=1)
- /products/seating/oando-seating--rider (brokenImages=1)

## Notes
- console_error is inflated by expected fallback logging ([business-stats] fallback...) and should be triaged separately from true JS runtime crashes.
- missing_h1 for /robots.txt and /sitemap.xml is expected for non-HTML routes.
