import { CheckoutResult } from "@/components/commerce/checkout-result";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string; review?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-3xl">
        <CheckoutResult status="success" orderNumber={params.order} demo={params.demo === "1" || params.review === "1"} />
      </div>
    </section>
  );
}
