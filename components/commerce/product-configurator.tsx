"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Select, Textarea } from "@/components/ui/form-controls";
import { useCart } from "@/features/cart/cart-context";
import { openSupportChat } from "@/lib/chat";
import { trackPrintMeEvent } from "@/lib/analytics/client";
import {
  buildOptionLabels,
  calculateProductPrice,
  getDefaultOptions,
  getDisplayValue,
  getPricingPathLabelFromEvaluation,
} from "@/lib/pricing";
import { ProductOption, PrintProduct } from "@/types";
import { cn } from "@/lib/utils";
import { timelineRules } from "@/data/experience";

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
      <Field label={option.label} hint={option.helperText}>
        <Textarea
          rows={4}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
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
                  "cursor-pointer rounded-[1.3rem] border bg-white p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand-soft/25 hover:shadow-soft",
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
    <Field label={option.label} hint={option.helperText}>
      <Select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select {option.label.toLowerCase()}</option>
        {option.choices?.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
            {choice.priceDelta ? ` (+$${choice.priceDelta})` : ""}
          </option>
        ))}
      </Select>
    </Field>
  );
}

export function ProductConfigurator({ product }: { product: PrintProduct }) {
  const { addItem, openCart } = useCart();
  const [options, setOptions] = useState<Record<string, string>>(() => getDefaultOptions(product));
  const [status, setStatus] = useState<"idle" | "added" | "error">("idle");
  const [error, setError] = useState("");

  const price = useMemo(() => calculateProductPrice(product, options), [product, options]);
  const optionLabels = useMemo(() => buildOptionLabels(product, options), [product, options]);
  const canAddToCart = price.canCheckoutDirectly && product.ctaMode !== "contact";
  const configurableOptions = useMemo(() => product.options, [product.options]);
  const quoteHref = useMemo(() => {
    const params = new URLSearchParams({ service: product.slug });

    for (const [key, value] of Object.entries(options)) {
      if (!value) continue;
      params.set(key, value);
    }

    return `/quote-request?${params.toString()}`;
  }, [options, product.slug]);
  const nextStepCopy = canAddToCart
    ? "Choose the listed standard specs here first, confirm the live price, then add the job to cart when the setup matches what you need."
    : "Choose the closest standard specs first. If the job falls outside them, use the quote path instead of forcing a bad checkout flow.";

  useEffect(() => {
    trackPrintMeEvent({
      eventName: "product_specs_configured",
      pageType: "product",
      funnelName: "storefront_discovery",
      funnelStage: "specs",
      journey: "storefront_discovery",
      isMicroConversion: true,
      properties: {
        productSlug: product.slug,
        state: "configurator_viewed",
      },
    });
  }, [product.slug]);

  function updateOption(name: string, value: string) {
    setStatus("idle");
    setOptions((current) => ({ ...current, [name]: value }));
    const option = product.options.find((item) => item.name === name);
    trackPrintMeEvent({
      eventName: "product_specs_configured",
      pageType: "product",
      funnelName: "storefront_discovery",
      funnelStage: "specs",
      journey: "storefront_discovery",
      isMicroConversion: true,
      properties: {
        productSlug: product.slug,
        optionName: name,
        optionGroup: option?.group ?? null,
        optionValue: value,
      },
    });
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
      pricingState: price.pricingState,
      pricingLabel: price.pricingLabel,
      pricingExplanation: price.pricingExplanation,
    });

    setError("");
    setStatus("added");
    trackPrintMeEvent({
      eventName: "order_method_selected",
      pageType: "product",
      funnelName: "direct_checkout",
      funnelStage: "cart",
      journey: "direct_checkout",
      isMicroConversion: true,
      properties: {
        productSlug: product.slug,
        orderMethod: "direct-order",
        pricingMode: price.pricingMode,
      },
    });
  }

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-line/80 bg-white shadow-luxe">
      <div className="border-b border-line/80 bg-[linear-gradient(180deg,rgba(255,241,236,0.7),rgba(255,255,255,0))] p-6">
        <p className="editorial-kicker">Build your order</p>
        <h2 className="mt-2 text-2xl font-black text-ink">Configure {product.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate">
          Start with the standard storefront options and confirm whether this job stays in direct order or needs quote review.
        </p>
        <p className="mt-4 rounded-[1.2rem] border border-brand/15 bg-brand-soft px-4 py-3 text-sm leading-6 text-brand">
          <span className="font-black text-ink">Best next step:</span> {nextStepCopy}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_330px]">
        <div className="space-y-6 p-6">
          {configurableOptions.length > 0 ? (
            configurableOptions.map((option) => (
              <OptionField
                key={option.name}
                option={option}
                value={options[option.name]}
                onChange={(value) => updateOption(option.name, value)}
              />
            ))
          ) : (
            <div className="rounded-[1.3rem] bg-canvas p-5">
              <p className="text-sm font-bold text-ink">This service is best handled by quote or in store.</p>
              <p className="mt-2 text-sm leading-6 text-slate">Send the details and we will confirm the safest production path before you commit.</p>
            </div>
          )}
          <div className="rounded-[1.3rem] border border-line bg-canvas p-4">
            <p className="text-sm font-black text-ink">Turnaround and production timing</p>
            <p className="mt-2 text-sm leading-6 text-slate">
              Select the timing path that best matches the job. Rush and same-day choices may still require staff confirmation before timing is finalized.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {timelineRules.map((rule) => (
                <div key={rule.title} className="rounded-[1rem] border border-line/80 bg-white px-3 py-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand">{rule.title}</p>
                  <p className="mt-1 text-sm font-black text-ink">{rule.window}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="border-t border-line bg-[#f7f1ea] p-5 lg:border-l lg:border-t-0">
          <div className="lg:sticky lg:top-24">
            <p className="editorial-kicker">Live buying summary</p>
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

            <div className="mt-5 rounded-[1.4rem] border border-white/80 bg-white/80 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate">{getPricingPathLabelFromEvaluation(price)}</span>
                <span className="text-2xl font-black text-ink">
                  {price.pricingMode === "quote-only" ? "Quote" : `$${price.estimatedTotal}`}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate">
                {price.pricingExplanation}
              </p>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-line/80 bg-white/85 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">What changes price</p>
              <p className="mt-2 text-sm font-bold text-ink">{price.pricingLabel}</p>
              <div className="mt-3 space-y-2 text-xs leading-5 text-slate">
                {price.adjustments.slice(0, 4).map((item) => (
                  <div key={`${item.label}-${item.amount}`} className="flex justify-between gap-3">
                    <span>{item.label}</span>
                    <span className="font-black text-ink">+${item.amount.toFixed(2)}</span>
                  </div>
                ))}
                {price.quoteReasons.length > 0 ? (
                  <p className="rounded-[1rem] border border-brand/15 bg-brand-soft px-3 py-2 text-brand">
                    Quote trigger: {price.quoteReasons[0]}
                  </p>
                ) : null}
                {price.customerSummary.slice(0, 2).map((item) => (
                  <p key={item}>{item}</p>
                ))}
                {price.guardrails.length > 0 ? <p>{price.guardrails[0]}</p> : null}
              </div>
            </div>

            {error ? <FeedbackMessage tone="error" className="mt-4 font-bold">{error}</FeedbackMessage> : null}
            {status === "added" ? (
              <FeedbackMessage tone="success" className="hero-in mt-4 font-bold">
                Added to cart. You can keep building the order, open the mini cart, or move straight into checkout when you are ready.
              </FeedbackMessage>
            ) : null}

            <div className="mt-5 grid gap-3">
              <Button type="button" onClick={addToCart} disabled={!canAddToCart}>
                {canAddToCart ? "Add Standard Order to Cart" : "Quote Required"}
              </Button>
              {status === "added" ? (
                <>
                  <Button href="/checkout" variant="secondary">
                    Go to Secure Checkout
                  </Button>
                  <Button type="button" variant="secondary" onClick={openCart}>
                    Review Cart
                  </Button>
                </>
              ) : null}
              <Button
                href={quoteHref}
                variant="secondary"
                onClick={() =>
                  trackPrintMeEvent({
                    eventName: "order_method_selected",
                    pageType: "product",
                    funnelName: "quote_to_cash",
                    funnelStage: "quote_request",
                    journey: "quote_to_cash",
                    isMicroConversion: true,
                    properties: {
                      productSlug: product.slug,
                      orderMethod: "quote-first",
                    },
                  })
                }
              >
                Request a Quote Instead
              </Button>
            </div>
            <button
              type="button"
              onClick={openSupportChat}
              className="mt-4 text-left text-xs font-bold text-slate transition hover:text-brand"
            >
              Need help deciding? Ask PrintMe before ordering.
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
