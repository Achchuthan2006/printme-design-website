import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand text-white shadow-[0_8px_18px_rgba(217,70,32,0.22)] hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_28px_rgba(217,70,32,0.26)] active:translate-y-0 active:shadow-[0_6px_14px_rgba(217,70,32,0.22)]",
  secondary:
    "bg-white text-ink ring-1 ring-inset ring-brand/45 hover:-translate-y-0.5 hover:bg-brand-soft hover:text-brand hover:ring-brand active:translate-y-0",
  ghost: "bg-transparent text-ink hover:bg-brand-soft hover:text-brand",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: keyof typeof variants;
}

export function Button({ className, href, variant = "primary", ...props }: ButtonProps) {
  const sharedClassName = cn(
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );

  if (href) {
    if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a href={href} className={sharedClassName}>
          {props.children}
        </a>
      );
    }

    return (
      <Link href={href} className={sharedClassName}>
        {props.children}
      </Link>
    );
  }

  return <button className={sharedClassName} {...props} />;
}
