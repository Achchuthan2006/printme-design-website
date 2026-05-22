import { cn } from "@/lib/utils";

const serviceVisualStyles: Record<string, { bg: string; label: string; accent?: string }> = {
  "business-cards": { bg: "bg-[#f5f5f5]", label: "PrintMe", accent: "bg-brand" },
  flyers: { bg: "bg-[#fff6f2]", label: "Flyer", accent: "bg-[#f7c7b8]" },
  brochures: { bg: "bg-[#f3f4f6]", label: "Fold", accent: "bg-[#222222]" },
  posters: { bg: "bg-[#1f1f1f]", label: "Bold", accent: "bg-brand" },
  banners: { bg: "bg-[#eef4f9]", label: "Banner", accent: "bg-[#4f6f86]" },
  envelopes: { bg: "bg-[#f6f6f4]", label: "Mail", accent: "bg-brand" },
  signs: { bg: "bg-[#242424]", label: "Sign", accent: "bg-brand" },
  stickers: { bg: "bg-[#fff4ef]", label: "Thank You", accent: "bg-brand" },
  "passport-photos": { bg: "bg-[#f4f4f4]", label: "ID Photos", accent: "bg-[#d7d7d7]" },
  "document-printing": { bg: "bg-[#f6f6f6]", label: "Docs", accent: "bg-[#dedede]" },
  "engineering-drawings": { bg: "bg-[#eef2f3]", label: "Plans", accent: "bg-[#9aa8ad]" },
  "manual-cheques": { bg: "bg-[#f8f8f8]", label: "Cheque", accent: "bg-[#222222]" },
  "custom-orders": { bg: "bg-[#f1ebe7]", label: "Custom", accent: "bg-brand" },
};

export function ServiceProductVisual({ slug }: { slug: string }) {
  const visual = serviceVisualStyles[slug] ?? serviceVisualStyles["custom-orders"];

  return (
    <div className={cn("relative flex h-28 items-center justify-center overflow-hidden rounded-md border border-line", visual.bg)}>
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/8 to-transparent" />
      <div className="relative h-20 w-28 rotate-[-4deg] rounded-sm border border-black/10 bg-white shadow-card transition duration-300 group-hover:rotate-[-2deg] group-hover:scale-[1.03]">
        <div className={cn("h-3 w-full", visual.accent)} />
        <div className="p-3">
          <p className={cn("text-sm font-black leading-tight", slug === "posters" || slug === "signs" ? "text-ink" : "text-ink")}>
            {visual.label}
          </p>
          <div className="mt-2 h-1.5 w-16 rounded-full bg-black/15" />
          <div className="mt-1 h-1.5 w-10 rounded-full bg-black/10" />
        </div>
      </div>
      <div className="absolute right-5 top-5 h-11 w-8 rotate-6 rounded-sm bg-brand/90 shadow-soft" />
    </div>
  );
}

export function HeroPrintComposition() {
  return (
    <div className="hero-visual-in relative min-h-[430px] overflow-hidden rounded-lg bg-[#f0f0ef] shadow-card">
      <div className="mockup-float absolute -right-8 top-10 h-72 w-52 rounded-md bg-ink p-6 text-white shadow-card [--float-delay:500ms] [--mockup-rotate:14deg]">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">Custom print</p>
        <p className="mt-16 text-4xl font-black uppercase leading-[0.92]">
          Bold
          <br />
          Ideas.
          <br />
          Bright
          <br />
          Prints.
        </p>
        <div className="absolute bottom-0 left-0 h-14 w-full bg-brand" />
      </div>
      <div className="mockup-float absolute left-12 top-14 h-28 w-48 rounded-md bg-white p-5 shadow-card [--float-delay:0ms] [--mockup-rotate:-14deg]">
        <p className="text-xl font-black text-ink">
          Print<span className="text-brand">Me</span>
        </p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate">20+ Years Experience</p>
        <div className="mt-5 h-2 w-28 rounded-full bg-line" />
      </div>
      <div className="mockup-float absolute bottom-12 left-8 h-56 w-44 rounded-md bg-white p-5 shadow-card [--float-delay:900ms] [--mockup-rotate:-10deg]">
        <div className="h-24 rounded-sm bg-[#d9e4ec]" />
        <p className="mt-5 text-2xl font-black uppercase leading-none text-brand">Grow your business</p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate">Flyers and banners</p>
      </div>
      <div className="mockup-float absolute bottom-9 right-28 h-40 w-48 rounded-md bg-white p-5 shadow-card [--float-delay:1300ms] [--mockup-rotate:8deg]">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-sm bg-[#dedede]" />
          ))}
        </div>
        <p className="mt-4 text-sm font-black text-ink">Passport Photos</p>
      </div>
    </div>
  );
}
