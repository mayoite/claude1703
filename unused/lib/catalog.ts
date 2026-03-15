/**
 * @deprecated — LEGACY STATIC CATALOG
 *
 * Product pages now fetch dynamically from Supabase via lib/getProducts.ts.
 * This file is ONLY kept for client-side components that need category
 * names/IDs for navigation (Header, CategoryGrid, InteractiveRoom).
 *
 * DO NOT add new products here. Add them to the Supabase 'products' table
 * and use getCatalog() from lib/getProducts.ts instead.
 *
 * To fully remove this file:
 *   1. Convert Header/CategoryGrid/InteractiveRoom to receive catalog
 *      data as props from a server component parent.
 *   2. Delete this file.
 */
export interface ProductVariant {
  id: string;
  variantName: string; // e.g., "With Headrest", "Without Headrest"
  galleryImages: string[]; // Exactly 7 images for the split layout
  threeDModelUrl?: string; // Optional path to a .gltf or .glb file
}

export interface ProductInfo {
  overview: string;
  features: string[];
  dimensions: string;
  materials: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  flagshipImage: string;
  sceneImages: string[]; // Lifestyle/Contextual shots
  technicalDrawings?: string[]; // CAD-style line drawings
  documents?: string[]; // PDF spec sheets, brochures
  variants: ProductVariant[];
  detailedInfo: ProductInfo;
  metadata?: {
    source?: string;
    category?: string;
    subcategory?: string;
    bifmaCertified?: boolean;
    warrantyYears?: number;
    sustainabilityScore?: number;
    tags?: string[];
    priceRange?: "budget" | "mid" | "premium" | "luxury";
    useCase?: string[];
    material?: string[];
    colorOptions?: string[];
    hasHeadrest?: boolean;
    isHeightAdjustable?: boolean;
    isStackable?: boolean;
    isNestable?: boolean;
    isBifoldable?: boolean;
    seriesId?: string;
  };
}

export interface Series {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  series: Series[];
}

