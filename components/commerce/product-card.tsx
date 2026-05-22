import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { Icon } from "@/components/ui/icon";
import { PrintProduct } from "@/types";

export function ProductCard({ product }: { product: PrintProduct }) {
  return (
    <article className="premium-card group flex h-full flex-col rounded-2xl border border-line/90 bg-white p-3 shadow-soft hover:border-brand/40 hover:shadow-card">
      <ServiceProductVisual slug={product.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-4">
        <div className="flex flex-wrap gap-2">
          {product.badges?.slice(0, 2).map((badge) => <Badge key={badge}>{badge}</Badge>)}
        </div>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-slate">{product.category}</p>
        <h2 className="mt-2 text-xl font-black text-ink">{product.title}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-slate">{product.description}</p>
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-line/70 bg-canvas p-3 transition group-hover:border-brand/20 group-hover:bg-brand-soft/35">
          <Icon name={product.ctaMode === "upload-first" ? "document" : product.ctaMode === "contact" ? "store" : "clock"} className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-xs leading-5 text-slate">{product.turnaround}</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-line/80 pt-4">
          <p className="text-sm font-black text-ink">
            {product.startingPrice ? `Starts at $${product.startingPrice}` : "Quote first"}
          </p>
          <Button href={`/products/${product.slug}`} className="px-4 py-2 text-xs">
            See Options
          </Button>
        </div>
      </div>
    </article>
  );
}
