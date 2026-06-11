"use client";

import { useEffect, useState, useTransition } from "react";
import { products } from "@/data/products";
import { serviceOptions } from "@/lib/site";
import { quoteRequestSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { PrintReadyChecklist } from "@/components/upload/print-ready-checklist";
import { useAuth } from "@/components/account/auth-provider";
import { trackPrintMeEvent } from "@/lib/analytics/client";
import { siteConfig } from "@/lib/site";
import { timelineRules } from "@/data/experience";
import { ArtworkUploadMetadata, ProductOrderMethod } from "@/types";
import { createIdempotencyKey } from "@/lib/submission-guards";

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  serviceNeeded: "",
  quantity: "",
  preferredDeadline: "",
  fulfillmentMethod: "",
  projectDetails: "",
};

type FormState = typeof initialState;

const orderMethodLabels: Record<ProductOrderMethod, string> = {
  "ready-template": "Start with a template",
  "customize-template": "Choose a design and customize it",
  "design-online": "Design online",
  "upload-finished-design": "Upload your design",
  "buy-now-upload-later": "Buy now and upload artwork later",
  "request-custom-design": "Request a full custom design",
};

export function QuoteRequestForm({
  initialService = "",
  initialMethod = "",
  initialTemplate = "",
  initialBrief = "",
}: {
  initialService?: string;
  initialMethod?: string;
  initialTemplate?: string;
  initialBrief?: string;
}) {
  const { user, configured } = useAuth();
  const normalizedInitialService = initialService.trim();
  const matchedProduct = products.find((product) => product.slug === normalizedInitialService);
  const matchedService = serviceOptions.find((service) => service.toLowerCase() === normalizedInitialService.toLowerCase());
  const prefillingService = matchedProduct?.title ?? matchedService ?? initialService;
  const normalizedMethod = initialMethod as ProductOrderMethod | "";
  const methodLabel = normalizedMethod ? orderMethodLabels[normalizedMethod] : "";

  const [form, setForm] = useState<FormState>(() => ({
    ...initialState,
    serviceNeeded: prefillingService,
    projectDetails: initialBrief,
  }));
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });
  const [uploadedFiles, setUploadedFiles] = useState<ArtworkUploadMetadata[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [honeypot, setHoneypot] = useState("");
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const hasContent = Object.values(form).some((value) => value.trim().length > 0) || uploadedFiles.length > 0;
    if (!hasContent || submitted) return;

    const handleBeforeUnload = () => {
      trackPrintMeEvent({
        eventName: "quote_abandoned",
        pageType: "quote_request",
        funnelName: "quote_to_cash",
        funnelStage: "quote_request",
        journey: "quote_to_cash",
        properties: {
          serviceNeeded: form.serviceNeeded || prefillingService || null,
          uploadedFileCount: uploadedFiles.length,
        },
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form, prefillingService, submitted, uploadedFiles.length]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    if (!started) {
      setStarted(true);
      trackPrintMeEvent({
        eventName: "quote_started",
        pageType: "quote_request",
        funnelName: "quote_to_cash",
        funnelStage: "quote_request",
        journey: "quote_to_cash",
        isMicroConversion: true,
        properties: {
          serviceNeeded: prefillingService || null,
          orderMethod: normalizedMethod || null,
          templateSelected: initialTemplate || null,
        },
      });
    }
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle" });

    const validated = quoteRequestSchema.safeParse(form);

    if (!validated.success) {
      const nextErrors: Record<string, string> = {};
      validated.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") nextErrors[field] = issue.message;
      });
      setFieldErrors(nextErrors);
      setStatus({ type: "error", message: "Please fix the highlighted fields so we can quote accurately." });
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      trackPrintMeEvent({
        eventName: "quote_validation_failed",
        pageType: "quote_request",
        funnelName: "quote_to_cash",
        funnelStage: "quote_request",
        properties: {
          errorCount: Object.keys(nextErrors).length,
          serviceNeeded: form.serviceNeeded || prefillingService || null,
        },
      });
      return;
    }

    setFieldErrors({});

    startTransition(async () => {
      try {
      const structuredProjectDetails = [
          normalizedMethod ? `Order method: ${methodLabel}.` : null,
          initialTemplate ? `Selected template: ${initialTemplate}.` : null,
          validated.data.projectDetails,
        ]
          .filter(Boolean)
          .join("\n");

        if (honeypot.trim().length > 0) {
          setStatus({
            type: "success",
            message: "Your request has been received. PrintMe will follow up if anything else is needed.",
          });
          return;
        }

        const response = await fetch("/api/quote-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-idempotency-key": createIdempotencyKey("quote-request"),
          },
          body: JSON.stringify({
            ...validated.data,
            projectDetails: structuredProjectDetails,
          }),
        });

        const result = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(result.message || "Something went wrong. Please try again.");
        }

        setSubmitted(true);
        setForm(initialState);
        setUploadedFiles([]);
        setStatus({
          type: "success",
          message: "Your quote request is in. PrintMe will review the details and follow up with pricing, timing, and the best next step.",
        });
        trackPrintMeEvent({
          eventName: "quote_submitted",
          pageType: "quote_request",
          funnelName: "quote_to_cash",
          funnelStage: "quote_request",
          journey: "quote_to_cash",
          isConversion: true,
          value: undefined,
          properties: {
            serviceNeeded: validated.data.serviceNeeded,
            fulfillmentMethod: validated.data.fulfillmentMethod,
            orderMethod: normalizedMethod || null,
            templateSelected: initialTemplate || null,
            uploadedFileCount: uploadedFiles.length,
          },
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: error instanceof Error ? error.message : "Unable to submit the form right now.",
        });
        trackPrintMeEvent({
          eventName: "quote_submission_failed",
          pageType: "quote_request",
          funnelName: "quote_to_cash",
          funnelStage: "quote_request",
          properties: {
            serviceNeeded: form.serviceNeeded || prefillingService || null,
            reason: error instanceof Error ? error.message : "Unable to submit the form right now.",
          },
        });
      }
    });
  }

  const fields: Array<{
    label: string;
    name: keyof FormState;
    type?: string;
    placeholder?: string;
    required?: boolean;
    hint?: string;
  }> = [
    { label: "Full name", name: "fullName", placeholder: "Your name", required: true, hint: "Who should we contact about this job?" },
    { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true, hint: "We will send quote details and follow-up questions here." },
    { label: "Phone number", name: "phone", type: "tel", placeholder: "(416) 555-0123", required: true, hint: "Best number for urgent timing or clarification." },
    { label: "Company name", name: "companyName", placeholder: "Optional", hint: "Helpful for repeat orders, business printing, or invoicing." },
    { label: "Quantity", name: "quantity", placeholder: "Example: 500", required: true, hint: "Approximate quantity is enough if you are still deciding." },
  ];

  return (
    <div className="surface-card p-6 sm:p-8">
      <form
        onSubmit={onSubmit}
        className="space-y-6"
        noValidate
        data-surface="quote-request"
        data-flow="quote-to-cash"
      >
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="hidden"
          aria-hidden="true"
          name="website"
        />
        {prefillingService ? (
          <div className="rounded-[1.4rem] border border-line/80 bg-canvas px-4 py-4 text-sm leading-6 text-slate">
            <p className="font-black text-ink">Service already selected: {prefillingService}</p>
            <p className="mt-1">
              This quote request started from a service page, so PrintMe already knows which product family you are asking about.
            </p>
          </div>
        ) : null}

        {normalizedMethod ? (
          <div className="rounded-[1.4rem] border border-brand/15 bg-brand-soft px-4 py-4 text-sm leading-6 text-brand">
            <p className="font-black text-ink">Order method already selected: {methodLabel}</p>
            <p className="mt-1">
              This request started from a product page, so the team will receive the selected order path with the quote details.
              {initialTemplate ? ` Template selected: ${initialTemplate}.` : ""}
            </p>
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-brand/15 bg-brand-soft px-4 py-4 text-sm leading-6 text-brand">
          <span className="font-black text-ink">Fastest path to an accurate quote:</span> include the quantity, turnaround window, pickup or delivery preference, and artwork status. That gives PrintMe enough to respond with fewer follow-up questions.
        </div>

        {configured && !user ? (
          <div className="liquid-glass rounded-[1.45rem] px-4 py-4 text-sm leading-6 text-slate">
            <p className="font-black text-ink">Want this quote connected to a real customer account?</p>
            <p className="mt-1">
              Create an account or sign in first so future quotes, uploads, orders, and repeat jobs stay tied to one dashboard.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button href="/account/create?redirect=%2Fquote-request" className="px-4 py-2.5 text-xs" onClick={() => trackPrintMeEvent({ eventName: "customer_login_prompt_viewed", pageType: "quote_request", properties: { action: "create-account" } })}>Create Account</Button>
              <Button href="/account/login?redirect=%2Fquote-request" variant="secondary" className="px-4 py-2.5 text-xs" onClick={() => trackPrintMeEvent({ eventName: "customer_login_prompt_viewed", pageType: "quote_request", properties: { action: "sign-in" } })}>Sign In</Button>
            </div>
          </div>
        ) : null}

        <div className="rounded-[1.35rem] border border-line/80 bg-canvas px-4 py-4 text-sm leading-6 text-slate">
          Use this form when the specs are still taking shape, the job needs review, or you want PrintMe to confirm the safest path before payment is requested. If the deadline is tight, call {siteConfig.phone}.
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
              <Field key={field.name} label={field.label} hint={field.hint} error={fieldErrors[field.name]}>
                <Input
                type={field.type ?? "text"}
                value={form[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                autoComplete={field.name === "email" ? "email" : field.name === "phone" ? "tel" : field.name === "fullName" ? "name" : "on"}
                aria-invalid={Boolean(fieldErrors[field.name])}
              />
              </Field>
            ))}

          <Field label="Turnaround window" hint="Choose the nearest production window. If the job is date-sensitive, mention the in-hand date in your project details." error={fieldErrors.preferredDeadline}>
            <Select
              value={form.preferredDeadline}
              onChange={(event) => updateField("preferredDeadline", event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.preferredDeadline)}
            >
              <option value="">Choose a turnaround window</option>
              {timelineRules.map((rule) => (
                <option key={rule.title} value={`${rule.title} - ${rule.window}`}>
                  {rule.title} - {rule.window}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Service needed" hint="Choose the closest match. If you came from a product page, this may already be filled in." error={fieldErrors.serviceNeeded}>
            <Select
              value={form.serviceNeeded}
              onChange={(event) => updateField("serviceNeeded", event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.serviceNeeded)}
            >
              <option value="">Select a service</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Pickup or delivery" hint="Choose your preferred path. We can still confirm what makes the most sense." error={fieldErrors.fulfillmentMethod}>
            <Select
              value={form.fulfillmentMethod}
              onChange={(event) => updateField("fulfillmentMethod", event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.fulfillmentMethod)}
            >
              <option value="">Choose one</option>
              <option value="In-store pickup">In-store pickup</option>
              <option value="Local delivery">Local delivery</option>
              <option value="Need help deciding">Need help deciding</option>
            </Select>
          </Field>
        </div>

        <Field
          label="Tell us what the finished job needs to do"
          hint="Include size, sides, stock, finish, where it will be used, or anything else that helps us quote accurately."
          error={fieldErrors.projectDetails}
        >
          <Textarea
            value={form.projectDetails}
            onChange={(event) => updateField("projectDetails", event.target.value)}
            rows={6}
            placeholder="Example: 500 double-sided flyers for pickup Friday afternoon. Artwork is ready, but please check bleed and colour before print."
            aria-invalid={Boolean(fieldErrors.projectDetails)}
            required
          />
        </Field>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
          <ArtworkUploadZone
            context={{ scope: "quote", productSlug: form.serviceNeeded || undefined, relatedLabel: "Quote request" }}
            title="Upload artwork for a more accurate quote"
            description="Attach your files now so PrintMe can review size, quality, bleed, turnaround, and finishing details before quoting."
            onUploaded={(files) => setUploadedFiles(files)}
          />
          <PrintReadyChecklist compact className="shadow-none" />
        </div>

        <div className="rounded-[1.35rem] border border-line/80 bg-canvas px-4 py-3 text-xs leading-5 text-slate">
          Files upload separately from the form so PrintMe can start reviewing artwork right away. If the files are not final yet, submit the request now and mention what is still coming.
        </div>

        <div className="rounded-[1.35rem] border border-line/80 bg-white/90 px-4 py-4 text-sm leading-6 text-slate">
          PrintMe reviews the request first, then replies with pricing, timing, file questions, or the clearest next step.
        </div>

        {uploadedFiles.length > 0 ? (
          <FeedbackMessage>
            {uploadedFiles.length} file{uploadedFiles.length === 1 ? "" : "s"} attached. That helps us quote with more confidence and less back-and-forth.
          </FeedbackMessage>
        ) : null}

        {status.message ? (
          <FeedbackMessage tone={status.type === "success" ? "success" : "error"} className="hero-in">
            {status.message}
          </FeedbackMessage>
        ) : null}

        {status.type === "success" ? (
          <div className="grid gap-3 rounded-[1.35rem] border border-emerald-100 bg-emerald-50/80 p-4 md:grid-cols-3">
            {[
              "We review the service, quantity, timing, and fulfillment details.",
              "If files were attached, we check size, quality, bleed, and production fit.",
              "You get pricing, clarification, or the cleanest next step instead of guesswork.",
            ].map((item, index) => (
              <div key={item} className="rounded-[1rem] bg-white/80 px-3 py-3 text-sm leading-6 text-slate">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">Next {index + 1}</p>
                <p className="mt-2">{item}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate">
            No payment is taken here. This form is only used to review your request, confirm pricing and timing, and guide you to the right next step.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isPending} className="min-w-44 disabled:cursor-not-allowed disabled:opacity-70" data-cta="quote-submit">
              {isPending ? "Sending..." : "Send Quote Request"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
