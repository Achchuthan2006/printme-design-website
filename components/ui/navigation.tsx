import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type NavTone = "default" | "inverse" | "soft";
type NavLayout = "stack" | "inline";

export function navItemVariants({
  active = false,
  tone = "default",
  className,
}: {
  active?: boolean;
  tone?: NavTone;
  className?: string;
}) {
  return cn(
    "premium-focus block rounded-[1rem] px-3 py-2.5 text-sm font-bold transition",
    tone === "default" &&
      (active
        ? "bg-ink text-white hover:bg-ink hover:text-white"
        : "text-ink hover:bg-brand-soft hover:text-brand"),
    tone === "inverse" &&
      (active
        ? "bg-white text-ink shadow-soft hover:bg-white hover:text-ink"
        : "text-white/72 hover:bg-white/10 hover:text-white"),
    tone === "soft" &&
      (active
        ? "bg-brand-soft text-brand"
        : "text-ink hover:bg-white hover:text-brand"),
    className,
  );
}

export function NavList({
  className,
  layout = "stack",
  ...props
}: React.HTMLAttributes<HTMLElement> & { layout?: NavLayout }) {
  return (
    <nav
      className={cn(layout === "stack" ? "grid gap-1" : "flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export type NavItemLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  active?: boolean;
  tone?: NavTone;
};

export function NavItemLink({
  active = false,
  tone = "default",
  className,
  ...props
}: NavItemLinkProps) {
  return <Link className={navItemVariants({ active, tone, className })} {...props} />;
}

export function NavPanel({
  className,
  tone = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { tone?: "default" | "dark" }) {
  return (
    <div
      className={cn(
        "rounded-[1.6rem]",
        tone === "dark" ? "liquid-glass-dark border border-white/10 text-white" : "hero-panel",
        className,
      )}
      {...props}
    />
  );
}
