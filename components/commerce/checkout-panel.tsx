"use client";

import { useId, useMemo, useState, useTransition } from "react";
import { CartSupportPanel } from "@/components/commerce/cart-support-panel";
import { Button } from "@/components/ui/button";
import { CheckboxTile, FeedbackMessage, Field, Input, Textarea } from "@/components/ui/form-controls";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { useCart } from "@/features/cart/cart-context";
import { openSupportChat } from "@/lib/chat";
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
  const errorId = useId();
  const [customer, setCustomer] = useState(emptyCustomer);
  const [deliveryAddress, setDeliveryAddress] = useState(emptyAddress);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"pickup" | "delivery">("pickup");
  const [paymentMode, setPaymentMode] = useState<"full" | "deposit">("full");
  const [orderNotes, setOrderNotes] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const payableItems = useMemo(() => items.filter((item) => !item.quoteOnly), [items]);
  const quoteItems = useMemo(() => items.filter((item) => item.quoteOnly), [items]);
  const payableSubtotal = useMemo(
    () => payableItems.reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0),
    [payableItems],
  );
  const needsReviewOnly = payableSubtotal <= 0 && quoteItems.length > 0;

  function updateCustomer(field: keyof CheckoutCustomer, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function updateAddress(field: keyof CheckoutAddress, value: string) {
    setDeliveryAddress((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (items.length === 0) return { message: "Your cart is empty.", errors: nextErrors };
    if (!customer.fullName) nextErrors.fullName = "Enter the name we should use for this order.";
    if (!customer.email) nextErrors.email = "Enter the best email for confirmations and questions.";
    if (!customer.phone) nextErrors.phone = "Enter a phone number in case timing or files need a quick check.";
    if (fulfillmentMethod === "delivery") {
      if (!deliveryAddress.addressLine1) nextErrors.addressLine1 = "Enter the delivery address.";
      if (!deliveryAddress.city) nextErrors.city = "Enter the delivery city.";
      if (!deliveryAddress.postalCode) nextErrors.postalCode = "Enter the delivery postal code.";
    }
    if (!accepted) nextErrors.accepted = "Please confirm that PrintMe will review files and order details before production.";

    return {
      message: Object.keys(nextErrors).length > 0 ? "Please fix the highlighted checkout details before continuing." : "",
      errors: nextErrors,
    };
  }

  async function submitCheckout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    if (validation.message) {
      setFieldErrors(validation.errors);
      setError(validation.message);
      return;
    }

    setFieldErrors({});
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
      <div className="hero-panel p-8 text-center">
        <p className="editorial-kicker">Secure checkout</p>
        <h1 className="display-title mt-2 text-[2.5rem] font-black">Your checkout is waiting for a print item.</h1>
        <p className="mt-3 text-sm leading-6 text-slate">Add an online-order item or request a quote if your project needs review first.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/products">Start My Order</Button>
          <Button href="/quote-request" variant="secondary">Request a Quote</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submitCheckout} className="grid gap-8 lg:grid-cols-[1fr_390px]" noValidate>
      <div className="space-y-6">
        <CartSupportPanel />

        <section className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Step 1", title: "Contact details", detail: "Where to send confirmations, questions, and pickup updates." },
            { label: "Step 2", title: "Fulfillment choice", detail: "Choose pickup or delivery so timing and logistics can be confirmed." },
            { label: "Step 3", title: "Files and notes", detail: "Upload artwork now or leave guidance so PrintMe knows what is coming next." },
          ].map((item) => (
            <div key={item.title} className="signal-card">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">{item.label}</p>
              <p className="mt-2 text-sm font-black text-ink">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate">{item.detail}</p>
            </div>
          ))}
        </section>

        <section className="section-frame p-6">
          <p className="editorial-kicker">Step 1</p>
          <h1 className="display-title mt-2 text-[2.3rem] font-black leading-[0.95] text-ink">Where should we send updates?</h1>
          <p className="mt-3 text-sm leading-6 text-slate">We use these details for order confirmation, artwork questions, pickup updates, and payment follow-up if needed.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              ["fullName", "Full name", "Your name", "text", "name"],
              ["email", "Email", "you@example.com", "email", "email"],
              ["phone", "Phone", "416-555-0123", "tel", "tel"],
              ["companyName", "Company", "Optional", "text", "organization"],
            ].map(([field, label, placeholder, inputType, autoComplete]) => (
              <Field key={field} label={label} error={fieldErrors[field]}>
                <Input
                  value={customer[field as keyof CheckoutCustomer] ?? ""}
                  onChange={(event) => updateCustomer(field as keyof CheckoutCustomer, event.target.value)}
                  placeholder={placeholder}
                  type={inputType}
                  required={field !== "companyName"}
                  autoComplete={autoComplete}
                  aria-invalid={Boolean(fieldErrors[field])}
                />
              </Field>
            ))}
          </div>
        </section>

        <section className="surface-card p-6">
          <p className="editorial-kicker">Step 2</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Choose pickup or delivery</h2>
          <p className="mt-3 text-sm leading-6 text-slate">Pickup is fastest for most orders. Delivery is reviewed after the order details are confirmed.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { value: "pickup", label: "In-store pickup", description: siteConfig.address },
              { value: "delivery", label: "Local delivery", description: "Delivery is reviewed after order details are confirmed." },
            ].map((choice) => (
              <label
                key={choice.value}
                className={`cursor-pointer rounded-[1.35rem] border p-4 transition hover:border-brand/40 ${
                  fulfillmentMethod === choice.value ? "border-brand bg-brand-soft ring-2 ring-brand/10 shadow-soft" : "border-line bg-white"
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
              <Field label="Address line 1" className="md:col-span-2" error={fieldErrors.addressLine1}>
                <Input value={deliveryAddress.addressLine1} onChange={(event) => updateAddress("addressLine1", event.target.value)} required={fulfillmentMethod === "delivery"} autoComplete="address-line1" aria-invalid={Boolean(fieldErrors.addressLine1)} />
              </Field>
              <Field label="Address line 2" className="md:col-span-2">
                <Input value={deliveryAddress.addressLine2 ?? ""} onChange={(event) => updateAddress("addressLine2", event.target.value)} autoComplete="address-line2" />
              </Field>
              <Field label="City" error={fieldErrors.city}>
                <Input value={deliveryAddress.city} onChange={(event) => updateAddress("city", event.target.value)} required={fulfillmentMethod === "delivery"} autoComplete="address-level2" aria-invalid={Boolean(fieldErrors.city)} />
              </Field>
              <Field label="Postal code" error={fieldErrors.postalCode}>
                <Input value={deliveryAddress.postalCode} onChange={(event) => updateAddress("postalCode", event.target.value)} required={fulfillmentMethod === "delivery"} autoComplete="postal-code" aria-invalid={Boolean(fieldErrors.postalCode)} />
              </Field>
            </div>
          ) : null}
        </section>

        <section className="surface-card p-6">
          <p className="editorial-kicker">Step 3</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Artwork and production notes</h2>
          <Field label="Anything we should confirm before print?" hint="Use this for deadlines, colour notes, file naming, packaging details, or anything else we should double-check." className="mt-5">
            <Textarea value={orderNotes} onChange={(event) => setOrderNotes(event.target.value)} rows={5} />
          </Field>
          <div className="mt-5 rounded-[1.35rem] border border-line/80 bg-canvas px-4 py-4 text-sm leading-6 text-slate">
            <p className="font-black text-ink">You do not need every file finalized to continue.</p>
            <p className="mt-1">
              If artwork is still being updated, tell PrintMe what is missing and when to expect it. We will keep the order moving with the clearest next step possible.
            </p>
          </div>
          <div className="mt-5">
            <ArtworkUploadZone
              context={{ scope: "order", relatedLabel: "Checkout order" }}
              title="Attach artwork for this order"
              description="Upload print-ready files now, or add a note if you want to send artwork after checkout."
              helperText="For multi-item carts, name files clearly so we can match them to the correct product."
              className="shadow-none"
            />
          </div>
          <CheckboxTile checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-5 items-start">
            <span className="leading-6 text-slate">
              I understand PrintMe may review artwork, production details, pickup or delivery requirements, and quote-only items before production begins. This helps prevent avoidable print issues.
            </span>
          </CheckboxTile>
          {fieldErrors.accepted ? <p className="mt-2 text-sm text-brand">{fieldErrors.accepted}</p> : null}
        </section>
      </div>

      <aside className="hero-panel h-fit p-6 lg:sticky lg:top-24">
        <p className="editorial-kicker">Secure checkout</p>
        <h2 className="display-title mt-2 text-[2rem] font-black leading-[0.96] text-ink">Confirm your print order</h2>
        <p className="mt-2 text-sm leading-6 text-slate">Review what can be paid online now, what still needs staff confirmation, and what happens after you submit.</p>

        <div className="mt-5 max-h-[360px] space-y-4 overflow-y-auto pr-1">
          {items.map((item) => (
            <article key={item.id} className="rounded-[1.35rem] border border-line/90 bg-white/88 p-4 shadow-[0_10px_22px_rgba(18,17,16,0.04)]">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-black text-ink">{item.title}</p>
                  <p className="mt-1 text-xs text-slate">{item.optionLabels.slice(0, 3).map((option) => option.value).join(" / ")}</p>
                </div>
                <p className="text-sm font-black text-ink">{item.quoteOnly ? "Quote" : `$${((item.estimatedTotal || item.unitPrice) * item.quantity).toFixed(2)}`}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between"><span>Estimated subtotal</span><span className="font-black text-ink">${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-slate"><span>Payable online</span><span>${payableSubtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-slate"><span>Quote review items</span><span>{quoteItems.length}</span></div>
          <div className="rounded-[1.25rem] border border-line/80 bg-white/90 px-4 py-3 text-xs leading-5 text-slate">
            After checkout, PrintMe confirms files, fulfillment, and any review items before production begins.
          </div>
          <div className="focus-band px-4 py-3 text-xs leading-5 text-slate">
            Secure checkout is powered by Stripe. PrintMe still confirms files, fulfillment, and any quote-review items before production begins.
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-black text-ink">Payment option</legend>
          <div className="grid gap-2">
            {[
              { value: "full", label: "Pay online now", description: "Use Stripe Checkout for online-payable items." },
              { value: "deposit", label: "Deposit mode", description: "Coming soon. Online full payment is currently the supported checkout path.", disabled: true },
            ].map((choice) => (
              <label
                key={choice.value}
                className={`rounded-[1.25rem] border p-3 ${
                  paymentMode === choice.value ? "border-brand bg-brand-soft" : "border-line bg-white/80"
                } ${choice.disabled ? "cursor-not-allowed opacity-65" : "cursor-pointer"}`}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value={choice.value}
                  checked={paymentMode === choice.value}
                  onChange={(event) => setPaymentMode(event.target.value as "full" | "deposit")}
                  className="sr-only"
                  disabled={choice.disabled}
                />
                <span className="block text-sm font-bold text-ink">{choice.label}</span>
                <span className="mt-1 block text-xs text-slate">{choice.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {quoteItems.length > 0 ? (
          <p className="mt-5 rounded-[1.3rem] border border-brand/15 bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
            Quote-only items will be reviewed by PrintMe before final pricing or production approval.
          </p>
        ) : null}
        {needsReviewOnly ? (
          <p className="mt-5 rounded-[1.3rem] border border-line/80 bg-white/90 px-4 py-3 text-xs leading-5 text-slate">
            This checkout will send your details and files for review. If no online-payable items are in the cart, no Stripe payment step is required.
          </p>
        ) : null}

        {error ? (
          <FeedbackMessage id={errorId} tone="error" className="mt-5" >
            {error}
          </FeedbackMessage>
        ) : null}

        <Button type="submit" disabled={isPending} className="mt-6 w-full">
          {isPending ? "Starting secure checkout..." : payableSubtotal > 0 ? "Continue to Secure Payment" : "Send Order for Review"}
        </Button>
        <p className="mt-3 text-xs leading-5 text-slate">
          {payableSubtotal > 0
            ? "You will be sent to Stripe for secure payment, then back to PrintMe for order review and fulfillment confirmation."
            : "This sends the order details to PrintMe for review. The team will confirm pricing or next steps before production."}
        </p>
        <Button type="button" variant="secondary" className="mt-3 w-full" onClick={openSupportChat}>
          Ask About Files or Turnaround
        </Button>
        <p className="mt-4 text-xs leading-5 text-slate">
          Secure payment is handled by Stripe. For help, call {siteConfig.phone} or email {siteConfig.email}.
        </p>
      </aside>
    </form>
  );
}
