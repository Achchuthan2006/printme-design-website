import type { Metadata } from "next";
import { env } from "@/lib/env";
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
  const url = `${env.siteUrl}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(env.siteUrl),
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
