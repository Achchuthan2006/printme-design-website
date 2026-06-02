import type { Metadata } from "next";
import { env } from "@/lib/env";
import { siteConfig } from "@/lib/site";

export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
  keywords,
  openGraphImage = "/images/brand/print-range-hero.jpg",
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
  openGraphImage?: string;
}): Metadata {
  const url = `${env.siteUrl}${path}`;
  const imageUrl = openGraphImage.startsWith("http") ? openGraphImage : `${env.siteUrl}${openGraphImage}`;

  return {
    title,
    description,
    metadataBase: new URL(env.siteUrl),
    alternates: { canonical: path || "/" },
    keywords,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_CA",
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
