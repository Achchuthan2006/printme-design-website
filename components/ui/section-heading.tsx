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
        <p className="editorial-kicker">{eyebrow}</p>
      ) : null}
      <h2 className="display-title mt-3 text-balance text-[2.05rem] font-black leading-[0.96] sm:text-[3.15rem]">{title}</h2>
      {description ? (
        <p className={cn("mt-4 max-w-2xl text-pretty text-[15px] leading-7 text-slate sm:text-base", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
      <div className={cn("premium-divider mt-6 max-w-[11rem]", align === "center" && "mx-auto")} />
    </div>
  );
}
