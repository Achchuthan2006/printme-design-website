import { AdminCard } from "@/components/admin/admin-card";

export function AdminPricingEstimator() {
  return (
    <AdminCard>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Estimator note</p>
      <p className="mt-3 text-sm leading-6 text-slate">
        Pricing logic is stabilized at the storefront layer first. This admin estimator stays intentionally lightweight until the operations model is expanded.
      </p>
    </AdminCard>
  );
}
