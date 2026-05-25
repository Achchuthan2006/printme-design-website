import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { ServiceItem } from "@/types";

export function ServiceCard({ service, featured = false }: { service: ServiceItem; featured?: boolean }) {
  return (
    <article className="group premium-card premium-surface flex h-full flex-col overflow-hidden p-3 hover:border-brand/25 hover:shadow-soft">
      <ServiceProductVisual slug={service.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/20 bg-brand-soft text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors duration-200 group-hover:bg-white">
            <Icon name={service.icon} className="h-4 w-4" />
          </div>
          {service.badge || featured ? <Badge>{featured ? "Featured" : service.badge}</Badge> : null}
        </div>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">Print path</p>
        <h3 className="mt-2 text-[1.2rem] font-black leading-[1.05] text-ink">{service.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate">{service.description}</p>
        <div className="focus-band mt-4 p-3 text-xs leading-5 text-slate">
          Best when you want a local team to review the job, clarify the specs, and point you to the fastest realistic next step.
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/75 pt-4">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Quote-first support</span>
          <Button href="/quote-request" variant="secondary" className="px-3 py-2.5 text-xs">
            Request a Quote
          </Button>
        </div>
      </div>
    </article>
  );
}
