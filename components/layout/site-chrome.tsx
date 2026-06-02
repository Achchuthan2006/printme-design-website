"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { resolveTenantContext } from "@/lib/tenancy";
import { ResolvedTenantContext } from "@/types";

const CartFeedbackCard = dynamic(
  () => import("@/components/commerce/cart-feedback-card").then((module) => module.CartFeedbackCard),
  { ssr: false },
);

const ChatWidget = dynamic(
  () => import("@/components/support/chat-widget").then((module) => module.ChatWidget),
  { ssr: false },
);

export function SiteChrome({
  children,
  initialSiteContext,
}: {
  children: React.ReactNode;
  initialSiteContext: ResolvedTenantContext;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [enhancementsReady, setEnhancementsReady] = useState(false);
  const siteContext = useMemo(() => {
    if (typeof window === "undefined") {
      return initialSiteContext;
    }

    return resolveTenantContext({
      host: window.location.host,
      pathname,
    });
  }, [initialSiteContext, pathname]);

  useEffect(() => {
    const run = () => setEnhancementsReady(true);
    const browserWindow = window as Window & typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (browserWindow.requestIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(run, { timeout: 1200 });
      return () => browserWindow.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(run, 350);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <div className="relative min-h-screen">
      <Header key={pathname} siteContext={siteContext} />
      <main id="main-content">{children}</main>
      <Footer siteContext={siteContext} />
      {enhancementsReady ? <CartFeedbackCard /> : null}
      {enhancementsReady ? <ChatWidget /> : null}
    </div>
  );
}
