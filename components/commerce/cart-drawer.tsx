"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, itemCount, subtotal, removeItem } = useCart();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative rounded-md px-3 py-2 text-xs font-extrabold text-ink transition hover:bg-brand-soft hover:text-brand"
      >
        Cart
        {itemCount > 0 ? (
          <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[10px] text-white">{itemCount}</span>
        ) : null}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-[70] bg-ink/30 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col bg-white shadow-card transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mini cart"
      >
        <div className="flex items-center justify-between border-b border-line p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Cart</p>
            <h2 className="text-2xl font-black text-ink">{itemCount} item(s)</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-line px-3 py-2 text-sm font-bold">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-lg bg-canvas p-5 text-sm text-slate">
              Your cart is empty. Browse products to configure a print order.
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="rounded-lg border border-line p-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-black text-ink">{item.title}</p>
                      <p className="mt-1 text-xs text-slate">
                        {item.optionLabels.slice(0, 3).map((option) => option.value).join(" | ") || "Configured print item"}
                      </p>
                    </div>
                    <button type="button" onClick={() => removeItem(item.id)} className="text-xs font-bold text-brand">
                      Remove
                    </button>
                  </div>
                  <p className="mt-3 text-sm font-black text-ink">
                    {item.quoteOnly ? "Quote" : `$${item.estimatedTotal || item.unitPrice}`}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-line p-5">
          <div className="mb-4 flex justify-between text-sm">
            <span className="font-bold text-slate">Estimated subtotal</span>
            <span className="font-black text-ink">${subtotal}</span>
          </div>
          <Button href="/cart" className="w-full" onClick={() => setOpen(false)}>
            View Cart
          </Button>
          <Link href="/checkout" onClick={() => setOpen(false)} className="mt-3 block text-center text-sm font-bold text-brand">
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
