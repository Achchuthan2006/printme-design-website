"use client";

import { usePathname } from "next/navigation";
import { CartFeedbackCard } from "@/components/commerce/cart-feedback-card";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ChatWidget } from "@/components/support/chat-widget";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <div className="relative min-h-screen">
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <CartFeedbackCard />
      <ChatWidget />
    </div>
  );
}
