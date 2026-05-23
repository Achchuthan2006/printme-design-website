import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-controls";
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
      <PageHero title="Check where your print job stands" description="Use your order or quote details to review progress, or contact PrintMe directly when timing is urgent." />
      <section className="section-space bg-canvas">
        <div className="container-shell max-w-2xl">
          <form className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
            <Field label="Order or quote number">
              <Input placeholder="Example: PM-10042" aria-describedby="order-status-help" />
            </Field>
            <Field label="Email address" className="mt-5">
              <Input type="email" placeholder="you@example.com" />
            </Field>
            <Button type="button" className="mt-6 w-full">Check My Status</Button>
            <p id="order-status-help" className="mt-4 rounded-2xl border border-brand/15 bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
              For urgent timing, call PrintMe directly. Account-based tracking is structured for quotes, orders, files, and future production updates.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
