import Image from "next/image";
import Link from "next/link";
import { HOMEPAGE_TRUST_CONTENT } from "@/data/site/homepage";
import { PRODUCT_CATEGORY_SECTION } from "@/data/site/marketing";

export function ProductClientBlocks() {
  return (
    <section className="product-client-blocks">
      <div className="product-client-blocks__shell">
        <div className="product-cards">
          <h2 className="product-cards__title">{PRODUCT_CATEGORY_SECTION.title}</h2>
          <p className="product-cards__subtitle">{PRODUCT_CATEGORY_SECTION.subtitle}</p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-3 md:px-5">
              <p className="text-sm font-medium text-neutral-800">
                {PRODUCT_CATEGORY_SECTION.tableTitle}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse">
                <thead className="bg-neutral-50">
                  <tr>
                    {PRODUCT_CATEGORY_SECTION.tableColumns.map((column) => (
                      <th
                        key={column}
                        className="border-b border-neutral-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 md:px-5"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRODUCT_CATEGORY_SECTION.tableRows.map((row) => (
                    <tr key={row.category} className="odd:bg-white even:bg-neutral-50/40">
                      <td className="border-b border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-900 md:px-5">
                        {row.category}
                      </td>
                      <td className="border-b border-neutral-200 px-4 py-3 text-sm text-neutral-700 md:px-5">
                        {row.bestFor}
                      </td>
                      <td className="border-b border-neutral-200 px-4 py-3 text-sm text-neutral-700 md:px-5">
                        {row.setup}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="product-cards__grid">
            {PRODUCT_CATEGORY_SECTION.items.map((item) => (
              <Link key={item.name} href={item.href} className="product-cards__card group">
                <div className="product-cards__image-wrap">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="product-cards__image"
                  />
                </div>
                <div className="product-cards__label">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="client-logo-block">
          <p className="client-logo-block__eyebrow">{HOMEPAGE_TRUST_CONTENT.logoLabel}</p>
          <div className="client-logo-block__grid">
            {HOMEPAGE_TRUST_CONTENT.logos.map((logo) => (
              <div key={logo.name} className="client-logo-block__logo">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={150}
                  height={56}
                  className="client-logo-block__logo-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
