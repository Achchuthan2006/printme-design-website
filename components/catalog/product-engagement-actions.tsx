"use client";

import { useEngagement } from "@/features/engagement/engagement-context";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function ProductEngagementActions({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { favorites, compare, toggleFavorite, toggleCompare } = useEngagement();
  const isFavorite = favorites.includes(slug);
  const isCompared = compare.includes(slug);

  return (
    <div className={cn("flex items-center gap-2", compact && "gap-1.5")}>
      <button
        type="button"
        onClick={() => toggleFavorite(slug)}
        aria-pressed={isFavorite}
        className={cn(
          "rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition",
          isFavorite ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-slate hover:border-brand/25 hover:text-brand",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon name="spark" className="h-3.5 w-3.5" />
          {isFavorite ? "Saved" : "Save"}
        </span>
      </button>
      <button
        type="button"
        onClick={() => toggleCompare(slug)}
        aria-pressed={isCompared}
        className={cn(
          "rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition",
          isCompared ? "border-ink bg-ink text-white" : "border-line bg-white text-slate hover:border-ink/20 hover:text-ink",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <Icon name="document" className="h-3.5 w-3.5" />
          {isCompared ? "Compared" : "Compare"}
        </span>
      </button>
    </div>
  );
}
