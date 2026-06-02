"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { siteConfig } from "@/lib/site";

export function CheckoutResult({
  status,
  orderNumber,
  demo,
  paymentMode,
  balanceDue,
}: {
  status: "success" | "cancel" | "failure";
  orderNumber?: string;
  demo?: boolean;
  paymentMode?: "full" | "deposit" | "review";
  balanceDue?: string;
}) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "success") clearCart();
  }, [clearCart, status]);

  const copy = {
    success: {
      eyebrow: demo ? "Demo checkout" : paymentMode === "deposit" ? "Deposit received" : paymentMode === "review" ? "Order sent for review" : "Payment received",
      title: "Your print order is in.",
      body:
        paymentMode === "review"
          ? "PrintMe will review artwork, specs, and production requirements before sending the next payment step."
          : paymentMode === "deposit"
            ? "PrintMe received the initial payment and will keep the job in review until the remaining balance and production gates are clear."
            : "PrintMe will review artwork, production details, pickup or delivery requirements, and follow up if anything needs attention before production begins.",
      steps: [
        paymentMode === "review"
          ? "You will receive order confirmation and the next billing step after staff review."
          : "You will receive order confirmation and payment details by email.",
        paymentMode === "deposit"
          ? `The team reviews files, fulfillment notes, and proof requirements before the remaining balance${balanceDue ? ` of ${balanceDue}` : ""} is collected.`
          : "The team reviews files, fulfillment notes, and any quote-review items before production starts.",
        "If anything needs clarification, PrintMe reaches out before the job moves ahead.",
      ],
    },
    cancel: {
      eyebrow: "Checkout cancelled",
      title: "Checkout was paused - your cart is still safe.",
      body:
        "No payment was taken. Your cart is still available so you can review details, adjust products, or try secure checkout again.",
      steps: [
        "Your cart stays available so you do not need to start over.",
        "You can return to checkout, adjust the order, or ask PrintMe a quick question first.",
        "If the issue was timing, files, or fulfillment, support can help you choose the cleanest next step.",
      ],
    },
    failure: {
      eyebrow: "Payment issue",
      title: "Checkout needs another try.",
      body:
        "Please try again or contact PrintMe and we will help you complete the order safely.",
      steps: [
        "No production starts until payment and order details are confirmed.",
        "You can retry checkout right away or speak with PrintMe for help.",
        "If the issue was file-related or order-related, the team can guide you before you attempt payment again.",
      ],
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
      {status === "success" && paymentMode === "deposit" && balanceDue ? (
        <p className="mx-auto mt-4 max-w-xl rounded-[1rem] border border-line bg-white px-4 py-3 text-sm font-black text-ink">
          Remaining balance due later: {balanceDue}
        </p>
      ) : null}
      <div className="mx-auto mt-6 grid max-w-2xl gap-3 md:grid-cols-3">
        {copy.steps.map((step, index) => (
          <div key={step} className="rounded-[1.2rem] border border-line/80 bg-white/88 px-4 py-4 text-left shadow-soft">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Next {index + 1}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {status === "success" ? (
          <>
            <Button href="/account">View My Account</Button>
            <Button href="/order-status" variant="secondary">Check Order Status</Button>
            <Button href="/products" variant="secondary">Order More Prints</Button>
          </>
        ) : (
          <>
            <Button href="/checkout">Try Secure Checkout Again</Button>
            <Button href="/support" variant="secondary">Talk to PrintMe</Button>
          </>
        )}
      </div>
      {status === "success" ? (
        <div className="mx-auto mt-6 grid max-w-3xl gap-3 md:grid-cols-3">
          {[
            { title: "Reorder later", detail: "Your account keeps the order history ready for a faster repeat run." },
            { title: "Leave a review", detail: "Once the order is complete, PrintMe can invite you to share quick feedback." },
            { title: "Need another product?", detail: "Use the catalog to save or compare the next item while this order is moving." },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.2rem] border border-line/80 bg-white/88 px-4 py-4 text-left shadow-soft">
              <p className="text-sm font-black text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
      <p className="mt-5 text-xs leading-5 text-slate">
        Need help now? Call {siteConfig.phone} or email {siteConfig.email}.
      </p>
    </div>
  );
}
