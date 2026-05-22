import Link from "next/link";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminFilterBar, AdminTable } from "@/components/admin/admin-table";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { products } from "@/data/products";

export default function AdminProductsPage() {
  const directProducts = products.filter((product) => product.mode !== "quote-only").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product operations"
        description="Manage product visibility, order modes, starting prices, turnaround notes, and future pricing rules without changing the public catalog structure."
        actionLabel="View Public Catalog"
        actionHref="/products"
      />
      <div className="grid gap-4 md:grid-cols-3">
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Catalog items</p>
          <p className="mt-2 text-4xl font-black text-ink">{products.length}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Order-capable</p>
          <p className="mt-2 text-4xl font-black text-ink">{directProducts}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Quote-first</p>
          <p className="mt-2 text-4xl font-black text-ink">{products.length - directProducts}</p>
        </AdminCard>
      </div>
      <AdminFilterBar>
        {["All", "Direct order", "Hybrid", "Quote only", "Rush available"].map((label) => (
          <button key={label} className="rounded-full border border-line px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-slate transition hover:border-brand/40 hover:text-brand">
            {label}
          </button>
        ))}
      </AdminFilterBar>
      <AdminTable
        columns={["Product", "Category", "Mode", "Starting price", "Turnaround", "Badges", "Action"]}
        rows={products.map((product) => [
          <span key="title">{product.title}</span>,
          <span key="category">{product.category}</span>,
          <AdminStatusBadge key="mode" status="normal" label={product.mode.replace("-", " ")} />,
          <span key="price">{product.startingPrice ? `$${product.startingPrice.toFixed(2)}` : "Quote based"}</span>,
          <span key="turnaround" className="max-w-xs text-slate">{product.turnaround}</span>,
          <div key="badges" className="flex flex-wrap gap-2">
            {(product.badges ?? ["Standard"]).map((badge) => <AdminStatusBadge key={badge} status="normal" label={badge} />)}
          </div>,
          <Link key="action" href={`/products/${product.slug}`} className="font-black text-brand hover:text-brand-dark">Preview</Link>,
        ])}
      />
    </div>
  );
}
