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
    <div className="hero-visual-in hero-panel relative min-h-[500px] bg-[rgba(246,240,232,0.88)] p-6 shadow-glass">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.95),transparent_28rem),radial-gradient(circle_at_80%_14%,rgba(217,70,32,0.14),transparent_22rem)]" aria-hidden="true" />
      <div className="absolute inset-x-10 top-8 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" aria-hidden="true" />
      <div className="mockup-float absolute -right-3 top-10 h-80 w-56 rounded-[1.75rem] bg-ink p-7 text-white shadow-card [--float-delay:500ms] [--mockup-rotate:11deg]">
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/45">Campaign Print</p>
        <p className="mt-14 font-display text-[2.7rem] leading-[0.9] text-white">
          Bold ideas,
          <br />
          beautifully
          <br />
          printed.
        </p>
        <p className="mt-4 max-w-[12rem] text-xs leading-5 text-white/62">Flyers, signage, packaging, documents, and fast local support.</p>
        <div className="absolute bottom-0 left-0 h-14 w-full rounded-b-[1.75rem] bg-brand" />
      </div>
      <div className="mockup-float liquid-glass absolute left-10 top-14 h-32 w-52 rounded-[1.65rem] p-5 [--float-delay:0ms] [--mockup-rotate:-14deg]">
        <p className="text-2xl font-black text-ink">
          Print<span className="text-brand">Me</span>
        </p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate">20+ Years Experience</p>
        <div className="mt-5 h-2 w-28 rounded-full bg-line" />
        <div className="mt-2 h-2 w-16 rounded-full bg-brand/20" />
      </div>
      <div className="mockup-float absolute bottom-10 left-8 h-64 w-48 rounded-[1.6rem] border border-white/80 bg-white p-5 shadow-card [--float-delay:900ms] [--mockup-rotate:-10deg]">
        <div className="h-28 rounded-lg bg-[#d9e4ec]" />
        <p className="mt-5 font-display text-[2rem] leading-none text-brand">Grow your business</p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate">Flyers, banners, promos</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-2 rounded-full bg-brand/20" />
          <div className="h-2 rounded-full bg-ink/12" />
        </div>
      </div>
      <div className="mockup-float liquid-glass absolute bottom-8 right-28 h-44 w-52 rounded-[1.65rem] p-5 [--float-delay:1300ms] [--mockup-rotate:8deg]">
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-square rounded-md bg-[#dedede]" />
          ))}
        </div>
        <p className="mt-4 text-sm font-black text-ink">Passport Photos</p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate">Quick in-store service</p>
      </div>
    </div>
  );
}
