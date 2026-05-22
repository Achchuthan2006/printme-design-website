import { cn } from "@/lib/utils";

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-line/80 bg-white p-5 shadow-soft", className)}>
      {children}
    </section>
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
