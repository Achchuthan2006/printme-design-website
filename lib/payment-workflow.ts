import { CartItem, CheckoutPaymentMode, PaymentPlanSummary } from "@/types";

function cents(amount: number) {
  return Math.round(amount * 100);
}

export function formatPaymentPlanCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(value / 100);
}

export function getCheckoutPaymentModeLabel(mode: CheckoutPaymentMode) {
  if (mode === "deposit") return "Deposit checkout";
  if (mode === "review") return "Review before payment";
  return "Secure checkout";
}

export function getPaymentCollectionPathLabel(path: PaymentPlanSummary["collectionPath"]) {
  return path.replaceAll("_", " ");
}

export function evaluateCartPaymentPlan(items: CartItem[], requestedMode: CheckoutPaymentMode = "full"): PaymentPlanSummary {
  const includesQuoteReviewItems = items.some((item) => item.quoteOnly || item.pricingState === "custom-quote");
  const payableSubtotal = items
    .filter((item) => !item.quoteOnly)
    .reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0);

  const subtotalCents = cents(items.reduce((total, item) => total + (item.estimatedTotal || item.unitPrice) * item.quantity, 0));
  const payableCents = cents(payableSubtotal);
  const depositRequired = requestedMode === "deposit" && payableCents > 0;
  const dueNowCents = requestedMode === "review" ? 0 : requestedMode === "deposit" ? Math.round(payableCents * 0.5) : payableCents;
  const dueLaterCents = requestedMode === "deposit" ? payableCents - dueNowCents : 0;
  const checkoutMode: CheckoutPaymentMode =
    requestedMode === "review" || payableCents === 0 ? "review" : requestedMode === "deposit" ? "deposit" : "full";

  return {
    checkoutMode,
    collectionPath:
      checkoutMode === "review"
        ? includesQuoteReviewItems
          ? "quote_approval_then_payment"
          : "review_then_invoice"
        : checkoutMode === "deposit"
          ? "deposit_checkout"
          : includesQuoteReviewItems
            ? "mixed_checkout_and_quote"
            : "instant_checkout",
    readinessState:
      checkoutMode === "review"
        ? "review_required"
        : checkoutMode === "deposit"
          ? "deposit_pending"
          : dueNowCents > 0
            ? "payment_pending"
            : "review_required",
    paymentHeadline:
      checkoutMode === "review"
        ? "Send the order for staff review before payment."
        : checkoutMode === "deposit"
          ? "Pay a deposit now and settle the balance later."
          : "Pay online now for the direct-order portion of this cart.",
    paymentCtaLabel:
      checkoutMode === "review"
        ? "Send for Review"
        : checkoutMode === "deposit"
          ? "Pay Deposit"
          : "Go to Secure Checkout",
    dueNowCents,
    dueLaterCents,
    subtotalCents,
    depositRate: checkoutMode === "deposit" ? 0.5 : 1,
    depositRequired,
    invoiceEligible: checkoutMode === "review",
    allowsDirectCheckout: checkoutMode !== "review",
    includesQuoteReviewItems,
    requiresQuoteApproval: includesQuoteReviewItems,
    requiresProofApproval: items.some((item) => item.fulfillmentMethod === "proof"),
    acceptedMethods: ["Visa", "Mastercard", "Amex"],
    blocksProductionUntil: [
      "Artwork readiness is confirmed",
      "Payment or deposit requirements are satisfied",
      "Any required proof approvals are recorded",
    ],
    customerNotes: [
      checkoutMode === "review"
        ? "PrintMe will confirm the next billing step after review."
        : checkoutMode === "deposit"
          ? "A remaining balance may still be due before pickup or delivery."
          : "PrintMe still confirms file readiness and fulfillment details before release.",
    ],
    staffNotes: [
      includesQuoteReviewItems ? "Cart includes quote-review items." : "Cart stays inside direct-order checkout rules.",
    ],
  };
}

export function buildRecordedPaymentSummary({
  subtotalCents,
  payableCents,
  paymentMode,
  paymentStatus,
  quoteReviewRequired,
}: {
  subtotalCents: number;
  payableCents: number;
  paymentMode: CheckoutPaymentMode;
  paymentStatus: string;
  quoteReviewRequired: boolean;
}) {
  const summary = evaluateCartPaymentPlan(
    [
      {
        id: "recorded-payment",
        productSlug: "recorded-payment",
        title: "Recorded payment",
        quantity: 1,
        unitPrice: payableCents / 100,
        estimatedTotal: payableCents / 100,
        pricingMode: quoteReviewRequired ? "quote-only" : "fixed-estimate",
        mode: quoteReviewRequired ? "quote-only" : "direct-order",
        options: {},
        optionLabels: [],
        quoteOnly: quoteReviewRequired,
      },
    ],
    paymentMode,
  );

  if (paymentStatus === "paid") {
    return {
      ...summary,
      readinessState: "paid_in_full" as const,
      dueNowCents: subtotalCents,
      dueLaterCents: 0,
      paymentHeadline: "Paid in full",
    };
  }

  if (paymentStatus === "deposit_paid") {
    return {
      ...summary,
      readinessState: "balance_due" as const,
      dueNowCents: Math.round(subtotalCents * 0.5),
      dueLaterCents: subtotalCents - Math.round(subtotalCents * 0.5),
      paymentHeadline: "Deposit received / balance due later",
    };
  }

  return summary;
}
