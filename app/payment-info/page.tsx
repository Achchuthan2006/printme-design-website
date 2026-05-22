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
      <PageHero title="Pay securely when your print order is ready" description="Online-payable items can move through secure checkout, while custom jobs can be reviewed by PrintMe before payment is confirmed." />
      <section className="section-space bg-canvas">
        <div className="container-shell grid gap-5 md:grid-cols-3">
          {["Secure checkout", "Deposit-ready workflows", "Invoice records"].map((item) => (
            <article key={item} className="rounded-lg border border-line bg-white p-6 shadow-soft">
              <h2 className="text-xl font-black text-ink">{item}</h2>
              <p className="mt-3 text-sm leading-7 text-slate">PrintMe can support clear payment steps for online orders, reviewed custom jobs, and future account invoice access.</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
