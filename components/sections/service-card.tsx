import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { ServiceItem } from "@/types";
import Link from "next/link";
import { getServicePageHrefByServiceSlug } from "@/data/services";

export function ServiceCard({ service, featured = false }: { service: ServiceItem; featured?: boolean }) {
  const serviceHref = getServicePageHrefByServiceSlug(service.slug);
  const quoteHref = `/quote-request?service=${encodeURIComponent(service.title)}`;

  return (
    <article className="group premium-card premium-surface flex h-full flex-col overflow-hidden p-3 hover:border-brand/25 hover:shadow-card">
      <ServiceProductVisual slug={service.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,241,236,0.9))] text-brand shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_rgba(18,17,16,0.06)] transition-colors duration-200 group-hover:bg-white">
            <Icon name={service.icon} className="h-4 w-4" />
          </div>
          {service.badge || featured ? <Badge>{featured ? "Featured" : service.badge}</Badge> : null}
        </div>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">Print path</p>
        <h3 className="mt-2 text-[1.2rem] font-black leading-[1.05] text-ink">
          <Link href={serviceHref ?? quoteHref} className="transition hover:text-brand">
            {service.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate">{service.description}</p>
        <div className="focus-band mt-4 p-3 text-xs leading-5 text-slate">
          Best when you want a local team to review the job, clarify the specs, and point you to the fastest realistic next step.
        </div>
        <div className="mt-4 grid gap-3 border-t border-black/5 pt-4 sm:grid-cols-2">
          <Button href={serviceHref ?? "/services"} variant="secondary" className="px-3 py-2.5 text-xs">
            {serviceHref ? "View Service" : "View Services"}
          </Button>
          <Button href={quoteHref} className="px-3 py-2.5 text-xs">
            Request a Quote
          </Button>
        </div>
      </div>
    </article>
  );
}
