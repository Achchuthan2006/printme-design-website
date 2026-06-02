import { ProductTemplate } from "@/types";

const templateSourceAliases: Record<string, string> = {
  "standard-business-cards": "business-cards",
  "premium-business-cards": "business-cards",
  "matte-business-cards": "business-cards",
  "rounded-corner-business-cards": "business-cards",
  "luxury-business-cards": "business-cards",
  "standard-flyers": "flyers",
  "folded-flyers": "brochures",
  "dl-flyers": "flyers",
  "premium-flyers": "flyers",
  "trifold-brochures": "brochures",
  "yard-signs": "signs",
  "foam-board-signs": "signs",
  "acrylic-signs": "signs",
  "roll-up-banners": "banners",
  "window-graphics": "signs",
  "product-labels": "stickers",
  "box-sleeves": "stickers",
};

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
    paletteOptions: [
      { id: "charcoal-ember", label: "Charcoal ember", swatch: "#1f1b18", surfaceClassName: "bg-[#1f1b18]", textClassName: "text-white" },
      { id: "brand-ivory", label: "Brand ivory", swatch: "#d94620", surfaceClassName: "bg-[#d94620]", textClassName: "text-white" },
      { id: "linen-slate", label: "Linen slate", swatch: "#f4efe8", surfaceClassName: "bg-[#f4efe8]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "editorial", label: "Editorial", className: "font-black tracking-[-0.03em]", note: "Best for premium and minimal brands." },
      { id: "balanced", label: "Balanced", className: "font-semibold tracking-[-0.01em]", note: "Safer for everyday business use." },
    ],
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
    paletteOptions: [
      { id: "brand-sunrise", label: "Brand sunrise", swatch: "#d94620", surfaceClassName: "bg-[#d94620]", textClassName: "text-white" },
      { id: "midnight-cream", label: "Midnight cream", swatch: "#171412", surfaceClassName: "bg-[#171412]", textClassName: "text-white" },
      { id: "market-soft", label: "Market soft", swatch: "#f8e2d7", surfaceClassName: "bg-[#f8e2d7]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "promo-bold", label: "Promo bold", className: "font-black uppercase tracking-[0.02em]", note: "Makes offers feel louder from a distance." },
      { id: "clean-sans", label: "Clean sans", className: "font-semibold tracking-normal", note: "Better when the flyer carries more detail." },
    ],
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
    paletteOptions: [
      { id: "clinic-ink", label: "Clinic ink", swatch: "#1f2732", surfaceClassName: "bg-[#1f2732]", textClassName: "text-white" },
      { id: "brand-soft", label: "Brand soft", swatch: "#f4efe8", surfaceClassName: "bg-[#f4efe8]", textClassName: "text-ink" },
      { id: "warm-paper", label: "Warm paper", swatch: "#fffaf5", surfaceClassName: "bg-[#fffaf5]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "calm-editorial", label: "Calm editorial", className: "font-black tracking-[-0.02em]", note: "Supports trust-heavy service brochures." },
      { id: "service-plain", label: "Service plain", className: "font-semibold tracking-normal", note: "Best when readability matters more than style." },
    ],
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
    paletteOptions: [
      { id: "campaign-brand", label: "Campaign brand", swatch: "#d94620", surfaceClassName: "bg-[#d94620]", textClassName: "text-white" },
      { id: "open-house", label: "Open house", swatch: "#202429", surfaceClassName: "bg-[#202429]", textClassName: "text-white" },
      { id: "mailer-cream", label: "Mailer cream", swatch: "#f7efe7", surfaceClassName: "bg-[#f7efe7]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "headline-first", label: "Headline first", className: "font-black tracking-[-0.03em]", note: "Good for offers, launches, and listings." },
      { id: "mailer-clean", label: "Mailer clean", className: "font-semibold tracking-normal", note: "Keeps mail-ready details easier to scan." },
    ],
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
    paletteOptions: [
      { id: "poster-night", label: "Poster night", swatch: "#151515", surfaceClassName: "bg-[#151515]", textClassName: "text-white" },
      { id: "poster-brand", label: "Poster brand", swatch: "#d94620", surfaceClassName: "bg-[#d94620]", textClassName: "text-white" },
      { id: "poster-cream", label: "Poster cream", swatch: "#f9eedf", surfaceClassName: "bg-[#f9eedf]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "distance-bold", label: "Distance bold", className: "font-black uppercase tracking-[0.03em]", note: "Best for event, sale, and public-facing posters." },
      { id: "editorial-poster", label: "Editorial poster", className: "font-black tracking-[-0.02em]", note: "A premium option for gallery or brand work." },
    ],
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
    paletteOptions: [
      { id: "banner-brand", label: "Banner brand", swatch: "#d94620", surfaceClassName: "bg-[#d94620]", textClassName: "text-white" },
      { id: "banner-navy", label: "Banner navy", swatch: "#234056", surfaceClassName: "bg-[#234056]", textClassName: "text-white" },
      { id: "banner-cream", label: "Banner cream", swatch: "#f6efe8", surfaceClassName: "bg-[#f6efe8]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "impact-banner", label: "Impact", className: "font-black uppercase tracking-[0.02em]", note: "Best for large headline-first signage." },
      { id: "clean-banner", label: "Clean", className: "font-semibold tracking-normal", note: "Helpful when the banner includes contact info." },
    ],
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
    paletteOptions: [
      { id: "sign-contrast", label: "High contrast", swatch: "#1b1b1b", surfaceClassName: "bg-[#1b1b1b]", textClassName: "text-white" },
      { id: "sign-brand", label: "Brand-led", swatch: "#d94620", surfaceClassName: "bg-[#d94620]", textClassName: "text-white" },
      { id: "sign-neutral", label: "Neutral", swatch: "#ece8e0", surfaceClassName: "bg-[#ece8e0]", textClassName: "text-ink" },
    ],
    fontOptions: [
      { id: "wayfinding", label: "Wayfinding", className: "font-black uppercase tracking-[0.04em]", note: "Helps arrows and messages read faster." },
      { id: "retail-clean", label: "Retail clean", className: "font-semibold tracking-normal", note: "Useful when the sign includes lighter messaging." },
    ],
    views: [
      { id: "flat", label: "Flat preview", headline: "Fast readability", detail: "Good for lobbies, counters, and directional points.", accent: "ink" },
      { id: "mockup", label: "Mockup", headline: "Space context", detail: "Helps customers picture scale before they request a quote.", accent: "brand" },
    ],
  },
];

export function getTemplatesForProduct(productSlug: string) {
  const sourceSlug = templateSourceAliases[productSlug] ?? productSlug;
  return productTemplates.filter((template) => template.productSlug === sourceSlug);
}
