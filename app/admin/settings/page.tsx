import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { siteConfig } from "@/lib/site";

export default function AdminSettingsPage() {
  const settings = [
    ["Business phone", siteConfig.phone],
    ["Business email", siteConfig.email],
    ["Shop address", siteConfig.address],
    ["Service area", siteConfig.serviceArea],
    ["Admin portal gate", "ADMIN_PORTAL_ENABLED"],
    ["Server allowlist", "ADMIN_USER_EMAILS"],
    ["Client portal gate", "NEXT_PUBLIC_ADMIN_USER_EMAILS"],
    ["Future role source", "Supabase profiles.role"],
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin settings"
        description="Centralize operational settings, staff-access readiness, notifications, business details, and future workflow automation controls."
        actionLabel="Return to Site"
        actionHref="/"
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <AdminCard>
          <h2 className="text-2xl font-black text-ink">Operations configuration</h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {settings.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-line bg-slate-50 p-4">
                <dt className="text-xs font-black uppercase tracking-[0.16em] text-slate">{label}</dt>
                <dd className="mt-2 break-words font-black text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>

        <AdminCard>
          <h2 className="text-2xl font-black text-ink">Future workflow hooks</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate">
            <li className="rounded-xl border border-line bg-white p-3">Current state: the admin UI now expects both the server allowlist and the client portal allowlist to match while the portal remains frontend-driven.</li>
            <li className="rounded-xl border border-line bg-white p-3">TODO: Replace the temporary portal gate with Supabase RLS, admin role claims, and server-side session enforcement.</li>
            <li className="rounded-xl border border-line bg-white p-3">TODO: Connect status changes to SendGrid customer/admin notifications.</li>
            <li className="rounded-xl border border-line bg-white p-3">TODO: Add staff assignments, pickup scheduling, proof approval, and production board views.</li>
            <li className="rounded-xl border border-line bg-white p-3">TODO: Generate invoices and order PDFs from persisted Supabase order snapshots.</li>
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
