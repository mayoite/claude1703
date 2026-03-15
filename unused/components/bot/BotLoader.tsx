"use client";

import dynamic from "next/dynamic";

// ssr: false is only allowed inside Client Components
const AdvancedBot = dynamic(
  () =>
    import("@/components/bot/AdvancedBot").then((m) => ({
      default: m.AdvancedBot,
    })),
  { ssr: false },
);

export function BotLoader() {
  return <AdvancedBot />;
}
