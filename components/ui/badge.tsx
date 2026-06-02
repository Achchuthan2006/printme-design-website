import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "brand" | "outline" | "secondary"
}

export function badgeVariants({ variant = "default", className = "" }: Partial<BadgeProps>) {
  return cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
    {
      // Standard dark badge
      "border border-transparent bg-ink text-white shadow-sm": variant === "default",
      // Brand emphasis badge
      "border border-transparent bg-brand text-white shadow-sm": variant === "brand",
      // Secondary soft badge
      "border border-line bg-canvas text-slate": variant === "secondary",
      // Outline only
      "border border-ink text-ink": variant === "outline",
    },
    className
  )
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ variant, className })} {...props} />
  )
}