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
  return (
    <>
      <PageHero
        title="Get a clear print quote before you commit"
        description="Tell us what you need, attach artwork if you have it, and we will review the job for price, timing, pickup or delivery, and production fit."
        ctaLabel="Call PrintMe"
        ctaHref="tel:+14165721999"
      />
      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <QuoteRequestForm />
          <aside className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink">Help us quote it right the first time</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate">
                <li>Service type and quantity</li>
                <li>Finished size or dimensions</li>
                <li>Deadline and whether the order is rush-sensitive</li>
                <li>Pickup or delivery preference</li>
                <li>Whether your artwork is ready or still needs design help</li>
              </ul>
            </div>
            <div className="surface-card p-6">
              <h3 className="text-xl font-extrabold tracking-tight text-ink">What happens after you send it</h3>
              <p className="mt-3 text-sm leading-7 text-slate">
                PrintMe reviews your request, checks the artwork notes, confirms what is realistic for your deadline, and follows up with the clearest next step.
              </p>
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
