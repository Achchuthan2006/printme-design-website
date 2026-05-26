import { AdminCard } from "@/components/admin/admin-card";
import { AdminQuotesOpsView } from "@/components/admin/admin-quotes-ops-view";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminQuotes } from "@/data/admin";

export default function AdminQuotesPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quote queue"
        description="Review incoming print requests, confirm missing details, attach internal notes, and prepare quote-to-order conversion later."
        actionLabel="Review Uploads"
        actionHref="/admin/uploads"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Open queue</p><p className="mt-2 text-4xl font-black text-ink">{adminQuotes.length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Waiting for files</p><p className="mt-2 text-4xl font-black text-ink">{adminQuotes.filter((quote) => quote.status === "waiting_for_files").length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Ready to send</p><p className="mt-2 text-4xl font-black text-ink">{adminQuotes.filter((quote) => quote.status === "quoted").length}</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">High priority</p><p className="mt-2 text-4xl font-black text-ink">{adminQuotes.filter((quote) => quote.priority === "high" || quote.priority === "urgent").length}</p></AdminCard>
      </div>
      <AdminQuotesOpsView quotes={adminQuotes} />
    </div>
  );
}
