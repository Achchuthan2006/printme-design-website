import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">{label}</span>
      {hint ? <span className="mb-3 block max-w-2xl text-xs leading-5 text-slate/82">{hint}</span> : null}
      {children}
      {error ? <p className="mt-2 text-sm text-brand">{error}</p> : null}
    </label>
  );
}

const sharedControlClassName =
  "premium-input w-full aria-[invalid=true]:border-brand aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-brand/10";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(sharedControlClassName, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(sharedControlClassName, className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select ref={ref} className={cn(sharedControlClassName, className)} {...props} />
  ),
);
Select.displayName = "Select";

export function CheckboxTile({
  children,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex items-center gap-3 rounded-[1.3rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,238,231,0.84))] p-4 text-sm font-bold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_18px_rgba(18,17,16,0.05)] transition hover:-translate-y-0.5 hover:border-brand/20 hover:bg-brand-soft/20", className)}>
      <input type="checkbox" className="h-4 w-4 accent-brand" {...props} />
      {children}
    </label>
  );
}

export function FeedbackMessage({
  children,
  tone = "default",
  className,
  ...props
}: {
  children: React.ReactNode;
  tone?: "default" | "success" | "error";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const tones = {
    default: "border-brand/15 bg-brand-soft/85 text-brand",
    success: "border-emerald-100 bg-emerald-50 text-emerald-800",
    error: "border-red-100 bg-red-50 text-red-800",
  } as const;

  return (
    <div className={cn("rounded-[1.15rem] border px-4 py-3 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]", tones[tone], className)} {...props}>
      {children}
    </div>
  );
}
