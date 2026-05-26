import { ProductTemplate } from "@/types";

export const productTemplates: ProductTemplate[] = [
  {
    id: "bc-realtor-clean",
    productSlug: "business-cards",
    title: "Clean Realtor Card",
    industry: "Real estate",
    summary: "Minimal front, service highlights on the back, and a QR-ready layout.",
    recommendedSize: "3.5 x 2 in",
    tags: ["Front and back", "Most popular", "Premium feel"],
    editableFields: ["fullName", "companyName", "phone", "email", "headline"],
    styleDirection: "Minimal and premium with a local-trust feel.",
    views: [
      { id: "front", label: "Front", headline: "A clean first impression", detail: "Name, title, phone, and logo positioned for a fast read.", accent: "brand" },
      { id: "back", label: "Back", headline: "Support details", detail: "Room for services, QR code, or appointment details.", accent: "soft" },
    ],
  },
  {
    id: "flyer-food-promo",
    productSlug: "flyers",
    title: "Restaurant Promo Flyer",
    industry: "Food and hospitality",
    summary: "Hero offer at the top, menu or service highlights, and one clear next step.",
    recommendedSize: "8.5 x 11",
    tags: ["Upload or customize", "Promo layout"],
    editableFields: ["companyName", "phone", "website", "headline"],
    styleDirection: "Offer-first layout with bold CTA and clean section hierarchy.",
    views: [
      { id: "front", label: "Front", headline: "Offer-first layout", detail: "Built for promos, launches, and menu drops.", accent: "brand" },
      { id: "back", label: "Back", headline: "Optional reverse side", detail: "Use the back for pricing, a menu, or campaign details.", accent: "soft" },
    ],
  },
  {
    id: "brochure-clinic-fold",
    productSlug: "brochures",
    title: "Clinic Service Brochure",
    industry: "Healthcare and wellness",
    summary: "Structured fold with services, process, trust cues, and booking prompt.",
    recommendedSize: "8.5 x 11 flat",
    tags: ["Tri-fold", "Service explainer"],
    editableFields: ["companyName", "phone", "website", "headline"],
    styleDirection: "Calm editorial structure with trust and service clarity.",
    views: [
      { id: "outside", label: "Outside", headline: "Cover and contact", detail: "Front panel, quick promise, and booking details.", accent: "ink" },
      { id: "inside", label: "Inside", headline: "Service breakdown", detail: "Panels designed for clear scanning and trust-building.", accent: "brand" },
    ],
  },
  {
    id: "postcard-real-estate",
    productSlug: "postcards",
    title: "Neighbourhood Mailer",
    industry: "Real estate",
    summary: "Bold front visual with campaign message and direct-mail-ready reverse layout.",
    recommendedSize: "5 x 7",
    tags: ["Mail-ready", "Local campaign"],
    editableFields: ["fullName", "companyName", "phone", "website", "headline"],
    styleDirection: "Campaign-led direct mail with local-market clarity.",
    views: [
      { id: "front", label: "Front", headline: "Visual-led headline", detail: "Built for listings, launches, and local promotions.", accent: "brand" },
      { id: "back", label: "Back", headline: "Mail and response layout", detail: "Space for campaign copy, contact details, and mailing setup.", accent: "soft" },
    ],
  },
  {
    id: "poster-event-launch",
    productSlug: "posters",
    title: "Event Launch Poster",
    industry: "Events",
    summary: "Large headline, date block, and bold visibility from a distance.",
    recommendedSize: "18 x 24",
    tags: ["Large-format", "Distance-readable"],
    editableFields: ["companyName", "website", "headline"],
    styleDirection: "Big-message poster composition for quick distance readability.",
    views: [
      { id: "flat", label: "Flat preview", headline: "Big message first", detail: "Designed for quick readability on walls, windows, and counters.", accent: "ink" },
    ],
  },
  {
    id: "banner-storefront-sale",
    productSlug: "banners",
    title: "Storefront Sale Banner",
    industry: "Retail",
    summary: "A large-format layout for bold offer messaging and clear distance visibility.",
    recommendedSize: "3 x 6 ft",
    tags: ["Outdoor-ready", "Large-format"],
    editableFields: ["companyName", "phone", "website", "headline"],
    styleDirection: "Large-format promotional design for storefront and event use.",
    views: [
      { id: "flat", label: "Flat preview", headline: "Distance-led message", detail: "Built for storefronts, booths, and event visibility.", accent: "brand" },
      { id: "mockup", label: "Mockup", headline: "Installed look", detail: "Shows how the banner reads in a real-world large-format context.", accent: "soft" },
    ],
  },
  {
    id: "sign-wayfinding",
    productSlug: "signs",
    title: "Wayfinding Sign Starter",
    industry: "Retail and office",
    summary: "Simple arrow-led signage with strong contrast and fast readability.",
    recommendedSize: "18 x 24",
    tags: ["Indoor signage", "Directional"],
    editableFields: ["companyName", "headline"],
    styleDirection: "Fast-reading directional signage with strong visual contrast.",
    views: [
      { id: "flat", label: "Flat preview", headline: "Fast readability", detail: "Good for lobbies, counters, and directional points.", accent: "ink" },
      { id: "mockup", label: "Mockup", headline: "Space context", detail: "Helps customers picture scale before they request a quote.", accent: "brand" },
    ],
  },
];

export function getTemplatesForProduct(productSlug: string) {
  return productTemplates.filter((template) => template.productSlug === productSlug);
}
