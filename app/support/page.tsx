import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
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
  const supportRoutes = [
    { title: "Need a quote clarified?", detail: "Use the quote form when the job is custom, the timing matters, or the file still needs review.", href: "/quote-request", cta: "Open Quote Request", icon: "document" },
    { title: "Need order or pickup help?", detail: "Use order status for upcoming tracking flows or contact the shop directly for the fastest update.", href: "/order-status", cta: "Check Order Status", icon: "clock" },
    { title: "Need a real person now?", detail: "Call the shop for urgent timing, passport photo questions, or anything that still feels unclear.", href: siteConfig.phoneHref, cta: "Call PrintMe", icon: "phone" },
  ];

  return (
    <>
      <PageHero
        title="Get unstuck before your print deadline"
        description="Find help with artwork setup, quote requests, online orders, payment, pickup, delivery, and custom printing."
        ctaLabel="Talk to PrintMe"
        eyebrow="Support"
        highlights={["Artwork and file guidance", "Order and quote help", "Fastest path to a real answer"]}
      />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="story-panel pl-7">
              <p className="editorial-kicker">Support paths</p>
              <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Choose the kind of help you need, then move directly into the right action.</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                Print questions are easier to solve when the route is clear: quote support, artwork help, order updates, or a direct conversation with the shop.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
            {helpTopics.map((topic) => (
              <article key={topic} className="premium-surface p-5">
                <h2 className="text-lg font-black text-ink">{topic}</h2>
                <p className="mt-2 text-sm leading-6 text-slate">Get clear guidance before you submit files, approve a quote, or place an order.</p>
              </article>
            ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {supportRoutes.map((route) => (
                <article key={route.title} className="premium-surface flex h-full flex-col p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                    <Icon name={route.icon} className="h-4.5 w-4.5" />
                  </span>
                  <h2 className="mt-5 text-lg font-black text-ink">{route.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate">{route.detail}</p>
                  <div className="mt-5">
                    <Button href={route.href} variant="secondary" className="w-full px-4 py-2.5 text-xs">
                      {route.cta}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <aside className="hero-panel h-fit p-6">
            <p className="editorial-kicker">Direct help</p>
            <h2 className="display-title mt-3 text-[2rem] font-black leading-[0.96]">Need a real person to look at it?</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Call {siteConfig.phone}, email {siteConfig.email}, or send a quote request with the job details and deadline.</p>
            <div className="mt-6 grid gap-3">
              <Button href="/quote-request">Get My Quote</Button>
              <Button href="/order-status" variant="secondary">Check My Order</Button>
            </div>
            <div className="mt-6 rounded-[1.3rem] border border-dashed border-line bg-canvas p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand">Fast support options</p>
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
