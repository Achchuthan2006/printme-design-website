"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AccountOrder } from "@/types";
import { StatusBadge } from "@/components/account/status-badge";
import { Input, Select } from "@/components/ui/form-controls";

export function OrdersHistoryPanel({ orders }: { orders: AccountOrder[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery =
        query.trim().length === 0 ||
        order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        order.items.join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 rounded-[1.25rem] border border-line/90 bg-canvas p-4 md:grid-cols-[1fr_220px]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by order number or product"
          aria-label="Search orders"
        />
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter orders by status">
          <option value="all">All statuses</option>
          <option value="pending_review">Pending review</option>
          <option value="ready_for_pickup">Ready for pickup</option>
          <option value="in_production">In production</option>
          <option value="completed">Completed</option>
          <option value="quote_required">Quote required</option>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-line">
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_auto] bg-canvas px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate md:grid">
          <span>Order</span><span>Date</span><span>Status</span><span>Total</span><span>Actions</span>
        </div>
        {visibleOrders.map((order) => (
          <article key={order.id} className="grid gap-3 border-t border-line px-4 py-4 first:border-t-0 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center">
            <div>
              <p className="font-black text-ink">{order.orderNumber}</p>
              <p className="mt-1 text-sm text-slate">{order.items.join(", ")}</p>
              {order.nextStep ? <p className="mt-2 text-xs leading-5 text-slate">{order.nextStep}</p> : null}
            </div>
            <p className="text-sm text-slate">{order.date}</p>
            <StatusBadge status={order.status} />
            <p className="font-bold text-ink">{order.total}</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/account/orders/${order.id}`} className="text-sm font-bold text-brand">Review Details</Link>
              <Link href={order.reorderHref ?? `/quote-request?service=${encodeURIComponent(order.items[0])}`} className="text-sm font-bold text-slate">Start Similar Job</Link>
            </div>
          </article>
        ))}
        {visibleOrders.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm leading-6 text-slate">
            No orders match this search yet. Try a different status or keyword.
          </div>
        ) : null}
      </div>
    </div>
  );
}
