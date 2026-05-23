export const supportChatOpenEvent = "printme-support-chat-open";

export function openSupportChat() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(supportChatOpenEvent));
}
