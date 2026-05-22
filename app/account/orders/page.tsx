import Link from "next/link";
import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { StatusBadge } from "@/components/account/status-badge";
import { Button } from "@/components/ui/button";
import { demoOrders } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Account Orders",
  description: "Review PrintMe order history, active jobs, and future reorder shortcuts.",
  path: "/account/orders",
});

export default function AccountOrdersPage() {
  return (
    <section className="section-space bg-canvas">
      <div className="container-shell">
        <ProtectedAccount>
          <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Orders</p>
                <h1 className="mt-2 text-3xl font-black text-ink">Order history</h1>
              </div>
              <Button href="/products">Start New Order</Button>
            </div>
            {demoOrders.length === 0 ? (
              <div className="mt-6">
                <EmptyState title="No orders yet" description="Start an online print order or request a quote when your job needs review first." ctaLabel="Start My Order" ctaHref="/products" />
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-lg border border-line">
                <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_auto] bg-canvas px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate md:grid">
                  <span>Order</span><span>Date</span><span>Status</span><span>Total</span><span>Actions</span>
                </div>
                {demoOrders.map((order) => (
                  <article key={order.id} className="grid gap-3 border-t border-line px-4 py-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center">
                    <div>
                      <p className="font-black text-ink">{order.orderNumber}</p>
                      <p className="mt-1 text-sm text-slate">{order.items.join(", ")}</p>
                    </div>
                    <p className="text-sm text-slate">{order.date}</p>
                    <StatusBadge status={order.status} />
                    <p className="font-bold text-ink">{order.total}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/account/orders/${order.id}`} className="text-sm font-bold text-brand">Review Details</Link>
                      <button className="text-sm font-bold text-slate">Reorder Soon</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
