import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "premium-cta border border-brand-dark/12 bg-[linear-gradient(180deg,#ef6a46_0%,#d94620_62%,#b73314_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_16px_38px_rgba(217,70,32,0.22)] hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,#f17452_0%,#d94620_56%,#a92f14_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_22px_42px_rgba(217,70,32,0.26)] active:translate-y-[1px] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.12),0_10px_18px_rgba(183,51,20,0.14)]",
  secondary:
    "border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,238,231,0.86))] text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-3px_8px_rgba(18,17,16,0.04),0_10px_22px_rgba(18,17,16,0.06)] hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-3px_8px_rgba(18,17,16,0.05),0_14px_28px_rgba(18,17,16,0.08)] active:translate-y-[1px] active:shadow-[inset_0_2px_7px_rgba(18,17,16,0.1),0_6px_12px_rgba(18,17,16,0.05)]",
  ghost: "bg-transparent text-ink hover:bg-white/85 hover:text-brand active:bg-white/95",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: keyof typeof variants;
}

export function Button({
  className,
  href,
  variant = "primary",
  children,
  onClick,
  title,
  "aria-label": ariaLabel,
  ...props
}: ButtonProps) {
  const dataEvent = (props as Record<string, unknown>)["data-event"] as string | undefined;
  const trackingProps = {
    "data-event": dataEvent,
    "aria-label": ariaLabel,
    title,
  };

  const sharedClassName = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-[1.25rem] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );

  if (href) {
    if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a href={href} className={sharedClassName} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined} {...trackingProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={sharedClassName} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined} {...trackingProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} onClick={onClick} title={title} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
}
