import { serviceOptions, services } from "@/lib/site";
import { ServicePage, ServiceItem } from "@/types";

function titleToSlug(title: string) {
  return title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getLinkedProductSlug(service: ServiceItem) {
  if (service.slug === "packaging-label-printing") return "stickers";
  if (service.slug === "apparel-printing") return "custom-orders";
  if (service.slug === "promotional-products") return "custom-orders";
  if (service.slug === "branding-launch-support") return "custom-orders";
  if (service.slug === "rush-printing-review") return "custom-orders";
  if (service.slug === "invitation-event-print") return "custom-orders";
  return service.slug;
}

export const servicePages: ServicePage[] = services.map((service) => ({
  slug: service.slug,
  title: service.title,
  shortTitle: service.title,
  summary: service.description,
  metaTitle: `${service.title} | PrintMe Design`,
  metaDescription: service.description,
  heroTitle: service.title,
  heroDescription: service.description,
  intent: `Learn when ${service.title.toLowerCase()} is the right PrintMe path.`,
  primaryCta: "Request a Quote",
  secondaryCta: "Browse Products",
  categorySlugs: [],
  relatedProductSlugs: [getLinkedProductSlug(service)],
  localIntentQueries: [service.title.toLowerCase(), `${service.title.toLowerCase()} scarborough`],
  proofPoints: [
    "Local Scarborough support",
    "Structured quote review when needed",
    "Production guidance before release",
  ],
  deliverables: [service.title, "Quote review", "File guidance"],
  useCases: [service.description],
  process: [
    "Share the job details",
    "PrintMe reviews the production path",
    "Approve the next step",
  ],
  faqs: [
    {
      question: `How do I get started with ${service.title}?`,
      answer: "Use the quote request flow when the job needs pricing, file review, or production guidance before checkout.",
    },
  ],
}));

export function getServicePageBySlug(slug: string) {
  return servicePages.find((service) => service.slug === slug);
}

export function getServicePageHrefByServiceSlug(slug?: string | null) {
  if (!slug) return null;
  const directMatch = servicePages.find((service) => service.slug === slug);
  if (directMatch) return `/services/${directMatch.slug}`;

  const byTitle = servicePages.find((service) => titleToSlug(service.title) === slug);
  return byTitle ? `/services/${byTitle.slug}` : null;
}

export function getServiceItemsForProducts(slugs: string[]) {
  return servicePages.filter((service) => service.relatedProductSlugs.some((slug) => slugs.includes(slug)));
}

export { serviceOptions };
