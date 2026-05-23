import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { analyticsEvents } from "@/data/cro";
import { siteConfig } from "@/lib/site";

interface LeadCtaPanelProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryHref?: string;
}

export function LeadCtaPanel({
  title = "Ready for a clearer print quote?",
  description = "Send your quantity, timing, and artwork if available. PrintMe will review the job, reduce the guesswork, and confirm the cleanest next step before production begins.",
  primaryLabel = "Get My Quote",
  secondaryLabel = "Call PrintMe",
  primaryHref = "/quote-request",
}: LeadCtaPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#28211d] bg-ink p-7 text-white shadow-luxe sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.28),transparent_20rem),radial-gradient(circle_at_78%_24%,rgba(255,255,255,0.06),transparent_18rem)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative">
          <p className="editorial-kicker text-brand-light">Next step</p>
          <h2 className="display-title mt-3 max-w-3xl text-balance text-[2.15rem] font-black leading-[0.94] text-white sm:text-[2.85rem]">{title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">{description}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold text-white/72">
            {["No payment on quote requests", "Artwork review before production", "Pickup and delivery guidance included"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-brand-light" />
                {item}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { label: "Quotes handled clearly", detail: "Specs, timing, and file notes reviewed together." },
              { label: "Local support built in", detail: "Scarborough pickup and GTA delivery guidance when it fits." },
              { label: "Production-first advice", detail: "The next step is shaped around what the job actually needs." },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <p className="text-sm font-black text-white">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-white/62">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex flex-col gap-3 sm:flex-row">
          <Button href={primaryHref} data-event={analyticsEvents.landingQuoteClick}>
            {primaryLabel}
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" className="bg-white/10 text-white ring-white/12 hover:bg-white/16 hover:text-white hover:ring-white/20" data-event={analyticsEvents.phoneClick}>
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
