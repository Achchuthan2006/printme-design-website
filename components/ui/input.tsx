import * as React from "react";
import { cn } from "@/lib/utils";

type ControlTone = "default" | "subtle";

type ControlSize = "sm" | "default" | "lg";

type ControlVariantOptions = {
  tone?: ControlTone;
  size?: ControlSize;
  className?: string;
};

const controlSizeClassNames: Record<ControlSize, string> = {
  sm: "min-h-10 px-3 py-2 text-sm",
  default: "min-h-12 px-4 py-3 text-sm",
  lg: "min-h-14 px-5 py-3.5 text-base",
};

export function controlVariants({
  tone = "default",
  size = "default",
  className,
}: ControlVariantOptions = {}) {
  return cn(
    "premium-input premium-focus w-full rounded-[1.25rem] font-semibold aria-[invalid=true]:border-brand/55 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-60",
    tone === "subtle" && "bg-canvas/78",
    controlSizeClassNames[size],
    className,
  );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  tone?: ControlTone;
  size?: ControlSize;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, tone, size, ...props }, ref) => (
    <input ref={ref} className={controlVariants({ tone, size, className })} {...props} />
  ),
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  tone?: ControlTone;
  size?: ControlSize;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, tone, size, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={controlVariants({ tone, size, className })}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  tone?: ControlTone;
  size?: ControlSize;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, tone, size, ...props }, ref) => (
    <select ref={ref} className={controlVariants({ tone, size, className })} {...props} />
  ),
);
Select.displayName = "Select";
