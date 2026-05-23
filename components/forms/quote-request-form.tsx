"use client";

import { useState, useTransition } from "react";
import { serviceOptions } from "@/lib/site";
import { quoteRequestSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { PrintReadyChecklist } from "@/components/upload/print-ready-checklist";
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

export function QuoteRequestForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });
  const [uploadedFiles, setUploadedFiles] = useState<ArtworkUploadMetadata[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
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
  }> = [
    { label: "Full name", name: "fullName", placeholder: "Your name", required: true },
    { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true },
    { label: "Phone number", name: "phone", type: "tel", placeholder: "(416) 555-0123", required: true },
    { label: "Company name", name: "companyName", placeholder: "Optional" },
    { label: "Quantity", name: "quantity", placeholder: "Example: 500", required: true },
    { label: "Preferred deadline", name: "preferredDeadline", type: "date", required: true },
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

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.name} label={field.label} error={fieldErrors[field.name]}>
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

          <Field label="Service needed" error={fieldErrors.serviceNeeded}>
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

          <Field label="Pickup or delivery" error={fieldErrors.fulfillmentMethod}>
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

        <Field label="Tell us what the finished job needs to do" error={fieldErrors.projectDetails}>
          <Textarea
            value={form.projectDetails}
            onChange={(event) => updateField("projectDetails", event.target.value)}
            rows={6}
            placeholder="Example: 500 double-sided flyers for pickup Friday afternoon. Artwork is ready, but please check bleed and colour before print."
            aria-invalid={Boolean(fieldErrors.projectDetails)}
            required
          />
        </Field>

        <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <ArtworkUploadZone
            context={{ scope: "quote", productSlug: form.serviceNeeded || undefined, relatedLabel: "Quote request" }}
            title="Upload artwork for a more accurate quote"
            description="Attach your files now so PrintMe can review size, quality, bleed, turnaround, and finishing details before quoting."
            onUploaded={(files) => setUploadedFiles(files)}
          />
          <PrintReadyChecklist compact className="shadow-none" />
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate">
            No payment is taken here. This form is only used to review your request and confirm the next production step.
          </p>
          <Button type="submit" disabled={isPending} className="min-w-44 disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? "Sending..." : "Get My Quote"}
          </Button>
        </div>
      </form>
    </div>
  );
}
