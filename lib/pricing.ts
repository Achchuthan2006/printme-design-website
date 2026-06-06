import {
  defaultPricingRule,
  ExactPriceConfiguration,
  pricingRules,
  ProductPricingRule,
  QuantityTierRule,
  TurnaroundRule,
} from "@/data/pricing-rules";
import { PricingAdjustmentLine, PricingEvaluation, PrintProduct, ProductOption, ProductOrderMethod } from "@/types";

export type PriceResult = PricingEvaluation;

function normalizeServiceSlug(product: PrintProduct) {
  return pricingRules[product.slug] ? product.slug : "custom-orders";
}

export function getPricingRule(product: PrintProduct): ProductPricingRule {
  return pricingRules[normalizeServiceSlug(product)] ?? defaultPricingRule;
}

export function getDefaultOptions(product: PrintProduct) {
  return product.options.reduce<Record<string, string>>((defaults, option) => {
    const firstChoice = option.choices?.[0]?.value;
    if (option.defaultValue ?? firstChoice) {
      defaults[option.name] = option.defaultValue ?? firstChoice ?? "";
    }
    return defaults;
  }, {});
}

export function getSelectedChoice(option: ProductOption, value?: string) {
  return option.choices?.find((choice) => choice.value === value);
}

export function getDisplayValue(option: ProductOption, value?: string) {
  if (!value) return "Not selected";
  return getSelectedChoice(option, value)?.label ?? value;
}

