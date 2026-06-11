import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "brand" | "secondary" | "outline" | "ghost" | "link" | "danger";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
};

type ButtonAsButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLinkProps = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const buttonSizeClassNames: Record<ButtonSize, string> = {
  default: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-xs",
  lg: "h-14 px-8 text-base",
  icon: "h-11 w-11",
};

const buttonVariantClassNames: Record<ButtonVariant, string> = {
  default: "bg-ink text-white hover:bg-ink/82 shadow-[0_8px_20px_rgba(26,25,24,0.08)]",
  brand: "bg-brand text-white hover:bg-[#b73314] premium-cta shadow-[0_10px_22px_rgba(217,70,32,0.24)]",
  secondary: "border border-line bg-white text-ink shadow-sm hover:border-brand/30 hover:bg-canvas",
  outline: "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  ghost: "bg-transparent text-ink hover:bg-brand-soft hover:text-brand",
  link: "h-auto rounded-none px-0 py-0 font-semibold text-brand underline-offset-4 hover:underline",
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-[0_10px_20px_rgba(239,68,68,0.2)]",
};

export function buttonVariants({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "premium-focus inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none",
    buttonVariantClassNames[variant],
    variant !== "link" && buttonSizeClassNames[size],
    size === "icon" && "p-0",
    className,
  );
}

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "default",
      size = "default",
      href,
      leadingIcon,
      trailingIcon,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {leadingIcon}
        {children != null ? <span>{children}</span> : null}
        {trailingIcon}
      </>
    );

    if (href) {
      const linkProps = props as Omit<ButtonAsLinkProps, "href">;
      if (isExternalHref(href)) {
        const externalRel =
          linkProps.target === "_blank"
            ? linkProps.rel ?? "noreferrer noopener"
            : linkProps.rel;
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={buttonVariants({ variant, size, className })}
            data-button="true"
            data-size={size}
            data-variant={variant}
            rel={externalRel}
            {...linkProps}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={buttonVariants({ variant, size, className })}
          data-button="true"
          data-size={size}
          data-variant={variant}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={buttonVariants({ variant, size, className })}
        data-button="true"
        data-size={size}
        data-variant={variant}
        {...(props as ButtonAsButtonProps)}
      >
        {content}
      </button>
    );
  },
);
Button.displayName = "Button";
