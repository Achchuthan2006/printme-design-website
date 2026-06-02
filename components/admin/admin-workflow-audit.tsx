import { AdminWorkflowAuditItem } from "@/types";

export function AdminWorkflowAudit({ items }: { items: AdminWorkflowAuditItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-line bg-canvas p-4">
          <p className="text-sm font-black text-ink">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate">{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
