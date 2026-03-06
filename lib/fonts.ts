import localFont from "next/font/local";

export const ciscoSans = localFont({
  src: [
    {
      path: "../public/fonts/cisco-sans/CiscoSans-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/cisco-sans/CiscoSans-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/cisco-sans/CiscoSans.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/cisco-sans/CiscoSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/cisco-sans/CiscoSans-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-cisco",
  display: "swap",
});
