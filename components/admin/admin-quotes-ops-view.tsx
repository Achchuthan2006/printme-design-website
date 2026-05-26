"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminQuote } from "@/types";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Input, Select } from "@/components/ui/form-controls";
import { AdminTable } from "@/components/admin/admin-table";
import { quoteStatusLabels } from "@/data/admin";

export function AdminQuotesOpsView({ quotes }: { quotes: AdminQuote[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const visibleQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesQuery =
        query.trim().length === 0 ||
        quote.quoteNumber.toLowerCase().includes(query.toLowerCase()) ||
        quote.customerName.toLowerCase().includes(query.toLowerCase()) ||
        quote.service.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || quote.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [quotes, query, status]);

  return (
    <div className="space-y-4">
      <div className="hero-panel grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-[1fr_240px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search quote number, customer, or service" />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All quote states</option>
          <option value="new_quote">New quote</option>
          <option value="reviewing">Reviewing</option>
          <option value="waiting_for_files">Waiting for files</option>
          <option value="quoted">Quoted</option>
          <option value="approved">Approved</option>
        </Select>
      </div>
      <AdminTable
        columns={["Quote", "Customer", "Service", "Quantity", "Deadline", "Status", "Follow-up", "Action"]}
        rows={visibleQuotes.map((quote) => [
          <div key="quote">
            <Link href={`/admin/quotes/${quote.id}`} className="text-brand hover:text-brand-dark">{quote.quoteNumber}</Link>
            <p className="mt-1 text-xs text-slate">{quote.createdAt}</p>
          </div>,
          <div key="customer">
            <p>{quote.customerName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{quote.customerEmail}</p>
          </div>,
          <span key="service">{quote.service}</span>,
          <span key="quantity">{quote.quantity}</span>,
          <span key="deadline">{quote.deadline}</span>,
          <AdminStatusBadge key="status" status={quote.status} label={quoteStatusLabels[quote.status]} />,
          <span key="follow">{quote.followUp}</span>,
          <Link key="action" href={`/admin/quotes/${quote.id}`} className="font-black text-brand hover:text-brand-dark">Open</Link>,
        ])}
        emptyLabel="No quotes match the current search or filter."
      />
    </div>
  );
}
