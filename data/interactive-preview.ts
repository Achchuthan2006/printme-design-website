import { ProductInteractivePreviewModel } from "@/types";

export function getInteractivePreviewModel(slug: string): ProductInteractivePreviewModel {
  return {
    slug,
    previewTitle: "Product preview",
    previewSummary: "Use the interactive preview as a quick orientation layer before finalizing specs.",
    comparisonLabel: "Common setup comparisons",
    sizeOptions: [
      { value: "standard", label: "Standard", width: 8.5, height: 11, context: "Common production size", featured: true },
      { value: "compact", label: "Compact", width: 4, height: 6, context: "Space-conscious format" },
      { value: "large", label: "Large", width: 11, height: 17, context: "High-visibility format" },
    ],
    materialOptions: [
      { value: "standard", label: "Standard stock", detail: "Balanced cost and turnaround.", tone: "clean" },
      { value: "premium", label: "Premium stock", detail: "Better tactile feel and presentation.", tone: "premium" },
    ],
    finishOptions: [
      { value: "matte", label: "Matte", detail: "Low-glare finish.", sheen: "matte" },
      { value: "gloss", label: "Gloss", detail: "Higher color pop.", sheen: "glossy" },
    ],
    featureHighlights: ["Compare sizes quickly", "See common material paths", "Use as guidance before final proofing"],
    guideOverlays: [
      { id: "safe-area", label: "Safe area", detail: "Keep important content away from trim edges." },
      { id: "bleed", label: "Bleed", detail: "Extend backgrounds past the trim line when needed." },
    ],
    mockupNote: "Preview is illustrative and not a final production proof.",
    recommendationPrompts: [
      { label: "Need help choosing?", detail: "Use the quote or support path when the spec still needs review." },
    ],
  };
}
