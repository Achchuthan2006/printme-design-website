import { PrintProduct } from "@/types";

export function SmartTemplateRecommendations({ product }: { product: PrintProduct }) {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Template guidance</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Starter directions for {product.title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        Use the product page, quote flow, or file upload path depending on whether the artwork is ready, needs cleanup, or still needs design support.
      </p>
    </section>
  );
}
