import { PageHero } from "@/components/ui/page-hero";

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" description="Terms placeholder for orders, quotes, artwork, approvals, payment, pickup, delivery, and reprints." />
      <section className="section-space bg-canvas">
        <div className="container-shell max-w-3xl rounded-lg border border-line bg-white p-6 text-sm leading-7 text-slate shadow-soft">
          <p>TODO: Add legal-approved terms for online ordering, quote approvals, file responsibility, colour variation, refunds, and delivery.</p>
        </div>
      </section>
    </>
  );
}
