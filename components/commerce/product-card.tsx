"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductEngagementActions } from "@/components/catalog/product-engagement-actions";
import { ServiceProductVisual } from "@/components/sections/print-product-visual";
import { Icon } from "@/components/ui/icon";
import { getTemplatesForProduct } from "@/data/templates";
import { trackPrintMeEvent } from "@/lib/analytics/client";
import { PrintProduct } from "@/types";

export function ProductCard({ product }: { product: PrintProduct }) {
  const hasTemplates = getTemplatesForProduct(product.slug).length > 0;

  return (
    <article className="premium-card premium-surface group flex h-full flex-col overflow-hidden p-3 hover:border-brand/25 hover:shadow-card">
      <ServiceProductVisual slug={product.slug} />
      <div className="flex flex-1 flex-col px-2 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {product.badges?.slice(0, 2).map((badge) => <Badge key={badge}>{badge}</Badge>)}
            {hasTemplates ? <Badge>Template ready</Badge> : null}
          </div>
          <span className="rounded-full border border-white/85 bg-white/86 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
            {product.mode === "direct-order" ? "Order online" : product.mode === "hybrid" ? "Order or quote" : "Quote first"}
          </span>
        </div>
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate">
          {product.productLine ?? product.category}
        </p>
        <h2 className="mt-2 text-[1.32rem] font-black leading-[1.04] text-ink">{product.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate">{product.description}</p>
        <div className="mt-4">
          <ProductEngagementActions slug={product.slug} compact />
        </div>
        <div className="focus-band mt-4 flex items-start gap-2 p-3">
          <Icon name={product.ctaMode === "upload-first" ? "document" : product.ctaMode === "contact" ? "store" : "clock"} className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <p className="text-xs leading-5 text-slate">
            {product.turnaround}
          </p>
        </div>
        <div className="mt-3 rounded-[1.25rem] border border-brand/12 bg-brand-soft/45 p-3 text-xs leading-5 text-slate">
          <span className="font-black text-ink">Payment path:</span> {product.mode === "direct-order" ? "secure checkout available" : "review first, pay after confirmation"}
        </div>
        <div className="mt-3 rounded-[1.25rem] border border-white/80 bg-white/82 p-3 text-xs leading-5 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_16px_rgba(18,17,16,0.04)]">
          {product.pickupDeliveryNote}
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/5 pt-4">
          <p className="text-sm font-black text-ink">
            {product.startingPrice ? `Starts at $${product.startingPrice}` : "Quote first"}
          </p>
          <Button
            href={`/products/${product.slug}`}
            className="px-4 py-2 text-[11px]"
            onClick={() =>
              trackPrintMeEvent({
                eventName: "product_card_clicked",
                pageType: "category",
                funnelName: "storefront_discovery",
                funnelStage: "product_list",
                isMicroConversion: true,
                properties: {
                  productSlug: product.slug,
                  categorySlug: product.categorySlug,
                  ctaMode: product.ctaMode,
                },
              })
            }
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}
