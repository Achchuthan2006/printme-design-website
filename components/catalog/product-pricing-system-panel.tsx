import { PrintProduct } from "@/types";
import { calculateProductPrice, getDefaultOptions } from "@/lib/pricing";

export function ProductPricingSystemPanel({ product }: { product: PrintProduct }) {
  const price = calculateProductPrice(product, getDefaultOptions(product));

  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Pricing logic</p>
      <h2 className="mt-2 text-2xl font-black text-ink">How this product behaves in the checkout path</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">State</p>
          <p className="mt-2 text-sm font-black text-ink">{price.pricingLabel}</p>
        </div>
        <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Minimum charge</p>
          <p className="mt-2 text-sm font-black text-ink">${price.minimumCharge}</p>
        </div>
        <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Production note</p>
          <p className="mt-2 text-sm leading-6 text-slate">{price.paymentPathNote}</p>
        </div>
      </div>
    </section>
  );
}
