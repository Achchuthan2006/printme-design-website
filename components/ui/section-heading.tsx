import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-balance text-3xl font-black leading-[1.04] tracking-[-0.03em] text-ink sm:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-pretty text-sm leading-7 text-slate sm:text-[15px]">{description}</p>
      ) : null}
    </div>
  );
}
