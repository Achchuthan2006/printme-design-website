import { QuoteRequestForm } from "@/components/forms/quote-request-form";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Request a Quote",
  description: "Request a custom print quote from PrintMe Design for business cards, brochures, signage, document printing, and rush-ready local orders.",
  path: "/quote-request",
});

export default function QuoteRequestPage() {
  return (
    <>
      <PageHero
        title="Request a quote for your next print project"
        description="Share your service, quantity, deadline, and project details. We’ll review the request and follow up with pricing, turnaround, and the next step."
        ctaLabel="Call the Shop"
        ctaHref="tel:+14167500005"
      />
      <section className="section-space">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <QuoteRequestForm />
          <aside className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink">What helps us quote faster</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate">
                <li>Service type and quantity</li>
                <li>Finished size or dimensions</li>
                <li>Deadline and whether the order is rush-sensitive</li>
                <li>Pickup or delivery preference</li>
                <li>Whether your artwork is ready or still needs design help</li>
              </ul>
            </div>
            <div className="surface-card p-6">
              <h3 className="text-xl font-extrabold tracking-tight text-ink">Future-ready architecture</h3>
              <p className="mt-3 text-sm leading-7 text-slate">
                This form is prepared for future file uploads, customer accounts, Stripe payments, order tracking, and an internal admin workflow.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
