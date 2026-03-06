"use client";

import { useId } from "react";

const CLIENTS_ROW_1 = [
  "Adani Power",
  "Adecco",
  "Indian Bank",
  "Amara Raja",
  "Ambuja Neotia",
  "Annapurna Finance",
  "Asian Paints",
  "Azim Premji Foundation",
  "BBC Media Action",
  "BHEL",
  "Bureau of Indian Standards",
  "BNP Paribas",
  "BSPHCL",
  "Bandhan Bank",
  "Big Bazaar",
  "Government of Bihar",
  "Indian Army",
  "Birla School",
  "CIMP",
  "CRI Pumps",
  "Canara Bank",
  "CARE",
  "Coca-Cola",
  "Corporation Bank",
  "DMRC",
  "Dalmia Bharat Cement",
  "Essel Utilities",
  "FHI 360",
  "Franklin Templeton Investments",
  "D. Goenka School",
  "Government of India",
  "HDFC",
];

const CLIENTS_ROW_2 = [
  "HelpAge India",
  "Hyundai",
  "IDBI Bank",
  "ITC Limited",
  "Income Tax Department",
  "IndianOil",
  "JSW",
  "Janalakshmi",
  "L&T",
  "Maruti Suzuki",
  "NTPC",
  "SAIL",
  "State Bank of India",
  "SITI Networks",
  "Shriram",
  "Sonalika International",
  "Survey of India",
  "Syndicate Bank",
  "Tata Steel",
  "Tata Motors",
  "Titan",
  "United Nations",
  "Usha",
  "Ujjivan Small Finance Bank",
  "UNICEF",
  "NABARD",
  "United Spirits",
  "Vodafone",
  "World Health Organization",
  "ZTE",
];

export function ClientMarquee() {
  const firstTrackId = useId();
  const secondTrackId = useId();

  return (
    <section className="w-full bg-[#1a2030] py-10 md:py-12 overflow-hidden">
      <div className="container mb-6 px-6 2xl:px-0">
        <p className="text-left md:text-right text-sm font-semibold tracking-[0.1em] text-[#8792ad]">
          Clients we have delivered for
        </p>
      </div>

      <div className="relative flex flex-col gap-4 md:gap-5 select-none">
        {/* Row 1 - scrolling left */}
        <div
          id={firstTrackId}
          className="flex w-max animate-marquee motion-reduce:animate-none hover:[animation-play-state:paused]"
          style={{ animationDuration: "60s" }}
        >
          {[...Array(2)].map((_, i) => (
            <div
              key={`row1-${i}`}
              className="flex items-center whitespace-nowrap px-4"
            >
              {CLIENTS_ROW_1.map((client) => (
                <div
                  key={client}
                  className="mx-5 text-xl md:text-3xl font-light tracking-tight text-[#707b95] transition-colors duration-300 hover:text-[#eef3ff]"
                >
                  {client}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Row 2 - scrolling right */}
        <div
          id={secondTrackId}
          className="flex w-max animate-marquee-reverse motion-reduce:animate-none hover:[animation-play-state:paused]"
          style={{ animationDuration: "60s" }}
        >
          {[...Array(2)].map((_, i) => (
            <div
              key={`row2-${i}`}
              className="flex items-center whitespace-nowrap px-4"
            >
              {CLIENTS_ROW_2.map((client) => (
                <div
                  key={client}
                  className="mx-5 text-xl md:text-3xl font-light tracking-tight text-[#707b95] transition-colors duration-300 hover:text-[#eef3ff]"
                >
                  {client}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Edge fade gradients for premium feel */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-[#1a2030] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-[#1a2030] to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
