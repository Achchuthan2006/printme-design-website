import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { Icon } from "@/components/ui/icon";
import { PrintProduct } from "@/types";

export function ProductCard({ product }: { product: PrintProduct }) {
  return (
    <article className="premium-card premium-surface group flex h-full flex-col overflow-hidden p-3 hover:border-brand/35 hover:shadow-card">
      <ServiceProductVisual slug={product.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {product.badges?.slice(0, 2).map((badge) => <Badge key={badge}>{badge}</Badge>)}
          </div>
          <span className="rounded-full border border-line/80 bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">
            {product.mode === "direct-order" ? "Order online" : product.mode === "hybrid" ? "Order or quote" : "Quote first"}
          </span>
        </div>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate">{product.category}</p>
        <h2 className="mt-2 text-xl font-black text-ink">{product.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate">{product.description}</p>
        <div className="mt-4 flex items-start gap-2 rounded-[1.2rem] border border-line/70 bg-canvas p-3 transition group-hover:border-brand/20 group-hover:bg-brand-soft/35">
          <Icon name={product.ctaMode === "upload-first" ? "document" : product.ctaMode === "contact" ? "store" : "clock"} className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-xs leading-5 text-slate">{product.turnaround}</p>
        </div>
        <div className="mt-3 rounded-[1.2rem] border border-line/70 bg-white/80 p-3 text-xs leading-5 text-slate">
          {product.pickupDeliveryNote}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-line/80 pt-4">
          <p className="text-sm font-black text-ink">
            {product.startingPrice ? `Starts at $${product.startingPrice}` : "Quote first"}
          </p>
          <Button href={`/products/${product.slug}`} className="px-4 py-2 text-[11px]">
            See Options
          </Button>
        </div>
      </div>
    </article>
  );
}
