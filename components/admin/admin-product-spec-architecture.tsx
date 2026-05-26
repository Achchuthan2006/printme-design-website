import { AdminCard } from "@/components/admin/admin-card";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminProductCatalogItem, AdminProductVariantGroup } from "@/types";

export function AdminProductSpecArchitecture({
  products,
  variantGroups,
}: {
  products: AdminProductCatalogItem[];
  variantGroups: AdminProductVariantGroup[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <AdminCard>
        <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Catalog workflow architecture</h2>
        <div className="mt-5 grid gap-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-line p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-black text-ink">{product.title}</p>
                  <p className="mt-1 text-sm text-slate">{product.category} / {product.turnaround}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge status="normal" label={product.orderMode.replace("-", " ")} />
                  <AdminStatusBadge status={product.storefrontStatus === "active" ? "low" : product.storefrontStatus === "draft" ? "high" : "on_hold"} label={product.storefrontStatus} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate">{product.internalNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.variantGroups.map((groupId) => {
                  const group = variantGroups.find((item) => item.id === groupId);
                  return <span key={groupId} className="value-chip">{group?.title ?? groupId}</span>;
                })}
              </div>
            </article>
          ))}
        </div>
      </AdminCard>

      <AdminCard>
        <h2 className="text-2xl font-black tracking-[-0.04em] text-ink">Variant group architecture</h2>
        <div className="mt-5 space-y-4">
          {variantGroups.map((group) => (
            <article key={group.id} className="rounded-2xl border border-line bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-ink">{group.title}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate">
                    {group.scope === "shared" ? "Shared group" : "Product-specific group"}{group.required ? " / required" : ""}
                  </p>
                </div>
                <AdminStatusBadge status="normal" label={`${group.options.length} options`} />
              </div>
              <div className="mt-4 grid gap-2">
                {group.options.map((option) => (
                  <div key={option.id} className="rounded-xl border border-line bg-white px-3 py-3 text-sm">
                    <p className="font-bold text-ink">{option.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate">
                      {option.pricingHint ?? "Pricing hint ready"}{option.turnaroundHint ? ` / ${option.turnaroundHint}` : ""}{option.skuHint ? ` / ${option.skuHint}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
