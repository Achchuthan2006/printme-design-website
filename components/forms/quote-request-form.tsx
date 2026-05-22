"use client";

import { useState, useTransition } from "react";
import { serviceOptions } from "@/lib/site";
import { quoteRequestSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
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
        <div className="rounded-2xl border border-brand/15 bg-brand-soft px-4 py-3 text-sm leading-6 text-brand">
          <span className="font-black text-ink">Quick quote tip:</span> add your deadline and upload artwork if available. The more detail you share now, the faster we can confirm price and production timing.
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 block text-sm font-bold text-ink">{field.label}</span>
              <input
                type={field.type ?? "text"}
                value={form[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                autoComplete={field.name === "email" ? "email" : field.name === "phone" ? "tel" : field.name === "fullName" ? "name" : "on"}
                aria-invalid={Boolean(fieldErrors[field.name])}
                className="premium-input w-full"
              />
              {fieldErrors[field.name] ? <p className="mt-2 text-sm text-brand">{fieldErrors[field.name]}</p> : null}
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">Service needed</span>
            <select
              value={form.serviceNeeded}
              onChange={(event) => updateField("serviceNeeded", event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.serviceNeeded)}
              className="premium-input w-full"
            >
              <option value="">Select a service</option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {fieldErrors.serviceNeeded ? <p className="mt-2 text-sm text-brand">{fieldErrors.serviceNeeded}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">Pickup or delivery</span>
            <select
              value={form.fulfillmentMethod}
              onChange={(event) => updateField("fulfillmentMethod", event.target.value)}
              required
              aria-invalid={Boolean(fieldErrors.fulfillmentMethod)}
              className="premium-input w-full"
            >
              <option value="">Choose one</option>
              <option value="In-store pickup">In-store pickup</option>
              <option value="Local delivery">Local delivery</option>
              <option value="Need help deciding">Need help deciding</option>
            </select>
            {fieldErrors.fulfillmentMethod ? (
              <p className="mt-2 text-sm text-brand">{fieldErrors.fulfillmentMethod}</p>
            ) : null}
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink">Tell us what success looks like</span>
          <textarea
            value={form.projectDetails}
            onChange={(event) => updateField("projectDetails", event.target.value)}
            rows={6}
            placeholder="Example: 500 double-sided flyers for pickup Friday. Artwork is ready but please check bleed and colour."
            aria-invalid={Boolean(fieldErrors.projectDetails)}
            required
            className="premium-input w-full"
          />
          {fieldErrors.projectDetails ? <p className="mt-2 text-sm text-brand">{fieldErrors.projectDetails}</p> : null}
        </label>

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
          <p className="rounded-lg bg-brand-soft px-4 py-3 text-sm font-bold text-brand">
            {uploadedFiles.length} file{uploadedFiles.length === 1 ? "" : "s"} attached. Good move - artwork review helps us quote with more confidence.
          </p>
        ) : null}

        {status.message ? (
          <div
            className={
              status.type === "success"
                ? "hero-in rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                : "hero-in rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800"
            }
          >
            {status.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate">
            No payment is taken here. We will only contact you about this print request and the next production step.
          </p>
          <Button type="submit" disabled={isPending} className="min-w-44 disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? "Sending..." : "Get My Quote"}
          </Button>
        </div>
      </form>
    </div>
  );
}