export function getConfiguredQuantity(product: PrintProduct, selectedOptions: Record<string, string>, fallback = 1) {
  const quantityOption = product.options.find((option) => option.group === "quantity" || option.name === "quantity");
  const quantityValue = quantityOption ? selectedOptions[quantityOption.name] : undefined;
  const parsed = Number(quantityValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getQuantityOption(product: PrintProduct) {
  return product.options.find((option) => option.group === "quantity" || option.name === "quantity");
}

function hasExactNumericQuantityChoices(product: PrintProduct) {
  const quantityOption = getQuantityOption(product);
  if (!quantityOption?.choices?.length) return false;

  return quantityOption.choices.every((choice) => {
    const parsed = Number(choice.value);
    return Number.isFinite(parsed) && parsed > 0;
  });
}

function inferOrderMethod(selectedOptions: Record<string, string>, requestedMethod?: ProductOrderMethod): ProductOrderMethod {
  if (requestedMethod) return requestedMethod;

  if (selectedOptions.artwork === "design-help") return "request-custom-design";
  if (selectedOptions.artwork === "file-check") return "customize-template";
  return "upload-finished-design";
}

function toAdjustmentKind(option?: ProductOption): PricingAdjustmentLine["kind"] {
  if (option?.group === "quantity") return "quantity";
  if (option?.group === "turnaround") return "turnaround";
  return "option";
}

function getPricingPathLabel(pricingState: PriceResult["pricingState"]) {
  if (pricingState === "instant-price") return "Instant price";
  if (pricingState === "estimated-price") return "Structured estimate";
  return "Custom quote";
}

function matchCombo(combo: Record<string, string>, selectedOptions: Record<string, string>) {
  return Object.entries(combo).every(([key, value]) => selectedOptions[key] === value);
}

function addAdjustment(
  adjustments: PricingAdjustmentLine[],
  label: string,
  amount: number,
  kind: PricingAdjustmentLine["kind"],
  note?: string,
) {
  if (!amount) return;
  adjustments.push({ label, amount, kind, note });
}

function buildQuoteOnlyResult(
  product: PrintProduct,
  quantity: number,
  minimumCharge: number,
  quoteReasons: string[],
  businessNotes: string[],
  paymentPathNote: string,
  guardrails: string[],
  pricingFactors: string[],
): PriceResult {
  return {
    unitPrice: 0,
    estimatedTotal: 0,
    optionPrice: 0,
    quantity,
    pricingMode: "quote-only",
    pricingPath: "quote",
    pricingState: "custom-quote",
    pricingLabel: minimumCharge > 0 ? `Custom quote from $${minimumCharge}` : "Custom quote required",
    pricingExplanation: "PrintMe reviews this job before final pricing is confirmed.",
    minimumCharge,
    basePrice: 0,
    methodFee: 0,
    serviceFeeTotal: 0,
    adjustments: [],
    quoteReasons,
    businessNotes,
    guardrails,
    paymentPathNote,
    pricingFactors,
    businessRuleSummary: [
      `This product stays in the quote-only path because ${quoteReasons[0]?.toLowerCase() ?? "staff review is required"}.`,
      `Minimum commercial guardrail${minimumCharge > 0 ? ` starts from $${minimumCharge}` : ""}.`,
    ],
    customerSummary: [
      "You are not seeing a final checkout price yet.",
      "PrintMe will review the specs, artwork, and production fit before confirming the quote.",
    ],
    staffSummary: [
      "Manual review is required before pricing can be finalized.",
      "Use the quote path to confirm specs, margin, timing, and production fit.",
    ],
    quantityLabel: undefined,
    turnaroundLabel: undefined,
    canCheckoutDirectly: false,
    requiredReview: true,
  };
}

function getTierRule(rule: ProductPricingRule, selectedOptions: Record<string, string>) {
  if (!rule.quantityTiers) return null;
  const value = selectedOptions[rule.quantityTiers.optionName];
  return rule.quantityTiers.tiers.find((tier) => tier.choiceValue === value) ?? null;
}

function getTurnaroundRule(rule: ProductPricingRule, selectedOptions: Record<string, string>) {
  if (!rule.turnaroundRules) return null;
  const value = selectedOptions[rule.turnaroundRules.optionName];
  return rule.turnaroundRules.choices.find((choice) => choice.choiceValue === value) ?? null;
}

function getExactPriceConfiguration(rule: ProductPricingRule, selectedOptions: Record<string, string>) {
  if (!rule.exactPricing) return null;
  return rule.exactPricing.configurations.find((configuration) => matchCombo(configuration.when, selectedOptions)) ?? null;
}

function buildExactPriceResult(params: {
  product: PrintProduct;
  rule: ProductPricingRule;
  quantity: number;
  orderMethod: ProductOrderMethod;
  exactConfiguration: ExactPriceConfiguration;
  turnaroundRule: TurnaroundRule | null;
  paymentPathNote: string;
  pricingFactors: string[];
  guardrails: string[];
  businessNotes: string[];
}) {
  const adjustments: PricingAdjustmentLine[] = [
    {
      label: params.exactConfiguration.label,
      amount: params.exactConfiguration.total,
      kind: "base",
      note: params.exactConfiguration.note,
    },
  ];
  const pricingState: PriceResult["pricingState"] = "instant-price";
  const summaries = summarizeRuleLines({
    rule: params.rule,
    tierRule: null,
    turnaroundRule: params.turnaroundRule,
    orderMethod: params.orderMethod,
    requiredReview: false,
    pricingState,
    quoteReasons: [],
  });

  return {
    unitPrice: params.exactConfiguration.total,
    estimatedTotal: params.exactConfiguration.total,
    optionPrice: 0,
    quantity: params.quantity,
    pricingMode: "fixed-estimate" as const,
    pricingPath: "instant" as const,
    pricingState,
    pricingLabel: `Exact listed price $${params.exactConfiguration.total.toFixed(2)}`,
    pricingExplanation: "This configuration matches an exact PrintMe standard tier and can move directly into checkout.",
    minimumCharge: params.rule.minimumCharge,
    basePrice: params.exactConfiguration.total,
    methodFee: 0,
    serviceFeeTotal: 0,
    adjustments,
    quoteReasons: [],
    businessNotes: params.businessNotes,
    guardrails: params.guardrails,
    paymentPathNote: params.paymentPathNote,
    pricingFactors: params.pricingFactors,
    businessRuleSummary: [
      ...summaries.businessRuleSummary,
      "This price came from an exact listed tier, not an estimated interpolation.",
    ],
    customerSummary: [
      "This configuration matches PrintMe's standard listed pricing.",
      "The price shown is tied to an exact supported quantity, size, and print-side combination.",
    ],
    staffSummary: summaries.staffSummary,
    quantityLabel: undefined,
    turnaroundLabel: params.turnaroundRule?.label,
    canCheckoutDirectly: params.product.ctaMode !== "contact",
    requiredReview: false,
  };
}

function summarizeRuleLines(params: {
  rule: ProductPricingRule;
  tierRule: QuantityTierRule | null;
  turnaroundRule: TurnaroundRule | null;
  orderMethod: ProductOrderMethod;
  requiredReview: boolean;
  pricingState: PriceResult["pricingState"];
  quoteReasons: string[];
}) {
  const customerSummary = [
    params.pricingState === "instant-price"
      ? "This configuration stays inside PrintMe's standard production rules and can move into checkout."
      : params.pricingState === "estimated-price"
        ? "This configuration shows a structured estimate. Staff may still confirm timing, file fit, or production details."
        : "This configuration needs a custom quote before pricing is finalized.",
    params.tierRule ? `Quantity path: ${params.tierRule.label}.` : "Quantity affects final print value.",
    params.turnaroundRule ? `Turnaround path: ${params.turnaroundRule.label}.` : "Turnaround may affect price and review path.",
  ];

  const staffSummary = [
    `Order method: ${params.orderMethod.replaceAll("-", " ")}.`,
    params.requiredReview
      ? `Staff review is required because ${params.quoteReasons[0]?.toLowerCase() ?? "one or more business rules were triggered"}.`
      : "This configuration currently stays inside the checkout-safe ruleset.",
    params.rule.paymentPathNote,
  ];

  const businessRuleSummary = [
    `Minimum commercial guardrail: $${params.rule.minimumCharge}.`,
    params.tierRule ? `${params.tierRule.label}: ${params.tierRule.note}` : "Quantity tiering is part of the pricing model.",
    params.turnaroundRule ? `${params.turnaroundRule.label}: ${params.turnaroundRule.note}` : "Turnaround selection is part of the pricing model.",
  ];

  return { customerSummary, staffSummary, businessRuleSummary };
}

export function calculateProductPrice(
  product: PrintProduct,
  selectedOptions: Record<string, string>,
  context?: { orderMethod?: ProductOrderMethod },
): PriceResult {
  const quantity = getConfiguredQuantity(product, selectedOptions);
  const usesNumericQuantityChoices = hasExactNumericQuantityChoices(product);
  const rule = getPricingRule(product);
  const orderMethod = inferOrderMethod(selectedOptions, context?.orderMethod);
  const basePrice = product.startingPrice ?? rule.minimumCharge ?? 0;
  const minimumCharge = rule.minimumCharge ?? basePrice;
  const quoteReasons = new Set<string>();
  const guardrails: string[] = [];
  const pricingFactors = rule.pricingFactors;

  if (product.mode === "quote-only" || rule.behavior === "quote") {
    rule.quoteTriggers.forEach((reason) => quoteReasons.add(reason));
    return buildQuoteOnlyResult(product, quantity, minimumCharge, [...quoteReasons], rule.businessNotes, rule.paymentPathNote, guardrails, pricingFactors);
  }

  for (const requiredOption of rule.requiredOptionNames ?? []) {
    if (!selectedOptions[requiredOption]) {
      quoteReasons.add(`Missing required specification: ${requiredOption.replaceAll("-", " ")}.`);
    }
  }

  for (const combo of rule.unsupportedCombinations ?? []) {
    if (matchCombo(combo.when, selectedOptions)) {
      quoteReasons.add(combo.reason);
      guardrails.push(combo.reason);
    }
  }

  const turnaroundRule = getTurnaroundRule(rule, selectedOptions);
  if (turnaroundRule) {
    if (turnaroundRule.forceQuote) {
      quoteReasons.add(turnaroundRule.note);
    }
    if (turnaroundRule.forceEstimate) {
      guardrails.push(turnaroundRule.note);
    }
  }

  if (selectedOptions.artwork === "file-check") {
    guardrails.push("File review may adjust the final production path if artwork needs correction or proof handling.");
  }

  if (selectedOptions.artwork === "design-help") {
    quoteReasons.add("Design support requires staff review before pricing is finalized.");
  }

  const exactPriceConfiguration = getExactPriceConfiguration(rule, selectedOptions);
  if (rule.exactPricing) {
    if (quantity > rule.exactPricing.maxQuantity) {
      const reason = `Quantities above ${rule.exactPricing.maxQuantity} require a custom quote.`;
      quoteReasons.add(reason);
      guardrails.push(reason);
    }

    if (!exactPriceConfiguration) {
      quoteReasons.add(rule.exactPricing.noMatchReason);
    }
  } else if (usesNumericQuantityChoices) {
    quoteReasons.add("This product does not have an exact listed tier for the selected quantity and configuration, so it must move to a custom quote.");
  }

  if (selectedOptions.fulfillment === "delivery" && !rule.exactPricing) {
    guardrails.push("Delivery cost is confirmed separately and is not included in this price.");
  }

  if (quoteReasons.size > 0 && (rule.exactPricing || usesNumericQuantityChoices)) {
    return buildQuoteOnlyResult(product, quantity, minimumCharge, [...quoteReasons], rule.businessNotes, rule.paymentPathNote, guardrails, pricingFactors);
  }

  if (exactPriceConfiguration) {
    return buildExactPriceResult({
      product,
      rule,
      quantity,
      orderMethod,
      exactConfiguration: exactPriceConfiguration,
      turnaroundRule,
      paymentPathNote: rule.paymentPathNote,
      pricingFactors,
      guardrails,
      businessNotes: rule.businessNotes,
    });
  }

  const adjustments: PricingAdjustmentLine[] = [
    {
      label: "Base production setup",
      amount: basePrice,
      kind: "base",
      note: "Starting point for the standard product setup.",
    },
  ];

  let optionPrice = 0;
  for (const option of product.options) {
    const selectedValue = selectedOptions[option.name];
    const selectedChoice = getSelectedChoice(option, selectedValue);

    if (selectedChoice?.priceDelta) {
      optionPrice += selectedChoice.priceDelta;
      adjustments.push({
        label: option.label,
        amount: selectedChoice.priceDelta,
        kind: toAdjustmentKind(option),
        note: selectedChoice.description,
      });
    }

    const matchingRule = rule.optionRules?.find((item) => item.optionName === option.name && item.choiceValue === selectedValue);
    if (matchingRule?.amount) {
      optionPrice += matchingRule.amount;
      adjustments.push({
        label: `${option.label} rule`,
        amount: matchingRule.amount,
        kind: toAdjustmentKind(option),
        note: matchingRule.note,
      });
    }

    if (matchingRule?.forceQuote) {
      quoteReasons.add(matchingRule.note);
    }
  }

  const tierRule = getTierRule(rule, selectedOptions);
  if (tierRule) {
    addAdjustment(adjustments, tierRule.label, tierRule.amount, "quantity", tierRule.note);
    optionPrice += tierRule.amount;
    if (tierRule.forceQuote) {
      quoteReasons.add(tierRule.note);
    }
  }

  if (turnaroundRule) {
    addAdjustment(adjustments, turnaroundRule.label, turnaroundRule.amount, "turnaround", turnaroundRule.note);
    optionPrice += turnaroundRule.amount;
  }

  const methodFeeRule = rule.methodFees[orderMethod];
  const methodFee = methodFeeRule?.amount ?? 0;
  if (methodFee > 0) {
    adjustments.push({
      label: methodFeeRule?.label ?? "Order method service fee",
      amount: methodFee,
      kind: "service",
      note: methodFeeRule?.note,
    });
  }

  if (rule.maxInstantQuantity && quantity > rule.maxInstantQuantity) {
    quoteReasons.add(`Quantity above ${rule.maxInstantQuantity} requires staff review before final pricing is confirmed.`);
  }

  const subtotal = basePrice + optionPrice + methodFee;
  const estimatedTotal = Math.max(minimumCharge, subtotal);

  if (estimatedTotal === minimumCharge && subtotal < minimumCharge) {
    adjustments.push({
      label: "Minimum charge guardrail",
      amount: minimumCharge - subtotal,
      kind: "guardrail",
      note: "Protects minimum production value on low-spec configurations.",
    });
  }

  const requiredReview = quoteReasons.size > 0;
  const forcedEstimate = Boolean(turnaroundRule?.forceEstimate) && !requiredReview;
  const pricingState =
    requiredReview
      ? "custom-quote"
      : rule.behavior === "instant" && !forcedEstimate
        ? "instant-price"
        : "estimated-price";

  const pricingPath =
    pricingState === "instant-price"
      ? "instant"
      : pricingState === "estimated-price"
        ? "estimate"
        : "quote";

  const pricingMode =
    pricingState === "custom-quote"
      ? "quote-only"
      : pricingState === "instant-price"
        ? "fixed-estimate"
        : "starting-from";

  const pricingLabel =
    pricingState === "instant-price"
      ? `Instant price $${estimatedTotal.toFixed(2)}`
      : pricingState === "estimated-price"
        ? `Estimated price from $${estimatedTotal.toFixed(2)}`
        : `Custom quote from $${minimumCharge}`;

  const pricingExplanation =
    pricingState === "instant-price"
      ? "This configuration stays inside PrintMe's standard production rules and can move into checkout."
      : pricingState === "estimated-price"
        ? "This is a structured estimate. Staff may still confirm production fit, rush timing, or artwork handling."
        : "This job needs a structured quote because one or more business rules require staff review.";

  const summaries = summarizeRuleLines({
    rule,
    tierRule,
    turnaroundRule,
    orderMethod,
    requiredReview,
    pricingState,
    quoteReasons: [...quoteReasons],
  });

  return {
    unitPrice: estimatedTotal,
    estimatedTotal,
    optionPrice,
    quantity,
    pricingMode,
    pricingPath,
    pricingState,
    pricingLabel,
    pricingExplanation,
    minimumCharge,
    basePrice,
    methodFee,
    serviceFeeTotal: methodFee,
    adjustments,
    quoteReasons: [...quoteReasons.size ? quoteReasons : rule.behavior === "estimate" ? rule.quoteTriggers : []],
    businessNotes: rule.businessNotes,
    guardrails,
    paymentPathNote: rule.paymentPathNote,
    pricingFactors,
    businessRuleSummary: summaries.businessRuleSummary,
    customerSummary: summaries.customerSummary,
    staffSummary: summaries.staffSummary,
    quantityLabel: tierRule?.label,
    turnaroundLabel: turnaroundRule?.label,
    canCheckoutDirectly: pricingState !== "custom-quote" && product.ctaMode !== "contact",
    requiredReview,
  };
}

export function buildOptionLabels(product: PrintProduct, selectedOptions: Record<string, string>) {
  return product.options
    .filter((option) => selectedOptions[option.name])
    .map((option) => ({
      label: option.label,
      value: getDisplayValue(option, selectedOptions[option.name]),
    }));
}

export function getPricingPathLabelFromEvaluation(price: PriceResult) {
  return getPricingPathLabel(price.pricingState);
}
