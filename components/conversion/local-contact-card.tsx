import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/data/cro";
import { siteConfig } from "@/lib/site";

export function LocalContactCard() {
  return (
    <aside className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Local PrintMe shop</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Talk through the job before you print.</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-slate">
        <p>{siteConfig.address}</p>
        <p>
          <a href={siteConfig.phoneHref} className="font-black text-brand" data-event={analyticsEvents.phoneClick}>
            {siteConfig.phone}
          </a>
        </p>
        <p>{siteConfig.email}</p>
      </div>
      <div className="mt-6 grid gap-3">
        <Button href="/quote-request" data-event={analyticsEvents.landingQuoteClick}>Get My Quote</Button>
        <Button href={siteConfig.phoneHref} variant="secondary" data-event={analyticsEvents.phoneClick}>Call PrintMe</Button>
      </div>
    </aside>
  );
}