export const oandoCatalog: Category[] = [
  {
    id: "oando-workstations",
    name: "Workstations",
    description: "Modular workstation solutions for modern offices",
    series: [
      {
        id: "oando-workstations-series",
        name: "Workstations Series",
        description: "Premium workstations solutions",
        products: [
          {
            id: "curvivo",
            name: "Curvivo",
            description:
              "A dynamic and innovative workstation that is adaptable to different workspaces. Curvivo office solution for enhanced efficiency, embracing fluidity and harmony.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899aa009be5eb667a604f17_image_(5).png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e2908a7da0ff41267d9c_curvivo_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "A dynamic and innovative workstation that is adaptable to different workspaces. Curvivo office solution for enhanced efficiency, embracing fluidity and harmony.",
              features: [
                "Enhanced Efficiency",
                "Fluid Design",
                "Sustainability",
              ],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              subcategory: "Linear Workstation",
              priceRange: "premium",
              useCase: ["Executive Office", "Focused Work"],
              material: ["Steel", "MDF", "Melamine"],
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "adaptable",
            name: "Adaptable",
            description:
              "Adaptable modular office furniture designed for flexible workstations, modern offices, and collaborative spaces. Ideal for office furniture, modular office furniture, and workspace solutions.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_694a6270eafa71d6f5e33b7f_hat_2a.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_694a627695a9d78481b7e4ac_hat_2b.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Adaptable modular office furniture designed for flexible workstations, modern offices, and collaborative spaces. Ideal for office furniture, modular office furniture, and workspace solutions.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              subcategory: "Modular Workstation",
              priceRange: "mid",
              useCase: ["Open Office", "Collaborative"],
              material: ["Steel", "MFC"],
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "deskpro",
            name: "DeskPro",
            description:
              "DeskPro office workstations for efficient layouts. Discover modular desks for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899a993e44404f6f3bcc398_image_(3).png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e32607cc220a51bf8b9d_deskpro_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "DeskPro office workstations for efficient layouts. Discover modular desks for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              subcategory: "L-Shaped Workstation",
              priceRange: "mid",
              useCase: ["Corner Office", "Managerial"],
              material: ["Metal", "Laminate"],
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "sleek",
            name: "Sleek",
            description:
              "Sleek modern office furniture for stylish and functional workspaces. Explore solutions for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899a9c13d41a799c8276857_image_(4).png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e2ecfb7309f199638de2_sleek_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Sleek modern office furniture for stylish and functional workspaces. Explore solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              subcategory: "Linear Workstation",
              priceRange: "budget",
              useCase: ["BPO", "Compact Office"],
              material: ["Steel", "MFC"],
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "trio-2",
            name: "Trio",
            description:
              "A workstation system built for open spaces, crafted to bring flow and flexibility. Modular and adaptable solution designed to shape every kind of workstyle.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_69271a27cccef8a26e5b982b_trio_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_6927184380ed83acea41c477_trio_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "A workstation system built for open spaces, crafted to bring flow and flexibility. Modular and adaptable solution designed to shape every kind of workstyle, from focused corners to collaborative zones, creating harmony across the workplace.",
              features: [
                "Flow and Flexibility",
                "Modular Adaptability",
                "Supportive Design",
              ],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "panel-pro",
            name: "Panel Pro",
            description:
              "Panel Pro office partition systems for modular layouts and space division. Discover solutions for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899aa91f03e6a89282d60c6_image_(7).png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e19ce6798d83eab6341c_panelpro_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Panel Pro office partition systems for modular layouts and space division. Discover solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "x-bench",
            name: "X Bench",
            description:
              "X-Bench workstation system for collaborative offices. Discover modular benching for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "X-Bench workstation system for collaborative offices. Discover modular benching for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "fenix",
            name: "Fenix",
            description:
              "Workstation featuring a strong 40x40 leg framework that pairs durability with a sleek, minimal profile. Modular adaptability supports the changing needs of contemporary teams.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_693aa6dc791283acd3853cfa_fenix_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_693aa49ea09525af1fd89213_fenix_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Workstation featuring a strong 40x40 leg framework that pairs durability with a sleek, minimal profile. Modular adaptability supports the changing needs of contemporary teams through composed function.",
              features: [
                "40x40 Leg Framework",
                "Sleek Profile",
                "Modular Adaptability",
              ],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Steel frame, powder-coated",
                "Melamine-finish MDF work surface",
                "Adjustable levelling feet",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "workstations",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "oando-tables",
    name: "Tables",
    description: "Conference tables, meeting tables, and office desks",
    series: [
      {
        id: "oando-tables-series",
        name: "Tables Series",
        description: "Premium tables solutions",
        products: [
          {
            id: "exquisite",
            name: "Exquisite",
            description:
              "Exquisite blends refined craftsmanship with modern authority. Premium executive office furniture designed for modern cabins, creating a bold yet graceful presence.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_690f482177b80a5aa8d4f314_exquisite.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_690f47e748a3ed3ed1be7cc6_exquisite_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Exquisite blends refined craftsmanship with modern authority. It uses premium veneers and precise detailing to create a bold yet graceful presence that defines the executive space.",
              features: [
                "Refined Craftsmanship",
                "Premium Veneers",
                "Modern Authority",
              ],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "nextable",
            name: "NexTable",
            description:
              "Nextable height-adjustable tables for ergonomic comfort. Improve posture and productivity with One and Only sit-stand desks.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0b807564dd58e2a3306e_nextable_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0b83bc8b483e98f3fac6_nextable_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Nextable height-adjustable tables for ergonomic comfort. Improve posture and productivity with One and Only sit-stand desks.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "impulse",
            name: "Impulse",
            description:
              "Impulse workstation system for modular office layouts. Discover efficient space planning and premium design for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0bcdb10ee7e0d263392f_impulse_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0bd085bc1496ca4105d3_impulse_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Impulse workstation system for modular office layouts. Discover efficient space planning and premium design for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "crest",
            name: "Crest",
            description:
              "Crest executive office table crafted for leadership spaces. Modular office furniture with premium finishes for modern corporate interiors.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_690320cae57dfa867bb9fb19_crest.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_690320ce4217d21446ea5d49_crest_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Crest executive office table crafted for leadership spaces. Modular office furniture with premium finishes for modern corporate interiors.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "opus-2",
            name: "Opus",
            description:
              "Opus 2 executive office desk crafted for premium interiors. Luxury office furniture designed for modern executive workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_69207b1e31e6cda889f3dc1e_opus.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_69207b23866b7196e978d54f_opus_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Opus 2 executive office desk crafted for premium interiors. Luxury office furniture designed for modern executive workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "convesso",
            name: "Convesso",
            description:
              "Convesso conference table for meeting rooms. Stylish office meeting table designed for collaboration and modern workspace design.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09820580a18498c921c1_convesso.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac098849f11a71a090963b_convesso_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Convesso conference table for meeting rooms. Stylish office meeting table designed for collaboration and modern workspace design.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "uniflip",
            name: "Uniflip",
            description:
              "Uniflip training and flip tables for flexible learning spaces and meetings. Explore versatile table solutions for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0be40f3412327f1d163e_uniflip_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0be83d6190304fcb2304_uniflip_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Uniflip training and flip tables for flexible learning spaces and meetings. Explore versatile table solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "sleek-meet",
            name: "Sleek-Meet",
            description:
              "Sleek Meet conference tables for modern meeting rooms. Discover tables for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09a549f11a71a090b1bc_sleek_meet.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09a949f11a71a090b349_sleek_meet_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Sleek Meet conference tables for modern meeting rooms. Discover tables for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "convene",
            name: "Convene",
            description:
              "Convene meeting table designed for conference rooms. Functional office meeting table supporting teamwork and productivity.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0ad23ae62d06453de864_canvene_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0ad5acae760a25ca4248_canvene_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Convene meeting table designed for conference rooms. Functional office meeting table supporting teamwork and productivity.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "desk-meet",
            name: "Desk-Meet",
            description:
              "Desk Meet conference table for productive discussions. Durable office table furniture ideal for modern meeting rooms and offices.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09c017fc68ec25131aa8_desk_meet.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09c77564dd58e2a1b62d_desk_meet_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Desk Meet conference table for productive discussions. Durable office table furniture ideal for modern meeting rooms and offices.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "modulus",
            name: "Modulus",
            description:
              "Modulus modular office furniture for flexible layouts and efficient space planning. Explore modern solutions for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0c17a71dc35ac0df3c77_modulus_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0c1b0580a18498cb0b67_modulus_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Modulus modular office furniture for flexible layouts and efficient space planning. Explore modern solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "presidency",
            name: "Presidency",
            description:
              "Presidency executive table designed for luxury boss cabins. Premium office furniture for modern corporate offices across India.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899abac81b853e07c6bdded_image_1238.png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e46703f08bf146fecda9_presidency_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Presidency executive table designed for luxury boss cabins. Premium office furniture for modern corporate offices across India.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "curvivo-meet",
            name: "Curvivo",
            description:
              "Curvivo Meet table for offices and training rooms. Smart modular office furniture built for collaboration and daily meetings.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09debc8b483e98f2e291_curvivo.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac09e3acae760a25c9e330_curvivo_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Curvivo Meet table for offices and training rooms. Smart modular office furniture built for collaboration and daily meetings.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "stake",
            name: "Stake",
            description:
              "Stake versatile modular table and desk system offering functionality and durability. Ideal workspace solution for daily workstations and team meetings.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0b19714954caacc56e8c_stake_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0b1e04e90dca0d907df1_stake_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Stake versatile modular table and desk system offering functionality and durability. Ideal workspace solution for daily workstations and team meetings.",
              features: [
                "Modular Table System",
                "Versatile Layouts",
                "Durability",
              ],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "inox",
            name: "Inox",
            description:
              "Inox metal office furniture with durable construction. Strong tables and storage solutions built for modern office furniture needs.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0ae80580a18498c9f668_inox_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0aec17fc68ec2513f118_inox_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Inox metal office furniture with durable construction. Strong tables and storage solutions built for modern office furniture needs.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "consulate",
            name: "Consulate",
            description:
              "Consulate executive office table with elegant styling and durability. Perfect modular office furniture for cabins and leadership spaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899ab6c10d61f61929e6bbb_image_1240.png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e438d2d6d279597506e0_consulate_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Consulate executive office table with elegant styling and durability. Perfect modular office furniture for cabins and leadership spaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },

          {
            id: "x-meet",
            name: "X Meet",
            description:
              "X Meet conference table for boardrooms and offices. Spacious and durable office meeting table for modern corporate setups.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "X Meet conference table for boardrooms and offices. Spacious and durable office meeting table for modern corporate setups.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "sleek-tab",
            name: "Sleek",
            description:
              "Sleek Tab training and meeting table for offices. Flexible training table furniture for collaborative workstations and conference rooms.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0a8c7b975fe679fd0ee3_cafe_sleek_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0a913ae62d06453da920_cafe_sleek_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Sleek Tab training and meeting table for offices. Flexible training table furniture for collaborative workstations and conference rooms.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "letz-think",
            name: "Letz",
            description:
              "Letz Think training table for classrooms and offices. Flexible training table furniture for workshops, seminars, and learning spaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0a42acae760a25ca04cd_letz_think.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68ac0a493ae62d06453d5aa9_letz_think_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Letz Think training table for classrooms and offices. Flexible training table furniture for workshops, seminars, and learning spaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "apex",
            name: "Apex",
            description:
              "Apex executive office desk offering modern design and durability. Ideal office table furniture for professional and corporate cabins.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_6899ac6f98d87ab3c05862ed_image_1218.png",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a2e4f47c86ba66b1d6d195_apex_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Apex executive office desk offering modern design and durability. Ideal office table furniture for professional and corporate cabins.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "1800900750mm (standard)",
              materials: [
                "MFC top (25mm thick)",
                "Steel powder-coated base",
                "PVC edge banding 2mm",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "tables",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "oando-storage",
    name: "Storage",
    description: "Filing cabinets, lockers, and storage solutions",
    series: [
      {
        id: "oando-storage-series",
        name: "Storage Series",
        description: "Premium storage solutions",
        products: [
          {
            id: "prelam-locker",
            name: "Wooden",
            description:
              "The wooden locker blends style and functionality, offering secure storage for everyday use in offices, gyms, and schools. Its thoughtful design ensures organized spaces while adding warmth to shared e",
            flagshipImage: "/images/products/imported/storage/image-14.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33d88ac691a23437da4a9_locker_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "The wooden locker blends style and functionality, offering secure storage for everyday use in offices, gyms, and schools. Its thoughtful design ensures organized spaces while adding warmth to shared e",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "pedestal",
            name: "Prelam",
            description:
              "Office pedestal storage unit for organized workstations. Compact office storage solution with secure drawers for everyday use.",
            flagshipImage: "/images/products/imported/storage/image-15.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33aed4aa7c59dfbd123f7_pedestal_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Office pedestal storage unit for organized workstations. Compact office storage solution with secure drawers for everyday use.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "metal-pedestal",
            name: "Metal Pedestal",
            description:
              "Office pedestal storage units for desks and workstations. Discover compact and secure storage solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/storage/image-16.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33bd6c74b7831216a4bd2_pedestal_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Office pedestal storage units for desks and workstations. Discover compact and secure storage solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "compactor",
            name: "Compactor",
            description:
              "High-density compactor storage systems for files and documents. Explore space-saving storage solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/storage/image-39.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33d1345008068da79673a_compactor_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "High-density compactor storage systems for files and documents. Explore space-saving storage solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "metal-locker",
            name: "Metal Locker",
            description:
              "Metal lockers for offices and institutions. Discover secure, durable, and space-efficient locker storage solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/storage/image-42.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33d4537b54c7c3b17f77b_metal_locker_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Metal lockers for offices and institutions. Discover secure, durable, and space-efficient locker storage solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "prelam-storage",
            name: "Prelam",
            description:
              "Office side units and storage cabinets for organized workspaces. Discover modern storage for modern workspaces.",
            flagshipImage: "/images/products/imported/storage/image-45.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33aed4aa7c59dfbd123f7_pedestal_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Office side units and storage cabinets for organized workspaces. Discover modern storage for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "metal-storages",
            name: "Metal",
            description:
              "Office side units for workspace organization. Discover modern side storage cabinets for modern workspaces.",
            flagshipImage: "/images/products/imported/storage/image-73.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33bd6c74b7831216a4bd2_pedestal_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Office side units for workspace organization. Discover modern side storage cabinets for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "heavy-duty-racks",
            name: "Heavy Dut",
            description:
              "Office storage racks for organized workspaces. Discover durable shelving and rack storage solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/storage/image-75.webp",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a33cd07e416b6139611e93_racks_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Office storage racks for organized workspaces. Discover durable shelving and rack storage solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W900D450H1800mm (wardrobe)",
              materials: [
                "CRCA steel, powder-coated",
                "Piano hinge doors",
                "Adjustable shelves",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "storage",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "oando-soft-seating",
    name: "Soft Seating",
    description: "Lounge chairs, sofas, and casual seating",
    series: [
      {
        id: "oando-soft-seating-series",
        name: "Soft Seating Series",
        description: "Premium soft seating solutions",
        products: [
          {
            id: "verka",
            name: "Verka",
            description:
              "Verka lounge chair for receptions and breakout areas, providing a stylish and comfortable seating solution for modern professional environments.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Verka lounge chair for receptions and breakout areas, providing a stylish and comfortable seating solution for modern professional environments.",
              features: [
                "Ergonomic Support",
                "Modular Design",
                "Sustainability",
              ],
              dimensions: "W680 D700 H820mm",
              materials: [
                "High-density foam",
                "Premium fabric upholstery",
                "Steel base",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              subcategory: "Lounge Chair",
              useCase: ["Reception", "Breakout"],
              priceRange: "mid",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "high-cafe",
            name: "High Cafe",
            description:
              "High Cafe bar chair for breakout and dining spaces, offering a modern seating solution for cafeterias and collaborative zones.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "High Cafe bar chair for breakout and dining spaces, offering a modern seating solution for cafeterias and collaborative zones.",
              features: [
                "Sleek Profile",
                "Durable Frame",
                "Ergonomic Footrest",
              ],
              dimensions: "W450 D480 H1050mm",
              materials: ["Powder-coated steel", "Molded plywood seat"],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              subcategory: "Bar Stool",
              useCase: ["Cafeteria", "Collaborative"],
              priceRange: "budget",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "grace",
            name: "Grace",
            description:
              "Grace lounge seating for waiting areas and relaxed office spaces, offering a refined and comfortable aesthetic for modern professional environments.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_694b91752b9659cee7897a61_grace_landing_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_694b917ae8eb928ca73aa6c9_grace_landing_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Grace lounge seating for waiting areas and relaxed office spaces, offering a refined and comfortable aesthetic for modern professional environments.",
              features: [
                "Elegant Silhouette",
                "Soft Cushioning",
                "Durable Upholstery",
              ],
              dimensions: "W720 D750 H850mm",
              materials: [
                "Internal wood frame",
                "Memory foam topper",
                "Reinforced fabric",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              subcategory: "Lounge Chair",
              useCase: ["Waiting Area", "Lounge"],
              priceRange: "premium",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "brim",
            name: "Brim",
            description:
              "Brim lounge seating for waiting areas and informal spaces, designed to provide comfort and a touch of modern flair to shared office zones.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_69280b87ff297e69976d3ab6_brim_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_69280b8ae5a83b56217012b6_brim_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Brim lounge seating for waiting areas and informal spaces, designed to provide comfort and a touch of modern flair to shared office zones.",
              features: [
                "Versatile Styling",
                "Compact Footprint",
                "High-resilience Foam",
              ],
              dimensions: "W650 D680 H800mm",
              materials: ["Molded internal frame", "Premium textile finish"],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              subcategory: "Lounge Chair",
              useCase: ["Breakout", "Informal Meeting"],
              priceRange: "mid",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "fynn",
            name: "Fynn",
            description:
              "Fynn lounge seating for waiting areas and relaxed office spaces, combining ergonomic support with a contemporary design for professional settings.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_692af3dff014edab0a0eab6d_fynn.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_692af3e311e33e59fa4fc9a6_fynn_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Fynn lounge seating for waiting areas and relaxed office spaces, combining ergonomic support with a contemporary design for professional settings.",
              features: [
                "Ergonomic Contouring",
                "Contemporary Aesthetic",
                "Built-to-last",
              ],
              dimensions: "W700 D720 H830mm",
              materials: ["Stainless steel legs", "Contoured foam shell"],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              subcategory: "Lounge Chair",
              useCase: ["Reception", "Private Lounge"],
              priceRange: "premium",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "accent",
            name: "Accent",
            description:
              "Accent office side and storage units for organized workspaces. Discover modern storage for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Accent office side and storage units for organized workspaces. Discover modern storage for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "como",
            name: "Como",
            description:
              "Como lounge chair with plush cushioning and solid wood legs, perfect for executive waiting areas and breakout lounges.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Como executive office desks for premium leadership spaces. Explore modern desks for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "padora",
            name: "Padora",
            description:
              "Padora office chairs for comfort and durability. Discover modern seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Padora office chairs for comfort and durability. Discover modern seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "trion",
            name: "Trion",
            description:
              "Trion modular office furniture for flexible layouts and modern workspace needs. Discover solutions for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Trion modular office furniture for flexible layouts and modern workspace needs. Discover solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "luna",
            name: "Luna",
            description:
              "Luna lounge chair with Scandinavian-inspired wooden legs and deep cushioned seat. A calm, welcoming addition to any reception or breakout space.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Nordic office furniture inspired by clean lines and modern design. Discover workstations for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "armora",
            name: "Armora",
            description:
              "Armora office storage cabinets for durability and workspace organization. Discover storage for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Armora office storage cabinets for durability and workspace organization. Discover storage for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "nuvora",
            name: "Nuvora",
            description:
              "Nuvora marker board for offices. Ideal for meetings and brainstorming with a sleek and durable design for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Nuvora marker board for offices. Ideal for meetings and brainstorming with a sleek and durable design for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "nook",
            name: "Nook",
            description:
              "Nook lounge seating for waiting areas and informal spaces. Discover soft seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Nook lounge seating for waiting areas and informal spaces. Discover soft seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "opera",
            name: "Opera",
            description:
              "Opera executive office furniture for premium aesthetics and durability. Discover solutions for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Opera executive office furniture for premium aesthetics and durability. Discover solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "crossa",
            name: "Crossa",
            description:
              "Crossa office chair collection offering ergonomic comfort and modern design. Discover quality seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Crossa office chair collection offering ergonomic comfort and modern design. Discover quality seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "alonzo",
            name: "Alonzo",
            description:
              "Alonzo designer office chairs for comfort and modern interiors. Explore seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Alonzo designer office chairs for comfort and modern interiors. Explore seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "spectrum",
            name: "Spectrum",
            description:
              "Spectrum office furniture for flexible workspaces. Discover modern desks and seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Spectrum office furniture for flexible workspaces. Discover modern desks and seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "virello",
            name: "Virello",
            description:
              "Virello office chairs for comfort and durability. Discover ergonomic seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Virello office chairs for comfort and durability. Discover ergonomic seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "arco",
            name: "Arco",
            description:
              "Arco modern office furniture for stylish and functional workspaces. Discover contemporary designs for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Arco modern office furniture for stylish and functional workspaces. Discover contemporary designs for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "esmor",
            name: "Esmor",
            description:
              "Esmor modern office furniture for stylish and functional workspaces. Explore solutions for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Esmor modern office furniture for stylish and functional workspaces. Explore solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "cirq",
            name: "Cirq",
            description:
              "Cirq collaborative seating for teamwork and shared spaces. Discover modern office seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Cirq collaborative seating for teamwork and shared spaces. Discover modern office seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "orb",
            name: "Orb",
            description:
              "Orb collaborative seating for teamwork and shared spaces. Discover modern office seating for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_68a319f5dafd6cd106ec5943_orbit.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_68a319f94efd22af34df6e61_orbit_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Orb collaborative seating for teamwork and shared spaces. Discover modern office seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "tectara",
            name: "Tectara",
            description:
              "Tectara office workstations for efficient layouts. Discover modular workspace solutions for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Tectara office workstations for efficient layouts. Discover modular workspace solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "velto",
            name: "Velto",
            description:
              "Velto ergonomic office chairs for posture support and productivity. Discover seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Velto ergonomic office chairs for posture support and productivity. Discover seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "cocoon",
            name: "Cocoon",
            description:
              "Cocoon acoustic lounge chair wrapping you in comfort and focus. A high-back shell design ideal for breakout zones and informal meetings.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Cocoon acoustic seating for privacy and focus. Discover modern pod seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "moon",
            name: "Moon",
            description:
              "Moon lounge seating for waiting areas and relaxed office spaces. Discover soft seating for modern workspaces.",
            flagshipImage:
              "/images/catalog/686d3b55385e7b905b01d3a5_694bc1c696a177177806618c_moonlight_1.jpg",
            sceneImages: [
              "/images/catalog/686d3b55385e7b905b01d3a5_694bc1cb4c86a76f8dfce0e1_moonlight_2.jpg",
            ],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Moon lounge seating for waiting areas and relaxed office spaces. Discover soft seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "cone",
            name: "Cone",
            description:
              "Cone office seating for modern interiors. Discover stylish and comfortable chairs for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Cone office seating for modern interiors. Discover stylish and comfortable chairs for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "rattique",
            name: "Rattique",
            description:
              "Rattique designer office seating for comfort and contemporary appeal. Discover stylish seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Rattique designer office seating for comfort and contemporary appeal. Discover stylish seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "cove",
            name: "Cove",
            description:
              "Cove lounge seating for waiting areas and offices. Discover modern soft seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Cove lounge seating for waiting areas and offices. Discover modern soft seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "luxar",
            name: "Luxar",
            description:
              "Luxar executive office chairs for premium comfort. Discover leadership seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Luxar executive office chairs for premium comfort. Discover leadership seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "ceda",
            name: "Ceda",
            description:
              "Ceda executive office desk for leadership spaces. Discover premium workspace aesthetics for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Ceda executive office desk for leadership spaces. Discover premium workspace aesthetics for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "hush",
            name: "Hush",
            description:
              "Hush acoustic office seating for privacy and focused workspaces. Explore seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Hush acoustic office seating for privacy and focused workspaces. Explore seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "eclips",
            name: "Eclips",
            description:
              "Eclips executive office desk for premium workspaces. Explore durable design and modern aesthetics for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Eclips executive office desk for premium workspaces. Explore durable design and modern aesthetics for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "twig",
            name: "Twig",
            description:
              "Twig office chairs for modern workspaces. Discover ergonomic seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Twig office chairs for modern workspaces. Discover ergonomic seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "margas",
            name: "Margas",
            description:
              "Margas modular office furniture for flexible layouts and workspace efficiency. Explore modern solutions for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Margas modular office furniture for flexible layouts and workspace efficiency. Explore modern solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "lura",
            name: "Lura",
            description:
              "Lura office seating solutions for comfort and modern workspace appeal. Explore seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Lura office seating solutions for comfort and modern workspace appeal. Explore seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "embrace",
            name: "Embrace",
            description:
              "Embrace collaborative seating for teamwork and shared workspaces. Discover modern seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Embrace collaborative seating for teamwork and shared workspaces. Discover modern seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "halo",
            name: "Halo",
            description:
              "Halo ergonomic office chairs for superior comfort and posture support. Explore productivity-focused seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Halo ergonomic office chairs for superior comfort and posture support. Explore productivity-focused seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "relax",
            name: "Relax",
            description:
              "Relax lounge seating for waiting areas and informal office spaces. Explore soft seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Relax lounge seating for waiting areas and informal office spaces. Explore soft seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "arcana",
            name: "Arcana",
            description:
              "Arcana premium office furniture for executive spaces. Explore modern design and long-lasting performance for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Arcana premium office furniture for executive spaces. Explore modern design and long-lasting performance for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "plumb",
            name: "Plumb",
            description:
              "Plumb office furniture collection for modern design and functional workspaces. Explore solutions for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Plumb office furniture collection for modern design and functional workspaces. Explore solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "casca",
            name: "Casca",
            description:
              "Casca designer office seating combining comfort and durability. Explore stylish chairs for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Casca designer office seating combining comfort and durability. Explore stylish chairs for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "adam",
            name: "Adam",
            description:
              "Adam office seating for modern workspaces. Discover durable and comfortable chairs for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Adam office seating for modern workspaces. Discover durable and comfortable chairs for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "cozy",
            name: "Cozy",
            description:
              "Cozy lounge seating for relaxed office spaces and waiting areas. Discover modern soft seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Cozy lounge seating for relaxed office spaces and waiting areas. Discover modern soft seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "covea",
            name: "Covea",
            description:
              "Covea lounge and waiting seating for offices. Discover stylish and comfortable seating for modern workspaces.",
            flagshipImage: "",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [],
              },
            ],
            detailedInfo: {
              overview:
                "Covea lounge and waiting seating for offices. Discover stylish and comfortable seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600 D600 H900-1000mm (adj.)",
              materials: [
                "Solid wood or steel frame",
                "High-density foam (40D)",
                "Premium fabric or PU leather upholstery",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "soft-seating",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "oando-educational",
    name: "Educational",
    description: "Classroom furniture and educational institution solutions",
    series: [
      {
        id: "oando-educational-series",
        name: "Educational Series",
        description: "Premium educational solutions",
        products: [
          {
            id: "performer",
            name: "Performer",
            description:
              "Performer office chair designed for comfort, durability, and daily productivity. Discover modern ergonomic seating for modern workspaces.",
            flagshipImage: "/images/products/imported/adam/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Performer office chair designed for comfort, durability, and daily productivity. Discover modern ergonomic seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "connecta",
            name: "Connecta",
            description:
              "Connecta collaborative office furniture for teamwork and shared spaces. Discover solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/arcana/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Connecta collaborative office furniture for teamwork and shared spaces. Discover solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "wooden-bed",
            name: "Wooden Bed",
            description:
              "Wooden beds for institutional and staff accommodation. Discover durable furniture for modern workspaces.",
            flagshipImage: "/images/products/imported/crossa/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Wooden beds for institutional and staff accommodation. Discover durable furniture for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "audi-chair",
            name: "Audi Chair",
            description:
              "Audi ergonomic office chair designed for posture support and comfort. Discover modern seating for modern workspaces.",
            flagshipImage:
              "/images/products/imported/lab-furniture/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Audi ergonomic office chair designed for posture support and comfort. Discover modern seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "xplorer",
            name: "Xplorer",
            description:
              "Xplorer office workstations for modern offices. Discover modular layouts and efficient workspace solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/adam/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Xplorer office workstations for modern offices. Discover modular layouts and efficient workspace solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "forma",
            name: "Forma",
            description:
              "Forma modular office furniture for flexible layouts and workspace efficiency. Discover solutions for modern workspaces.",
            flagshipImage: "/images/products/imported/arcana/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Forma modular office furniture for flexible layouts and workspace efficiency. Discover solutions for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "metal-bed",
            name: "Metal Bed",
            description:
              "Metal beds for hostels and institutions. Discover durable accommodation furniture for modern workspaces.",
            flagshipImage: "/images/products/imported/adam/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Metal beds for hostels and institutions. Discover durable accommodation furniture for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "podium",
            name: "Podium",
            description:
              "Office podium furniture for presentations and meetings. Discover durable and modern podium designs for modern workspaces.",
            flagshipImage: "/images/products/imported/arcana/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Office podium furniture for presentations and meetings. Discover durable and modern podium designs for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "academia",
            name: "Academia",
            description:
              "Academia educational furniture for schools and colleges. Discover durable desks and seating for modern workspaces.",
            flagshipImage: "/images/products/imported/crossa/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Academia educational furniture for schools and colleges. Discover durable desks and seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "magazine-rack",
            name: "Magazine Rack",
            description:
              "Office magazine racks and display units for organized reception areas. Discover storage for modern workspaces.",
            flagshipImage:
              "/images/products/imported/lab-furniture/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Office magazine racks and display units for organized reception areas. Discover storage for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "classcraft",
            name: "Classcraft",
            description:
              "Classcraft classroom furniture for schools and institutes. Discover desks and seating for modern workspaces.",
            flagshipImage: "/images/products/imported/adam/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Classcraft classroom furniture for schools and institutes. Discover desks and seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
          {
            id: "learnix",
            name: "Learnix",
            description:
              "Learnix classroom furniture for modern learning spaces. Discover desks and seating for modern workspaces.",
            flagshipImage: "/images/products/imported/arcana/image-1.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/imported/accent/image-1.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Learnix classroom furniture for modern learning spaces. Discover desks and seating for modern workspaces.",
              features: ["Manufacturing", "Sustainability"],
              dimensions: "W600D500H720900mm",
              materials: [
                "Steel frame, epoxy-coated",
                "Plywood seat & back",
                "Rubber feet, stackable",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "educational",
              bifmaCertified: true,
              warrantyYears: 5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "oando-collaborative",
    name: "Collaborative Spaces",
    description: "Soft seating for dynamic team work and informal discussions",
    series: [
      {
        id: "oando-collaborative-series",
        name: "Collaborative Series",
        description:
          "Soft seating solutions for modern collaborative workspaces",
        products: [
          {
            id: "solace-pod",
            name: "Solace Pod",
            description:
              "Solace Pod — an acoustic privacy pod designed for teams needing focused conversation space in open offices. High curved back provides noise dampening without full enclosure.",
            flagshipImage: "/images/products/imported/pod/image-2.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: [
                  "/images/products/softseating-solace-1.webp",
                  "/images/products/softseating-solace-2.webp",
                ],
              },
            ],
            detailedInfo: {
              overview:
                "Solace Lounge provides comfortable seating for collaborative workspaces, perfect for informal discussions and team meetings.",
              features: [
                "Ergonomic Design",
                "Modular Configuration",
                "Premium Upholstery",
                "Easy Maintenance",
              ],
              dimensions: "Multiple configurations available",
              materials: [
                "High-density foam",
                "Premium fabric",
                "Sturdy frame construction",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "collaborative",
              bifmaCertified: true,
              warrantyYears: 5,
              tags: ["collaborative", "soft-seating", "lounge"],
            },
          },
          {
            id: "cocoon-pod",
            name: "Cocoon Pod",
            description:
              "Cocoon Pod provides full acoustic enclosure with integrated USB charging, ideal for private calls and focused deep work in collaborative office environments.",
            flagshipImage: "/images/products/imported/pod/image-11.webp",
            sceneImages: [],
            variants: [
              {
                id: "standard",
                variantName: "Standard Model",
                galleryImages: ["/images/products/softseating-solace-1.webp"],
              },
            ],
            detailedInfo: {
              overview:
                "Cocoon seating provides privacy and comfort for focused collaborative work in open office environments.",
              features: [
                "Sound Absorbing",
                "Privacy Panels",
                "Integrated Power",
                "Modular Design",
              ],
              dimensions: "Standard pod configuration",
              materials: [
                "Acoustic panels",
                "Premium upholstery",
                "Integrated technology",
              ],
            },
            metadata: {
              source: "oando.co.in",
              category: "collaborative",
              bifmaCertified: true,
              warrantyYears: 5,
              tags: ["collaborative", "privacy", "pods"],
            },
          },
        ],
      },
    ],
  },
];
