"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";

function formatLinePrice(value: number, quoteOnly?: boolean) {
  return quoteOnly ? "Quote" : `$${value}`;
}

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Cart</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm leading-6 text-slate">
          Browse products, configure a print item, or request a quote for custom work.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/products">Browse Products</Button>
          <Button href="/quote-request" variant="secondary">Request Quote</Button>
        </div>
      </div>
    );
  }

  const hasQuoteItems = items.some((item) => item.quoteOnly);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
                  {item.pricingMode === "quote-only" ? "Quote review" : "Configured item"}
                </p>
                <h2 className="mt-2 text-xl font-black text-ink">{item.title}</h2>
                {item.turnaround || item.fulfillmentMethod ? (
                  <p className="mt-2 text-sm text-slate">
                    {[item.turnaround, item.fulfillmentMethod].filter(Boolean).join(" | ")}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-sm font-bold text-brand transition hover:text-brand-dark"
              >
                Remove
              </button>
            </div>

            <div className="mt-5 grid gap-2 rounded-lg bg-canvas p-4 sm:grid-cols-2">
              {item.optionLabels.length > 0 ? (
                item.optionLabels.map((option) => (
                  <div key={`${item.id}-${option.label}`} className="text-sm">
                    <span className="font-bold text-ink">{option.label}: </span>
                    <span className="text-slate">{option.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate">Standard setup</p>
              )}
            </div>

            {item.notes ? (
              <p className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm leading-6 text-slate">
                <span className="font-bold text-ink">Notes: </span>
                {item.notes}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <label className="text-sm font-bold text-ink">
                Line qty
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                  className="ml-3 w-20 rounded-lg border border-line px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </label>
              <p className="text-lg font-black text-ink">
                {formatLinePrice((item.estimatedTotal || item.unitPrice) * item.quantity, item.quoteOnly)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-line bg-white p-6 shadow-soft lg:sticky lg:top-24">
        <h2 className="text-2xl font-black text-ink">Order summary</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Estimated subtotal</span>
            <span className="font-black text-ink">${subtotal}</span>
          </div>
          <div className="flex justify-between text-slate"><span>Tax</span><span>Calculated at checkout</span></div>
          <div className="flex justify-between text-slate"><span>Pickup / delivery</span><span>Confirmed later</span></div>
          {hasQuoteItems ? (
            <p className="rounded-lg bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
              Some cart items require quote review before final pricing or payment.
            </p>
          ) : null}
        </div>
        <div className="mt-5 border-t border-line pt-5">
          <Button href="/checkout" className="w-full">Checkout</Button>
          <Button href="/products" variant="secondary" className="mt-3 w-full">Continue Shopping</Button>
          <button type="button" onClick={clearCart} className="mt-4 w-full text-center text-sm font-bold text-slate transition hover:text-brand">
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  );
}
