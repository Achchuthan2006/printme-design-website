import { Card } from "@/components/ui/card";

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card as="section" variant="glass" className={className}>
      {children}
    </Card>
  );
}

export function AdminMetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <AdminCard className="transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-[-0.05em] text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate">{detail}</p>
    </AdminCard>
  );
}
