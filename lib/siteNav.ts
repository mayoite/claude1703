import {
  Catalog_CATEGORY_ORDER,
  buildCatalogCategoryNav,
} from "@/lib/catalogCategories";

// ---------------------------------------------------------------------------
// Primary navigation — drives Header + MobileNavDrawer
// ---------------------------------------------------------------------------

export const SITE_NAV_LINKS = [
  { label: "Products", href: "/products", hasMega: true },
  { label: "Configurator", href: "/configurator" },
  { label: "Solutions", href: "/solutions" },
  { label: "Projects", href: "/projects" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trusted by", href: "/trusted-by" },
  { label: "About", href: "/about" },
  { label: "Sustainability", href: "/sustainability" },
] as const;

export const SITE_CTA_LINKS = [
  { label: "Get Quote", href: "/contact", variant: "primary" as const },
  { label: "View Products", href: "/products", variant: "outline" as const },
] as const;

// ---------------------------------------------------------------------------
// Footer navigation — 4 columns
// ---------------------------------------------------------------------------

const productLinks = [
  { href: "/products", label: "All Products" },
  ...buildCatalogCategoryNav(Catalog_CATEGORY_ORDER),
];

export const SITE_FOOTER_NAV = [
  {
    heading: "Products",
    links: productLinks,
  },
  {
    heading: "Solutions",
    links: [
      { href: "/solutions", label: "All Solutions" },
      { href: "/products/seating", label: "Seating" },
      { href: "/products/workstations", label: "Workstations" },
      { href: "/products/tables", label: "Meeting Rooms" },
      { href: "/products/storages", label: "Storage & Filing" },
      { href: "/solutions", label: "Space Planning" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/trusted-by", label: "Trusted By" },
      { href: "/projects", label: "Projects" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/sustainability", label: "Sustainability" },
      { href: "/service", label: "After Sales" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/configurator", label: "2D Configurator" },
      { href: "/contact", label: "Get Quote" },
      { href: "/refund-and-return-policy", label: "Refund Policy" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
] as const;

// ---------------------------------------------------------------------------
// Social links — replace href="#" with real URLs when available
// ---------------------------------------------------------------------------

export const SITE_SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCehXuPNAXkyfODPCwyAU1gQ",
    id: "youtube",
  },
  { label: "Facebook", href: "https://www.facebook.com/oandofurniture", id: "facebook" },
] as const;
