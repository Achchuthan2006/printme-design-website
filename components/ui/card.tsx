import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "surface" | "glass" | "dark" | "panel" | "ghost";
type CardPadding = "none" | "sm" | "default" | "lg";

type CardVariantOptions = {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  className?: string;
};

const cardVariantClassNames: Record<CardVariant, string> = {
  surface: "surface-card",
  glass: "liquid-glass premium-depth border border-white/80",
  dark: "liquid-glass-dark border border-white/10 text-white shadow-card",
  panel: "hero-panel",
  ghost: "border border-line/70 bg-transparent shadow-none",
};

const cardPaddingClassNames: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  default: "p-5",
  lg: "p-6 sm:p-8",
};

export function cardVariants({
  variant = "surface",
  padding = "default",
  interactive = false,
  className,
}: CardVariantOptions = {}) {
  return cn(
    "rounded-[1.65rem]",
    cardVariantClassNames[variant],
    cardPaddingClassNames[padding],
    interactive && "premium-card transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-card",
    className,
  );
}

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "article" | "div" | "section" | "aside";
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
};

export function Card({
  as = "div",
  variant = "surface",
  padding = "default",
  interactive = false,
  className,
  ...props
}: CardProps) {
  const Component = as;
  return (
    <Component
      className={cardVariants({ variant, padding, interactive, className })}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-xl font-black text-ink", className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6 text-slate", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex items-center gap-3", className)} {...props} />;
}
