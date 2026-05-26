"use client";

import { useMemo, useState } from "react";
import { AdminProductCatalogItem } from "@/types";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { Input, Select } from "@/components/ui/form-controls";
import { AdminTable } from "@/components/admin/admin-table";

export function AdminProductsOpsView({ products }: { products: AdminProductCatalogItem[] }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("all");

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        query.trim().length === 0 ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase());
      const matchesMode = mode === "all" || product.orderMode === mode;
      return matchesQuery && matchesMode;
    });
  }, [products, query, mode]);

  return (
    <div className="space-y-4">
      <div className="hero-panel grid gap-3 rounded-[1.5rem] p-4 md:grid-cols-[1fr_220px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search product or category" />
        <Select value={mode} onChange={(event) => setMode(event.target.value)}>
          <option value="all">All order modes</option>
          <option value="direct-order">Direct order</option>
          <option value="hybrid">Hybrid</option>
          <option value="quote-only">Quote only</option>
          <option value="contact">Contact</option>
        </Select>
      </div>
      <AdminTable
        columns={["Product", "Category", "Mode", "Storefront", "Starting price", "Variant groups", "FAQs"]}
        rows={visibleProducts.map((product) => [
          <div key="title">
            <p>{product.title}</p>
            <p className="mt-1 text-xs font-normal text-slate">{product.internalNote}</p>
          </div>,
          <span key="category">{product.category}</span>,
          <AdminStatusBadge key="mode" status="normal" label={product.orderMode.replace("-", " ")} />,
          <AdminStatusBadge key="storefront" status={product.storefrontStatus === "active" ? "low" : product.storefrontStatus === "draft" ? "high" : "on_hold"} label={product.storefrontStatus} />,
          <span key="price">{product.startingPrice ?? "Quote based"}</span>,
          <span key="variants">{product.variantGroups.length}</span>,
          <span key="faq">{product.linkedFaqCount}</span>,
        ])}
        emptyLabel="No products match the current search or order-mode filter."
      />
    </div>
  );
}
