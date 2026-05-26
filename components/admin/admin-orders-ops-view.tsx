"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminOrder } from "@/types";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Input, Select } from "@/components/ui/form-controls";
import { AdminTable } from "@/components/admin/admin-table";
import { orderStatusLabels, uploadStatusLabels } from "@/data/admin";

export function AdminOrdersOpsView({ orders }: { orders: AdminOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const visibleOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery =
        query.trim().length === 0 ||
        order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.service.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || order.productionStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, status]);

  return (
    <div className="space-y-4">
      <div className="hero-panel grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-[1fr_240px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order number, customer, or service" />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All production states</option>
          <option value="awaiting_review">Awaiting review</option>
          <option value="in_production">In production</option>
          <option value="ready_for_pickup">Ready for pickup</option>
          <option value="on_hold">On hold</option>
        </Select>
      </div>
      <AdminTable
        columns={["Order", "Customer", "Service", "Payment", "Files", "Production", "Due", "Action"]}
        rows={visibleOrders.map((order) => [
          <div key="order">
            <Link href={`/admin/orders/${order.id}`} className="text-brand hover:text-brand-dark">{order.orderNumber}</Link>
            <p className="mt-1 text-xs text-slate">{order.createdAt}</p>
          </div>,
          <div key="customer">
            <p>{order.customerName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{order.customerEmail}</p>
          </div>,
          <span key="service">{order.service}</span>,
          <AdminStatusBadge key="payment" status={order.paymentStatus} />,
          <AdminStatusBadge key="files" status={order.fileStatus} label={uploadStatusLabels[order.fileStatus]} />,
          <AdminStatusBadge key="production" status={order.productionStatus} label={orderStatusLabels[order.productionStatus]} />,
          <span key="due">{order.dueDate}</span>,
          <Link key="action" href={`/admin/orders/${order.id}`} className="font-black text-brand hover:text-brand-dark">View</Link>,
        ])}
        emptyLabel="No orders match the current search or filter."
      />
    </div>
  );
}
