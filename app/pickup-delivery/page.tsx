import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Pickup and Delivery",
  description: "Learn about PrintMe pickup and local delivery options in Scarborough, Toronto, and the GTA.",
  path: "/pickup-delivery",
});

export default function PickupDeliveryPage() {
  return (
    <>
      <PageHero title="Pickup and local delivery" description="Choose convenient in-store pickup or ask about local delivery for qualifying print orders." />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-5 md:grid-cols-2">
          <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-black text-ink">In-store pickup</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Pick up completed orders at {siteConfig.address}. We will confirm readiness before pickup.</p>
          </article>
          <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-black text-ink">Local delivery</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Delivery options can be reviewed for Scarborough, Toronto, and surrounding areas based on order size and timing.</p>
          </article>
        </div>
        <div className="container-shell mt-6 max-w-3xl rounded-2xl border border-line/90 bg-white p-6 text-sm leading-7 text-slate shadow-soft">
          <p>Pickup and delivery timing are confirmed only after artwork, production readiness, and final order details are checked. Rush-sensitive jobs should be confirmed with PrintMe directly before you depend on a specific handoff time.</p>
          <p className="mt-4">For pickup questions, delivery fit, or deadline-sensitive coordination, contact {siteConfig.email} or call {siteConfig.phone}.</p>
        </div>
      </section>
    </>
  );
}
