"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { supportChatOpenEvent } from "@/lib/chat";
import { trackPrintMeEvent } from "@/lib/analytics/client";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type AssistantIcon =
  | "arrow"
  | "banner"
  | "brochure"
  | "card"
  | "chat"
  | "check"
  | "clock"
  | "custom"
  | "document"
  | "inspect"
  | "phone"
  | "shield"
  | "sign"
  | "spark"
  | "store"
  | "upload";

interface AssistantAction {
  id: string;
  label: string;
  detail: string;
  href: string;
  hrefLabel: string;
  icon: AssistantIcon;
  insight: string;
}

interface AssistantResource {
  id: string;
  title: string;
  detail: string;
  href: string;
  icon: AssistantIcon;
}

interface FlowOption {
  id: string;
  label: string;
  detail: string;
}

interface FlowQuestion {
  id: string;
  prompt: string;
  options: FlowOption[];
}

interface FlowResult {
  id: string;
  title: string;
  summary: string;
  href: string;
  hrefLabel: string;
  secondaryHref?: string;
  secondaryHrefLabel?: string;
  icon: AssistantIcon;
  chips: string[];
}

interface AssistantContext {
  id: string;
  entryEyebrow: string;
  entryTitle: string;
  entryDetail: string;
  panelTitle: string;
  panelDetail: string;
  trustLine: string;
  quickActions: AssistantAction[];
  resources: AssistantResource[];
  flowQuestions: FlowQuestion[];
  resolveFlow: (answers: Record<string, string>) => FlowResult;
}

interface AssistantFlowState {
  assistantId: string;
  selectedActionId: string | null;
  answers: Record<string, string>;
  stepIndex: number;
  flowResult: FlowResult | null;
}

const sharedQuestions: FlowQuestion[] = [
  {
    id: "intent",
    prompt: "What do you need help with most?",
    options: [
      { id: "choose-product", label: "Choosing a product", detail: "I need help finding the right print path." },
      { id: "place-order", label: "Placing an order", detail: "I know the job and want the fastest path forward." },
      { id: "prepare-files", label: "Preparing artwork", detail: "I want to avoid file, bleed, or setup issues." },
      { id: "order-support", label: "Existing order support", detail: "I need status, payment, pickup, or follow-up help." },
    ],
  },
  {
    id: "artwork",
    prompt: "What is your artwork situation?",
    options: [
      { id: "ready", label: "Artwork is ready", detail: "I can upload a file now." },
      { id: "needs-cleanup", label: "Needs a quick cleanup", detail: "The design exists but needs review or fixes." },
      { id: "need-design", label: "Need design help", detail: "I need layout, branding, or a fresh setup." },
    ],
  },
  {
    id: "timing",
    prompt: "How urgent is this?",
    options: [
      { id: "rush", label: "Rush or same day", detail: "Timing matters and I need the safest next step fast." },
      { id: "standard", label: "Normal turnaround", detail: "I want the best route without rushing." },
      { id: "planning", label: "Planning ahead", detail: "I am comparing options before I commit." },
    ],
  },
];

function createAction(
  id: string,
  label: string,
  detail: string,
  href: string,
  hrefLabel: string,
  icon: AssistantIcon,
  insight: string,
): AssistantAction {
  return { id, label, detail, href, hrefLabel, icon, insight };
}

function createResource(
  id: string,
  title: string,
  detail: string,
  href: string,
  icon: AssistantIcon,
): AssistantResource {
  return { id, title, detail, href, icon };
}

function createAssistantFlowState(assistantId: string): AssistantFlowState {
  return {
    assistantId,
    selectedActionId: null,
    answers: {},
    stepIndex: 0,
    flowResult: null,
  };
}

