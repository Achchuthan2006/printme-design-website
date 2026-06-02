import { CheckoutResult } from "@/components/commerce/checkout-result";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string; review?: string; mode?: "full" | "deposit" | "review"; balance?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell max-w-3xl">
        <CheckoutResult status="success" orderNumber={params.order} demo={params.demo === "1" || params.review === "1"} paymentMode={params.mode} balanceDue={params.balance ? `$${(Number(params.balance) / 100).toFixed(2)}` : undefined} />
      </div>
    </section>
  );
}
