export const reviewHighlights = {
  rating: "4.9/5",
  label: "Local trust built on repeat orders",
  stats: [
    { value: "20+ yrs", label: "Print experience" },
    { value: "Fast reply", label: "Quote follow-up" },
    { value: "Pickup ready", label: "Scarborough shop" },
  ],
  proofPoints: [
    "Clear file review before production",
    "Trusted by clinics, realtors, contractors, and local retail teams",
    "Real support for rush, signage, and custom print jobs",
  ],
};

export const brandArchitectureRecommendation = {
  title: "One core site. Three focused paths.",
  description:
    "Keep PrintMe as one premium parent platform, then use dedicated landing systems for core print, signage, and design-led custom work instead of splitting into fully separate websites too early.",
  pillars: [
    {
      title: "Core print",
      detail: "Cards, flyers, brochures, postcards, documents, and repeat business essentials.",
      href: "/products/category/business-printing",
    },
    {
      title: "Signs and large format",
      detail: "Banners, signs, posters, and visibility-first jobs with clearer size and material guidance.",
      href: "/products/category/signs-banners",
    },
    {
      title: "Design and custom",
      detail: "Quote-led work for design help, custom sizing, specialty print, and complex jobs.",
      href: "/products/category/specialty-custom-printing",
    },
  ],
};

export const paymentGuidance = {
  heading: "Simple payment rules",
  points: [
    "Direct-order items can be paid securely online.",
    "Quote-first and custom jobs are reviewed before payment is requested.",
    "Delivery cost, specialty finishing, and custom production are confirmed before charge approval.",
  ],
};

export const timelineRules = [
  {
    title: "Standard production",
    window: "2-3 business days",
    detail: "Applies to common print products with ready artwork and no unusual finishing.",
  },
  {
    title: "Extended production",
    window: "5-7 business days",
    detail: "Used for folding, large-format, custom stock, signage, or larger-quantity work.",
  },
  {
    title: "Rush review",
    window: "Confirmed by staff",
    detail: "Rush availability depends on artwork readiness, quantity, and current production load.",
  },
];

export type SizePreviewItem = {
  label: string;
  width: number;
  height: number;
  use: string;
  featured?: boolean;
};

export const sizePreviewLibrary: Record<string, SizePreviewItem[]> = {
  "business-cards": [
    { label: "3.5 x 2 in", width: 3.5, height: 2, use: "Standard handout", featured: true },
  ],
  flyers: [
    { label: "5.5 x 8.5", width: 5.5, height: 8.5, use: "Compact promo" },
    { label: "8.5 x 11", width: 8.5, height: 11, use: "Most popular", featured: true },
    { label: "11 x 17", width: 11, height: 17, use: "Window or event display" },
  ],
  brochures: [
    { label: "8.5 x 11 flat", width: 8.5, height: 11, use: "Bi-fold or tri-fold", featured: true },
    { label: "11 x 17 flat", width: 11, height: 17, use: "Larger service guide" },
  ],
  postcards: [
    { label: "4 x 6", width: 4, height: 6, use: "Mail or handout", featured: true },
    { label: "5 x 7", width: 5, height: 7, use: "Premium invite feel" },
    { label: "5.5 x 8.5", width: 5.5, height: 8.5, use: "Campaign card" },
  ],
  posters: [
    { label: "11 x 17", width: 11, height: 17, use: "Counter or window" },
    { label: "18 x 24", width: 18, height: 24, use: "Most popular", featured: true },
    { label: "24 x 36", width: 24, height: 36, use: "Large promotion" },
  ],
  banners: [
    { label: "2 x 4 ft", width: 24, height: 48, use: "Booth or wall" },
    { label: "3 x 6 ft", width: 36, height: 72, use: "Most popular", featured: true },
    { label: "Custom", width: 42, height: 84, use: "Storefront or event" },
  ],
  signs: [
    { label: "12 x 18", width: 12, height: 18, use: "Counter or notice" },
    { label: "18 x 24", width: 18, height: 24, use: "Most popular", featured: true },
    { label: "24 x 36", width: 24, height: 36, use: "Wayfinding or promo" },
  ],
};

const sizePreviewAliases: Record<string, string> = {
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

export function getSizePreviewItems(slug: string) {
  const sourceSlug = sizePreviewAliases[slug] ?? slug;
  return sizePreviewLibrary[sourceSlug] ?? null;
}

export const signageFocusPoints = [
  "Large-format jobs are organized around material, placement, and visibility first.",
  "Most sign and banner work starts with a quote so size, finishing, and install details are checked properly.",
  "Dedicated signage landing paths are the right next step before creating a separate site.",
];
