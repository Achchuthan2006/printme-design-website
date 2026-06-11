import * as React from "react";
export { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  children,
  className,
  labelProps,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
}) {
  const fieldId = React.useId();
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const childIsElement = React.isValidElement(children);
  const childElement = childIsElement
    ? (children as React.ReactElement<{
        id?: string;
        "aria-describedby"?: string;
        "aria-errormessage"?: string;
      }>)
    : null;
  const isFieldset = childElement && childElement.type === "fieldset";
  const controlId = childElement && !isFieldset ? childElement.props.id ?? fieldId : undefined;
  const mergedDescribedBy =
    childElement && !isFieldset
      ? [childElement.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined
      : undefined;
  const mergedErrorMessage =
    childElement && !isFieldset
      ? [childElement.props["aria-errormessage"], errorId].filter(Boolean).join(" ") || undefined
      : undefined;
  const control =
    childElement && !isFieldset
      ? React.cloneElement(childElement, {
          id: controlId,
          "aria-describedby": mergedDescribedBy,
          "aria-errormessage": mergedErrorMessage,
        })
      : children;

  return (
    <div className={cn("block", className)}>
      {isFieldset ? (
        <div className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate">
          {label}
        </div>
      ) : (
        <label
          htmlFor={controlId}
          className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate"
          {...labelProps}
        >
          {label}
        </label>
      )}
      {hint ? (
        <p id={hintId} className="mb-3 block max-w-2xl text-xs leading-5 text-slate/82">
          {hint}
        </p>
      ) : null}
      {control}
      {error ? (
        <p id={errorId} className="mt-2 text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function CheckboxTile({
  children,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { children: React.ReactNode; className?: string }) {
  return (
    <label
      className={cn(
        "premium-focus flex items-center gap-3 rounded-[1.3rem] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,238,231,0.84))] p-4 text-sm font-bold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_8px_18px_rgba(18,17,16,0.05)] transition hover:-translate-y-0.5 hover:border-brand/20 hover:bg-brand-soft/20 focus-within:border-brand/25 focus-within:bg-brand-soft/18",
        props.disabled && "cursor-not-allowed opacity-70",
        className,
      )}
    >
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
  const liveMode = tone === "error" ? "assertive" : "polite";

  return (
    <div
      className={cn(
        "rounded-[1.15rem] border px-4 py-3 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]",
        tones[tone],
        className,
      )}
      aria-live={liveMode}
      role={tone === "error" ? "alert" : "status"}
      {...props}
    >
      {children}
    </div>
  );
}
