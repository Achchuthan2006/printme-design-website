import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/data/cro";
import { siteConfig } from "@/lib/site";

export function LocalContactCard() {
  return (
    <aside className="surface-card p-6">
      <p className="editorial-kicker">Local PrintMe shop</p>
      <h2 className="display-title mt-3 text-[2rem] font-black leading-[0.96]">Talk through the job before you print.</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate">
        <p>{siteConfig.address}</p>
        <p>
          <a href={siteConfig.phoneHref} className="font-black text-brand" data-event={analyticsEvents.phoneClick}>
            {siteConfig.phone}
          </a>
        </p>
        <p>
          <a href={`mailto:${siteConfig.email}`} className="transition hover:text-brand">
            {siteConfig.email}
          </a>
        </p>
      </div>
      <div className="mt-6 grid gap-3">
        <Button href="/quote-request" data-event={analyticsEvents.landingQuoteClick}>Get My Quote</Button>
        <Button href={siteConfig.phoneHref} variant="secondary" data-event={analyticsEvents.phoneClick}>Call PrintMe</Button>
      </div>
    </aside>
  );
}
