import { AdminProofRecord } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";

export function AdminProofWorkflowPanel({ proof }: { proof: AdminProofRecord }) {
  return (
    <AdminCard>
      <h2 className="text-xl font-black text-ink">Proof workflow</h2>
      <p className="mt-3 text-sm leading-6 text-slate">{proof.lastAction}</p>
      <div className="mt-4 space-y-2">
        {proof.notes.map((note) => (
          <p key={note} className="rounded-xl border border-line bg-canvas p-3 text-sm leading-6 text-slate">{note}</p>
        ))}
      </div>
    </AdminCard>
  );
}
