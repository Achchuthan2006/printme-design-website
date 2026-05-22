import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export function buildMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    alternates: { canonical: path || "/" },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_CA",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
