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
  const [payment, setPayment] = useState("all");
  const [method, setMethod] = useState("all");
  const [priority, setPriority] = useState("all");

  const visibleOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery =
        query.trim().length === 0 ||
        order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName.toLowerCase().includes(query.toLowerCase()) ||
        order.service.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || order.productionStatus === status;
      const matchesPayment = payment === "all" || order.paymentStatus === payment;
      const matchesMethod = method === "all" || order.orderMethod === method;
      const matchesPriority = priority === "all" || order.priority === priority;
      return matchesQuery && matchesStatus && matchesPayment && matchesMethod && matchesPriority;
    });
  }, [method, orders, payment, priority, query, status]);

  const blockedCount = orders.filter((order) =>
    order.blockers.some((blocker) => blocker !== "none"),
  ).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="hero-panel grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-2 xl:grid-cols-3">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order number, customer, or service" />
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All production states</option>
            <option value="awaiting_review">Awaiting review</option>
            <option value="awaiting_files">Awaiting files</option>
            <option value="waiting_for_proof_approval">Waiting for proof approval</option>
            <option value="approved_for_production">Approved for production</option>
            <option value="in_production">In production</option>
            <option value="ready_for_pickup">Ready for pickup</option>
            <option value="on_hold">On hold</option>
          </Select>
          <Select value={payment} onChange={(event) => setPayment(event.target.value)}>
            <option value="all">All payment states</option>
            <option value="paid">Paid</option>
            <option value="deposit_paid">Deposit paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="refunded">Refunded</option>
          </Select>
          <Select value={method} onChange={(event) => setMethod(event.target.value)}>
            <option value="all">All order methods</option>
            <option value="upload-finished-design">Upload finished design</option>
            <option value="customize-template">Customize template</option>
            <option value="request-custom-design">Custom design request</option>
            <option value="quote-first">Quote-first</option>
          </Select>
          <Select value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="all">All priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </Select>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Visible orders</p>
            <p className="mt-2 text-3xl font-black text-ink">{visibleOrders.length}</p>
            <p className="mt-2 text-xs leading-5 text-slate">Current filtered operational view.</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Blocked orders</p>
            <p className="mt-2 text-3xl font-black text-ink">{blockedCount}</p>
            <p className="mt-2 text-xs leading-5 text-slate">Jobs still waiting on proof, payment, files, or review.</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Production moving</p>
            <p className="mt-2 text-3xl font-black text-ink">{orders.filter((order) => order.productionStatus === "in_production" || order.productionStatus === "ready_for_pickup").length}</p>
            <p className="mt-2 text-xs leading-5 text-slate">Orders already through approval and into active fulfillment work.</p>
          </div>
        </div>
      </div>
      <AdminTable
        columns={["Order", "Customer", "Service", "Readiness", "Files", "Production", "Due", "Action"]}
        rows={visibleOrders.map((order) => [
          <div key="order">
            <Link href={`/admin/orders/${order.id}`} className="text-brand hover:text-brand-dark">{order.orderNumber}</Link>
            <p className="mt-1 text-xs text-slate">{order.createdAt}</p>
            <p className="mt-1 text-xs font-normal text-slate">{order.orderMethod.replaceAll("-", " ")}</p>
          </div>,
          <div key="customer">
            <p>{order.customerName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{order.customerEmail}</p>
          </div>,
          <span key="service">{order.service}</span>,
          <div key="payment" className="flex flex-wrap gap-2">
            <AdminStatusBadge status={order.paymentStatus} />
            <AdminStatusBadge status={order.priority} />
            {order.amountDue ? <span className="text-xs font-normal text-slate">Due {order.amountDue}</span> : null}
          </div>,
          <AdminStatusBadge key="files" status={order.fileStatus} label={uploadStatusLabels[order.fileStatus]} />,
          <div key="production" className="space-y-2">
            <AdminStatusBadge status={order.productionStatus} label={orderStatusLabels[order.productionStatus]} />
            <p className="text-xs font-normal text-slate">{order.assignment.owner}</p>
          </div>,
          <div key="due">
            <p>{order.dueDate}</p>
            <p className="mt-1 text-xs font-normal text-slate">{order.nextAction}</p>
          </div>,
          <Link key="action" href={`/admin/orders/${order.id}`} className="font-black text-brand hover:text-brand-dark">View</Link>,
        ])}
        emptyLabel="No orders match the current search or filter."
      />
    </div>
  );
}
