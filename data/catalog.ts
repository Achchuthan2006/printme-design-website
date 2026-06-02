import { IndustryPath, CatalogSearchEntry, ProductCategory, ServicePage, CatalogShortcut } from "@/types";
import { getProductsByCategory, productCategories, products } from "@/data/products";
import { servicePages } from "@/data/services";

export const industryPaths: IndustryPath[] = [
  {
    slug: "retail",
    title: "Retail and storefront",
    description: "Signs, flyers, labels, packaging support, and local promotion for physical locations.",
    href: "/local/scarborough-print-shop",
    icon: "store",
    featuredProducts: ["signs", "stickers", "flyers"],
  },
  {
    slug: "events",
    title: "Events and activations",
    description: "Banners, posters, handouts, and fast-turnaround support for launches and events.",
    href: "/local/scarborough-banner-printing",
    icon: "spark",
    featuredProducts: ["banners", "posters", "flyers"],
  },
  {
    slug: "professional-services",
    title: "Professional services",
    description: "Cards, stationery, brochures, and polished print for offices, clinics, and teams.",
    href: "/local/business-card-printing-scarborough",
    icon: "briefcase",
    featuredProducts: ["business-cards", "brochures", "envelopes"],
  },
];

export const catalogUtilityLinks: CatalogShortcut[] = [
  {
    title: "Request a custom quote",
    description: "Start the guided quote path for specialty, rush, or unclear jobs.",
    href: "/quote-request",
    icon: "document",
  },
  {
    title: "Check artwork guidelines",
    description: "Review bleed, sizing, and file-readiness basics before you upload.",
    href: "/artwork-guidelines",
    icon: "inspect",
  },
  {
    title: "Need support?",
    description: "Use the support center for ordering, proofs, billing, and production help.",
    href: "/support",
    icon: "chat",
  },
  {
    title: "Pickup and delivery",
    description: "Learn how local pickup and delivery work before the order is released.",
    href: "/pickup-delivery",
    icon: "truck",
  },
];

export const featuredCatalogCollections = productCategories.slice(0, 4).map((category) => ({
  title: category.title,
  description: category.description,
  href: `/products/category/${category.slug}`,
  badge: category.productCountLabel,
}));

export function getCatalogNavigationFamilies() {
  return productCategories;
}

export function getCatalogCategoryBySlug(slug: string) {
  return productCategories.find((category) => category.slug === slug);
}

export function getCatalogSearchEntries(): CatalogSearchEntry[] {
  const productEntries = products.map((product) => ({
    title: product.title,
    description: product.description,
    href: `/products/${product.slug}`,
    type: "product" as const,
    keywords: [product.slug, product.categorySlug, ...product.idealFor],
    badge: product.badges?.[0],
  }));

  const categoryEntries = productCategories.map((category) => ({
    title: category.title,
    description: category.description,
    href: `/products/category/${category.slug}`,
    type: "category" as const,
    keywords: [category.slug, category.shortTitle, ...(category.searchTerms ?? [])],
    badge: category.productCountLabel,
  }));

  const serviceEntries = servicePages.map((service) => ({
    title: service.title,
    description: service.summary,
    href: `/services/${service.slug}`,
    type: "service" as const,
    keywords: [service.slug, ...service.relatedProductSlugs],
  }));

  const supportEntries = catalogUtilityLinks.map((item) => ({
    title: item.title,
    description: item.description,
    href: item.href,
    type: "support" as const,
    keywords: [item.title.toLowerCase()],
  }));

  return [...categoryEntries, ...productEntries, ...serviceEntries, ...supportEntries];
}

export function getCategoryPreviewProducts(category: ProductCategory) {
  return getProductsByCategory(category.slug).slice(0, 6);
}

export function getRelatedServicesForCategory(category: ProductCategory): ServicePage[] {
  const normalized = category.slug.replace(/-/g, " ");
  return servicePages.filter((service) => {
    const related = service.relatedProductSlugs.some((slug) => slug === category.slug || getProductsByCategory(category.slug).some((product) => product.slug === slug));
    return related || service.title.toLowerCase().includes(normalized);
  }).slice(0, 6);
}
