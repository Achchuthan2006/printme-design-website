export const brandVisuals = {
  rangeHero: {
    src: "/images/brand/print-range-hero.jpg",
    alt: "A premium spread of print products including brochures, cards, stationery, packaging, and signage.",
    focalClassName: "object-center",
  },
  consultation: {
    src: "/images/brand/consultation-support.jpg",
    alt: "A PrintMe consultation moment with a customer reviewing print samples, colour swatches, and brochure options.",
    focalClassName: "object-center",
  },
  paperStock: {
    src: "/images/brand/paper-stock-detail.jpg",
    alt: "Close-up of layered premium paper stocks and textured stationery materials.",
    focalClassName: "object-center",
  },
  embossedFinishes: {
    src: "/images/brand/embossed-finishes.jpg",
    alt: "Embossed and textured print finishes shown in a premium close-up composition.",
    focalClassName: "object-center",
  },
  premiumBusinessCards: {
    src: "/images/brand/premium-business-cards.jpg",
    alt: "Close-up of premium business cards with textured stock, layered edges, and colour references.",
    focalClassName: "object-center",
  },
} as const;

export function getBrandVisualForProduct(slug: string) {
  const sourceSlug =
    {
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
    }[slug] ?? slug;

  if (["business-cards", "manual-cheques", "envelopes"].includes(sourceSlug)) {
    return brandVisuals.premiumBusinessCards;
  }

  if (["flyers", "brochures", "postcards", "promotional-printing", "print-mail-services"].includes(sourceSlug)) {
    return brandVisuals.rangeHero;
  }

  if (["banners", "signs", "posters"].includes(sourceSlug)) {
    return brandVisuals.rangeHero;
  }

  if (["graphic-design-services"].includes(sourceSlug)) {
    return brandVisuals.consultation;
  }

  if (["custom-orders", "stickers"].includes(sourceSlug)) {
    return brandVisuals.embossedFinishes;
  }

  if (["document-printing", "engineering-drawings"].includes(sourceSlug)) {
    return brandVisuals.paperStock;
  }

  return null;
}
