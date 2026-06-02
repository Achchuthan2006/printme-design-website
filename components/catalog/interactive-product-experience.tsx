import { PrintProduct } from "@/types";

export function InteractiveProductExperience({ product }: { product: PrintProduct }) {
  return (
    <section id="interactive-preview" className="surface-card p-6">
      <p className="editorial-kicker">Interactive preview</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Preview the decision points before final production</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        {product.title} can still move through quoting, artwork review, and proofing after this setup. Use this section as orientation, not as the final print proof.
      </p>
    </section>
  );
}
