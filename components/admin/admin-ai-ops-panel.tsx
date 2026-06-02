import { AdminAiInsight, AdminCommandCenterSnapshot } from "@/types";
import { AdminCard } from "@/components/admin/admin-card";

export function AdminAiOpsPanel({
  snapshot,
  workspace,
}: {
  snapshot: AdminCommandCenterSnapshot;
  workspace: { alerts: Array<{ id: string; title: string; detail: string; href: string }> };
}) {
  const insights: AdminAiInsight[] = [
    {
      title: "Review stale quotes first",
      detail: `There are ${snapshot.alerts.length} active alerts competing for attention.`,
      priority: "now",
      actionLabel: "Open quotes",
      href: "/admin/quotes",
    },
    {
      title: "Clear workflow blockers",
      detail: `${workspace.alerts.length} intake or production blockers are visible in the current workspace.`,
      priority: "next",
      actionLabel: "Open operations",
      href: "/admin/orders",
    },
  ];

  return (
    <AdminCard>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Ops guidance</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {insights.map((item) => (
          <a key={item.title} href={item.href} className="rounded-2xl border border-line bg-canvas p-4 transition hover:border-brand/25">
            <p className="text-sm font-black text-ink">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
          </a>
        ))}
      </div>
    </AdminCard>
  );
}
