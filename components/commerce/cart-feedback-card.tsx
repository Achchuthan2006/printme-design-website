"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export function CartFeedbackCard() {
  const { lastAddedItem, subtotal, dismissLastAddedItem, openCart } = useCart();

  useEffect(() => {
    if (!lastAddedItem) return;

    const timeout = window.setTimeout(() => {
      dismissLastAddedItem();
    }, 5500);

    return () => window.clearTimeout(timeout);
  }, [dismissLastAddedItem, lastAddedItem]);

  if (!lastAddedItem) return null;

  const lineTotal = (lastAddedItem.estimatedTotal || lastAddedItem.unitPrice) * lastAddedItem.quantity;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-20 z-[85] mx-auto max-w-md transition duration-300 md:bottom-6 md:right-6 md:left-auto",
        "animate-[fade-in_220ms_ease-out]",
      )}
      aria-live="polite"
    >
      <aside className="pointer-events-auto overflow-hidden rounded-[1.6rem] border border-line/80 bg-white/96 shadow-[0_30px_80px_rgba(22,19,17,0.18)] backdrop-blur-xl">
        <div className="border-b border-line/70 bg-[linear-gradient(135deg,rgba(255,241,236,0.96),rgba(255,255,255,0.92))] p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-white text-brand shadow-soft">
                <Icon name="bag" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Added to cart</p>
                <h2 className="mt-1 text-lg font-black text-ink">Your print item is saved.</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissLastAddedItem}
              aria-label="Dismiss cart confirmation"
              className="rounded-2xl border border-line bg-white px-3 py-2 text-xs font-black text-slate transition hover:border-brand/20 hover:text-brand"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-black text-ink">{lastAddedItem.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate">
                {lastAddedItem.optionLabels.slice(0, 2).map((option) => option.value).join(" / ") || "Configured print item"}
              </p>
            </div>
            <span className="rounded-full border border-brand/15 bg-brand-soft px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand">
              PrintMe
            </span>
          </div>

          <div className="mt-4 grid gap-2 rounded-[1.25rem] border border-line/80 bg-canvas p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate">Quantity</span>
              <span className="font-black text-ink">{lastAddedItem.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate">This item</span>
              <span className="font-black text-ink">{lastAddedItem.quoteOnly ? "Quote review" : formatMoney(lineTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate">Cart subtotal</span>
              <span className="font-black text-ink">{formatMoney(subtotal)}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                dismissLastAddedItem();
              }}
              className="w-full"
            >
              Continue Shopping
            </Button>
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                dismissLastAddedItem();
                openCart();
              }}
            >
              Review Cart
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate">
            <span>Need artwork or quote help before paying?</span>
            <Link href="/checkout" className="font-black text-brand transition hover:text-brand-dark">
              Go to checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
