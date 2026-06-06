"use client";

import { cn } from "@/lib/utils";
import { getPricingRule } from "@/lib/pricing";
import { PrintProduct, ProductOption } from "@/types";

const optionGroupRank: Record<string, number> = {
  quantity: 0,
  size: 1,
  material: 2,
  finish: 3,
  print: 4,
  turnaround: 5,
  fulfillment: 6,
  artwork: 7,
  notes: 8,
};

function compareOptionPriority(a: ProductOption, b: ProductOption) {
  const aRank = optionGroupRank[a.group ?? "notes"] ?? 99;
  const bRank = optionGroupRank[b.group ?? "notes"] ?? 99;
  return aRank - bRank;
}

export function getCommercialOptions(product: PrintProduct, limit = 4) {
  return product.options
    .filter((option) => option.type !== "textarea" && (option.choices?.length ?? 0) > 0)
    .sort(compareOptionPriority)
    .slice(0, limit);
}

export function getPriceCue(product: PrintProduct) {
  const pricingRule = getPricingRule(product);
  const basePrice = product.startingPrice ?? pricingRule.minimumCharge;

  if (product.mode === "quote-only") {
    return {
      label: basePrice ? `Quote from $${basePrice}` : "Custom quote",
      detail: "Final pricing is confirmed after specs, files, and production fit are reviewed.",
    };
  }

  if (pricingRule.behavior === "instant") {
    return {
      label: `From $${basePrice}`,
      detail: "Standard listed combinations can move directly into checkout.",
    };
  }

  return {
    label: `Est. from $${basePrice}`,
    detail: "Standard selections start with a structured estimate and may still need staff review.",
  };
}

export function getOrderCue(product: PrintProduct) {
  if (product.ctaMode === "direct-order") {
    return {
      label: "Order now",
      detail: "Use the standard options, confirm the price, and add it to cart.",
    };
  }

  if (product.ctaMode === "upload-first") {
    return {
      label: "Upload or order",
      detail: "Ready artwork can move faster, but PrintMe still checks file fit before production.",
    };
  }

  if (product.ctaMode === "contact") {
    return {
      label: "Call or visit first",
      detail: "This path is handled best in store or with a quick conversation before timing is locked in.",
    };
  }

  return {
    label: "Request a quote",
    detail: "Best for custom specs, non-standard quantities, design help, or jobs that need review first.",
  };
}

export function getIdentityCue(product: PrintProduct) {
  const idealUse = product.idealFor[0]?.toLowerCase();
  return idealUse
    ? `${product.shortTitle ?? product.title} for ${idealUse}.`
    : product.description;
}

function summarizeOption(option: ProductOption) {
  if (!option.choices?.length) return "Custom review";

  const preview = option.choices.slice(0, 3).map((choice) => choice.label);
  const extraCount = option.choices.length - preview.length;
  return extraCount > 0 ? `${preview.join(", ")} +${extraCount} more` : preview.join(", ");
}

export function getStandardOptionCue(product: PrintProduct) {
  const options = getCommercialOptions(product, 3);
  if (options.length === 0) {
    return {
      label: "Custom setup",
      detail: "Specs are confirmed through quote review instead of fixed storefront options.",
    };
  }

  return {
    label: options.map((option) => option.label).join(" / "),
    detail: summarizeOption(options[0]),
  };
}

export function ProductBuyingAnswers({
  product,
  className,
}: {
  product: PrintProduct;
  className?: string;
}) {
  const priceCue = getPriceCue(product);
  const orderCue = getOrderCue(product);
  const optionCue = getStandardOptionCue(product);

  const answers = [
    {
      question: "What is this product?",
      answer: product.shortTitle ?? product.title,
      detail: getIdentityCue(product),
    },
    {
      question: "What are my standard options?",
      answer: optionCue.label,
      detail: optionCue.detail,
    },
    {
      question: "How much does it cost?",
      answer: priceCue.label,
      detail: priceCue.detail,
    },
    {
      question: "How fast can I get it?",
      answer: product.turnaround,
      detail: product.rushNote ?? product.pickupDeliveryNote,
    },
    {
      question: "Order now or request a quote?",
      answer: orderCue.label,
      detail: orderCue.detail,
    },
  ];

  return (
    <div className={cn("grid gap-3 md:grid-cols-2 xl:grid-cols-5", className)}>
      {answers.map((item) => (
        <article key={item.question} className="rounded-[1.2rem] border border-line/80 bg-white/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_10px_20px_rgba(18,17,16,0.04)]">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate">{item.question}</p>
          <p className="mt-2 text-sm font-black leading-6 text-ink">{item.answer}</p>
          <p className="mt-2 text-xs leading-5 text-slate">{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function ProductOptionOverview({
  product,
  className,
}: {
  product: PrintProduct;
  className?: string;
}) {
  const options = getCommercialOptions(product, 4);

  if (options.length === 0) {
    return (
      <div className={cn("rounded-[1.35rem] border border-line bg-canvas/75 p-5", className)}>
        <p className="text-sm font-black text-ink">This product does not use fixed storefront options.</p>
        <p className="mt-2 text-sm leading-6 text-slate">Use the quote path to confirm size, material, finishing, quantity, and production notes together.</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {options.map((option) => (
        <article key={option.name} className="rounded-[1.3rem] border border-line/80 bg-canvas/72 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">{option.label}</p>
          {option.helperText ? <p className="mt-2 text-sm leading-6 text-slate">{option.helperText}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {option.choices?.slice(0, 4).map((choice) => (
              <span key={choice.value} className="value-chip">
                {choice.label}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
