import { ProtectedAccount } from "@/components/account/protected-account";
import { Button } from "@/components/ui/button";
import { CheckboxTile, Field, Input } from "@/components/ui/form-controls";
import { demoAddresses, demoProfile } from "@/data/account";
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
                <Field label="Full name">
                  <Input defaultValue={demoProfile.fullName} />
                </Field>
                <Field label="Phone">
                  <Input defaultValue={demoProfile.phone} />
                </Field>
                <Field label="Company name">
                  <Input defaultValue={demoProfile.companyName} />
                </Field>
                <Field label="Business notes" className="md:col-span-2">
                  <Input defaultValue="Please call before any local delivery with display pieces." />
                </Field>
              </div>
            </section>
            <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-black text-ink">Save pickup and delivery details</h2>
              <div className="mt-6 grid gap-4">
                {demoAddresses.map((address) => (
                  <article key={address.id} className="rounded-[1.25rem] border border-line/80 bg-canvas p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="value-chip">{address.label}</span>
                      {address.isDefaultPickup ? <span className="value-chip">Default pickup</span> : null}
                      {address.isDefaultDelivery ? <span className="value-chip">Default delivery</span> : null}
                    </div>
                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                      <Field label="Address line 1" className="md:col-span-2">
                        <Input defaultValue={address.addressLine1} />
                      </Field>
                      <Field label="Address line 2" className="md:col-span-2">
                        <Input defaultValue={address.addressLine2} />
                      </Field>
                      <Field label="City">
                        <Input defaultValue={address.city} />
                      </Field>
                      <Field label="Postal code">
                        <Input defaultValue={address.postalCode} />
                      </Field>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <h2 className="text-2xl font-black text-ink">Communication preferences</h2>
              <div className="mt-5 grid gap-3">
                {[
                  ["Email order updates", demoProfile.communicationPreferences?.emailUpdates],
                  ["SMS status updates", demoProfile.communicationPreferences?.smsUpdates],
                  ["Occasional PrintMe offers", demoProfile.communicationPreferences?.marketingEmails],
                ].map(([label, checked]) => (
                  <CheckboxTile key={String(label)} defaultChecked={Boolean(checked)}>
                    {label}
                  </CheckboxTile>
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
