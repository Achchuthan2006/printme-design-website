"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminCustomerSummary } from "@/types";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Input, Select } from "@/components/ui/form-controls";
import { AdminTable } from "@/components/admin/admin-table";

export function AdminCustomersOpsView({ customers }: { customers: AdminCustomerSummary[] }) {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("all");

  const visibleCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesQuery =
        query.trim().length === 0 ||
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.email.toLowerCase().includes(query.toLowerCase()) ||
        (customer.company ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesTag = tagFilter === "all" || customer.tags.includes(tagFilter);
      return matchesQuery && matchesTag;
    });
  }, [customers, query, tagFilter]);

  const uniqueTags = Array.from(new Set(customers.flatMap((customer) => customer.tags)));

  return (
    <div className="space-y-4">
      <div className="hero-panel grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-[1fr_220px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search customer, company, or email" />
        <Select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
          <option value="all">All tags</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </Select>
      </div>
      <AdminTable
        columns={["Customer", "Contact", "Company", "Tags", "Last activity", "Value", "Actions"]}
        rows={visibleCustomers.map((customer) => [
          <div key="name">
            <Link href={`/admin/customers/${customer.id}`} className="text-brand hover:text-brand-dark">{customer.name}</Link>
            <p className="mt-1 text-xs text-slate">{customer.notes ?? "Customer account ready for operational notes."}</p>
          </div>,
          <div key="contact">
            <p>{customer.email}</p>
            <p className="mt-1 text-xs font-normal text-slate">{customer.phone}</p>
          </div>,
          <span key="company">{customer.company ?? "Individual customer"}</span>,
          <div key="tags" className="flex flex-wrap gap-2">
            {customer.tags.map((tag) => <AdminStatusBadge key={tag} status="normal" label={tag} />)}
          </div>,
          <span key="activity">{customer.lastActivity}</span>,
          <span key="value">{customer.lifetimeValue}</span>,
          <Link key="action" href={`/admin/customers/${customer.id}`} className="font-black text-brand hover:text-brand-dark">Open</Link>,
        ])}
        emptyLabel="No customers match the current search or tag filter."
      />
    </div>
  );
}
