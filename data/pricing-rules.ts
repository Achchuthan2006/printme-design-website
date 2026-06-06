import { ProductOrderMethod } from "@/types";

export interface QuantityTierRule {
  choiceValue: string;
  label: string;
  amount: number;
  note: string;
  forceQuote?: boolean;
}

export interface TurnaroundRule {
  choiceValue: string;
  label: string;
  amount: number;
  note: string;
  forceQuote?: boolean;
  forceEstimate?: boolean;
}

export interface ExactPriceConfiguration {
  when: Record<string, string>;
  total: number;
  label: string;
  note: string;
}

export interface ProductPricingRule {
  behavior: "instant" | "estimate" | "quote";
  minimumCharge: number;
  paymentPathNote: string;
  pricingFactors: string[];
  businessNotes: string[];
  quoteTriggers: string[];
  requiredOptionNames?: string[];
  unsupportedCombinations?: Array<{
    when: Record<string, string>;
    reason: string;
  }>;
  optionRules?: Array<{
    optionName: string;
    choiceValue: string;
    amount?: number;
    note: string;
    forceQuote?: boolean;
  }>;
  quantityTiers?: {
    optionName: string;
    tiers: QuantityTierRule[];
  };
  turnaroundRules?: {
    optionName: string;
    choices: TurnaroundRule[];
  };
  exactPricing?: {
    maxQuantity: number;
    noMatchReason: string;
    configurations: ExactPriceConfiguration[];
  };
  methodFees: Partial<Record<ProductOrderMethod, { amount: number; label: string; note: string }>>;
  maxInstantQuantity?: number;
}

export const defaultPricingRule: ProductPricingRule = {
  behavior: "estimate",
  minimumCharge: 25,
  paymentPathNote: "PrintMe may confirm files, timing, or fulfillment before production begins.",
  pricingFactors: ["Quantity", "Material", "Turnaround", "Artwork readiness"],
  businessNotes: ["Structured estimate backed by staff review when needed."],
  quoteTriggers: ["Final pricing may need staff review for custom specs or file conditions."],
  methodFees: {
    "request-custom-design": {
      amount: 25,
      label: "Design intake fee",
      note: "Covers additional design-side coordination before production.",
    },
  },
  turnaroundRules: {
    optionName: "turnaround",
    choices: [
      { choiceValue: "standard", label: "Standard turnaround", amount: 0, note: "Base production timing." },
      { choiceValue: "rush", label: "Rush turnaround", amount: 20, note: "Rush jobs may still need staff confirmation.", forceEstimate: true },
      { choiceValue: "same-day", label: "Same-day review", amount: 35, note: "Same-day jobs require staff approval.", forceQuote: true },
    ],
  },
};

const standardArtworkStatuses = ["print-ready", "file-check"] as const;

function createFlyerExactConfigurations(
  sizeValue: "half-letter" | "letter",
  sizeLabel: string,
  prices: Array<{
    quantity: "50" | "100" | "250" | "500" | "1000";
    oneSide: number;
    twoSide: number;
  }>,
): ExactPriceConfiguration[] {
  return prices.flatMap(({ quantity, oneSide, twoSide }) =>
    standardArtworkStatuses.flatMap((artwork) => [
      {
        when: {
          quantity,
          size: sizeValue,
          sides: "single",
          turnaround: "standard",
          fulfillment: "pickup",
          artwork,
        },
        total: oneSide,
        label: `${sizeLabel} - ${quantity} - One Side`,
        note: `Exact listed flyer tier for ${sizeLabel}, quantity ${quantity}, one side.`,
      },
      {
        when: {
          quantity,
          size: sizeValue,
          sides: "double",
          turnaround: "standard",
          fulfillment: "pickup",
          artwork,
        },
        total: twoSide,
        label: `${sizeLabel} - ${quantity} - Two Side`,
        note: `Exact listed flyer tier for ${sizeLabel}, quantity ${quantity}, two side.`,
      },
    ]),
  );
}

const flyerExactConfigurations: ExactPriceConfiguration[] = [
  ...createFlyerExactConfigurations("half-letter", "5.5 x 8.5", [
    { quantity: "50", oneSide: 50, twoSide: 60 },
    { quantity: "100", oneSide: 70, twoSide: 85 },
    { quantity: "250", oneSide: 105, twoSide: 120 },
    { quantity: "500", oneSide: 135, twoSide: 145 },
    { quantity: "1000", oneSide: 195, twoSide: 215 },
  ]),
  ...createFlyerExactConfigurations("letter", "8.5 x 11", [
    { quantity: "50", oneSide: 65, twoSide: 75 },
    { quantity: "100", oneSide: 80, twoSide: 95 },
    { quantity: "250", oneSide: 120, twoSide: 175 },
    { quantity: "500", oneSide: 185, twoSide: 235 },
    { quantity: "1000", oneSide: 255, twoSide: 295 },
  ]),
];

export const pricingRules: Record<string, ProductPricingRule> = {
  "business-cards": {
    ...defaultPricingRule,
    behavior: "quote",
    minimumCharge: 30,
    quoteTriggers: [
      "Business cards currently require a custom quote because the storefront options do not yet map exactly to the printed standard tier sheet.",
    ],
  },
  flyers: {
    ...defaultPricingRule,
    behavior: "instant",
    minimumCharge: 30,
    quoteTriggers: ["Unlisted flyer sizes, rush jobs, delivery, design support, and non-standard quantities require a custom quote."],
    exactPricing: {
      maxQuantity: 1000,
      noMatchReason: "This flyer configuration is not on PrintMe's exact standard price list, so it must move to a custom quote.",
      configurations: flyerExactConfigurations,
    },
    maxInstantQuantity: 1000,
  },
  "document-printing": {
    ...defaultPricingRule,
    behavior: "instant",
    minimumCharge: 15,
  },
  banners: {
    ...defaultPricingRule,
    behavior: "quote",
    minimumCharge: 89,
    quoteTriggers: ["Banner sizing, finishing, and material fit need staff review."],
  },
  signs: {
    ...defaultPricingRule,
    behavior: "quote",
    minimumCharge: 95,
    quoteTriggers: ["Sign material and mounting require staff review."],
  },
  stickers: {
    ...defaultPricingRule,
    behavior: "quote",
    minimumCharge: 45,
    quoteTriggers: ["Sticker shape, cut, and material choices require quote review."],
  },
  "custom-orders": {
    ...defaultPricingRule,
    behavior: "quote",
    minimumCharge: 50,
    quoteTriggers: ["Custom jobs require staff review before pricing is finalized."],
  },
};
