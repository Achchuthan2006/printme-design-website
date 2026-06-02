import { trackPrintMeEvent } from "@/lib/analytics/client";

export const supportChatOpenEvent = "printme-support-chat-open";

export function openSupportChat() {
  if (typeof window === "undefined") return;
  trackPrintMeEvent({
    eventName: "support_chat_opened",
    funnelName: "storefront_discovery",
    funnelStage: "support_assist",
    isMicroConversion: true,
    properties: {
      trigger: "programmatic",
    },
  });
  window.dispatchEvent(new CustomEvent(supportChatOpenEvent));
}
