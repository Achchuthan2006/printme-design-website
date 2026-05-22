import type { MetadataRoute } from "next";
import { localLandingPages } from "@/data/cro";
import { productCategories, products } from "@/data/products";
import { env } from "@/lib/env";

function absoluteUrl(path: string) {
  return `${env.siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const corePages = [
    "",
    "/services",
    "/quote-request",
    "/contact",
    "/artwork-guidelines",
    "/support",
    "/faq",
    "/pickup-delivery",
    "/payment-info",
    "/order-status",
  ];

  return [
    ...corePages.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...productCategories.map((category) => ({
      url: absoluteUrl(`/products/category/${category.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...localLandingPages.map((page) => ({
      url: absoluteUrl(`/local/${page.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
