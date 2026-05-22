import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "PrintMe Design terms for quote requests, online orders, artwork review, approvals, payment, pickup, delivery, and reprints.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" description="Important terms for quotes, artwork review, online ordering, pickup, delivery, and production." />
      <section className="section-space bg-canvas">
        <div className="container-shell max-w-3xl rounded-2xl border border-line/90 bg-white p-6 text-sm leading-7 text-slate shadow-soft">
          <p>
            Quotes and online estimates are based on the details provided by the customer, including quantity, size, finish, artwork readiness, and turnaround requirements.
          </p>
          <p className="mt-4">
            Production begins after order details, artwork, payment requirements, and timing are confirmed. Customers are responsible for reviewing spelling, layout, contact details, and final approval before printing.
          </p>
          <p className="mt-4">
            Colour may vary slightly between screens and printed materials. Pickup and delivery timing depends on artwork readiness, production requirements, and local availability.
          </p>
          <p className="mt-4">
            For questions about an order, quote, artwork file, or reprint concern, contact {siteConfig.email} or call {siteConfig.phone}.
          </p>
          <p className="mt-4 text-xs font-bold text-slate">
            This page is a practical launch-ready summary and should be reviewed by a legal professional before final publication.
          </p>
        </div>
      </section>
    </>
  );
}
