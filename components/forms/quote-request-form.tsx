"use client";

import { useState, useTransition } from "react";
import { serviceOptions } from "@/lib/site";
import { quoteRequestSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";

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
  const [files, setFiles] = useState<File[]>([]);
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
      setStatus({ type: "error", message: "Please fix the highlighted fields and try again." });
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
        setStatus({
          type: "success",
          message: "Your request has been sent. We will follow up shortly with next steps.",
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
        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 block text-sm font-bold text-ink">{field.label}</span>
              <input
                type={field.type ?? "text"}
                value={form[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                placeholder={field.placeholder}
                aria-invalid={Boolean(fieldErrors[field.name])}
                className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-slate/60 hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
              />
              {fieldErrors[field.name] ? <p className="mt-2 text-sm text-brand">{fieldErrors[field.name]}</p> : null}
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">Service needed</span>
            <select
              value={form.serviceNeeded}
              onChange={(event) => updateField("serviceNeeded", event.target.value)}
              aria-invalid={Boolean(fieldErrors.serviceNeeded)}
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-200 hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
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
              aria-invalid={Boolean(fieldErrors.fulfillmentMethod)}
              className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-200 hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
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
          <span className="mb-2 block text-sm font-bold text-ink">Message / project details</span>
          <textarea
            value={form.projectDetails}
            onChange={(event) => updateField("projectDetails", event.target.value)}
            rows={6}
            placeholder="Share size, finish, artwork status, turnaround needs, or anything we should know."
            aria-invalid={Boolean(fieldErrors.projectDetails)}
            className="w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-all duration-200 placeholder:text-slate/60 hover:border-brand/35 focus:border-brand focus:ring-2 focus:ring-brand/15"
          />
          {fieldErrors.projectDetails ? <p className="mt-2 text-sm text-brand">{fieldErrors.projectDetails}</p> : null}
        </label>

        <div className="rounded-lg border border-dashed border-line bg-canvas px-5 py-5 transition duration-300 hover:border-brand/35 hover:bg-brand-soft/30">
          <p className="text-sm font-bold text-ink">Artwork files</p>
          <p className="mt-2 text-sm leading-6 text-slate">
            Upload-ready UI for PDFs, images, and artwork files. Supabase Storage connection is scaffolded for secure production uploads.
          </p>
          <label className="mt-4 block cursor-pointer rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-ink ring-1 ring-inset ring-line transition hover:text-brand hover:ring-brand/40">
            Select files
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
            />
          </label>
          {files.length > 0 ? (
            <div className="mt-4 space-y-2">
              {files.map((file) => (
                <p key={`${file.name}-${file.size}`} className="rounded-md bg-white px-3 py-2 text-xs text-slate">
                  {file.name} ({Math.ceil(file.size / 1024)} KB)
                </p>
              ))}
            </div>
          ) : null}
        </div>

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
            By submitting, you agree that our team may contact you about your print request.
          </p>
          <Button type="submit" disabled={isPending} className="min-w-44 disabled:cursor-not-allowed disabled:opacity-70">
            {isPending ? "Sending..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
