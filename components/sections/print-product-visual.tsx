import Image from "next/image";
import { brandVisuals, getBrandVisualForProduct } from "@/data/brand-visuals";
import { cn } from "@/lib/utils";

const serviceVisualStyles: Record<string, { bg: string; label: string; accent?: string }> = {
  "business-cards": { bg: "bg-[#f5f5f5]", label: "PrintMe", accent: "bg-brand" },
  flyers: { bg: "bg-[#fff6f2]", label: "Flyer", accent: "bg-[#f7c7b8]" },
  brochures: { bg: "bg-[#f3f4f6]", label: "Fold", accent: "bg-[#222222]" },
  postcards: { bg: "bg-[#fff7f1]", label: "Postcard", accent: "bg-brand" },
  posters: { bg: "bg-[#1f1f1f]", label: "Bold", accent: "bg-brand" },
  banners: { bg: "bg-[#eef4f9]", label: "Banner", accent: "bg-[#4f6f86]" },
  "promotional-printing": { bg: "bg-[#f4efe8]", label: "Promo", accent: "bg-brand" },
  "print-mail-services": { bg: "bg-[#f7f3ee]", label: "Mail", accent: "bg-[#222222]" },
  envelopes: { bg: "bg-[#f6f6f4]", label: "Mail", accent: "bg-brand" },
  signs: { bg: "bg-[#242424]", label: "Sign", accent: "bg-brand" },
  stickers: { bg: "bg-[#fff4ef]", label: "Thank You", accent: "bg-brand" },
  "passport-photos": { bg: "bg-[#f4f4f4]", label: "ID Photos", accent: "bg-[#d7d7d7]" },
  "document-printing": { bg: "bg-[#f6f6f6]", label: "Docs", accent: "bg-[#dedede]" },
  "engineering-drawings": { bg: "bg-[#eef2f3]", label: "Plans", accent: "bg-[#9aa8ad]" },
  "manual-cheques": { bg: "bg-[#f8f8f8]", label: "Cheque", accent: "bg-[#222222]" },
  "custom-orders": { bg: "bg-[#f1ebe7]", label: "Custom", accent: "bg-brand" },
  "graphic-design-services": { bg: "bg-[#f3eee9]", label: "Design", accent: "bg-brand" },
};

export function ServiceProductVisual({ slug }: { slug: string }) {
  const visual = serviceVisualStyles[slug] ?? serviceVisualStyles["custom-orders"];
  const photoVisual = getBrandVisualForProduct(slug);

  if (photoVisual) {
    return (
      <div className="relative flex h-36 items-end overflow-hidden rounded-[1.35rem] border border-line/80 bg-[#f4efe8]">
        <Image
          src={photoVisual.src}
          alt={photoVisual.alt}
          fill
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 100vw"
          className={cn("object-cover", photoVisual.focalClassName)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(20,18,16,0.45))]" />
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/32 to-transparent" />
        <div className="relative m-3 inline-flex max-w-[76%] items-center gap-2 rounded-full border border-white/60 bg-white/84 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_22px_rgba(18,17,16,0.08)] backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          Premium print detail
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative flex h-36 items-center justify-center overflow-hidden rounded-[1.35rem] border border-line/80", visual.bg)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_18rem)]" />
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/10 to-transparent" />
      <div className="absolute left-5 top-5 h-16 w-16 rounded-full bg-white/55 blur-2xl" />
      <div className="relative h-24 w-32 rotate-[-6deg] rounded-lg border border-black/10 bg-white shadow-card transition duration-300 group-hover:rotate-[-3deg] group-hover:scale-[1.03]">
        <div className={cn("h-3 w-full rounded-t-lg", visual.accent)} />
        <div className="p-3">
          <p className={cn("text-sm font-black leading-tight", slug === "posters" || slug === "signs" ? "text-ink" : "text-ink")}>
            {visual.label}
          </p>
          <div className="mt-2 h-1.5 w-16 rounded-full bg-black/15" />
          <div className="mt-1 h-1.5 w-10 rounded-full bg-black/10" />
        </div>
      </div>
      <div className="absolute right-6 top-7 h-14 w-10 rotate-6 rounded-md bg-brand/90 shadow-soft" />
      <div className="absolute bottom-6 left-8 h-5 w-16 rounded-full bg-white/55 blur-lg" />
    </div>
  );
}

export function HeroPrintComposition() {
  return (
    <div className="hero-visual-in hero-panel relative min-h-[500px] overflow-hidden bg-[rgba(246,240,232,0.88)] p-4 shadow-glass sm:p-5">
      <Image
        src={brandVisuals.rangeHero.src}
        alt={brandVisuals.rangeHero.alt}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className={cn("object-cover", brandVisuals.rangeHero.focalClassName)}
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.22),rgba(16,14,12,0.28))]" aria-hidden="true" />
      <div className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" aria-hidden="true" />
      <div className="mockup-float absolute left-5 top-5 max-w-[16rem] rounded-[1.45rem] border border-white/60 bg-white/82 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_28px_rgba(18,17,16,0.12)] backdrop-blur-md [--float-delay:0ms] [--mockup-rotate:-7deg]">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Premium brand range</p>
        <p className="mt-2 text-lg font-black leading-[1.02] text-ink">Cards, brochures, stationery, signs, and packaging in one clean workflow.</p>
      </div>
      <div className="mockup-float absolute bottom-5 left-5 rounded-[1.45rem] border border-white/65 bg-ink/88 px-5 py-4 text-white shadow-[0_20px_34px_rgba(18,17,16,0.18)] backdrop-blur-md [--float-delay:540ms] [--mockup-rotate:-4deg]">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">What customers trust</p>
        <div className="mt-2 space-y-2 text-sm font-bold leading-5">
          <p>Premium print detail</p>
          <p>Structured service paths</p>
          <p>Local pickup and support</p>
        </div>
      </div>
      <div className="mockup-float absolute right-5 top-5 max-w-[13.5rem] rounded-[1.45rem] border border-white/60 bg-white/84 px-4 py-4 text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_16px_28px_rgba(18,17,16,0.1)] backdrop-blur-md [--float-delay:920ms] [--mockup-rotate:6deg]">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Service coverage</p>
        <p className="mt-2 text-sm font-bold leading-6">Business print, brochures, direct-mail pieces, premium cards, banners, and rigid signs.</p>
      </div>
    </div>
  );
}
