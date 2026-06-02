import { EmptyState } from "@/components/account/empty-state";
import { AccountSupportHub } from "@/components/account/account-support-hub";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { demoInvoices } from "@/data/account";
import { isSupabaseConfigured } from "@/lib/env";
import { buildMetadata } from "@/lib/metadata";
import { SummaryStrip } from "@/components/platform/summary-strip";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({ title: "Account Invoices", description: "Review and download PrintMe invoice records.", path: "/account/invoices" });

export default function AccountInvoicesPage() {
  const previewMode = !isSupabaseConfigured();
  const invoices = previewMode ? demoInvoices : [];
  const invoiceSummary = [
    { label: "Total invoices", value: String(invoices.length), detail: "Billing records tied to orders as the platform grows." },
    { label: "Paid", value: String(invoices.filter((invoice) => invoice.status === "paid").length), detail: "Invoices already completed successfully." },
    { label: "Open", value: String(invoices.filter((invoice) => invoice.status === "unpaid" || invoice.status === "deposit_pending" || invoice.status === "partially_paid").length), detail: "Invoices that may still need payment follow-up." },
    { label: "Download-ready", value: String(invoices.length), detail: "Records prepared for future PDF and statement workflows." },
  ];

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Invoices</p>
                <h1 className="mt-2 text-3xl font-black text-ink">Invoice history</h1>
              </div>
              <Button href="/support" variant="secondary">Billing Help</Button>
            </div>
            <SummaryStrip items={invoiceSummary} className="mt-6" />
            {invoices.length === 0 ? (
              <div className="mt-6"><EmptyState title={previewMode ? "No invoices yet" : "No live invoices yet"} description={previewMode ? "Invoices will appear here as your online order and payment history grows." : "Live invoice records will appear here once billing is tied to an order for this customer."} ctaLabel="Review Orders" ctaHref="/account/orders" /></div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-lg border border-line">
                {invoices.map((invoice) => (
                  <article key={invoice.id} className="grid gap-3 border-t border-line px-4 py-4 first:border-t-0 md:grid-cols-[1.15fr_1fr_1fr_1fr_auto] md:items-center">
                    <div>
                      <p className="font-black text-ink">{invoice.invoiceNumber}</p>
                      <p className="mt-1 text-xs leading-5 text-slate">{invoice.paymentStageLabel ?? invoice.dueLabel}</p>
                    </div>
                    <p className="text-sm text-slate">{invoice.orderNumber}</p>
                    <p className="text-sm text-slate">{invoice.date}</p>
                    <div className="flex flex-col gap-2">
                      <StatusBadge status={invoice.status} />
                      <p className="text-sm font-bold text-ink">{invoice.amount}</p>
                      {invoice.amountDue ? <p className="text-xs leading-5 text-slate">Still due: {invoice.amountDue}</p> : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="text-sm font-bold text-brand">Download</button>
                      {invoice.payNowHref ? <Button href={invoice.payNowHref} variant="secondary" className="px-3 py-2 text-xs">Pay now</Button> : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
            <div className="mt-6">
              <AccountSupportHub
                title="Billing and invoice help"
                description="Use this area when an invoice needs clarification, payment follow-up, or an updated billing contact before a repeat order moves ahead."
                shortcuts={[
                  { title: "Ask about invoice balance", detail: "Best when an order is waiting on payment or you need billing confirmation.", href: "/support", cta: "Billing Help", icon: "card" },
                  { title: "Review order tied to invoice", detail: "Open the order area if you need to confirm what the invoice covers.", href: "/account/orders", cta: "Review Orders", icon: "bag" },
                  { title: "Update saved account details", detail: "Keep billing and contact information current for faster repeat work.", href: "/account/settings", cta: "Account Settings", icon: "check" },
                ]}
              />
            </div>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
