import { catalogUtilityLinks, getCatalogSearchEntries, getRelatedServicesForCategory } from "@/data/catalog";
import { productCategories, products } from "@/data/products";
import { servicePages } from "@/data/services";
import {
  DiscoveryFacetGroup,
  DiscoveryRecoveryAction,
  DiscoveryTemplateResult,
  PrintProduct,
  ProductCategory,
} from "@/types";

export type DiscoveryFilterState = Partial<Record<
  "size" | "material" | "finish" | "turnaround" | "premium" | "template" | "orderPath" | "environment",
  string[]
>>;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function includesQuery(haystacks: string[], query: string) {
  const normalizedQuery = normalize(query);
  return haystacks.some((value) => normalize(value).includes(normalizedQuery));
}

export function runCatalogSearch(query: string, limit = 8) {
  const entries = getCatalogSearchEntries();
  const normalizedQuery = normalize(query);
  const results = !normalizedQuery
    ? entries.slice(0, limit)
    : entries.filter((entry) => includesQuery([entry.title, entry.description, ...entry.keywords], normalizedQuery)).slice(0, limit);

  return {
    results,
    recovery: buildNoResultsRecovery(query),
    suggestions: results.slice(0, 4).map((entry) => entry.title),
  };
}

export function buildNoResultsRecovery(query: string): DiscoveryRecoveryAction[] {
  const label = query.trim() ? `Search for "${query.trim()}" another way` : "Try a broader path";
  return [
    {
      title: label,
      description: "Browse the full catalog or use a quote-first route for unclear jobs.",
      href: "/products",
    },
    ...catalogUtilityLinks.slice(0, 2).map((item) => ({
      title: item.title,
      description: item.description,
      href: item.href,
    })),
  ];
}

function buildTemplateResults(currentProducts: PrintProduct[]): DiscoveryTemplateResult[] {
  return currentProducts.slice(0, 3).map((product) => ({
    id: `${product.slug}-template`,
    title: `${product.title} starter`,
    summary: `A quick starting point for ${product.title.toLowerCase()} jobs.`,
    industry: product.category,
    productSlug: product.slug,
    href: `/products/${product.slug}`,
    badge: "Starter",
  }));
}

function sortProducts(items: PrintProduct[], sort?: string) {
  const sorted = [...items];
  switch (sort) {
    case "a-z":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "premium":
      sorted.sort((a, b) => Number(Boolean(b.badges?.includes("Premium"))) - Number(Boolean(a.badges?.includes("Premium"))));
      break;
    case "quote-first":
      sorted.sort((a, b) => Number(a.ctaMode === "quote-first") - Number(b.ctaMode === "quote-first"));
      break;
    default:
      break;
  }
  return sorted;
}

export function buildDiscoveryExperience({
  query,
  categorySlug,
  filters,
  sort,
}: {
  query?: string;
  categorySlug?: string;
  filters?: DiscoveryFilterState;
  sort?: string;
}) {
  const normalizedQuery = normalize(query ?? "");
  let visibleProducts = categorySlug ? products.filter((product) => product.categorySlug === categorySlug) : products;

  if (normalizedQuery) {
    visibleProducts = visibleProducts.filter((product) =>
      includesQuery([product.title, product.description, product.category, product.slug, ...product.idealFor, ...product.specs], normalizedQuery),
    );
  }

  if (filters?.orderPath?.length) {
    visibleProducts = visibleProducts.filter((product) => filters.orderPath?.includes(product.ctaMode));
  }

  const categories = productCategories;
  const currentCategory = categorySlug ? categories.find((category) => category.slug === categorySlug) : undefined;
  const facets = getDiscoveryFacetGroups(visibleProducts, categorySlug);
  const services = currentCategory ? getRelatedServicesForCategory(currentCategory) : servicePages.slice(0, 6);

  return {
    search: runCatalogSearch(query ?? "", 8),
    products: sortProducts(visibleProducts, sort),
    facets,
    templates: buildTemplateResults(visibleProducts),
    services,
    support: catalogUtilityLinks,
    recovery: buildNoResultsRecovery(query ?? ""),
    recommendations: getDiscoveryRecommendations(visibleProducts, currentCategory),
  };
}

export function getDiscoveryFacetGroups(currentProducts: PrintProduct[], categorySlug?: string): DiscoveryFacetGroup[] {
  const turnaroundValues = Array.from(new Set(currentProducts.map((product) => product.turnaround)));
  const orderPaths = Array.from(new Set(currentProducts.map((product) => product.ctaMode)));

  return [
    {
      id: `${categorySlug ?? "all"}-turnaround`,
      label: "Turnaround",
      type: "single" as const,
      options: turnaroundValues.map((value) => ({
        value,
        label: value,
        count: currentProducts.filter((product) => product.turnaround === value).length,
      })),
    },
    {
      id: `${categorySlug ?? "all"}-order-path`,
      label: "Order path",
      type: "multi" as const,
      options: orderPaths.map((value) => ({
        value,
        label: value.replaceAll("-", " "),
        count: currentProducts.filter((product) => product.ctaMode === value).length,
      })),
    },
  ].filter((group) => group.options.length > 0);
}

export function getDiscoveryRecommendations(currentProducts: PrintProduct[], category?: ProductCategory) {
  const supportLinks = category?.supportLinks?.length
    ? category.supportLinks
    : catalogUtilityLinks;

  return {
    premium: currentProducts.filter((product) => product.badges?.includes("Premium")).slice(0, 3),
    templateReady: currentProducts.filter((product) => product.ctaMode !== "contact").slice(0, 3),
    supportLinks,
  };
}
