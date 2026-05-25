"use client";

import { useState, useTransition } from "react";
import { useEffect } from "react";
import { products } from "@/data/products";
import { serviceOptions } from "@/lib/site";
import { quoteRequestSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { PrintReadyChecklist } from "@/components/upload/print-ready-checklist";
import { siteConfig } from "@/lib/site";
import { ArtworkUploadMetadata } from "@/types";

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

export function QuoteRequestForm({ initialService = "" }: { initialService?: string }) {
  const normalizedInitialService = initialService.trim();
  const matchedProduct = products.find((product) => product.slug === normalizedInitialService);
  const matchedService = serviceOptions.find((service) => service.toLowerCase() === normalizedInitialService.toLowerCase());
  const prefillingService = matchedProduct?.title ?? matchedService ?? initialService;

  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });
  const [uploadedFiles, setUploadedFiles] = useState<ArtworkUploadMetadata[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!prefillingService) return;
    setForm((current) => (current.serviceNeeded === prefillingService ? current : { ...current, serviceNeeded: prefillingService }));
  }, [prefillingService]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
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
      return;
    }

    setFieldErrors({});

    startTransition(async () => {
      try {
        const response = await fetch("/api/quote-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validated.data),
        });

        const result = (await response.json()) as { message?: string };

        if (!response.ok) {
          throw new Error(result.message || "Something went wrong. Please try again.");
        }

        setForm(initialState);
        setUploadedFiles([]);
        setStatus({
          type: "success",
          message: "Your quote request is in. PrintMe will review the details and follow up with pricing, timing, and the best next step.",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: error instanceof Error ? error.message : "Unable to submit the form right now.",
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
    { label: "Preferred deadline", name: "preferredDeadline", type: "date", required: true, hint: "Tell us the real date you need it in hand." },
  ];

  return (
    <div className="surface-card p-6 sm:p-8">
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Step 1", title: "Tell us the job", detail: "Service, quantity, and the real deadline." },
            { label: "Step 2", title: "Upload files if ready", detail: "Helpful for more accurate review, but optional." },
            { label: "Step 3", title: "Get the next step", detail: "Quote, clarification, or the safest production path." },
          ].map((item) => (
            <div key={item.title} className="signal-card">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand">{item.label}</p>
              <p className="mt-2 text-sm font-black text-ink">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-brand/15 bg-brand-soft px-4 py-4 text-sm leading-6 text-brand">
          <span className="font-black text-ink">Fastest path to an accurate quote:</span> include the quantity, deadline, pickup or delivery preference, and artwork if you have it. More clarity here means fewer follow-up messages later.
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[1.35rem] border border-line/80 bg-canvas px-4 py-4 text-sm leading-6 text-slate">
            <p className="font-black text-ink">Best for custom, rush, or not-quite-standard jobs</p>
            <p className="mt-1">
              Use this form when the specs are still taking shape, the product needs review, or you want PrintMe to confirm the safest path before you pay.
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-line/80 bg-canvas px-4 py-4 text-sm leading-6 text-slate">
            <p className="font-black text-ink">Need a quick answer before you submit?</p>
            <p className="mt-1">
              Call {siteConfig.phone} if the deadline is close, the service choice is unclear, or you want help deciding whether to quote, upload, or order online.
            </p>
          </div>
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
          Files upload separately from the form so PrintMe can start reviewing artwork right away. If you are still waiting on final files, submit the request now and mention that in the project details.
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
              "You get a quote, clarification, or the cleanest next step instead of vague back-and-forth.",
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
            {status.type === "success" ? (
              <Button href="/support" variant="secondary" className="min-w-44">
                Get Help With My Project
              </Button>
            ) : null}
            <Button type="submit" disabled={isPending} className="min-w-44 disabled:cursor-not-allowed disabled:opacity-70">
              {isPending ? "Sending..." : "Send Quote Request"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
