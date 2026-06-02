import { siteConfig } from "@/lib/site";
import { FaqItem, PrintProduct, ProductCategory } from "@/types";

function absoluteUrl(path: string) {
  return `${siteConfig.domain.startsWith("http") ? siteConfig.domain : `https://${siteConfig.domain}`}${path}`;
}

export function buildBreadcrumbSchema(items: Array<{ label: string; href?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? absoluteUrl(item.href) : undefined,
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  if (!items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    telephone: siteConfig.phone,
    email: siteConfig.email,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
  };
}

export function buildLocalBusinessSchema({
  path = "/",
  description,
  areaServed,
}: {
  path?: string;
  description?: string;
  areaServed?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: absoluteUrl(path),
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description: description ?? siteConfig.description,
    areaServed,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Scarborough",
      addressRegion: "ON",
      addressCountry: "CA",
    },
  };
}

export function buildCollectionPageSchema({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: Array<{ name: string; path: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    hasPart: items.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function buildProductSchema(product: PrintProduct, category?: ProductCategory, path?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    category: category?.title ?? product.category,
    url: absoluteUrl(path ?? `/products/${product.slug}`),
    brand: {
      "@type": "Brand",
      name: siteConfig.brandName,
    },
  };
}
