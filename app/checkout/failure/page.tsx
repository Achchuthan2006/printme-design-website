import { CheckoutResult } from "@/components/commerce/checkout-result";

export default function CheckoutFailurePage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-3xl">
        <CheckoutResult status="failure" />
      </div>
    </section>
  );
}
