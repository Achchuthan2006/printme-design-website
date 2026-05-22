import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { adminMessages } from "@/data/admin";

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages and follow-ups"
        description="Keep contact submissions, quote questions, checkout issues, and support requests visible so staff can respond quickly."
        actionLabel="Review Quotes"
        actionHref="/admin/quotes"
      />
      <AdminFilterBar>
        {["All", "Open", "Waiting", "Resolved", "High priority"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["Customer", "Subject", "Channel", "Priority", "Status", "Received", "Summary"]}
        rows={adminMessages.map((message) => [
          <span key="customer">{message.customerName}</span>,
          <span key="subject">{message.subject}</span>,
          <AdminStatusBadge key="channel" status="normal" label={message.channel} />,
          <AdminStatusBadge key="priority" status={message.priority} />,
          <AdminStatusBadge key="status" status={message.status} />,
          <span key="received">{message.receivedAt}</span>,
          <span key="summary" className="max-w-xs text-slate">{message.summary}</span>,
        ])}
      />
    </div>
  );
}
