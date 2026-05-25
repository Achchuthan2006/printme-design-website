import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "border border-brand-dark/10 bg-brand text-white shadow-[0_14px_28px_rgba(217,70,32,0.18)] hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_18px_32px_rgba(217,70,32,0.22)] active:translate-y-0 active:shadow-[0_8px_16px_rgba(183,51,20,0.12)]",
  secondary:
    "bg-white text-ink ring-1 ring-inset ring-line/90 shadow-[0_1px_0_rgba(255,255,255,0.88)_inset,0_8px_18px_rgba(18,17,16,0.03)] hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:ring-ink/15 hover:shadow-[0_12px_24px_rgba(18,17,16,0.05)] active:translate-y-0",
  ghost: "bg-transparent text-ink hover:bg-white/85 hover:text-brand",
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
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
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
