"use client";

import { getTemplatesForProduct } from "@/data/templates";
import { useEngagement } from "@/features/engagement/engagement-context";
import { PrintProduct } from "@/types";
import { Button } from "@/components/ui/button";

export function AccountMemoryPanel({ products }: { products: PrintProduct[] }) {
  const { favorites, recentlyViewed, compare } = useEngagement();

  const favoriteProducts = favorites
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean) as PrintProduct[];
  const recentProducts = recentlyViewed
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean) as PrintProduct[];
  const compareProducts = compare
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean) as PrintProduct[];

  if (favoriteProducts.length === 0 && recentProducts.length === 0 && compareProducts.length === 0) {
    return null;
  }

  return (
    <section className="surface-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="editorial-kicker">Remembered for you</p>
          <h2 className="mt-2 text-2xl font-black text-ink">Recently viewed and saved product shortcuts</h2>
        </div>
        <Button href="/products" variant="secondary" className="px-4 py-2 text-xs">
          Open Catalog
        </Button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          { title: "Saved", items: favoriteProducts },
          { title: "Recently viewed", items: recentProducts },
          { title: "Compare tray", items: compareProducts },
        ].map((group) => (
          <article key={group.title} className="rounded-[1.25rem] border border-line bg-canvas p-4">
            <p className="text-sm font-black text-ink">{group.title}</p>
            <div className="mt-3 space-y-3">
              {group.items.length > 0 ? (
                group.items.slice(0, 3).map((product) => (
                  <div key={product.slug} className="rounded-[1rem] border border-line/80 bg-white px-3 py-3">
                    <p className="text-sm font-black text-ink">{product.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate">
                      {getTemplatesForProduct(product.slug).length > 0 ? "Template-ready" : product.mode === "direct-order" ? "Direct-order path" : "Quote-led path"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate">Nothing here yet.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
