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
        <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-balance text-3xl font-black leading-tight text-ink sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-pretty text-sm leading-7 text-slate sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
