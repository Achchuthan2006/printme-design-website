"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AccountQuote } from "@/types";
import { StatusBadge } from "@/components/account/status-badge";
import { Input, Select } from "@/components/ui/form-controls";

export function QuotesHistoryPanel({ quotes }: { quotes: AccountQuote[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const visibleQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const matchesQuery =
        query.trim().length === 0 ||
        quote.service.toLowerCase().includes(query.toLowerCase()) ||
        quote.summary.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [quotes, query, statusFilter]);

  return (
    <div className="mt-6 space-y-4">
      <div className="grid gap-3 rounded-[1.25rem] border border-line/90 bg-canvas p-4 md:grid-cols-[1fr_220px]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by service or quote details"
          aria-label="Search quotes"
        />
        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter quotes by status">
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="reviewing">Reviewing</option>
          <option value="priced">Priced</option>
          <option value="approved">Approved</option>
          <option value="expired">Expired</option>
        </Select>
      </div>

      <div className="grid gap-4">
        {visibleQuotes.map((quote) => (
          <article key={quote.id} className="rounded-lg border border-line p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-ink">{quote.service}</h2>
                <p className="mt-2 text-sm text-slate">{quote.summary}</p>
                <p className="mt-2 text-xs font-bold text-slate">{quote.requestedDate}</p>
                {quote.estimatedValue ? <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-brand">Estimated value {quote.estimatedValue}</p> : null}
              </div>
              <StatusBadge status={quote.status} />
            </div>
            {quote.nextStep ? (
              <div className="mt-4 rounded-[1.2rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                <p className="font-black text-ink">Best next step</p>
                <p className="mt-1">{quote.nextStep}</p>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`/account/quotes/${quote.id}`} className="text-sm font-bold text-brand">Review Details</Link>
              {quote.proofPortalId ? <Link href={`/account/proofs/${quote.proofPortalId}`} className="text-sm font-bold text-ink">Open Proof</Link> : null}
              <Link href={`/quote-request?service=${encodeURIComponent(quote.service)}`} className="text-sm font-bold text-slate">Update Quote Details</Link>
            </div>
          </article>
        ))}
        {visibleQuotes.length === 0 ? (
          <div className="rounded-[1.25rem] border border-line bg-white px-4 py-8 text-center text-sm leading-6 text-slate">
            No quotes match this search yet. Try another service keyword or status.
          </div>
        ) : null}
      </div>
    </div>
  );
}
