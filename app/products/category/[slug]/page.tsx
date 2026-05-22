import { notFound } from "next/navigation";
import { CategoryHero } from "@/components/catalog/category-hero";
import { FinalCta } from "@/components/catalog/final-cta";
import { ProductCard } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getCategoryBySlug, getProductsByCategory, productCategories } from "@/data/products";

export function generateStaticParams() {
  return productCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.title,
    description: category.metaDescription,
    path: `/products/category/${category.slug}`,
  });
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.slug);

  return (
    <>
      <CategoryHero category={category} />
      <section className="border-y border-line bg-canvas section-space">
        <div className="container-shell">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">Services in this category</p>
              <h2 className="mt-2 text-3xl font-black text-ink">{category.shortTitle} products</h2>
            </div>
            <Button href="/products" variant="secondary">All Products</Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
