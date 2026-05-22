import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { demoInvoices } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Account Invoices", description: "Review and download PrintMe invoice records.", path: "/account/invoices" });

export default function AccountInvoicesPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Invoices</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Invoice history</h1>
            {demoInvoices.length === 0 ? (
              <div className="mt-6"><EmptyState title="No invoices yet" description="Invoices will appear here as your online order and payment history grows." ctaLabel="Review Orders" ctaHref="/account/orders" /></div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-lg border border-line">
                {demoInvoices.map((invoice) => (
                  <article key={invoice.id} className="grid gap-3 border-t border-line px-4 py-4 first:border-t-0 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center">
                    <p className="font-black text-ink">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-slate">{invoice.orderNumber}</p>
                    <p className="text-sm text-slate">{invoice.date}</p>
                    <StatusBadge status={invoice.status} />
                    <button className="text-sm font-bold text-brand">Download</button>
                  </article>
                ))}
              </div>
            )}
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
