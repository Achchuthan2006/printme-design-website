"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import {
  buildOptionLabels,
  calculateProductPrice,
  getDefaultOptions,
  getDisplayValue,
} from "@/lib/pricing";
import { ProductOption, PrintProduct } from "@/types";
import { cn } from "@/lib/utils";

function OptionField({
  option,
  value,
  onChange,
}: {
  option: ProductOption;
  value?: string;
  onChange: (value: string) => void;
}) {
  if (option.type === "textarea") {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-black text-ink">{option.label}</span>
        {option.helperText ? <span className="mb-3 block text-xs leading-5 text-slate">{option.helperText}</span> : null}
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </label>
    );
  }

  if (option.type === "radio") {
    return (
      <fieldset>
        <legend className="text-sm font-black text-ink">{option.label}</legend>
        {option.helperText ? <p className="mt-1 text-xs leading-5 text-slate">{option.helperText}</p> : null}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {option.choices?.map((choice) => {
            const selected = value === choice.value;
            return (
              <label
                key={choice.value}
                className={cn(
                  "cursor-pointer rounded-lg border bg-white p-4 transition duration-200 hover:border-brand/40 hover:bg-brand-soft/25",
                  selected ? "border-brand bg-brand-soft ring-2 ring-brand/10" : "border-line",
                )}
              >
                <input
                  type="radio"
                  name={option.name}
                  value={choice.value}
                  checked={selected}
                  onChange={(event) => onChange(event.target.value)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-sm font-black text-ink">{choice.label}</span>
                    {choice.description ? <span className="mt-1 block text-xs leading-5 text-slate">{choice.description}</span> : null}
                  </span>
                  {choice.priceDelta ? <span className="text-xs font-black text-brand">+${choice.priceDelta}</span> : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-ink">{option.label}</span>
      {option.helperText ? <span className="mb-3 block text-xs leading-5 text-slate">{option.helperText}</span> : null}
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none transition hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
      >
        <option value="">Select {option.label.toLowerCase()}</option>
        {option.choices?.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
            {choice.priceDelta ? ` (+$${choice.priceDelta})` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ProductConfigurator({ product }: { product: PrintProduct }) {
  const { addItem } = useCart();
  const [options, setOptions] = useState<Record<string, string>>(() => getDefaultOptions(product));
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");
  const [error, setError] = useState("");

  const price = useMemo(() => calculateProductPrice(product, options), [product, options]);
  const optionLabels = useMemo(() => buildOptionLabels(product, options), [product, options]);
  const canAddToCart = product.mode !== "quote-only" && product.ctaMode !== "contact";

  function updateOption(name: string, value: string) {
    setStatus("idle");
    setOptions((current) => ({ ...current, [name]: value }));
  }

  function validate() {
    const missing = product.options.find((option) => option.required && !options[option.name]);
    if (missing) {
      setError(`Please choose ${missing.label.toLowerCase()} before adding this item.`);
      setStatus("error");
      return false;
    }
    return true;
  }

  function addToCart() {
    if (!canAddToCart) return;
    if (!validate()) return;

    addItem({
      productSlug: product.slug,
      title: product.title,
      quantity: 1,
      unitPrice: price.unitPrice,
      estimatedTotal: price.estimatedTotal,
      pricingMode: price.pricingMode,
      mode: product.mode,
      options,
      optionLabels,
      notes: options.notes || options.instructions,
      fulfillmentMethod: getDisplayValue(product.options.find((option) => option.name === "fulfillment") ?? product.options[0], options.fulfillment),
      turnaround: getDisplayValue(product.options.find((option) => option.name === "turnaround") ?? product.options[0], options.turnaround),
      quoteOnly: price.pricingMode === "quote-only",
    });

    setError("");
    setStatus("added");
  }

  return (
    <div className="rounded-lg border border-line bg-white shadow-soft">
      <div className="border-b border-line p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Build your order</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Choose options for {product.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          Select the basics now. PrintMe can still review files, timing, and special instructions before production.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_330px]">
        <div className="space-y-6 p-5">
          {product.options.length > 0 ? (
            product.options.map((option) => (
              <OptionField
                key={option.name}
                option={option}
                value={options[option.name]}
                onChange={(value) => updateOption(option.name, value)}
              />
            ))
          ) : (
            <div className="rounded-lg bg-canvas p-5">
              <p className="text-sm font-bold text-ink">This service is best handled by quote or in store.</p>
              <p className="mt-2 text-sm leading-6 text-slate">Send the details and we will confirm the safest production path before you commit.</p>
            </div>
          )}
        </div>

        <aside className="border-t border-line bg-canvas p-5 lg:border-l lg:border-t-0">
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Live print summary</p>
            <h3 className="mt-2 text-xl font-black text-ink">{product.title}</h3>
            <div className="mt-5 space-y-3">
              {optionLabels.length > 0 ? (
                optionLabels.map((item) => (
                  <div key={item.label} className="flex justify-between gap-4 border-b border-line pb-2 text-sm">
                    <span className="text-slate">{item.label}</span>
                    <span className="text-right font-bold text-ink">{item.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate">No configurable options selected.</p>
              )}
            </div>

            <div className="mt-5 rounded-lg bg-white p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate">
                  {price.pricingMode === "quote-only" ? "Pricing" : price.pricingMode === "starting-from" ? "Starting estimate" : "Estimated total"}
                </span>
                <span className="text-2xl font-black text-ink">
                  {price.pricingMode === "quote-only" ? "Quote" : `$${price.estimatedTotal}`}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate">
                {price.pricingMode === "quote-only"
                  ? "This product needs PrintMe review before pricing can be confirmed."
                  : "Estimate before tax, delivery, artwork setup, or specialty finishing. We will review files before production."}
              </p>
            </div>

            {error ? <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
            {status === "added" ? (
              <p className="hero-in mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Added to cart. Review your order when you are ready, or keep building your print list.
              </p>
            ) : null}

            <div className="mt-5 grid gap-3">
              <Button type="button" onClick={addToCart} disabled={!canAddToCart}>
                {canAddToCart ? "Add to My Cart" : "Quote Required"}
              </Button>
              <Button href={`/quote-request?service=${product.slug}`} variant="secondary">
                Get a Quote Instead
              </Button>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate">
              Need help? PrintMe can review files, confirm stock, and recommend the best production path before payment.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
