import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const sizeStyles = {
  compact: "h-6 w-[86px] sm:h-6 sm:w-[92px]",
  header: "h-8 w-[118px] sm:h-9 sm:w-[132px] lg:h-10 lg:w-[148px]",
  footer: "h-10 w-[144px] sm:h-11 sm:w-[158px]",
};

export function BrandLogo({
  className,
  inverted = false,
  size = "header",
  ariaLabel,
  href = "/",
  src = "/printme-logo.svg",
  alt = "PrintMe",
}: {
  className?: string;
  inverted?: boolean;
  size?: keyof typeof sizeStyles;
  ariaLabel?: string;
  href?: string;
  src?: string;
  alt?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center rounded-md premium-focus", className)}
      aria-label={ariaLabel ?? siteConfig.name}
    >
      <span
        className={cn(
          "relative block shrink-0",
          sizeStyles[size],
          inverted && "rounded-md bg-white px-2 py-1",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={!inverted}
          sizes={size === "footer" ? "158px" : "(max-width: 640px) 118px, (max-width: 1024px) 132px, 148px"}
          className="object-contain"
        />
      </span>
    </Link>
  );
}
