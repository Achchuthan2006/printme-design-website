"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";

export function CheckoutResult({
  status,
  orderNumber,
  demo,
}: {
  status: "success" | "cancel" | "failure";
  orderNumber?: string;
  demo?: boolean;
}) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "success") clearCart();
  }, [clearCart, status]);

  const copy = {
    success: {
      eyebrow: demo ? "Demo checkout" : "Payment received",
      title: "Your print order is in.",
      body:
        "PrintMe will review artwork, production details, pickup or delivery requirements, and follow up if anything needs attention before production begins.",
    },
    cancel: {
      eyebrow: "Checkout cancelled",
      title: "Checkout was paused - your cart is still safe.",
      body:
        "No payment was taken. Your cart is still available so you can review details, adjust products, or try secure checkout again.",
    },
    failure: {
      eyebrow: "Payment issue",
      title: "Checkout needs another try.",
      body:
        "Please try again or contact PrintMe and we will help you complete the order safely.",
    },
  }[status];

  return (
    <div className="hero-panel p-8 text-center">
      <p className="editorial-kicker">{copy.eyebrow}</p>
      <h1 className="display-title mt-3 text-[2.7rem] font-black leading-[0.94]">{copy.title}</h1>
      {orderNumber ? (
        <p className="mt-4 rounded-[1rem] bg-canvas px-4 py-3 text-sm font-black text-ink">
          Order reference: {orderNumber}
        </p>
      ) : null}
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate">{copy.body}</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {status === "success" ? (
          <>
            <Button href="/account">View My Account</Button>
            <Button href="/products" variant="secondary">Order More Prints</Button>
          </>
        ) : (
          <>
            <Button href="/checkout">Try Secure Checkout Again</Button>
            <Button href="/support" variant="secondary">Talk to PrintMe</Button>
          </>
        )}
      </div>
    </div>
  );
}
