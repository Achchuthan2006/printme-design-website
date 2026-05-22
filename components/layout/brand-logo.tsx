import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function BrandLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label={siteConfig.name}>
      <span className={cn("relative block h-12 w-44", inverted && "rounded-sm bg-white px-2 py-1")}>
        <Image
          src="/printme-logo.svg"
          alt="PrintMe"
          fill
          priority={!inverted}
          sizes="176px"
          className="object-contain"
        />
      </span>
    </Link>
  );
}
