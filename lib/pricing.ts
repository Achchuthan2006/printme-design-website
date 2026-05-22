import { PrintProduct, ProductOption } from "@/types";

export interface PriceResult {
  unitPrice: number;
  estimatedTotal: number;
  pricingMode: "fixed-estimate" | "starting-from" | "quote-only";
  optionPrice: number;
  quantity: number;
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

export function calculateProductPrice(product: PrintProduct, selectedOptions: Record<string, string>): PriceResult {
  const quantity = getConfiguredQuantity(product, selectedOptions);
  const optionPrice = product.options.reduce((total, option) => {
    const selected = getSelectedChoice(option, selectedOptions[option.name]);
    return total + (selected?.priceDelta ?? 0);
  }, 0);

  if (product.mode === "quote-only" || !product.startingPrice) {
    return {
      unitPrice: 0,
      estimatedTotal: 0,
      optionPrice,
      quantity,
      pricingMode: "quote-only",
    };
  }

  const unitPrice = product.startingPrice + optionPrice;

  // TODO: replace with production pricing tables for breakpoints, paper costs, finishes, taxes, delivery, and artwork setup.
  return {
    unitPrice,
    estimatedTotal: unitPrice,
    optionPrice,
    quantity,
    pricingMode: product.mode === "direct-order" ? "fixed-estimate" : "starting-from",
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
