import { QuoteRequestForm } from "@/components/forms/quote-request-form";
import { LeadCtaPanel } from "@/components/conversion/lead-cta-panel";
import { LocalTrustStrip } from "@/components/conversion/local-trust-strip";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Request a Print Quote in Scarborough",
  description: "Get a clear print quote from PrintMe Design for business cards, flyers, banners, documents, passport photos, technical prints, and custom jobs.",
  path: "/quote-request",
});

export default async function QuoteRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; method?: string; template?: string; brief?: string }>;
}) {
  const { service, method, template, brief } = await searchParams;
  const quoteExpectations = [
    "A clearer request helps us reply with fewer follow-up questions.",
    "Artwork is helpful but not required. You can still send the project first.",
    "Rush timing, pickup, delivery, and production fit are reviewed before the next step is confirmed.",
  ];

  return (
    <>
      <PageHero
        title="Get a clear print quote before you commit."
        description="Tell us what you need, attach artwork if you have it, and PrintMe will review the job for pricing, timing, pickup or delivery, and production fit before you pay."
        ctaLabel="Call PrintMe"
        ctaHref="tel:+14165721999"
        eyebrow="Quote request"
        highlights={["No payment required", "Artwork upload available", "Pricing and turnaround reviewed before production"]}
      />
      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <QuoteRequestForm
            initialService={service ?? ""}
            initialMethod={method ?? ""}
            initialTemplate={template ?? ""}
            initialBrief={brief ?? ""}
          />
          <aside className="space-y-6">
            <div className="surface-card p-6">
              <p className="editorial-kicker">Quote quality</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Help us quote it right the first time.</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {quoteExpectations.map((item) => (
                  <span key={item} className="value-chip">
                    {item}
                  </span>
                ))}
              </div>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate">
                <li>Service type and quantity</li>
                <li>Finished size or dimensions</li>
                <li>Deadline and whether the order is rush-sensitive</li>
                <li>Pickup or delivery preference</li>
                <li>Whether your artwork is ready or still needs design help</li>
              </ul>
              <div className="mt-5 rounded-[1.35rem] border border-line bg-canvas px-4 py-4 text-sm leading-6 text-slate">
                <p className="font-black text-ink">Need help before you submit?</p>
                <p className="mt-1">Call 416-572-1999 if timing is urgent, the product is unclear, or you want to confirm the fastest route before filling out the form.</p>
              </div>
            </div>
            <div className="surface-card p-6">
              <p className="editorial-kicker">What happens next</p>
              <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">What happens after you send it</h3>
              <div className="mt-4 space-y-3">
                {[
                  "We review the service, quantity, timeline, and whether the job fits a direct order or custom path.",
                  "If files are attached, we check size, quality, and production notes before quoting.",
                  "You get a clearer next step instead of vague back-and-forth.",
                ].map((item, index) => (
                  <div key={item} className="signal-card">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Step {index + 1}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
        <div className="container-shell mt-8">
          <LocalTrustStrip />
        </div>
        <div className="container-shell mt-8">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Best for custom work",
                detail: "Use quote-first for banners, signs, postcards, promotional print, print-and-mail, and any specialty job.",
              },
              {
                title: "Best for design help",
                detail: "If the idea is ready but the artwork is not, the quote path is the cleanest place to scope layout or print-setup support.",
              },
              {
                title: "Best for rush questions",
                detail: "Tell us the real deadline, file status, and quantity so PrintMe can confirm what is realistic before you commit.",
              },
            ].map((item) => (
              <article key={item.title} className="premium-surface p-5">
                <p className="text-sm font-black text-ink">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
              </article>
            ))}
          </div>
          <LeadCtaPanel
            title="Need help shaping the request before you send it?"
            description="If the specs are still fuzzy, call PrintMe first or send the rough version now. We can help turn it into a cleaner, more accurate quote."
            primaryLabel="Request a Quote"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>
    </>
  );
}
