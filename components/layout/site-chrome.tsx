"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const CartFeedbackCard = dynamic(
  () => import("@/components/commerce/cart-feedback-card").then((module) => module.CartFeedbackCard),
  { ssr: false },
);

const ChatWidget = dynamic(
  () => import("@/components/support/chat-widget").then((module) => module.ChatWidget),
  { ssr: false },
);

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [enhancementsReady, setEnhancementsReady] = useState(false);

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
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      {enhancementsReady ? <CartFeedbackCard /> : null}
      {enhancementsReady ? <ChatWidget /> : null}
    </div>
  );
}
