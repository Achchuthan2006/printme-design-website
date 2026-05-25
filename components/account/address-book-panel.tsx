import { CustomerAddress } from "@/types";
import { Button } from "@/components/ui/button";

export function AddressBookPanel({
  addresses,
  title = "Saved addresses",
}: {
  addresses: CustomerAddress[];
  title?: string;
}) {
  return (
    <section className="surface-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Address book</p>
          <h2 className="mt-2 text-2xl font-black text-ink">{title}</h2>
        </div>
        <Button href="/account/settings" variant="secondary" className="px-4 py-2 text-xs">
          Manage
        </Button>
      </div>
      <div className="mt-5 grid gap-4">
        {addresses.map((address) => (
          <article key={address.id} className="rounded-[1.25rem] border border-line/90 bg-canvas p-4">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-line/80 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate">
                {address.label}
              </span>
              {address.isDefaultPickup ? (
                <span className="rounded-full border border-brand/15 bg-brand-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-brand">
                  Default pickup
                </span>
              ) : null}
              {address.isDefaultDelivery ? (
                <span className="rounded-full border border-brand/15 bg-brand-soft px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-brand">
                  Default delivery
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm font-black text-ink">{address.recipient}</p>
            {address.companyName ? <p className="mt-1 text-sm text-slate">{address.companyName}</p> : null}
            <p className="mt-2 text-sm leading-6 text-slate">
              {address.addressLine1}
              {address.addressLine2 ? `, ${address.addressLine2}` : ""}
              <br />
              {address.city}, {address.province} {address.postalCode}
            </p>
            {address.instructions ? <p className="mt-2 text-xs leading-5 text-slate">{address.instructions}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
