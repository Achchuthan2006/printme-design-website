import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/site";

interface PageHeroProps {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  eyebrow?: string;
  highlights?: string[];
}

export function PageHero({
  title,
  description,
  ctaLabel = "Get My Quote",
  ctaHref = "/quote-request",
  eyebrow = "PrintMe Design",
  highlights = ["Local Scarborough pickup", "Artwork review before production", "Rush-aware print guidance"],
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-line/70 bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.10),transparent_28rem),radial-gradient(circle_at_86%_16%,rgba(27,23,20,0.05),transparent_22rem)]" aria-hidden="true" />
      <div className="container-shell section-space relative">
        <div className="hero-panel quiet-grid px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[linear-gradient(135deg,rgba(255,255,255,0),rgba(217,70,32,0.10))] lg:block" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="max-w-4xl">
              <p className="hero-in editorial-kicker [--delay:10ms]">{eyebrow}</p>
              <h1 className="display-title hero-in mt-4 text-balance text-[2.9rem] font-black leading-[0.94] [--delay:80ms] sm:text-[4.4rem]">
                {title}
              </h1>
              <p className="hero-in mt-5 max-w-2xl text-base leading-8 text-slate [--delay:160ms] sm:text-lg">{description}</p>
              <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row [--delay:240ms]">
                <Button href={ctaHref}>{ctaLabel}</Button>
                <Button href="/contact" variant="secondary">Speak With PrintMe</Button>
              </div>
              <div className="hero-in mt-7 flex flex-wrap gap-2.5 [--delay:300ms]">
                {["Quote-first clarity", "File review before print", "Pickup or delivery guidance"].map((item) => (
                  <span key={item} className="value-chip">
                    <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="hero-in space-y-4 [--delay:320ms]">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {highlights.map((item, index) => (
                  <div key={item} className="signal-card">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                        <Icon name={index === 0 ? "check" : index === 1 ? "document" : "clock"} className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-black leading-6 text-ink">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="story-panel pl-7">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Fastest direct path</p>
                <h2 className="mt-2 text-lg font-black text-ink">Need a quick answer before the deadline moves?</h2>
                <p className="mt-2 text-sm leading-6 text-slate">
                  Call {siteConfig.phone} for urgent timing, or send a quote request so the team can review files, quantity, and fulfillment in one pass.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                  <Button href={siteConfig.phoneHref} className="px-4 py-2.5 text-xs">
                    Call PrintMe
                  </Button>
                  <Button href="/quote-request" variant="secondary" className="px-4 py-2.5 text-xs">
                    Send Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
