import { CheckoutPanel } from "@/components/commerce/checkout-panel";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Checkout for PrintMe online print orders.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <CheckoutPanel />
      </div>
    </section>
  );
}
