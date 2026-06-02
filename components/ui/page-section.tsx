import * as React from "react";
import { cn } from "@/lib/utils";

type PageSectionTone = "default" | "band" | "white" | "dark";
type PageSectionSpacing = "tight" | "default" | "hero";

const toneClassNames: Record<PageSectionTone, string> = {
  default: "bg-transparent",
  band: "section-band",
  white: "bg-white",
  dark: "bg-ink text-white",
};

const spacingClassNames: Record<PageSectionSpacing, string> = {
  tight: "section-tight",
  default: "section-space",
  hero: "pb-24 pt-14 sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20",
};

export type PageSectionProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
  tone?: PageSectionTone;
  spacing?: PageSectionSpacing;
  contentClassName?: string;
};

export function PageSection({
  as = "section",
  tone = "default",
  spacing = "default",
  className,
  contentClassName,
  children,
  ...props
}: PageSectionProps) {
  const Component = as;

  return (
    <Component className={cn("relative", toneClassNames[tone], spacingClassNames[spacing], className)} {...props}>
      <div className={cn("container-shell relative", contentClassName)}>{children}</div>
    </Component>
  );
}
