import { CartView } from "@/components/commerce/cart-view";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Cart",
  description: "Review your PrintMe cart and continue to checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <CartView />
      </div>
    </section>
  );
}
