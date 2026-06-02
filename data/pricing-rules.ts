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

export const pricingRules: Record<string, ProductPricingRule> = {
  "business-cards": {
    ...defaultPricingRule,
    behavior: "instant",
    minimumCharge: 39,
    quoteTriggers: ["Business card setup may need review if artwork or finish is outside the standard path."],
    maxInstantQuantity: 5000,
  },
  flyers: {
    ...defaultPricingRule,
    behavior: "instant",
    minimumCharge: 49,
    maxInstantQuantity: 5000,
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
