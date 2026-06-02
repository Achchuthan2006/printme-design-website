import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Payment Information",
  description: "Payment, deposit, invoice, and Stripe checkout information for PrintMe orders.",
  path: "/payment-info",
});

export default function PaymentInfoPage() {
  return (
    <>
      <PageHero title="Pay securely at the right stage of the print workflow" description="PrintMe supports full checkout, deposits, and invoice-style payment requests depending on the job, proofing path, and production risk." />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-ink">Secure checkout</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Standard direct-order products can move through Stripe Checkout for secure card payment. PrintMe still reviews files, fulfillment, and production fit before print begins.</p>
          </article>
          <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-ink">Deposits and balance due</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Rush, design-led, large-format, or estimate-sensitive work may use a deposit first, with the balance collected before pickup, delivery, or production release.</p>
          </article>
          <article className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <h2 className="text-xl font-black text-ink">Quotes and invoice requests</h2>
            <p className="mt-3 text-sm leading-7 text-slate">Custom, quote-first, or proof-sensitive jobs may be reviewed first, then moved into a deposit request, full invoice, or payment link once scope is confirmed.</p>
          </article>
        </div>
        <div className="container-shell mt-6 max-w-3xl rounded-2xl border border-line/90 bg-white p-6 text-sm leading-7 text-slate shadow-soft">
          <p>Payment timing depends on the job path. Standard online-payable items can move straight into checkout. Deposit jobs, quote-approved jobs, and invoice-driven projects are held until the right billing step is complete.</p>
          <p className="mt-4">No job moves into production until the required payment step, quote approval, proof approval, and file review conditions are satisfied. If a payment fails, expires, or needs follow-up, PrintMe reviews the order state before promising production timing.</p>
          <p className="mt-4">For billing questions, invoice updates, or alternate arrangements on approved business accounts, contact {siteConfig.email} or call {siteConfig.phone}.</p>
        </div>
      </section>
    </>
  );
}
