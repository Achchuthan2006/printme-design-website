import { Button } from "@/components/ui/button";
import { ContextualHelpPanel } from "@/components/support/contextual-help-panel";
import { HelpCenterHub } from "@/components/support/help-center-hub";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Support Center",
  description: "Get intelligent self-service help for PrintMe ordering, artwork files, quotes, proofs, checkout, tracking, payment, and custom printing.",
  path: "/support",
});

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Support that helps customers finish the job, not just ask questions."
        description="Use PrintMe's help center for ordering guidance, artwork setup, quote and proof help, product support, tracking, billing, and direct escalation when self-service is not enough."
        ctaLabel="Call PrintMe"
        ctaHref={siteConfig.phoneHref}
        eyebrow="Support center"
        highlights={["Guided self-service", "Contextual support across the site", "Clear escalation when needed"]}
      />

      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <ContextualHelpPanel context="support" title="Start with the strongest support route for the task" />
            <HelpCenterHub />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="hero-panel p-6">
              <p className="editorial-kicker">Direct help</p>
              <h2 className="display-title mt-3 text-[2rem] font-black leading-[0.96]">Need a real person to step in?</h2>
              <p className="mt-3 text-sm leading-7 text-slate">
                Call {siteConfig.phone}, email {siteConfig.email}, or use the quote and support paths when the project needs a human review.
              </p>
              <div className="mt-4 rounded-[1.3rem] border border-line bg-canvas p-4 text-xs leading-5 text-slate">
                <p className="font-black text-ink">{siteConfig.shortAddress}</p>
                <p className="mt-1">Use the shop for pickup, in-person questions, and local print support.</p>
              </div>
              <div className="mt-6 grid gap-3">
                <Button href={siteConfig.phoneHref}>Call PrintMe</Button>
                <Button href="/quote-request" variant="secondary">Request a quote</Button>
                <Button href="/order-status" variant="secondary">Track my order</Button>
                <Button href="/contact" variant="secondary">Email or visit</Button>
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="editorial-kicker">Fastest paths</p>
              <div className="mt-4 grid gap-3">
                {[
                  {
                    title: "Urgent timing",
                    detail: "Call the shop when the deadline is today or the timing feels risky.",
                    href: siteConfig.phoneHref,
                    cta: "Call now",
                  },
                  {
                    title: "File review",
                    detail: "Use artwork guidance and reviewed upload paths before you commit the order.",
                    href: "/artwork-guidelines",
                    cta: "Check files",
                  },
                  {
                    title: "Custom specs",
                    detail: "Use quote-first when the product, material, or finish still needs confirmation.",
                    href: "/quote-request",
                    cta: "Open quote request",
                  },
                ].map((item) => (
                  <a key={item.title} href={item.href} className="block rounded-[1.2rem] border border-line bg-canvas p-4 transition hover:border-brand/14 hover:bg-brand-soft/35">
                    <p className="text-sm font-black text-ink">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-brand">{item.cta}</p>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
