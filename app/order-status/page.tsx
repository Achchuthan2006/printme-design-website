import { OrderStatusExperience } from "@/components/support/order-status-experience";
import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Order Status",
  description: "Check the status of a PrintMe order or quote.",
  path: "/order-status",
});

export default function OrderStatusPage() {
  return (
    <>
      <PageHero
        title="Check where your print job stands"
        description="Use your order or quote details to review progress, see the likely next step, and know when to contact PrintMe directly."
        ctaLabel="Call PrintMe"
        ctaHref="tel:+14165721999"
        highlights={["Order and quote lookup", "Progress guidance", "Fast escalation for urgent timing"]}
      />
      <section className="section-space bg-canvas">
        <OrderStatusExperience />
      </section>
    </>
  );
}
