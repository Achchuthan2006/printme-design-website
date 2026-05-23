"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartSupportPanel } from "@/components/commerce/cart-support-panel";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { items, itemCount, subtotal, removeItem, isDrawerOpen, openCart, closeCart } = useCart();
  const titleId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      openButtonRef.current?.focus();
    };
  }, [closeCart, isDrawerOpen]);

  return (
    <div className="relative">
      <button
        ref={openButtonRef}
        type="button"
        onClick={openCart}
        aria-expanded={isDrawerOpen}
        aria-controls="printme-cart-drawer"
        className="relative rounded-[1rem] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-ink transition hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        Cart
        {itemCount > 0 ? (
          <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">{itemCount}</span>
        ) : null}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[70] bg-ink/35 backdrop-blur-sm transition-opacity duration-300",
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeCart}
      />
      <aside
        id="printme-cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col border-l border-line/80 bg-white shadow-card transition-transform duration-300",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mini cart"
      >
        <div className="border-b border-line bg-[linear-gradient(180deg,rgba(255,241,236,0.72),rgba(255,255,255,0))] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="editorial-kicker">Print cart</p>
              <h2 id={titleId} className="mt-2 text-2xl font-black text-ink">{itemCount} item(s)</h2>
              <p className="mt-2 text-sm leading-6 text-slate">Review the order, keep shopping, or move into secure checkout when you are ready.</p>
            </div>
            <div className="flex items-center gap-3">
              <BrandLogo size="compact" className="hidden sm:inline-flex" />
              <button ref={closeButtonRef} type="button" aria-label="Close cart drawer" onClick={closeCart} className="rounded-[1rem] border border-line px-3 py-2 text-sm font-bold transition hover:border-brand/35 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-[1.3rem] border border-dashed border-line bg-canvas p-5 text-sm text-slate">
              Your cart is empty. Start with a product, or request a quote if your job needs custom sizing, finishing, or file review.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="rounded-[1.3rem] border border-line/90 p-4 transition hover:border-brand/25 hover:bg-brand-soft/20">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-black text-ink">{item.title}</p>
                      <p className="mt-1 text-xs text-slate">
                        {item.optionLabels.slice(0, 3).map((option) => option.value).join(" / ") || "Configured print item"}
                      </p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title} from cart`} className="text-xs font-bold text-brand">
                      Remove
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                    <p className="font-bold text-slate">Qty {item.quantity}</p>
                    <p className="font-black text-ink">{item.quoteOnly ? "Quote review" : `$${((item.estimatedTotal || item.unitPrice) * item.quantity).toFixed(2)}`}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate">
                    {item.turnaround ? <span className="rounded-full border border-line bg-canvas px-2.5 py-1">{item.turnaround}</span> : null}
                    {item.fulfillmentMethod ? <span className="rounded-full border border-line bg-canvas px-2.5 py-1">{item.fulfillmentMethod}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          )}

          <CartSupportPanel compact className="mt-5" />
        </div>

        <div className="border-t border-line p-5">
          <div className="mb-4 rounded-[1.3rem] border border-line/80 bg-canvas p-4 text-sm">
            <div className="flex justify-between">
              <span className="font-bold text-slate">Estimated subtotal</span>
              <span className="font-black text-ink">${subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-3 space-y-2 text-xs leading-5 text-slate">
              <div className="flex items-center gap-2">
                <Icon name="shield" className="h-4 w-4 text-brand" />
                <span>Secure payment through Stripe</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="clock" className="h-4 w-4 text-brand" />
                <span>Turnaround and pickup details confirmed before production</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="upload" className="h-4 w-4 text-brand" />
                <span>Artwork can be uploaded now or after checkout if needed</span>
              </div>
            </div>
          </div>
          <Button href="/cart" className="w-full" onClick={closeCart}>
            View Full Cart
          </Button>
          <Button href="/products" variant="secondary" className="mt-3 w-full" onClick={closeCart}>
            Continue Shopping
          </Button>
          <Link href="/checkout" onClick={closeCart} className="mt-4 block text-center text-sm font-bold text-brand">
            Go to Secure Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
