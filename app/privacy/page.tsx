const COOKIE_ROWS = [
  {
    name: "oando_cookie_consent",
    category: "Essential",
    purpose: "Stores your cookie preference so we do not ask on every visit.",
    duration: "180 days",
  },
  {
    name: "oando_seo_landing",
    category: "Analytics & attribution",
    purpose: "Stores the landing page path for attribution reporting.",
    duration: "180 days",
  },
  {
    name: "oando_seo_referrer",
    category: "Analytics & attribution",
    purpose: "Stores the referring URL or source site.",
    duration: "180 days",
  },
  {
    name: "oando_seo_source",
    category: "Analytics & attribution",
    purpose: "Stores the traffic source such as direct, Google, or LinkedIn.",
    duration: "180 days",
  },
  {
    name: "oando_seo_medium",
    category: "Analytics & attribution",
    purpose: "Stores the traffic medium such as referral, none, or campaign medium.",
    duration: "180 days",
  },
  {
    name: "oando_seo_campaign",
    category: "Analytics & attribution",
    purpose: "Stores the UTM campaign value when present.",
    duration: "180 days",
  },
  {
    name: "oando_seo_term",
    category: "Analytics & attribution",
    purpose: "Stores the UTM term value when present.",
    duration: "180 days",
  },
  {
    name: "oando_seo_content",
    category: "Analytics & attribution",
    purpose: "Stores the UTM content value when present.",
    duration: "180 days",
  },
  {
    name: "oando_seo_locale",
    category: "Analytics & attribution",
    purpose: "Stores the current site locale for attribution context.",
    duration: "180 days",
  },
] as const;

export default function PrivacyPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white pt-24">
      <section className="container px-6 py-12 2xl:px-0">
        <h1 className="mb-12 font-slogan text-5xl text-neutral-900 md:text-6xl">
          Privacy Policy
        </h1>

        <div className="space-y-6 font-light text-neutral-600">
          <p>
            One and Only Furniture Private Limited ("OOFPL") operates oando.co.in. This policy
            explains what personal data we collect, how we use it, and what cookies we set when
            you browse our website or submit an enquiry.
          </p>

          <p>
            Personal information includes data that can identify or contact you, such as your
            name, company, email address, phone number, IP address, and any enquiry details you
            share through our forms.
          </p>

          <h2 className="mt-8 text-xl font-medium text-neutral-900">
            How we use your information
          </h2>
          <p>
            We use submitted information to respond to quote requests, follow up on workspace
            enquiries, improve service quality, and maintain internal records of sales and support
            conversations.
          </p>
          <p>
            We do not sell your personal information. We may disclose information when required by
            law, to investigate misuse, or to maintain and secure our services.
          </p>

          <h2 className="mt-8 text-xl font-medium text-neutral-900">
            Cookies, tags, and similar technologies
          </h2>
          <p>
            We use one essential cookie to remember your consent choice and optional analytics &
            attribution cookies to record landing page, referrer, and UTM parameters when you
            accept them in the cookie banner.
          </p>

          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-neutral-900">Cookie</th>
                  <th className="px-4 py-3 font-medium text-neutral-900">Category</th>
                  <th className="px-4 py-3 font-medium text-neutral-900">Purpose</th>
                  <th className="px-4 py-3 font-medium text-neutral-900">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 bg-white">
                {COOKIE_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-900">{row.name}</td>
                    <td className="px-4 py-3">{row.category}</td>
                    <td className="px-4 py-3">{row.purpose}</td>
                    <td className="px-4 py-3">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-8 text-xl font-medium text-neutral-900">
            Links to other websites
          </h2>
          <p>
            Our website may link to external websites. Their privacy practices are separate from
            ours, so you should review their policies before sharing information there.
          </p>

          <h2 className="mt-8 text-xl font-medium text-neutral-900">
            How we protect information
          </h2>
          <p>
            We use reasonable technical and organisational measures to protect the information we
            collect. No system can guarantee absolute security, but we take steps to reduce risk
            and restrict unnecessary access.
          </p>

          <h2 className="mt-8 text-xl font-medium text-neutral-900">Contact</h2>
          <p>
            For privacy questions or requests, email{" "}
            <a
              href="mailto:sales@oando.co.in"
              className="font-medium text-primary hover:underline"
            >
              sales@oando.co.in
            </a>
            .
          </p>

          <h2 className="mt-8 text-xl font-medium text-neutral-900">
            Changes to this policy
          </h2>
          <p>
            We may update this privacy policy from time to time. The latest version will always be
            published on this page.
          </p>
        </div>
      </section>
    </section>
  );
}
