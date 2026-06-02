import { AdminCard } from "@/components/admin/admin-card";
import { AdminPricingEstimator } from "@/components/admin/admin-pricing-estimator";
import { AdminQuotesOpsView } from "@/components/admin/admin-quotes-ops-view";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminOperationsWorkspace } from "@/lib/backend/admin-operations";

export default async function AdminQuotesPage() {
  const workspace = await getAdminOperationsWorkspace();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quote queue"
        description="Review incoming print requests, test structured pricing rules, confirm missing details, and move approved quotes toward deposit, invoice, or clean job conversion."
        actionLabel="Review Uploads"
        actionHref="/admin/uploads"
      />
      <div className="grid gap-4 md:grid-cols-4">
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Open queue</p><p className="mt-2 text-4xl font-black text-ink">{workspace.quotes.length}</p><p className="mt-2 text-sm text-slate">Live quote tickets ready for scoping, pricing, and conversion.</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Waiting for files</p><p className="mt-2 text-4xl font-black text-ink">{workspace.quotes.filter((quote) => quote.status === "waiting_for_files").length}</p><p className="mt-2 text-sm text-slate">Quotes that still need artwork or clearer source files before pricing.</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Ready to send</p><p className="mt-2 text-4xl font-black text-ink">{workspace.quotes.filter((quote) => quote.status === "quoted").length}</p><p className="mt-2 text-sm text-slate">Quotes prepared and waiting on customer response or approval.</p></AdminCard>
        <AdminCard><p className="text-xs font-black uppercase tracking-[0.16em] text-slate">High priority</p><p className="mt-2 text-4xl font-black text-ink">{workspace.quotes.filter((quote) => quote.priority === "high" || quote.priority === "urgent").length}</p><p className="mt-2 text-sm text-slate">High-value or time-sensitive opportunities needing quick follow-up.</p></AdminCard>
      </div>
      <AdminPricingEstimator />
      <AdminQuotesOpsView quotes={workspace.quotes} />
    </div>
  );
}
