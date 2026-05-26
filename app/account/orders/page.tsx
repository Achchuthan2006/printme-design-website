import { EmptyState } from "@/components/account/empty-state";
import { ProtectedAccount } from "@/components/account/protected-account";
import { AccountSupportHub } from "@/components/account/account-support-hub";
import { OrdersHistoryPanel } from "@/components/account/orders-history-panel";
import { Button } from "@/components/ui/button";
import { demoOrders } from "@/data/account";
import { buildMetadata } from "@/lib/metadata";
import { SummaryStrip } from "@/components/platform/summary-strip";

export const metadata = buildMetadata({
  title: "Account Orders",
  description: "Review PrintMe order history, active jobs, and future reorder shortcuts.",
  path: "/account/orders",
});

export default function AccountOrdersPage() {
  const orderSummary = [
    { label: "Active orders", value: String(demoOrders.filter((order) => order.status !== "completed").length), detail: "Jobs still moving through review, production, or pickup." },
    { label: "Pickup jobs", value: String(demoOrders.filter((order) => order.fulfillmentMethod.includes("pickup")).length), detail: "Orders expected to hand off at the Scarborough shop." },
    { label: "Completed orders", value: String(demoOrders.filter((order) => order.status === "completed").length), detail: "Useful starting points for quick repeat work." },
    { label: "Reorder-ready", value: String(demoOrders.length), detail: "Every order can feed future repeat jobs, invoices, and file reuse." },
  ];

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
            <SummaryStrip items={orderSummary} className="mt-6" />
            {demoOrders.length === 0 ? (
              <div className="mt-6">
                <EmptyState title="No orders yet" description="Start an online print order or request a quote when your job needs review first." ctaLabel="Start My Order" ctaHref="/products" />
              </div>
            ) : (
              <OrdersHistoryPanel orders={demoOrders} />
            )}
            <div className="mt-6">
              <AccountSupportHub
                title="Order help inside your account"
                description="Use the right support path if production timing changed, a file needs replacing, pickup is urgent, or a repeat order needs updated quantities."
                shortcuts={[
                  { title: "Ask about production timing", detail: "Best when a deadline changed or you need the next realistic update.", href: "/support", cta: "Open Support", icon: "clock" },
                  { title: "Replace artwork on an active job", detail: "Use the file area when the job needs revised artwork before production.", href: "/account/files", cta: "Review Files", icon: "upload" },
                  { title: "Start a repeat order", detail: "Use a previous order as the base when only quantity, finish, or timing changed.", href: "/account/reorders", cta: "Open Reorders", icon: "bag" },
                ]}
              />
            </div>
          </div>
        </ProtectedAccount>
      </div>
    </section>
  );
}
