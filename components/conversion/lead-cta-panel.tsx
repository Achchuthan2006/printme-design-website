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
  description = "Send your quantity, deadline, and artwork if available. PrintMe will help confirm the best next step before production.",
  primaryLabel = "Get My Quote",
  secondaryLabel = "Call PrintMe",
  primaryHref = "/quote-request",
}: LeadCtaPanelProps) {
  return (
    <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Next step</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.02em] text-ink">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">{description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate">
            {["No payment on quote requests", "Artwork review available", "Local pickup support"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-brand" />
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={primaryHref} data-event={analyticsEvents.landingQuoteClick}>
            {primaryLabel}
          </Button>
          <Button href={siteConfig.phoneHref} variant="secondary" data-event={analyticsEvents.phoneClick}>
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
