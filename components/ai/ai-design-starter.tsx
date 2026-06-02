import { PrintProduct } from "@/types";

export function AiDesignStarter({ product }: { product: PrintProduct }) {
  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Design starter</p>
      <h2 className="mt-2 text-2xl font-black text-ink">Need help shaping the artwork?</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        Start with {product.title.toLowerCase()} requirements, then move into quote or design support if the file still needs cleanup.
      </p>
    </section>
  );
}
