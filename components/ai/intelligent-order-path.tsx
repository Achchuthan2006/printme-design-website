import { PrintProduct } from "@/types";

export function IntelligentOrderPath({ product }: { product: PrintProduct }) {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Order path</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Recommended next step</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        This product currently leans toward the <span className="font-black text-ink">{product.ctaMode.replaceAll("-", " ")}</span> path based on how the catalog is configured.
      </p>
    </section>
  );
}
