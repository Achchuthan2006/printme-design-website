import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { ServiceItem } from "@/types";

export function ServiceCard({ service, featured = false }: { service: ServiceItem; featured?: boolean }) {
  return (
    <article className="group premium-card premium-surface flex h-full flex-col overflow-hidden p-3 hover:border-brand/45 hover:shadow-card">
      <ServiceProductVisual slug={service.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/20 bg-brand-soft text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white group-hover:shadow-glow">
            <Icon name={service.icon} className="h-4 w-4" />
          </div>
          {service.badge || featured ? <Badge>{featured ? "Featured" : service.badge}</Badge> : null}
        </div>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">Print path</p>
        <h3 className="mt-2 text-lg font-black text-ink">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate">{service.description}</p>
        <div className="mt-4 rounded-[1.2rem] border border-line/70 bg-canvas p-3 text-xs leading-5 text-slate transition group-hover:border-brand/20 group-hover:bg-brand-soft/35">
          Best when you want a cleaner handoff, faster review, and a local team that can help shape the safest next step.
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/75 pt-4">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Quote-first support</span>
          <Button href="/quote-request" variant="secondary" className="px-3 py-2.5 text-xs">
            Request Quote
          </Button>
        </div>
      </div>
    </article>
  );
}
