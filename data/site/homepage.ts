export const HOMEPAGE_HERO_CONTENT = {
  title: ["Spaces that work", "as hard as your team.", ""],
  description: "One accountable team from planning through support.",
  primaryCta: { label: "Guided Planner", href: "/contact" },
  secondaryCta: { label: "View Products", href: "/products" },
} as const;

export const HOMEPAGE_TRUST_CONTENT = {
  logoLabel: "Selected organisations",
  logos: [
    { name: "Titan", src: "/ClientLogos/Titan.png" },
    { name: "L&T", src: "/ClientLogos/LandT.png" },
    { name: "JSW", src: "/ClientLogos/JSW.png" },
    { name: "Tata Motors", src: "/ClientLogos/TataMotors.jpg" },
    { name: "Maruti Suzuki", src: "/ClientLogos/MarutiSuzuki.png" },
    { name: "HDFC", src: "/ClientLogos/HDFCLogo.jpg" },
  ],
  projectsCta: "View projects",
} as const;

export const HOMEPAGE_BRAND_STATEMENT_CONTENT = {
  lead:
    "We have been designing and installing workplaces across India since 2011.",
  body:
    "Not just interiors, but working environments that help teams focus, collaborate, and stay productive. Built for organizations that cannot afford unclear planning or weak execution.",
} as const;

export const HOMEPAGE_COLLECTIONS_CONTENT = {
  titleLead: "Browse",
  titleAccent: "workspace categories",
  items: [
    {
      name: "Seating",
      image: "/images/products/seating-myel-1.webp",
      href: "/products/seating",
    },
    {
      name: "Workstations",
      image: "/images/products/deskpro-workstation-1.webp",
      href: "/products/workstations",
    },
    {
      name: "Tables",
      image: "/images/products/meeting-table-10pax.webp",
      href: "/products/tables",
    },
    {
      name: "Storage",
      image: "/images/products/cabin electrical render .webp",
      href: "/products/storages",
    },
    {
      name: "Soft Seating",
      image: "/images/products/softseating-solace-1.webp",
      href: "/products/soft-seating",
    },
    {
      name: "Education",
      image: "/images/products/chair-cafeteria.webp",
      href: "/products/education",
    },
  ],
} as const;

export const HOMEPAGE_PROJECTS_CONTENT = {
  titleLead: "Recent",
  titleAccent: "projects",
  cta: { label: "View gallery", href: "/portfolio" },
  cards: [
    {
      sector: "Government",
      companyName: "DMRC",
      image: "/ClientPhotos/DMRC/hero.jpg",
    },
    {
      sector: "Corporate",
      companyName: "Titan Limited",
      image: "/ClientPhotos/Titan/hero.jpg",
    },
    {
      sector: "Automobile",
      companyName: "TVS Motors",
      image: "/ClientPhotos/TVS/hero.jpg",
    },
    {
      sector: "Institutional",
      companyName: "Usha Workspace",
      image: "/ClientPhotos/Usha/hero.jpg",
    },
  ],
} as const;

export const HOMEPAGE_CONTACT_CONTENT = {
  eyebrow: "Planning-led close",
  titleLead: "Start with one",
  titleAccent: "clear brief.",
  description: "Share the brief, timeline, and city. We will guide the right next step.",
  plannerPoints: ["Brief and city", "Timeline and scope", "Human response"],
  plannerCta: "Guided Planner",
  directTitle: "Direct line if the brief is ready",
  directDescription: "Use WhatsApp for the fastest routing or call the team for a live handoff.",
  directActions: [
    {
      type: "whatsapp",
      label: "WhatsApp now",
      detail: "Fastest response",
    },
    {
      type: "phone",
      label: "Call team",
      detail: "Talk to support",
    },
  ],
} as const;

export const HOMEPAGE_PROCESS_CONTENT = {
  kicker: "",
  titleLead: "A clear",
  titleAccent: "delivery system.",
  description: "",
  cta: { label: "Start your project brief", href: "/contact" },
  steps: [
    {
      title: "Scope",
      sla: "Day 1-2",
      deliverable: "Signed brief",
    },
    {
      title: "Design",
      sla: "Day 3-7",
      deliverable: "Approved layout",
    },
    {
      title: "Deliver",
      sla: "As per approved schedule",
      deliverable: "Installed workspace",
    },
    {
      title: "Support",
      sla: "Ongoing",
      deliverable: "Service support",
    },
  ],
} as const;

export const HOMEPAGE_SOLUTIONS_CONTENT = {
  kicker: "Workspace routes",
  title: "Browse by workspace need.",
  compareCta: "Compare product options",
  catalogCta: "Browse full catalog",
  mobileHint: "Swipe to browse categories",
  capabilities: [
    {
      title: "Ergonomic Seating",
      outcome:
        "Task and executive seating tuned for posture support, long-hour comfort, and dependable after-sales coverage.",
      href: "/products/seating",
      image: "/images/catalog/oando-seating--fluid-x/image-1.webp",
    },
    {
      title: "Scalable Workstations",
      outcome:
        "Modular systems that scale team by team with practical cable management and planning-friendly layouts.",
      href: "/products/workstations",
      image: "/images/catalog/oando-workstations--deskpro/image-1.webp",
    },
    {
      title: "Meeting Tables",
      outcome:
        "Table systems for collaboration, review, and client-facing discussion zones.",
      href: "/products/tables",
      image: "/images/products/meeting-table-10pax.webp",
    },
    {
      title: "Storage Systems",
      outcome:
        "Lockers, pedestals, and cabinets built for secure daily use with efficient footprint planning.",
      href: "/products/storages",
      image: "/images/catalog/oando-storage--metal-storages/image-1.webp",
    },
  ],
} as const;

export const HOMEPAGE_PARTNERSHIP_CONTENT = {
  image: {
    src: "/catalog-logo-sharp.webp",
    alt: "AFC - Authorized Franchise Partner",
  },
  title: ["Authorized Franchise", "Partner"],
  description: "Global standards, local execution.",
  cta: {
    label: "Partner Profile",
    href: "/about",
  },
} as const;
