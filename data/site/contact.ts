export type SiteSocialLink = {
  label: string;
  href: string;
  id: "youtube" | "facebook";
};

export const SITE_CONTACT = {
  salesPhone: "+91 98356 30940",
  supportPhone: "+91 90310 22875",
  salesEmail: "sales@oando.co.in",
  regionLine: "Patna, Bihar and Jharkhand, India",
  openingHours: "Mo-Sa 09:00-18:00",
  priceRange: "INR",
  areaServed: ["Bihar", "Jharkhand", "India"],
  address: {
    streetAddress: "401, Jagat Trade Centre, Frazer Road",
    addressLocality: "Patna",
    postalCode: "800001",
    addressRegion: "Bihar",
    addressCountry: "IN",
  },
  geo: {
    latitude: 25.6127,
    longitude: 85.1376,
  },
  socialLinks: [
    {
      label: "YouTube",
      href: "https://www.youtube.com/channel/UCehXuPNAXkyfODPCwyAU1gQ",
      id: "youtube",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/oandofurniture",
      id: "facebook",
    },
  ] satisfies SiteSocialLink[],
} as const;
