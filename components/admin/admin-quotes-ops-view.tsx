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

  const pricingPathSummary = useMemo(() => {
    return {
      manualReview: quotes.filter((quote) => quote.orderMethod === "quote-first" || quote.designRequired || quote.status === "reviewing").length,
      waitingOnCustomer: quotes.filter((quote) => quote.status === "quoted" || quote.status === "approved").length,
      missingInputs: quotes.filter((quote) => quote.status === "waiting_for_files" || quote.blockers.length > 0).length,
    };
  }, [quotes]);

  function formatBlocker(blocker: AdminQuote["blockers"][number]) {
    return blocker === "none" ? "No active blockers" : blocker.replaceAll("_", " ");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.35rem] border border-line bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Needs estimator review</p>
          <p className="mt-2 text-3xl font-black text-ink">{pricingPathSummary.manualReview}</p>
          <p className="mt-2 text-sm leading-6 text-slate">Quotes that still need staff pricing judgement, design scoping, or structured rule review.</p>
        </div>
        <div className="rounded-[1.35rem] border border-line bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Waiting on customer</p>
          <p className="mt-2 text-3xl font-black text-ink">{pricingPathSummary.waitingOnCustomer}</p>
          <p className="mt-2 text-sm leading-6 text-slate">Quotes already sent or approved that need either customer sign-off or quote-to-order conversion.</p>
        </div>
        <div className="rounded-[1.35rem] border border-line bg-canvas p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Missing inputs</p>
          <p className="mt-2 text-3xl font-black text-ink">{pricingPathSummary.missingInputs}</p>
          <p className="mt-2 text-sm leading-6 text-slate">Requests blocked by files, specifications, or customer clarification before pricing can be finalized.</p>
        </div>
      </div>

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
        columns={["Quote", "Customer", "Service path", "Specs", "Estimate", "Status", "Next action", "Action"]}
        rows={visibleQuotes.map((quote) => [
          <div key="quote">
            <Link href={`/admin/quotes/${quote.id}`} className="text-brand hover:text-brand-dark">{quote.quoteNumber}</Link>
            <p className="mt-1 text-xs text-slate">{quote.createdAt}</p>
          </div>,
          <div key="customer">
            <p>{quote.customerName}</p>
            <p className="mt-1 text-xs font-normal text-slate">{quote.customerEmail}</p>
          </div>,
          <div key="service">
            <p>{quote.service}</p>
            <p className="mt-1 text-xs font-normal uppercase tracking-[0.12em] text-slate">{quote.orderMethod.replaceAll("-", " ")}</p>
          </div>,
          <div key="quantity">
            <p>{quote.quantity}</p>
            <p className="mt-1 text-xs font-normal text-slate">{quote.selectedSpecs.slice(0, 2).join(" · ") || "Specs pending review"}</p>
          </div>,
          <div key="estimate">
            <p>{quote.estimatedValue}</p>
            <p className="mt-1 text-xs font-normal text-slate">{quote.paymentStageLabel ?? quote.deadline}</p>
          </div>,
          <AdminStatusBadge key="status" status={quote.status} label={quoteStatusLabels[quote.status]} />,
          <div key="follow">
            <p>{quote.followUp}</p>
            {quote.blockers.length > 0 ? <p className="mt-1 text-xs font-normal text-slate">{formatBlocker(quote.blockers[0])}</p> : <p className="mt-1 text-xs font-normal text-slate">{quote.nextAction}</p>}
          </div>,
          <Link key="action" href={`/admin/quotes/${quote.id}`} className="font-black text-brand hover:text-brand-dark">Open</Link>,
        ])}
        emptyLabel="No quotes match the current search or filter."
      />
    </div>
  );
}
