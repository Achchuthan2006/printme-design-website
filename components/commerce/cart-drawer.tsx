"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { CartSupportPanel } from "@/components/commerce/cart-support-panel";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";

export function CartDrawer({ compact = false }: { compact?: boolean }) {
  const { items, itemCount, subtotal, removeItem, isDrawerOpen, openCart, closeCart } = useCart();
  const quoteReviewCount = items.filter((item) => item.quoteOnly).length;
  const directCheckoutCount = items.length - quoteReviewCount;
  const titleId = useId();
  const descriptionId = useId();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const opener = openButtonRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
      if (event.key !== "Tab") return;

      const focusable = closeButtonRef.current
        ?.closest("aside")
        ?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      opener?.focus();
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
        aria-label={itemCount > 0 ? `Open cart with ${itemCount} item${itemCount > 1 ? "s" : ""}` : "Open cart"}
        data-surface="mini-cart-trigger"
        className={cn(
          "group relative inline-flex items-center text-xs font-extrabold uppercase tracking-[0.08em] text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          compact
            ? "h-11 w-11 justify-center rounded-[1rem] border border-line/80 bg-white/94 shadow-[0_10px_20px_rgba(22,19,17,0.04)] hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-soft hover:text-brand hover:shadow-soft"
            : "h-11 gap-2.5 rounded-[1.1rem] border border-line/80 bg-white/92 px-3.5 shadow-[0_10px_20px_rgba(22,19,17,0.04)] hover:-translate-y-0.5 hover:border-brand/25 hover:bg-brand-soft hover:text-brand hover:shadow-soft",
        )}
      >
        <span className={cn(
          "relative inline-flex items-center justify-center text-brand transition group-hover:text-brand",
          compact ? "h-8 w-8" : "h-7 w-7",
        )}>
          <Icon name="bag" className="h-5 w-5" />
          {itemCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 min-w-5 rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-black leading-none text-white">
              {itemCount}
            </span>
          ) : null}
        </span>
        {!compact ? <span className="hidden sm:inline">Cart</span> : null}
        {!compact && itemCount > 0 ? (
          <span className="hidden rounded-full bg-brand px-2 py-0.5 text-[10px] text-white lg:inline-flex">{itemCount} item{itemCount > 1 ? "s" : ""}</span>
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
        aria-describedby={descriptionId}
        className={cn(
          "fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col border-l border-line/80 bg-white shadow-card transition-transform duration-300",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mini cart"
        data-surface="mini-cart"
        data-cart-state={items.length === 0 ? "empty" : quoteReviewCount > 0 ? "mixed" : "ready"}
      >
        <div className="border-b border-line bg-[linear-gradient(180deg,rgba(255,241,236,0.72),rgba(255,255,255,0))] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="editorial-kicker">Print cart</p>
              <h2 id={titleId} className="mt-2 text-2xl font-black text-ink">{itemCount} item(s)</h2>
              <p id={descriptionId} className="mt-2 text-sm leading-6 text-slate">Review what is ready for checkout, what still needs review, and the fastest next step for the job.</p>
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
          {items.length > 0 ? (
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate">Ready for checkout</p>
                <p className="mt-2 text-2xl font-black text-ink">{directCheckoutCount}</p>
                <p className="mt-1 text-xs leading-5 text-slate">Items that can move into secure payment now.</p>
              </div>
              <div className="rounded-[1.2rem] border border-line bg-canvas p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate">Needs review</p>
                <p className="mt-2 text-2xl font-black text-ink">{quoteReviewCount}</p>
                <p className="mt-1 text-xs leading-5 text-slate">Items that still need staff confirmation before production.</p>
              </div>
            </div>
          ) : null}
          {items.length === 0 ? (
            <div className="rounded-[1.3rem] border border-dashed border-line bg-canvas p-5 text-sm text-slate">
              <p className="font-black text-ink">Your cart is empty.</p>
              <p className="mt-2">Start with a product, or request a quote if your job needs custom sizing, finishing, or file review.</p>
              <div className="mt-4 grid gap-3">
                <Button href="/products" onClick={closeCart}>Browse Products</Button>
                <Button href="/quote-request" variant="secondary" onClick={closeCart}>Request a Custom Quote</Button>
              </div>
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
                  {item.pricingLabel ? <p className="mt-2 text-xs leading-5 text-slate">{item.pricingLabel}</p> : null}
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
          {quoteReviewCount > 0 ? (
            <div className="mb-4 rounded-[1.25rem] border border-brand/15 bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
              {quoteReviewCount} item{quoteReviewCount === 1 ? "" : "s"} still need PrintMe review before final pricing or production approval.
            </div>
          ) : null}
            <div className="mb-4 rounded-[1.25rem] border border-line/80 bg-white/90 px-4 py-3 text-xs leading-5 text-slate">
            Upload files during checkout, or continue without them if the artwork is still being finalized.
          </div>
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
                <span>Turnaround and pickup or delivery confirmed before production</span>
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
          <Button href="/quote-request" variant="secondary" className="mt-3 w-full" onClick={closeCart}>
            Request a Custom Quote
          </Button>
          {items.length > 0 ? (
            <Link href="/checkout" onClick={closeCart} className="mt-4 block text-center text-sm font-bold text-brand">
              Continue to Checkout
            </Link>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
