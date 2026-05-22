import Link from "next/link";
import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminQuotes, quoteStatusLabels } from "@/data/admin";

export default function AdminQuotesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quote queue"
        description="Review incoming print requests, confirm missing details, attach internal notes, and prepare quote-to-order conversion later."
        actionLabel="Review Uploads"
        actionHref="/admin/uploads"
      />
      <AdminFilterBar>
        {["All", "New", "Reviewing", "Waiting for Files", "Quoted", "Approved"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["Quote", "Customer", "Service", "Quantity", "Deadline", "Status", "Follow-up", "Action"]}
        rows={adminQuotes.map((quote) => [
          <div key="quote">
            <Link href={`/admin/quotes/${quote.id}`} className="text-brand hover:text-brand-dark">{quote.quoteNumber}</Link>
            <p className="mt-1 text-xs text-slate">{quote.createdAt}</p>
          </div>,
          <div key="customer">
            <p>{quote.customerName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{quote.customerEmail}</p>
          </div>,
          <span key="service">{quote.service}</span>,
          <span key="quantity">{quote.quantity}</span>,
          <span key="deadline">{quote.deadline}</span>,
          <AdminStatusBadge key="status" status={quote.status} label={quoteStatusLabels[quote.status]} />,
          <span key="follow">{quote.followUp}</span>,
          <Link key="action" href={`/admin/quotes/${quote.id}`} className="font-black text-brand hover:text-brand-dark">Open</Link>,
        ])}
      />
    </div>
  );
}
