import { ProtectedAccount } from "@/components/account/protected-account";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({ title: "Account Settings", description: "Manage PrintMe account profile, addresses, and communication preferences.", path: "/account/settings" });

export default function AccountSettingsPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="space-y-6">
            <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Settings</p>
              <h1 className="mt-2 text-3xl font-black text-ink">Make future orders easier</h1>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {["Full name", "Phone", "Company name", "Business notes"].map((label) => (
                  <label key={label} className={label === "Business notes" ? "block md:col-span-2" : "block"}>
                    <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
                    <input className="premium-input w-full" />
                  </label>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-black text-ink">Save pickup and delivery details</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {["Address line 1", "Address line 2", "City", "Postal code"].map((label) => (
                  <label key={label} className={label.includes("Address") ? "block md:col-span-2" : "block"}>
                    <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
                    <input className="premium-input w-full" />
                  </label>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-black text-ink">Communication preferences</h2>
              <div className="mt-5 grid gap-3">
                {["Email order updates", "SMS status updates", "Occasional PrintMe offers"].map((label) => (
                  <label key={label} className="flex items-center gap-3 rounded-2xl border border-line/80 bg-canvas p-4 text-sm font-bold text-ink">
                    <input type="checkbox" className="h-4 w-4 accent-brand" />
                    {label}
                  </label>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button type="button">Save My Preferences</Button>
                <Button href="/account/forgot-password" variant="secondary">Change Password</Button>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate">
                Saved details help reduce repeat-order friction once profile persistence is connected.
              </p>
            </section>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
