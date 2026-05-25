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
  title = "Ready for a clear quote or a quick print answer?",
  description = "Send your quantity, size, deadline, and artwork if available. PrintMe will review the job and confirm pricing, turnaround, and the cleanest next step before production begins.",
  primaryLabel = "Request a Quote",
  secondaryLabel = "Call PrintMe",
  primaryHref = "/quote-request",
}: LeadCtaPanelProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#28211d] bg-ink p-7 text-white shadow-luxe sm:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.18),transparent_18rem)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" aria-hidden="true" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_17rem] lg:items-center">
        <div className="relative">
          <p className="editorial-kicker text-brand-light">Next step</p>
          <h2 className="mt-3 max-w-[15ch] text-balance font-display text-[2.15rem] font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-[2.8rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">{description}</p>
          <div className="mt-5 flex flex-wrap gap-4 text-xs font-bold text-white/68">
            {["No payment on quote requests", "Artwork review before production"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-brand-light" />
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/62">
            Best for custom jobs, rush questions, unclear files, reorder planning, and quote-first work.
          </p>
        </div>
        <div className="liquid-glass-dark relative rounded-[1.5rem] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Ready to move?</p>
          <div className="mt-3 rounded-[1rem] border border-white/10 bg-white/5 px-3 py-3 text-xs leading-5 text-white/72">
            <p className="font-bold text-white">{siteConfig.shortAddress}</p>
            <p className="mt-1">{siteConfig.phone}</p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            <Button href={primaryHref} data-event={analyticsEvents.landingQuoteClick} className="w-full">
              {primaryLabel}
            </Button>
            <Button href={siteConfig.phoneHref} variant="secondary" className="w-full bg-white/10 text-white ring-white/12 hover:bg-white/16 hover:text-white hover:ring-white/20" data-event={analyticsEvents.phoneClick}>
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
