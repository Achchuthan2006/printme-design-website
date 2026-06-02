import { AdminAssignment, AdminBlockingReason, AdminPriority } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";

export function AdminAssignmentPanel({
  assignment,
  blockers,
  nextAction,
  priority,
}: {
  assignment: AdminAssignment;
  blockers: AdminBlockingReason[];
  nextAction: string;
  priority: AdminPriority;
}) {
  return (
    <AdminCard>
      <h2 className="text-xl font-black text-ink">Assignment</h2>
      <p className="mt-3 text-sm leading-6 text-slate">{assignment.owner} / {assignment.workstream}</p>
      <p className="mt-2 text-sm leading-6 text-slate">Priority: {priority}</p>
      <p className="mt-2 text-sm leading-6 text-slate">Next: {nextAction}</p>
      {blockers.filter((item) => item !== "none").map((blocker) => (
        <p key={blocker} className="mt-2 text-sm leading-6 text-brand">{blocker.replaceAll("_", " ")}</p>
      ))}
    </AdminCard>
  );
}
