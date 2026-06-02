import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { CartProvider } from "@/features/cart/cart-context";
import { EngagementProvider } from "@/features/engagement/engagement-context";
import { AuthProvider } from "@/components/account/auth-provider";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { SiteChrome } from "@/components/layout/site-chrome";
import { env } from "@/lib/env";
import { JsonLd } from "@/components/seo/json-ld";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo";
import { getDefaultSiteContext } from "@/lib/tenancy";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Scarborough Print Shop for Business Printing, Signs, and Custom Jobs",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(env.siteUrl),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Scarborough Print Shop for Business Printing, Signs, and Custom Jobs",
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: `${env.siteUrl}/images/brand/print-range-hero.jpg`,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scarborough Print Shop for Business Printing, Signs, and Custom Jobs",
    description: siteConfig.description,
    images: [`${env.siteUrl}/images/brand/print-range-hero.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSiteContext = getDefaultSiteContext();

  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${sansFont.variable}`}
        data-tenant={initialSiteContext.tenant.slug}
        data-tenant-kind={initialSiteContext.tenant.kind}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-2xl focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <AuthProvider>
          <EngagementProvider>
            <CartProvider>
              <SiteChrome initialSiteContext={initialSiteContext}>{children}</SiteChrome>
            </CartProvider>
          </EngagementProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
