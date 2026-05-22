import { PageHero } from "@/components/ui/page-hero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Payment Information",
  description: "Payment, deposit, invoice, and Stripe checkout information for PrintMe orders.",
  path: "/payment-info",
});

export default function PaymentInfoPage() {
  return (
    <>
      <PageHero title="Payment information" description="PrintMe is prepared for online payment, deposits, full payment, invoices, and payment confirmations." />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          {["Stripe checkout", "Deposit payments", "Invoice downloads"].map((item) => (
            <article key={item} className="rounded-lg border border-line bg-white p-6 shadow-soft">
              <h2 className="text-xl font-black text-ink">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-slate">Integration scaffold is ready for production payment rules and admin review.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
