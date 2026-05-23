import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { CartProvider } from "@/features/cart/cart-context";
import { AuthProvider } from "@/components/account/auth-provider";
import { SiteChrome } from "@/components/layout/site-chrome";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Print Shop in Scarborough`,
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
    title: `${siteConfig.name} | Scarborough Print Shop`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_CA",
    type: "website",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteConfig.name,
  alternateName: siteConfig.brandName,
  url: `https://${siteConfig.domain}`,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  image: `https://${siteConfig.domain}/printme-logo.svg`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1585 Markham Road Unit 103",
    addressLocality: "Scarborough",
    addressRegion: "ON",
    postalCode: "M1B 2W1",
    addressCountry: "CA",
  },
  areaServed: ["Scarborough", "Toronto", "GTA"],
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-2xl focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:font-black focus:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
