import { CheckoutPanel } from "@/components/commerce/checkout-panel";
import { ContextualHelpPanel } from "@/components/support/contextual-help-panel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Checkout for PrintMe online print orders.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell space-y-8">
        <CheckoutPanel />
        <ContextualHelpPanel context="checkout" title="Checkout help without leaving the order path" />
      </div>
    </section>
  );
}
