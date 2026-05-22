import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { helpTopics } from "@/data/support";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Support Center",
  description: "Get help with PrintMe quotes, artwork files, order status, pickup, delivery, payment, and custom printing.",
  path: "/support",
});

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Get unstuck before your print deadline"
        description="Find help with artwork setup, quote requests, online orders, payment, pickup, delivery, and custom printing."
        ctaLabel="Talk to PrintMe"
      />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <article key={topic} className="rounded-2xl border border-line/90 bg-white p-5 shadow-soft">
                <h2 className="text-lg font-black text-ink">{topic}</h2>
                <p className="mt-2 text-sm leading-6 text-slate">Get clear guidance before you submit files, approve a quote, or place an order.</p>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-black text-ink">Need a real person to look at it?</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Call {siteConfig.phone}, email {siteConfig.email}, or send a quote request with the job details and deadline.</p>
            <div className="mt-6 grid gap-3">
              <Button href="/quote-request">Get My Quote</Button>
              <Button href="/order-status" variant="secondary">Check My Order</Button>
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-line bg-canvas p-4">
              <p className="text-sm font-bold text-ink">Fast support options</p>
              <p className="mt-2 text-xs leading-5 text-slate">
                Call for urgent timing, send a quote request for project details, or use order status for future tracking.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
