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
      <h2 className="display-title mt-4 text-balance text-[2.2rem] font-semibold leading-[0.92] sm:text-[3.35rem]">{title}</h2>
      {description ? (
        <p className={cn("mt-5 max-w-[42rem] text-pretty text-[15px] leading-8 text-slate sm:text-[1.02rem]", align === "center" && "mx-auto")}>
          {description}
        </p>
      ) : null}
      <div className={cn("premium-divider mt-7 max-w-[10rem]", align === "center" && "mx-auto")} />
    </div>
  );
}
