import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Support Center",
  description: "Get help with PrintMe quotes, artwork files, order status, pickup, delivery, payment, and custom printing.",
  path: "/support",
});

export default function SupportPage() {
  const supportTopics = [
    {
      title: "Artwork and file checks",
      detail: "Best when you need help confirming size, bleed, file quality, or whether the artwork is ready to print.",
      icon: "upload",
      action: "Review guidelines",
      href: "/artwork-guidelines",
    },
    {
      title: "Quote and custom job help",
      detail: "Use this when the specs are custom, the deadline is tight, or the safest path is not obvious yet.",
      icon: "document",
      action: "Request a quote",
      href: "/quote-request",
    },
    {
      title: "Pickup, delivery, and timing",
      detail: "Good for urgent orders, local fulfillment questions, or deciding whether the deadline is realistic.",
      icon: "clock",
      action: "Call PrintMe",
      href: siteConfig.phoneHref,
    },
    {
      title: "Payments, receipts, and invoices",
      detail: "Get help with checkout, payment confirmation, invoice access, or what happens after a quote becomes an order.",
      icon: "card",
      action: "Contact support",
      href: "/contact",
    },
  ];

  const supportRoutes = [
    { title: "Need a quote clarified?", detail: "Use the quote form when the job is custom, the timing matters, or the file still needs review.", href: "/quote-request", cta: "Open Quote Request", icon: "document" },
    { title: "Need order or pickup help?", detail: "Use order status for upcoming tracking flows or contact the shop directly for the fastest update.", href: "/order-status", cta: "Check Order Status", icon: "clock" },
    { title: "Need a real person now?", detail: "Call the shop for urgent timing, passport photo questions, or anything that still feels unclear.", href: siteConfig.phoneHref, cta: "Call PrintMe", icon: "phone" },
  ];

  return (
    <>
      <PageHero
        title="Get the right kind of print help before the deadline gets tighter."
        description="Find help with artwork setup, quote requests, online orders, payment, pickup, delivery, and custom printing without guessing where to start."
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
            {supportTopics.map((topic) => (
              <article key={topic.title} className="premium-surface flex h-full flex-col p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                  <Icon name={topic.icon} className="h-4.5 w-4.5" />
                </span>
                <h2 className="mt-5 text-lg font-black text-ink">{topic.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate">{topic.detail}</p>
                <div className="mt-5">
                  <Button href={topic.href} variant="secondary" className="w-full px-4 py-2.5 text-xs">
                    {topic.action}
                  </Button>
                </div>
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
            <div className="rounded-[1.8rem] border border-line/90 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="editorial-kicker">Support system</p>
                  <h2 className="mt-2 text-[2rem] font-black leading-[0.98] text-ink">Built to support the real print workflow, not just answer generic questions.</h2>
                </div>
                <Button href="/order-status" variant="secondary">Track a Job</Button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Before ordering",
                    detail: "Help choosing products, materials, timelines, sizes, and whether the job should start as a quote or direct order.",
                  },
                  {
                    title: "During review",
                    detail: "Support for artwork uploads, proof questions, print-readiness, and quote clarification before production begins.",
                  },
                  {
                    title: "After payment",
                    detail: "Updates for production, pickup, delivery, invoices, and repeat-order planning from the same support system.",
                  },
                ].map((item) => (
                  <article key={item.title} className="rounded-[1.25rem] border border-line bg-canvas p-4">
                    <p className="text-sm font-black text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <aside className="hero-panel h-fit p-6">
            <p className="editorial-kicker">Direct help</p>
            <h2 className="display-title mt-3 text-[2rem] font-black leading-[0.96]">Need a real person to look at it?</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Call {siteConfig.phone}, email {siteConfig.email}, or send a quote request with the job details and deadline.</p>
            <div className="mt-4 rounded-[1.3rem] border border-line bg-canvas p-4 text-xs leading-5 text-slate">
              <p className="font-black text-ink">{siteConfig.shortAddress}</p>
              <p className="mt-1">Use the shop for pickup, in-person questions, and local print support.</p>
            </div>
            <div className="mt-6 grid gap-3">
              <Button href={siteConfig.phoneHref}>Call PrintMe</Button>
              <Button href="/quote-request" variant="secondary">Request a Quote</Button>
              <Button href="/contact" variant="secondary">Email or Visit</Button>
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
