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
        title="PrintMe support center"
        description="Find help for artwork setup, quote requests, online orders, payment, pickup, delivery, and custom printing."
      />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <article key={topic} className="rounded-lg border border-line bg-white p-5 shadow-soft">
                <h2 className="text-lg font-black text-ink">{topic}</h2>
                <p className="mt-2 text-sm leading-6 text-slate">A production-ready help article can be attached here as the platform grows.</p>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-black text-ink">Need direct help?</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Call {siteConfig.phone}, email {siteConfig.email}, or request a quote with project details.</p>
            <div className="mt-6 grid gap-3">
              <Button href="/quote-request">Request a Quote</Button>
              <Button href="/order-status" variant="secondary">Check Order Status</Button>
            </div>
            <div className="mt-6 rounded-lg border border-dashed border-line bg-canvas p-4">
              <p className="text-sm font-bold text-ink">Chat placeholder</p>
              <p className="mt-2 text-xs leading-5 text-slate">Connect live chat or chatbot tooling here when ready.</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
