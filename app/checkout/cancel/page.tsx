import { CheckoutResult } from "@/components/commerce/checkout-result";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; mode?: "full" | "deposit" | "review" }>;
}) {
  const params = await searchParams;

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-3xl">
        <CheckoutResult status="cancel" orderNumber={params.order} paymentMode={params.mode} />
      </div>
    </section>
  );
}
