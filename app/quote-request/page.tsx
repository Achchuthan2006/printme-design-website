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

export default function QuoteRequestPage() {
  const quoteExpectations = [
    "A clearer request helps us reply with fewer follow-up questions.",
    "Artwork is helpful but not required. You can still send the project first.",
    "Rush timing, pickup, delivery, and production fit are reviewed before the next step is confirmed.",
  ];

  return (
    <>
      <PageHero
        title="Get a clear print quote before you commit."
        description="Tell us what you need, attach artwork if you have it, and PrintMe will review the job for price, timing, pickup or delivery, and production fit."
        ctaLabel="Call PrintMe"
        ctaHref="tel:+14165721999"
        eyebrow="Quote request"
        highlights={["No payment required", "Artwork upload available", "Response shaped around timing and production fit"]}
      />
      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <QuoteRequestForm />
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
          <LeadCtaPanel
            title="Prefer to talk through the job first?"
            description="If the specs are unclear, call PrintMe or send a few details. We can help turn the request into a cleaner quote."
            primaryLabel="Send My Quote Request"
            secondaryLabel="Call PrintMe"
          />
        </div>
      </section>
    </>
  );
}