function titleFromSlug(pathname: string) {
  const slug = pathname.split("/").filter(Boolean).pop();
  if (!slug) return "this print job";
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildFlowResult(contextId: string, answers: Record<string, string>): FlowResult {
  const intent = answers.intent;
  const artwork = answers.artwork;
  const timing = answers.timing;

  if (intent === "order-support") {
    return {
      id: "order-support",
      title: "Route this through order support",
      summary: "Use the order status and support path so timing, pickup, payment, or proof notes stay tied to the right job.",
      href: "/order-status",
      hrefLabel: "Check order status",
      secondaryHref: "/support#escalation",
      secondaryHrefLabel: "Open support hub",
      icon: "chat",
      chips: ["Status updates", "Pickup questions", "Proof follow-up"],
    };
  }

  if (timing === "rush") {
    return {
      id: "rush-review",
      title: "Use a rush-aware review path",
      summary: "Rush jobs are safest when PrintMe sees the quantity, deadline, and artwork state before production is promised.",
      href: "/quote-request",
      hrefLabel: "Request rush review",
      secondaryHref: siteConfig.phoneHref,
      secondaryHrefLabel: "Call the shop",
      icon: "clock",
      chips: ["Fastest realistic answer", "Deadline review", "Human confirmation"],
    };
  }

  if (artwork === "need-design") {
    return {
      id: "design-support",
      title: "Start with design support",
      summary: "This job needs layout or artwork help first, so the best route is a guided quote with design notes attached.",
      href: "/quote-request",
      hrefLabel: "Request design support",
      secondaryHref: "/services/graphic-design-services",
      secondaryHrefLabel: "View design services",
      icon: "spark",
      chips: ["Design setup", "Print-ready help", "Quote-first"],
    };
  }

  if (artwork === "needs-cleanup" || intent === "prepare-files") {
    return {
      id: "file-review",
      title: "Check file readiness before ordering",
      summary: "A quick review of bleed, resolution, and packaging is the safest next step before the file moves into production.",
      href: "/artwork-guidelines",
      hrefLabel: "Review artwork guidelines",
      secondaryHref: "/quote-request",
      secondaryHrefLabel: "Upload with a quote",
      icon: "inspect",
      chips: ["Bleed and DPI", "Source file packaging", "Safer upload path"],
    };
  }

  if (intent === "choose-product") {
    return {
      id: "product-guidance",
      title: "Start with product guidance",
      summary: "Use the catalog or product family path first, then move to quote or upload once the format and finish are clearer.",
      href: contextId === "product" ? "/products" : "/products",
      hrefLabel: "Browse products",
      secondaryHref: "/quote-request",
      secondaryHrefLabel: "Request a custom quote",
      icon: "custom",
      chips: ["Product matching", "Material guidance", "Clearer next step"],
    };
  }

  return {
    id: "ready-to-order",
    title: "You can move forward now",
    summary: "Your job sounds ready for a direct next step: upload or request a quote depending on how custom the specs are.",
    href: contextId === "checkout" ? "/checkout" : "/quote-request",
    hrefLabel: contextId === "checkout" ? "Continue checkout" : "Start the next step",
    secondaryHref: "/support#escalation",
    secondaryHrefLabel: "Talk to support",
    icon: "check",
    chips: ["Ready artwork", "Normal turnaround", "Low-friction path"],
  };
}

function getAssistantContext(pathname: string): AssistantContext {
  if (pathname.startsWith("/checkout")) {
    return {
      id: "checkout",
      entryEyebrow: "Checkout assistant",
      entryTitle: "Need help finishing this order?",
      entryDetail: "Payment, proofing, turnaround, and pickup guidance without leaving checkout.",
      panelTitle: "Checkout guidance that keeps the order moving",
      panelDetail: "Use smart shortcuts for payment, proofing, shipping or pickup, and order support before you get stuck.",
      trustLine: "If anything feels risky, PrintMe can confirm the next step before payment goes through.",
      quickActions: [
        createAction("checkout-proof", "Proofing and approval help", "Understand approval, revisions, and when production starts.", "/support#quotes-proofs", "Open proof help", "shield", "Best when you want clarity before production begins."),
        createAction("checkout-turnaround", "Turnaround and pickup", "Check realistic timing, pickup, and delivery expectations.", "/support#ordering-help", "Check timing help", "clock", "Good for rush-sensitive or pickup-dependent jobs."),
        createAction("checkout-payment", "Payment path questions", "Get help with payment, invoices, or deposits before you submit.", "/payment-info", "Review payment info", "document", "Useful when the payment route is slowing the order down."),
        createAction("checkout-human", "Talk to a real person", "Escalate to the team if you want human confirmation before payment.", "/support#escalation", "Contact support", "phone", "Best when the order is custom, urgent, or unclear."),
      ],
      resources: [
        createResource("checkout-support", "Support hub", "Escalate questions about payment, proofing, or order timing.", "/support#billing-account", "chat"),
        createResource("order-status", "Order status tools", "Use guided status lookup after you place the order.", "/order-status", "inspect"),
        createResource("artwork-guidelines", "File requirements", "Double-check files before checkout causes production delays.", "/artwork-guidelines", "upload"),
      ],
      flowQuestions: sharedQuestions,
      resolveFlow: (answers) => buildFlowResult("checkout", answers),
    };
  }

  if (pathname.startsWith("/quote-request")) {
    return {
      id: "quote",
      entryEyebrow: "Quote assistant",
      entryTitle: "Need help shaping the quote?",
      entryDetail: "Clarify specs, design needs, and urgency before you submit.",
      panelTitle: "Build a cleaner quote request",
      panelDetail: "This assistant helps you send the right details so pricing, materials, and turnaround are easier to confirm.",
      trustLine: "Better quote details reduce back-and-forth and help PrintMe route custom work faster.",
      quickActions: [
        createAction("quote-specs", "What details matter most?", "Get clear on quantity, size, finish, deadline, and delivery notes.", "/quote-request", "Continue quote request", "document", "Strong quotes include quantity, deadline, and artwork status."),
        createAction("quote-design", "Need design support?", "Route the quote correctly when the file is not ready yet.", "/services/graphic-design-services", "View design services", "spark", "Best when artwork still needs layout or cleanup."),
        createAction("quote-materials", "Compare materials or finishes", "Decide whether the job needs standard or premium production.", "/products", "Browse products", "custom", "Useful when the product path is still not obvious."),
        createAction("quote-rush", "Rush or same-day review", "Check whether the job should go through a faster manual review path.", "/support#ordering-help", "Open rush help", "clock", "Best when timing matters more than instant pricing."),
      ],
      resources: [
        createResource("artwork-guidelines", "Artwork guidelines", "Review bleed, resolution, and preferred formats before attaching files.", "/artwork-guidelines", "upload"),
        createResource("products", "Product directory", "Compare core product families before you lock the quote path.", "/products", "custom"),
        createResource("support", "Support hub", "Use support if the quote needs a more consultative conversation.", "/support#quotes-proofs", "chat"),
      ],
      flowQuestions: sharedQuestions,
      resolveFlow: (answers) => buildFlowResult("quote", answers),
    };
  }

  if (
    pathname.startsWith("/artwork-guidelines") ||
    pathname.startsWith("/account/files") ||
    pathname.includes("/upload")
  ) {
    return {
      id: "upload",
      entryEyebrow: "Artwork assistant",
      entryTitle: "Ready to upload or fix a file?",
      entryDetail: "Get file setup help, upload guidance, and the safest next route for production.",
      panelTitle: "File help before production problems start",
      panelDetail: "Use this assistant to catch bleed, DPI, packaging, and artwork-readiness issues before they slow the job down.",
      trustLine: "A quick file check now is cheaper than fixing artwork after the order is already moving.",
      quickActions: [
        createAction("upload-checklist", "Check file requirements", "Review format, bleed, fonts, and image setup.", "/artwork-guidelines", "Open file guidelines", "inspect", "Use this before you upload if you want fewer revision loops."),
        createAction("upload-quote", "Upload with a quote", "Send artwork through a guided review path instead of guessing.", "/quote-request", "Start quote with files", "upload", "Best when the file may need review or the specs are still evolving."),
        createAction("upload-design", "Request file cleanup", "Ask for layout or print-ready fixes before production.", "/services/graphic-design-services", "View design support", "spark", "Good when the file exists but still needs cleanup."),
        createAction("upload-human", "Talk to support first", "Get human guidance if the job is technical or time-sensitive.", "/support#artwork-files", "Open artwork help", "phone", "Helpful for complex packaging, signage, or same-day questions."),
      ],
      resources: [
        createResource("support", "Support hub", "Escalate if your file, proof, or upload path is not obvious.", "/support#artwork-files", "chat"),
        createResource("products", "Product pages", "Check product-specific requirements before uploading artwork.", "/products", "custom"),
        createResource("order-status", "Order status", "Track the job later once the file has been reviewed and attached.", "/order-status", "inspect"),
      ],
      flowQuestions: sharedQuestions,
      resolveFlow: (answers) => buildFlowResult("upload", answers),
    };
  }

  if (
    pathname.startsWith("/order-status") ||
    pathname.startsWith("/account/orders") ||
    pathname.startsWith("/account/proofs") ||
    pathname.startsWith("/account/quotes")
  ) {
    return {
      id: "order",
      entryEyebrow: "Order assistant",
      entryTitle: "Need help with an existing job?",
      entryDetail: "Status, proofing, pickup, invoice, and follow-up routes in one place.",
      panelTitle: "Stay on top of the order without hunting for the right contact path",
      panelDetail: "This assistant keeps order support tied to the job so updates, pickup, proofing, and next actions are easier to manage.",
      trustLine: "Use structured support first so the team sees the job context before you have to explain it again.",
      quickActions: [
        createAction("order-track", "Check order status", "Review guided status information before escalating.", "/order-status", "Open order status", "inspect", "Best for timing, pickup, and progress checks."),
        createAction("order-proof", "Proof or revision help", "Find the right path for proofing changes or approval questions.", "/support#quotes-proofs", "Open proof help", "shield", "Use this when artwork approval is slowing the order."),
        createAction("order-pickup", "Pickup or delivery questions", "Get local handoff guidance for finished jobs.", "/support#ordering-help", "Open order help", "store", "Helpful for coordination on larger or time-sensitive jobs."),
        createAction("order-human", "Talk to a real person", "Escalate if the account tools do not resolve it.", "/support#escalation", "Open support hub", "phone", "Best when you need a live follow-up on the same job."),
      ],
      resources: [
        createResource("support", "Support hub", "Route order, invoice, proof, or status questions to the team.", "/support#ordering-help", "chat"),
        createResource("account", "Account center", "Return to quotes, orders, files, and proofs in one place.", "/account", "document"),
        createResource("contact", "Store contact details", "Call or visit the shop for urgent local follow-up.", "/contact", "store"),
      ],
      flowQuestions: sharedQuestions,
      resolveFlow: (answers) => buildFlowResult("order", answers),
    };
  }

  if (pathname.startsWith("/products/") && !pathname.startsWith("/products/category/")) {
    const productName = titleFromSlug(pathname);
    return {
      id: "product",
      entryEyebrow: "Product assistant",
      entryTitle: `Need help choosing ${productName}?`,
      entryDetail: "Compare materials, upload paths, custom quotes, and print-readiness from the page you are on.",
      panelTitle: `${productName} guidance without leaving the page`,
      panelDetail: "Use this assistant to figure out size, finish, artwork setup, rush options, or when the job should move to quote review.",
      trustLine: "Product pages work better when the next step is obvious: order, upload, quote, or support.",
      quickActions: [
        createAction("product-choose", "Help me choose options", "Get pointed toward the safest size, finish, or order path.", "/products", "Compare product options", "custom", "Useful when the format is close but not fully decided yet."),
        createAction("product-upload", "Check file requirements", "See what matters before you upload artwork for this job.", "/artwork-guidelines", "Review file guidelines", "inspect", "Best for bleed, resolution, and source-file questions."),
        createAction("product-quote", "Need a custom quote?", "Route special specs, premium finishes, or larger runs the right way.", "/quote-request", "Request a quote", "document", "Ideal for specialty stock, finishing, or non-standard quantities."),
        createAction("product-support", "Talk to support first", "Use a human handoff when the product fit still feels uncertain.", "/support#product-material-guidance", "Open product help", "phone", "Helpful for rush jobs, signage, and custom combinations."),
      ],
      resources: [
        createResource("quote-request", "Custom quote path", "Switch to quote review when the product is close but not standard.", "/quote-request", "document"),
        createResource("artwork-guidelines", "Artwork guidelines", "Double-check format, bleed, and resolution before upload.", "/artwork-guidelines", "upload"),
        createResource("support", "Support hub", "Use support if this product needs a more consultative route.", "/support#product-material-guidance", "chat"),
      ],
      flowQuestions: sharedQuestions,
      resolveFlow: (answers) => buildFlowResult("product", answers),
    };
  }

  if (pathname.startsWith("/products") || pathname.startsWith("/services")) {
    return {
      id: "catalog",
      entryEyebrow: "Print assistant",
      entryTitle: "Not sure what to choose?",
      entryDetail: "Get guided help choosing the right print option, quote path, or upload route.",
      panelTitle: "A smarter way into the PrintMe catalog",
      panelDetail: "This assistant helps you compare product paths, route custom work, and avoid getting stuck between quote, order, and upload decisions.",
      trustLine: "The best assistant here is one that reduces confusion before the user lands in the wrong flow.",
      quickActions: [
        createAction("catalog-choose", "Help me choose a product", "Find the right print family based on the job, not just the catalog name.", "/products", "Browse products", "custom", "Best when the customer knows the goal but not the format."),
        createAction("catalog-template", "Start with ready artwork", "Move into the upload or order path when the design already exists.", "/quote-request", "Start with a quote", "upload", "Good when the file is ready but the order path still needs guidance."),
        createAction("catalog-design", "Need custom design support", "Route to artwork help before production details create friction.", "/services/graphic-design-services", "View design support", "spark", "Best when the idea exists but the design is not print-ready."),
        createAction("catalog-human", "Talk to support", "Escalate to a real person if the catalog still feels unclear.", "/support#getting-started", "Open help center", "phone", "Helpful for signage, packaging, rush jobs, or mixed campaigns."),
      ],
      resources: [
        createResource("quote-request", "Quote request", "Use this when the job does not fit a simple direct-order path.", "/quote-request", "document"),
        createResource("artwork-guidelines", "Artwork guidelines", "Review file rules before you commit to an upload-first path.", "/artwork-guidelines", "upload"),
        createResource("support", "Support hub", "Use support for custom jobs, rush questions, or order-method confusion.", "/support#getting-started", "chat"),
      ],
      flowQuestions: sharedQuestions,
      resolveFlow: (answers) => buildFlowResult("catalog", answers),
    };
  }

  return {
    id: "general",
    entryEyebrow: "Ask PrintMe",
    entryTitle: "Need help choosing the right next step?",
    entryDetail: "Get product guidance, quote help, order support, or file advice from one smarter assistant.",
    panelTitle: "A guided assistant for real print decisions",
    panelDetail: "Use quick actions and guided recommendations to choose products, prepare files, request quotes, or get support faster.",
    trustLine: `Real support is available by phone at ${siteConfig.phone}, and the assistant is designed to get you there faster when needed.`,
    quickActions: [
      createAction("general-choose", "Help me choose a product", "Start with the right print path instead of guessing from a generic support menu.", "/products", "Browse products", "custom", "Best for customers comparing options, formats, or finishes."),
      createAction("general-quote", "Need a custom quote?", "Route non-standard jobs into a safer quote-first workflow.", "/quote-request", "Request a quote", "document", "Useful for packaging, signage, bulk runs, or premium finishes."),
      createAction("general-upload", "Upload or check files", "Get help with bleed, DPI, source files, and artwork readiness.", "/artwork-guidelines", "Review file guidelines", "upload", "Best when the design exists but production prep is unclear."),
      createAction("general-human", "Talk to a real person", "Open the support route when the job needs human review.", "/support#escalation", "Contact support", "phone", "Helpful for urgent, complex, or mixed-product jobs."),
    ],
    resources: [
      createResource("support", "Support hub", "Get structured help for quotes, orders, files, and custom work.", "/support#help-architecture", "chat"),
      createResource("order-status", "Order status", "Check progress, pickup, or production follow-up for existing jobs.", "/order-status", "inspect"),
      createResource("contact", "Store details", "Call, visit, or email the local team directly when timing matters.", "/contact", "store"),
    ],
    flowQuestions: sharedQuestions,
    resolveFlow: (answers) => buildFlowResult("general", answers),
  };
}

export function ChatWidget() {
  const pathname = usePathname();
  const assistant = useMemo(() => getAssistantContext(pathname), [pathname]);
  const [open, setOpen] = useState(false);
  const [flowState, setFlowState] = useState<AssistantFlowState>(() => createAssistantFlowState(assistant.id));
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeFlowState = flowState.assistantId === assistant.id ? flowState : createAssistantFlowState(assistant.id);
  const { selectedActionId, answers, stepIndex, flowResult } = activeFlowState;

  const selectedAction = assistant.quickActions.find((action) => action.id === selectedActionId) ?? null;
  const currentQuestion = assistant.flowQuestions[stepIndex] ?? null;

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(supportChatOpenEvent, handleOpen);
    return () => window.removeEventListener(supportChatOpenEvent, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => closeButtonRef.current?.focus(), 20);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function trackOpen(trigger: string) {
    trackPrintMeEvent({
      eventName: "support_chat_opened",
      pageType: "support",
      funnelStage: "support_assist",
      isMicroConversion: true,
      properties: {
        trigger,
        assistantContext: assistant.id,
      },
    });
  }

  function handleQuickAction(action: AssistantAction) {
    setOpen(true);
    setFlowState((current) => ({
      ...(current.assistantId === assistant.id ? current : createAssistantFlowState(assistant.id)),
      assistantId: assistant.id,
      selectedActionId: action.id,
    }));
    trackPrintMeEvent({
      eventName: "support_quick_action_selected",
      pageType: "support",
      funnelStage: "support_assist",
      isMicroConversion: true,
      properties: {
        actionId: action.id,
        actionLabel: action.label,
        assistantContext: assistant.id,
      },
    });
  }

  function handleOptionSelect(questionId: string, optionId: string) {
    const nextAnswers = { ...answers, [questionId]: optionId };

    if (stepIndex >= assistant.flowQuestions.length - 1) {
      const result = assistant.resolveFlow(nextAnswers);
      setFlowState({
        assistantId: assistant.id,
        selectedActionId,
        answers: nextAnswers,
        stepIndex,
        flowResult: result,
      });
      trackPrintMeEvent({
        eventName: "support_quick_action_selected",
        pageType: "support",
        funnelStage: "support_assist",
        isMicroConversion: true,
        properties: {
          actionId: `guided-${result.id}`,
          actionLabel: result.title,
          assistantContext: assistant.id,
        },
      });
      return;
    }

    setFlowState({
      assistantId: assistant.id,
      selectedActionId,
      answers: nextAnswers,
      stepIndex: stepIndex + 1,
      flowResult: null,
    });
  }

  function resetFlow() {
    setFlowState(createAssistantFlowState(assistant.id));
  }

  return (
    <>
      <div className="fixed bottom-20 right-3 z-[75] sm:bottom-6 sm:right-6 xl:bottom-8 xl:right-8">
        <button
          type="button"
          onClick={() => {
            const nextOpen = !open;
            setOpen(nextOpen);
            if (nextOpen) trackOpen("floating-widget");
          }}
          aria-expanded={open}
          aria-controls="printme-chat-widget"
          className="group premium-focus relative max-w-[20rem] overflow-hidden rounded-[1.65rem] border border-white/14 bg-[linear-gradient(140deg,#171412_0%,#231c19_58%,#121110_100%)] px-3 py-3 text-left text-white shadow-[0_28px_72px_rgba(18,17,16,0.34)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_84px_rgba(18,17,16,0.38)] sm:max-w-[21rem] sm:px-4"
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,106,70,0.2),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_32%)] opacity-90" />
          <span className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(180deg,#ef6a46_0%,#d94620_72%,#b73314_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_14px_30px_rgba(217,70,32,0.3)]">
              <Icon name="spark" className="h-5 w-5" />
            </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/55">{assistant.entryEyebrow}</span>
                <span className="mt-1 block text-sm font-black leading-5">{assistant.entryTitle}</span>
                <span className="mt-1 block max-w-[13.5rem] text-xs leading-5 text-white/72 xl:max-w-[15rem]">{assistant.entryDetail}</span>
              </span>
            <span className="sm:hidden">
              <span className="block text-xs font-black">Ask PrintMe</span>
            </span>
          </span>
        </button>
      </div>

      <aside
        id="printme-chat-widget"
        role="dialog"
        aria-modal="false"
        aria-label="Ask PrintMe assistant"
        className={cn(
          "fixed inset-x-2 bottom-3 z-[74] flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-[2rem] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(250,246,241,0.95))] shadow-[0_36px_88px_rgba(18,17,16,0.22)] backdrop-blur-[22px] transition-all duration-300 sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[24rem] xl:bottom-28 xl:right-8 xl:w-[25rem]",
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
      >
        <div className="relative overflow-hidden border-b border-line/80 bg-[linear-gradient(135deg,rgba(255,244,239,0.98),rgba(255,255,255,0.96))] p-4 sm:p-5">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,70,32,0.11),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.34),transparent_44%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">{assistant.entryEyebrow}</p>
              <h2 className="mt-1 max-w-[18rem] text-[1.15rem] font-black leading-6 text-ink">{assistant.panelTitle}</h2>
              <p className="mt-2 max-w-[19rem] text-sm leading-6 text-slate">{assistant.panelDetail}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="premium-focus rounded-[1rem] border border-white/90 bg-white/92 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] transition hover:border-brand/15 hover:text-brand"
            >
              Close
            </button>
          </div>

          <div className="relative mt-4 rounded-[1.35rem] border border-white/80 bg-white/78 px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_30px_rgba(18,17,16,0.06)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[1rem] bg-brand-soft text-brand">
                <Icon name="shield" className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Smart support promise</p>
                <p className="mt-1 text-sm leading-6 text-ink">{assistant.trustLine}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Quick actions</p>
                <p className="mt-1 text-sm leading-6 text-slate">Shortcuts tailored to this page so users can move forward without guessing.</p>
              </div>
            </div>
            <div className="grid gap-2.5">
              {assistant.quickActions.map((action) => {
                const isActive = selectedActionId === action.id;
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => handleQuickAction(action)}
                    className={cn(
                      "premium-focus group rounded-[1.35rem] border px-3.5 py-3.5 text-left transition duration-200",
                      isActive
                        ? "border-brand/18 bg-[linear-gradient(180deg,rgba(255,242,238,0.96),rgba(255,255,255,0.98))] shadow-[0_18px_40px_rgba(217,70,32,0.12)]"
                        : "border-white/85 bg-white/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_14px_28px_rgba(18,17,16,0.05)] hover:-translate-y-0.5 hover:border-brand/14 hover:bg-brand-soft/60",
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem]", isActive ? "bg-white text-brand" : "bg-brand-soft text-brand")}>
                        <Icon name={action.icon} className="h-4.5 w-4.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black text-ink">{action.label}</span>
                          <Icon name="arrow" className="h-4 w-4 shrink-0 text-slate transition group-hover:text-brand" />
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate">{action.detail}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedAction ? (
              <div className="rounded-[1.4rem] border border-brand/14 bg-[linear-gradient(180deg,rgba(255,245,241,0.94),rgba(255,255,255,0.98))] p-4 shadow-[0_20px_42px_rgba(217,70,32,0.1)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-white text-brand shadow-[0_10px_20px_rgba(18,17,16,0.06)]">
                    <Icon name={selectedAction.icon} className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Recommended route</p>
                    <h3 className="mt-1 text-base font-black text-ink">{selectedAction.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate">{selectedAction.insight}</p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button href={selectedAction.href} className="w-full sm:flex-1">
                        {selectedAction.hrefLabel}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          setFlowState((current) => ({
                            ...(current.assistantId === assistant.id ? current : createAssistantFlowState(assistant.id)),
                            assistantId: assistant.id,
                            selectedActionId: null,
                          }))
                        }
                        className="w-full sm:w-auto"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="rounded-[1.55rem] border border-black/5 bg-[rgba(247,243,238,0.82)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Guided help</p>
                <h3 className="mt-1 text-base font-black text-ink">Let Ask PrintMe recommend the next step</h3>
              </div>
              {(stepIndex > 0 || flowResult) ? (
                <button
                  type="button"
                  onClick={resetFlow}
                  className="text-[11px] font-black uppercase tracking-[0.16em] text-slate transition hover:text-brand"
                >
                  Restart
                </button>
              ) : null}
            </div>

            {!flowResult && currentQuestion ? (
              <div className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black text-ink">{currentQuestion.prompt}</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                    Step {stepIndex + 1} of {assistant.flowQuestions.length}
                  </p>
                </div>
                <div className="mt-3 grid gap-2.5">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
                      className="premium-focus rounded-[1.2rem] border border-white/85 bg-white/95 px-3.5 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_24px_rgba(18,17,16,0.04)] transition hover:-translate-y-0.5 hover:border-brand/14 hover:bg-brand-soft/55"
                    >
                      <span className="block text-sm font-black text-ink">{option.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate">{option.detail}</span>
                    </button>
                  ))}
                </div>
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setFlowState((current) => {
                        const activeState = current.assistantId === assistant.id ? current : createAssistantFlowState(assistant.id);
                        return {
                          ...activeState,
                          assistantId: assistant.id,
                          stepIndex: Math.max(0, activeState.stepIndex - 1),
                        };
                      })
                    }
                    className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-slate transition hover:text-brand"
                  >
                    Back
                  </button>
                ) : null}
              </div>
            ) : null}

            {flowResult ? (
              <div className="mt-4 rounded-[1.35rem] border border-white/80 bg-white/94 p-4 shadow-[0_18px_36px_rgba(18,17,16,0.06)]">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-brand-soft text-brand">
                    <Icon name={flowResult.icon} className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Best next step</p>
                    <h4 className="mt-1 text-base font-black text-ink">{flowResult.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate">{flowResult.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {flowResult.chips.map((chip) => (
                        <span key={chip} className="value-chip text-[10px] tracking-[0.14em]">
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <Button href={flowResult.href} className="w-full">
                        {flowResult.hrefLabel}
                      </Button>
                      {flowResult.secondaryHref && flowResult.secondaryHrefLabel ? (
                        <Button href={flowResult.secondaryHref} variant="secondary" className="w-full">
                          {flowResult.secondaryHrefLabel}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">Smart resources</p>
              <p className="mt-1 text-sm leading-6 text-slate">Structured routes beat a blank chat box when the goal is to finish the job faster.</p>
            </div>
            <div className="grid gap-2.5">
              {assistant.resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.href}
                  className="premium-focus group rounded-[1.2rem] border border-white/85 bg-white/94 px-3.5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_24px_rgba(18,17,16,0.04)] transition hover:-translate-y-0.5 hover:border-brand/14 hover:bg-brand-soft/55"
                >
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.95rem] bg-brand-soft text-brand">
                      <Icon name={resource.icon} className="h-4.5 w-4.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-ink">{resource.title}</span>
                        <Icon name="arrow" className="h-4 w-4 shrink-0 text-slate transition group-hover:text-brand" />
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate">{resource.detail}</span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-line/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,244,238,0.92))] p-4">
          <div className="rounded-[1.35rem] border border-white/85 bg-white/88 px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_28px_rgba(18,17,16,0.05)]">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] bg-[linear-gradient(180deg,#ef6a46_0%,#d94620_72%,#b73314_100%)] text-white">
                <Icon name="phone" className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Human support</p>
                <p className="mt-1 text-sm leading-6 text-ink">Call {siteConfig.phone} for urgent help, or use support for quotes, custom orders, design help, and order follow-up.</p>
                <p className="mt-1 text-xs leading-5 text-slate">{siteConfig.hours[0]} · {siteConfig.hours[1]}</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button href={siteConfig.phoneHref} className="w-full sm:flex-1">
                    Call PrintMe
                  </Button>
                  <Button href="/support#help-architecture" variant="secondary" className="w-full sm:flex-1">
                    Open support hub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
