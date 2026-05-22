import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand text-white shadow-[0_10px_22px_rgba(217,70,32,0.24)] hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_18px_34px_rgba(217,70,32,0.28)] active:translate-y-0 active:shadow-[0_6px_14px_rgba(217,70,32,0.2)]",
  secondary:
    "bg-white text-ink ring-1 ring-inset ring-line hover:-translate-y-0.5 hover:bg-brand-soft hover:text-brand hover:ring-brand/55 hover:shadow-soft active:translate-y-0",
  ghost: "bg-transparent text-ink hover:bg-brand-soft hover:text-brand hover:shadow-soft",
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
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-extrabold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
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
