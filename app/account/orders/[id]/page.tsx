import { notFound } from "next/navigation";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { accountOrderProgress, demoOrders } from "@/data/account";
import { StatusTimeline } from "@/components/platform/status-timeline";

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = demoOrders.find((item) => item.id === id);
  if (!order) notFound();

  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="space-y-6">
            <div className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Order details</p>
                  <h1 className="mt-2 text-3xl font-black text-ink">{order.orderNumber}</h1>
                  <p className="mt-2 text-sm text-slate">{order.date} / {order.fulfillmentMethod}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <section className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
                  <h2 className="text-2xl font-black text-ink">Items</h2>
                  <div className="mt-5 space-y-3">
                    {order.items.map((item) => (
                      <div key={item} className="rounded-2xl border border-line/80 bg-canvas p-4 text-sm font-bold text-ink">{item}</div>
                    ))}
                  </div>
                </section>
                <StatusTimeline
                  title="Order progress"
                  items={accountOrderProgress[order.id] ?? [
                    { label: "Order received", detail: "Workflow timeline will appear here once live events are connected.", status: "current" },
                  ]}
                />
              </div>
              <aside className="h-fit rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-black text-ink">Actions</h2>
                <div className="mt-5 grid gap-3">
                  <Button href={`/quote-request?service=${encodeURIComponent(order.items[0])}`}>Reorder Similar</Button>
                  <Button href="/account/invoices" variant="secondary">Download Invoice</Button>
                  <Button href="/support" variant="secondary">Contact Support</Button>
                </div>
                <div className="mt-5 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                  <p className="font-black text-ink">Best next step</p>
                  <p className="mt-1">Use support if the deadline changed, artwork needs updating, or you want to reuse this job with a new quantity or finish.</p>
                </div>
                <p className="mt-4 text-xs leading-5 text-slate">
                  Order details are ready to connect to Supabase order items, uploads, invoices, and status events.
                </p>
              </aside>
            </div>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
