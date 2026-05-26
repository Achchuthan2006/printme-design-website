import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminProductSpecArchitecture } from "@/components/admin/admin-product-spec-architecture";
import { AdminProductsOpsView } from "@/components/admin/admin-products-ops-view";
import { adminProductCatalog, adminVariantGroups } from "@/data/admin";

export default function AdminProductsPage() {
  const directProducts = adminProductCatalog.filter((product) => product.orderMode !== "quote-only" && product.orderMode !== "contact").length;

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
          <p className="mt-2 text-4xl font-black text-ink">{adminProductCatalog.length}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Order-capable</p>
          <p className="mt-2 text-4xl font-black text-ink">{directProducts}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">Quote-first</p>
          <p className="mt-2 text-4xl font-black text-ink">{adminProductCatalog.length - directProducts}</p>
        </AdminCard>
      </div>
      <AdminProductsOpsView products={adminProductCatalog} />
      <AdminProductSpecArchitecture products={adminProductCatalog} variantGroups={adminVariantGroups} />
    </div>
  );
}
