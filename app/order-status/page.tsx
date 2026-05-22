import { Button } from "@/components/ui/button";
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
      <PageHero title="Check order status" description="Enter order or quote details to check progress once order tracking is connected." />
      <section className="section-space bg-canvas">
        <div className="container-shell max-w-2xl">
          <form className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">Order or quote number</span>
              <input className="w-full rounded-lg border border-line px-4 py-3 text-sm" placeholder="Example: PM-10042" />
            </label>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-ink">Email address</span>
              <input className="w-full rounded-lg border border-line px-4 py-3 text-sm" placeholder="you@example.com" />
            </label>
            <Button type="button" className="mt-6 w-full">Check Status</Button>
          </form>
        </div>
      </section>
    </>
  );
}
