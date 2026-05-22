import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { ServiceItem } from "@/types";

export function ServiceCard({ service, featured = false }: { service: ServiceItem; featured?: boolean }) {
  return (
    <article className="group premium-card flex h-full flex-col rounded-2xl border border-line/90 bg-white p-3 shadow-soft hover:border-brand/45 hover:shadow-card">
      <ServiceProductVisual slug={service.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-brand/20 bg-brand-soft text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-white group-hover:shadow-glow">
          <Icon name={service.icon} className="h-4 w-4" />
        </div>
        <h3 className="mt-3 text-base font-black text-ink">{service.title}</h3>
        <p className="mt-2 flex-1 text-xs leading-5 text-slate">{service.description}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {service.badge || featured ? <Badge>{featured ? "Featured" : service.badge}</Badge> : null}
        </div>
        <div className="mt-4">
          <Button href="/quote-request" variant="secondary" className="w-full px-3 py-2.5 text-xs">
            Get Quote
          </Button>
        </div>
      </div>
    </article>
  );
}
