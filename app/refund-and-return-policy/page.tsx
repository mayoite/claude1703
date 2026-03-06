import { Hero } from "@/components/home/Hero";

export const metadata = {
  title: "Refund and Return Policy | One and Only Furniture",
  description: "Refund, return, replacement, and cancellation policy for One and Only Furniture.",
};

export default function RefundAndReturnPolicyPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Refund and return policy"
        subtitle="Terms for returns, replacements, cancellations, and refunds."
        showButton={false}
        backgroundImage="/images/hero/hero-3.webp"
      />

      <section className="container px-6 py-16 2xl:px-0">
        <div className="mx-auto max-w-5xl space-y-10">
          <article className="rounded-2xl border border-neutral-200 bg-white p-8 md:p-10">
            <h2 className="typ-h3 text-neutral-900">General policy</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-neutral-700">
              <li>
                Change requests are not accepted after delivery is completed, except for damaged or
                defective products.
              </li>
              <li>
                Exchanges are only provided for products that arrive damaged or defective.
              </li>
              <li>
                Product images on the website are representational and a few features may vary on
                the final product.
              </li>
              <li>
                Cancellation is allowed before shipment. Discounted purchases are not eligible for
                cancellation.
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 md:p-10">
            <h2 className="typ-h3 text-neutral-900">Damaged or defective products</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-neutral-700">
              <li>
                Report damage within 24 hours of delivery by email with product photos.
              </li>
              <li>
                Contact:{" "}
                <a className="text-primary underline" href="mailto:sales@oando.co.in">
                  sales@oando.co.in
                </a>
              </li>
              <li>
                Reverse pickup and replacement for damaged product cases are arranged by our team.
              </li>
              <li>
                Replaceable faulty parts are usually arranged within 7 days; full replacement can
                take up to 15 days depending on availability.
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-white p-8 md:p-10">
            <h2 className="typ-h3 text-neutral-900">Returns and refunds</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-neutral-700">
              <li>Returns are accepted only when products are damaged on arrival.</li>
              <li>
                Refund is issued only if replacement or replacement parts are not available for the
                same product.
              </li>
              <li>
                For non-damage refund requests, repackaging and transport charges may apply.
              </li>
              <li>
                Refunds are processed via NEFT or back to the original payment method, usually
                within 7 working days.
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-neutral-200 bg-neutral-50 p-8 md:p-10">
            <h2 className="typ-h3 text-neutral-900">How to initiate return or cancellation</h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-700">
              Contact customer care to initiate return or cancellation:
            </p>
            <div className="mt-3 space-y-2 text-base text-neutral-800">
              <p>
                Email:{" "}
                <a className="text-primary underline" href="mailto:sales@oando.co.in">
                  sales@oando.co.in
                </a>
              </p>
              <p>
                Phone:{" "}
                <a className="text-primary underline" href="tel:+919031022875">
                  +91 90310 22875
                </a>
              </p>
              <p>
                <strong>Corporate Office:</strong> 401, Jagat Trade Centre, Frazer Road, Patna - 800 001, Bihar, India
              </p>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
