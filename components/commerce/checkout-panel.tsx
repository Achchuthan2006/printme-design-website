"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { CheckoutAddress, CheckoutCustomer, CheckoutPayload } from "@/types";
import { siteConfig } from "@/lib/site";

const emptyCustomer: CheckoutCustomer = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
};

const emptyAddress: CheckoutAddress = {
  addressLine1: "",
  addressLine2: "",
  city: "Scarborough",
  province: "ON",
  postalCode: "",
};

export function CheckoutPanel() {
  const { items, subtotal } = useCart();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [deliveryAddress, setDeliveryAddress] = useState(emptyAddress);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"pickup" | "delivery">("pickup");
  const [paymentMode, setPaymentMode] = useState<"full" | "deposit">("full");
  const [orderNotes, setOrderNotes] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const payableItems = useMemo(() => items.filter((item) => !item.quoteOnly), [items]);
  const quoteItems = useMemo(() => items.filter((item) => item.quoteOnly), [items]);
  const payableSubtotal = useMemo(
    () => payableItems.reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0),
    [payableItems],
  );

  function updateCustomer(field: keyof CheckoutCustomer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function updateAddress(field: keyof CheckoutAddress, value: string) {
    setDeliveryAddress((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    if (items.length === 0) return "Your cart is empty.";
    if (!customer.fullName || !customer.email || !customer.phone) return "Please enter your name, email, and phone number.";
    if (fulfillmentMethod === "delivery" && (!deliveryAddress.addressLine1 || !deliveryAddress.city || !deliveryAddress.postalCode)) {
      return "Please complete the delivery address.";
    }
    if (!accepted) return "Please acknowledge that PrintMe will review artwork and order details before production.";
    return "";
  }

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    const payload: CheckoutPayload = {
      customer,
      fulfillmentMethod,
      deliveryAddress: fulfillmentMethod === "delivery" ? deliveryAddress : undefined,
      orderNotes,
      paymentMode,
      items,
      subtotal,
    };

    startTransition(async () => {
      try {
        const response = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = (await response.json()) as { checkoutUrl?: string; message?: string };

        if (!response.ok || !result.checkoutUrl) {
          throw new Error(result.message ?? "Unable to start checkout.");
        }

        window.location.href = result.checkoutUrl;
      } catch (checkoutError) {
        setError(checkoutError instanceof Error ? checkoutError.message : "Unable to start checkout.");
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm leading-6 text-slate">Add a configured print product or request a quote before checkout.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/products">Browse Products</Button>
          <Button href="/quote-request" variant="secondary">Request Quote</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitCheckout} className="grid gap-8 lg:grid-cols-[1fr_390px]">
      <div className="space-y-6">
        <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Step 1</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Customer details</h1>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["fullName", "Full name", "Your name"],
              ["email", "Email", "you@example.com"],
              ["phone", "Phone", "416-555-0123"],
              ["companyName", "Company", "Optional"],
            ].map(([field, label, placeholder]) => (
              <label key={field} className="block">
                <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
                <input
                  value={customer[field as keyof CheckoutCustomer] ?? ""}
                  onChange={(event) => updateCustomer(field as keyof CheckoutCustomer, event.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Step 2</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Fulfillment</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { value: "pickup", label: "In-store pickup", description: siteConfig.address },
              { value: "delivery", label: "Local delivery", description: "Delivery is reviewed after order details are confirmed." },
            ].map((choice) => (
              <label
                key={choice.value}
                className={`cursor-pointer rounded-lg border p-4 transition hover:border-brand/40 ${
                  fulfillmentMethod === choice.value ? "border-brand bg-brand-soft ring-2 ring-brand/10" : "border-line bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value={choice.value}
                  checked={fulfillmentMethod === choice.value}
                  onChange={(event) => setFulfillmentMethod(event.target.value as "pickup" | "delivery")}
                  className="sr-only"
                />
                <span className="block text-sm font-black text-ink">{choice.label}</span>
                <span className="mt-1 block text-xs leading-5 text-slate">{choice.description}</span>
              </label>
            ))}
          </div>

          {fulfillmentMethod === "delivery" ? (
            <div className="hero-in mt-6 grid gap-5 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">Address line 1</span>
                <input value={deliveryAddress.addressLine1} onChange={(event) => updateAddress("addressLine1", event.target.value)} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-ink">Address line 2</span>
                <input value={deliveryAddress.addressLine2 ?? ""} onChange={(event) => updateAddress("addressLine2", event.target.value)} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">City</span>
                <input value={deliveryAddress.city} onChange={(event) => updateAddress("city", event.target.value)} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-ink">Postal code</span>
                <input value={deliveryAddress.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
              </label>
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-line bg-white p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Step 3</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Order notes</h2>
          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-ink">Instructions, artwork notes, deadline, or pickup details</span>
            <textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} rows={5} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15" />
          </label>
          <label className="mt-5 flex gap-3 rounded-lg bg-canvas p-4">
            <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-brand" />
            <span className="text-sm leading-6 text-slate">
              I understand PrintMe may review artwork, production details, pickup or delivery requirements, and quote-only items before production begins.
            </span>
          </label>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-line bg-white p-6 shadow-soft lg:sticky lg:top-24">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Secure checkout</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Order summary</h2>

        <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
          {items.map((item) => (
            <article key={item.id} className="rounded-lg border border-line p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-black text-ink">{item.title}</p>
                  <p className="mt-1 text-xs text-slate">{item.optionLabels.slice(0, 3).map((option) => option.value).join(" | ")}</p>
                </div>
                <p className="text-sm font-black text-ink">{item.quoteOnly ? "Quote" : `$${(item.estimatedTotal || item.unitPrice) * item.quantity}`}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between"><span>Estimated subtotal</span><span className="font-black text-ink">${subtotal}</span></div>
          <div className="flex justify-between text-slate"><span>Payable online</span><span>${payableSubtotal}</span></div>
          <div className="flex justify-between text-slate"><span>Quote review items</span><span>{quoteItems.length}</span></div>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-black text-ink">Payment option</legend>
          <div className="grid gap-2">
            {[
              { value: "full", label: "Pay online now", description: "Use Stripe Checkout for online-payable items." },
              { value: "deposit", label: "Deposit mode", description: "Prepared for future deposit workflows." },
            ].map((choice) => (
              <label key={choice.value} className={`cursor-pointer rounded-lg border p-3 ${paymentMode === choice.value ? "border-brand bg-brand-soft" : "border-line"}`}>
                <input type="radio" name="paymentMode" value={choice.value} checked={paymentMode === choice.value} onChange={(event) => setPaymentMode(event.target.value as "full" | "deposit")} className="sr-only" />
                <span className="block text-sm font-bold text-ink">{choice.label}</span>
                <span className="mt-1 block text-xs text-slate">{choice.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {quoteItems.length > 0 ? (
          <p className="mt-5 rounded-lg bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
            Quote-only items will be submitted for PrintMe review before final pricing or payment.
          </p>
        ) : null}

        {error ? <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

        <Button type="submit" disabled={isPending} className="mt-6 w-full">
          {isPending ? "Starting secure checkout..." : payableSubtotal > 0 ? "Continue to Secure Payment" : "Submit for Review"}
        </Button>
        <p className="mt-4 text-xs leading-5 text-slate">
          Secure payment is handled by Stripe. For help, call {siteConfig.phone} or email {siteConfig.email}.
        </p>
      </aside>
    </form>
  );
}
