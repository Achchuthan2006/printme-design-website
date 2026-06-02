import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { adminIntakeTickets } from "@/data/admin";

export default function AdminIntakePage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Intake board" description="Cross-channel intake queue for quotes, uploads, and structured order tickets." />
      <div className="grid gap-4">
        {adminIntakeTickets.map((ticket) => (
          <AdminCard key={ticket.id}>
            <p className="text-sm font-black text-ink">{ticket.reference} / {ticket.product}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{ticket.summary}</p>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
