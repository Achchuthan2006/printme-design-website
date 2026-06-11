"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { evaluateCartPaymentPlan, formatPaymentPlanCurrency } from "@/lib/payment-workflow";

function formatLinePrice(value: number, quoteOnly?: boolean) {
  return quoteOnly ? "Quote" : `$${value.toFixed(2)}`;
}

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="hero-panel p-8 text-center">
        <p className="editorial-kicker">Cart</p>
        <h1 className="display-title mt-2 text-[2.5rem] font-black">Your cart is ready for the next print job.</h1>
        <p className="mt-3 text-sm leading-6 text-slate">
          Browse orderable print products or request a quote if your job needs custom sizing, finishing, design help, or file review.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/products">Start My Order</Button>
          <Button href="/quote-request" variant="secondary">Request a Quote</Button>
        </div>
      </div>
    );
  }

  const hasQuoteItems = items.some((item) => item.quoteOnly);
  const hasMissingArtworkReminder = items.some((item) => item.mode !== "quote-only");
  const paymentPlan = evaluateCartPaymentPlan(items);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className="section-frame p-6">
          <p className="editorial-kicker">Cart review</p>
          <h1 className="display-title mt-2 text-[2.4rem] font-black leading-[0.95] text-ink">Confirm the order before you pay or send it for review.</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate">
            Adjust quantities, confirm the print setup, and see right away which items can be paid now and which ones still need PrintMe review.
          </p>
          <p className="mt-5 rounded-[1.2rem] border border-line/80 bg-white/85 px-4 py-3 text-sm leading-6 text-slate">
            Online-order items can move into checkout now. Quote-review items stay in the same cart, but PrintMe confirms the final details before production starts.
          </p>
        </div>

        {items.map((item) => (
          <article key={item.id} className="premium-surface p-5 transition hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">
                  {item.pricingState === "instant-price" ? "Instant pricing" : item.pricingState === "estimated-price" ? "Estimated pricing" : "Needs quote review"}
                </p>
                <h2 className="mt-2 text-[1.4rem] font-black leading-[1.02] text-ink">{item.title}</h2>
                {item.turnaround || item.fulfillmentMethod ? (
                  <p className="mt-2 text-sm text-slate">
                    {[item.turnaround, item.fulfillmentMethod].filter(Boolean).join(" / ")}
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

            <div className="focus-band mt-5 grid gap-2 p-4 sm:grid-cols-2">
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
              <p className="mt-4 rounded-[1.3rem] border border-line bg-white px-4 py-3 text-sm leading-6 text-slate">
                <span className="font-bold text-ink">Notes: </span>
                {item.notes}
              </p>
            ) : null}
            {item.pricingExplanation ? (
              <p className="mt-4 rounded-[1.3rem] border border-line bg-canvas px-4 py-3 text-sm leading-6 text-slate">
                <span className="font-bold text-ink">{item.pricingLabel ?? "Pricing path"}: </span>
                {item.pricingExplanation}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-between border-t border-line/80 pt-4">
              <label className="text-sm font-bold text-ink">
                Line qty
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.id, Math.max(1, Number(event.target.value) || 1))}
                  className="premium-input ml-3 w-24 py-2"
                  aria-label={`Quantity for ${item.title}`}
                />
              </label>
              <p className="text-lg font-black text-ink">
                {formatLinePrice((item.estimatedTotal || item.unitPrice) * item.quantity, item.quoteOnly)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <aside className="hero-panel h-fit p-6 lg:sticky lg:top-24">
        <p className="editorial-kicker">Order review</p>
        <h2 className="display-title mt-2 text-[2rem] font-black leading-[0.96] text-ink">Know what is due now and what still needs review.</h2>
        <p className="mt-2 text-sm leading-6 text-slate">Pay online for orderable items now. If anything needs quote review, PrintMe confirms the details before production begins.</p>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Estimated subtotal</span>
            <span className="font-black text-ink">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate"><span>Due now</span><span>{formatPaymentPlanCurrency(paymentPlan.dueNowCents)}</span></div>
          {paymentPlan.dueLaterCents > 0 ? <div className="flex justify-between text-slate"><span>Due later</span><span>{formatPaymentPlanCurrency(paymentPlan.dueLaterCents)}</span></div> : null}
          <div className="flex justify-between text-slate"><span>Tax</span><span>Calculated at checkout</span></div>
          <div className="flex justify-between text-slate"><span>Pickup / delivery</span><span>Confirmed with your order</span></div>
          {hasQuoteItems ? (
            <p className="rounded-[1.3rem] border border-brand/15 bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
              Some items need PrintMe review before final pricing. We will confirm the details before production starts.
            </p>
          ) : null}
          {hasMissingArtworkReminder ? (
            <p className="rounded-[1.3rem] border border-line/80 bg-white/90 px-4 py-3 text-xs leading-5 text-slate">
              You can upload artwork during checkout. If files are still being finalized, you can still continue and tell PrintMe what is coming next.
            </p>
          ) : null}
          <div className="focus-band px-4 py-3 text-xs leading-5 text-slate">
            Secure payment is handled by Stripe. Pickup, delivery, and artwork details are rechecked before anything moves into production.
          </div>
          <div className="rounded-[1.3rem] border border-line/80 bg-white/90 px-4 py-3 text-xs leading-5 text-slate">
            <p className="font-black text-ink">{paymentPlan.paymentHeadline}</p>
            <p className="mt-1">{paymentPlan.customerNotes[0]}</p>
          </div>
        </div>
        <div className="mt-5 border-t border-line pt-5">
          <Button href="/checkout" className="w-full">Go to Secure Checkout</Button>
          <Button href="/products" variant="secondary" className="mt-3 w-full">Add More Print Items</Button>
          <button type="button" onClick={clearCart} className="mt-4 w-full text-center text-sm font-bold text-slate transition hover:text-brand">
            Clear cart
          </button>
        </div>
      </aside>
    </div>
  );
}
