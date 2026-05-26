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
    <section className="relative overflow-hidden border-b border-black/5 bg-white/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.08),transparent_24rem)]" aria-hidden="true" />
      <div className="container-shell section-space relative">
        <div className="hero-panel px-6 py-8 sm:px-8 lg:px-10 lg:py-11">
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="max-w-4xl">
              <p className="hero-in editorial-kicker [--delay:10ms]">{eyebrow}</p>
              <h1 className="display-title hero-in mt-4 text-balance text-[3rem] font-semibold leading-[0.9] [--delay:80ms] sm:text-[4.65rem]">
                <span className="headline-accent">{title}</span>
              </h1>
              <p className="hero-in mt-5 max-w-2xl text-base leading-8 text-slate [--delay:160ms] sm:text-[1.05rem]">{description}</p>
              <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row [--delay:240ms]">
                <Button href={ctaHref}>{ctaLabel}</Button>
                <Button href="/contact" variant="secondary">Call, Email, or Visit</Button>
              </div>
              <div className="hero-in mt-7 flex flex-wrap gap-2.5 [--delay:300ms]">
                {["Local Scarborough shop", "File review before print", "Help available for custom jobs"].map((item) => (
                  <span key={item} className="value-chip">
                    <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="hero-in space-y-4 [--delay:320ms]">
              <div className="grid gap-3">
                {highlights.map((item, index) => (
                  <div key={item} className="signal-card px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.15rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,241,236,0.88))] text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_18px_rgba(18,17,16,0.06)]">
                        <Icon name={index === 0 ? "check" : index === 1 ? "document" : "clock"} className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-black leading-6 text-ink">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="liquid-glass rounded-[1.7rem] px-5 py-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Fastest direct path</p>
                <h2 className="mt-2 text-lg font-black text-ink">Need a quote, file check, or quick turnaround answer?</h2>
                <p className="mt-2 text-sm leading-6 text-slate">
                  Call {siteConfig.phone} for urgent timing, or send a quote request so the team can review files, quantity, fulfillment, and production fit in one pass.
                </p>
                <div className="mt-4 rounded-[1.25rem] border border-white/80 bg-white/78 px-4 py-3 text-xs leading-5 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                  <p className="font-black text-ink">{siteConfig.shortAddress}</p>
                  <p className="mt-1">Mon - Fri: 9:00 AM - 6:00 PM • Sat: 10:00 AM - 4:00 PM</p>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                  <Button href={siteConfig.phoneHref} className="px-4 py-2.5 text-xs">
                    Call PrintMe
                  </Button>
                  <Button href="/quote-request" variant="secondary" className="px-4 py-2.5 text-xs">
                    Request a Quote
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
