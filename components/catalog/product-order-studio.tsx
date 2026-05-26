"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form-controls";
import { Icon } from "@/components/ui/icon";
import { getTemplatesForProduct } from "@/data/templates";
import { ProductOrderMethod, ProductTemplate, PrintProduct } from "@/types";
import { cn } from "@/lib/utils";

const orderMethodCopy: Record<
  ProductOrderMethod,
  {
    title: string;
    shortTitle: string;
    description: string;
    staffBenefit: string;
    icon: string;
  }
> = {
  "ready-template": {
    title: "Use a ready template",
    shortTitle: "Ready template",
    description: "Fastest path when you want a stored layout, light edits, and a quick move into proofing or ordering.",
    staffBenefit: "Staff receives the chosen template, product, and the exact editable fields instead of a vague design request.",
    icon: "spark",
  },
  "customize-template": {
    title: "Choose a design and customize it",
    shortTitle: "Template with edits",
    description: "Best when you like a direction but still want PrintMe to handle light layout changes, branding, or content cleanup.",
    staffBenefit: "Staff receives the chosen direction, the business details, and the requested edits in one structured brief.",
    icon: "document",
  },
  "upload-finished-design": {
    title: "Upload my finished design",
    shortTitle: "Upload artwork",
    description: "Best when the artwork is already built and you mainly need file review, sizing confirmation, and the right production path.",
    staffBenefit: "Staff receives the product specs, the file, and a clear review context instead of guessing what the upload is for.",
    icon: "upload",
  },
  "request-custom-design": {
    title: "Request a full custom design",
    shortTitle: "Custom design",
    description: "Best when you know the product and goal but still need PrintMe to create the design from scratch.",
    staffBenefit: "Staff receives a proper creative brief with audience, style, content readiness, and timeline needs.",
    icon: "custom",
  },
};

const fieldLabels: Record<string, string> = {
  fullName: "Full name",
  companyName: "Company name",
  phone: "Phone",
  email: "Email",
  website: "Website",
  headline: "Headline / message",
};

function buildQuoteHref(params: { productSlug: string; method: ProductOrderMethod; templateId?: string; brief?: string }) {
  const search = new URLSearchParams({
    service: params.productSlug,
    method: params.method,
  });

  if (params.templateId) {
    search.set("template", params.templateId);
  }

  if (params.brief) {
    search.set("brief", params.brief);
  }

  return `/quote-request?${search.toString()}`;
}

function getDefaultMethod(product: PrintProduct, hasTemplates: boolean): ProductOrderMethod {
  if (hasTemplates) {
    return product.mode === "direct-order" ? "ready-template" : "customize-template";
  }

  if (product.ctaMode === "upload-first") {
    return "upload-finished-design";
  }

  return "request-custom-design";
}

function TemplateMockup({
  template,
  viewId,
  previewValues,
}: {
  template: ProductTemplate;
  viewId: string;
  previewValues: Record<string, string>;
}) {
  const view = template.views.find((item) => item.id === viewId) ?? template.views[0];
  const accent =
    view.accent === "ink"
      ? "bg-ink text-white"
      : view.accent === "soft"
        ? "bg-[#f4efe8] text-ink"
        : "bg-brand text-white";

  const displayHeadline = previewValues.headline || view.headline;
  const displayName = previewValues.fullName || previewValues.companyName || "Your brand";
  const displaySupport = previewValues.phone || previewValues.email || previewValues.website || view.detail;

  return (
    <div className="rounded-[1.5rem] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,238,231,0.82))] p-5 shadow-[0_18px_28px_rgba(18,17,16,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate">{view.label}</p>
        <span className="rounded-full border border-line/80 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">
          {template.recommendedSize}
        </span>
      </div>
      <div className={cn("mt-4 rounded-[1.35rem] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]", accent)}>
        <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-80">{template.industry}</p>
        <h3 className="mt-5 text-2xl font-black leading-[0.95]">{displayHeadline}</h3>
        <p className="mt-3 max-w-sm text-sm font-bold leading-6 opacity-90">{displayName}</p>
        <p className="mt-2 max-w-sm text-sm leading-6 opacity-80">{displaySupport}</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white/40" />
          <div className="h-2 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

export function ProductOrderStudio({ product }: { product: PrintProduct }) {
  const templates = useMemo(() => getTemplatesForProduct(product.slug), [product.slug]);
  const industries = useMemo(() => Array.from(new Set(templates.map((template) => template.industry))), [templates]);
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const deferredIndustryFilter = useDeferredValue(industryFilter);
  const visibleTemplates = useMemo(
    () => (deferredIndustryFilter === "All" ? templates : templates.filter((template) => template.industry === deferredIndustryFilter)),
    [deferredIndustryFilter, templates],
  );
  const [selectedMethod, setSelectedMethod] = useState<ProductOrderMethod>(() => getDefaultMethod(product, templates.length > 0));
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | null>(templates[0] ?? null);
  const [activeView, setActiveView] = useState<string>(templates[0]?.views[0]?.id ?? "front");
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({
    fullName: "",
    companyName: "",
    phone: "",
    email: "",
    website: "",
    headline: "",
  });
  const [customizeNotes, setCustomizeNotes] = useState("");
  const [customDesignBrief, setCustomDesignBrief] = useState({
    businessName: "",
    audience: "",
    styleDirection: "",
    contentReadiness: "",
    timelineNeeds: "",
  });

  const canUseTemplates = templates.length > 0;
  const selectedTemplateFields = selectedTemplate?.editableFields ?? ["companyName", "phone", "headline"];
  const templateBrief = useMemo(() => {
    if (!selectedTemplate) return "";
    const filledFields = selectedTemplateFields
      .map((field) => {
        const value = templateFields[field];
        if (!value?.trim()) return null;
        return `${fieldLabels[field]}: ${value.trim()}`;
      })
      .filter(Boolean)
      .join(" | ");

    return `Order method: ${orderMethodCopy[selectedMethod].shortTitle}. Template: ${selectedTemplate.title}. Style direction: ${selectedTemplate.styleDirection ?? "Template-led refinement"}.${filledFields ? ` Editable details: ${filledFields}.` : ""}${customizeNotes ? ` Requested edits: ${customizeNotes.trim()}.` : ""}`;
  }, [customizeNotes, selectedMethod, selectedTemplate, selectedTemplateFields, templateFields]);

  const customDesignSummary = useMemo(() => {
    const briefParts = [
      customDesignBrief.businessName ? `Business or brand: ${customDesignBrief.businessName}` : null,
      customDesignBrief.audience ? `Audience or use case: ${customDesignBrief.audience}` : null,
      customDesignBrief.styleDirection ? `Style direction: ${customDesignBrief.styleDirection}` : null,
      customDesignBrief.contentReadiness ? `Content or files ready: ${customDesignBrief.contentReadiness}` : null,
      customDesignBrief.timelineNeeds ? `Timeline needs: ${customDesignBrief.timelineNeeds}` : null,
    ].filter(Boolean);

    return `Order method: ${orderMethodCopy["request-custom-design"].shortTitle}.${briefParts.length > 0 ? ` ${briefParts.join(" | ")}.` : ""}`;
  }, [customDesignBrief]);

  const staffChecklist = useMemo(() => {
    if (selectedMethod === "ready-template") {
      return [
        "Selected product and recommended size",
        "Chosen template and editable text fields",
        "Customer details for proofing or account linking",
      ];
    }

    if (selectedMethod === "customize-template") {
      return [
        "Chosen template direction",
        "Requested edits and business details",
        "Clear signal that PrintMe needs to adapt the design before production",
      ];
    }

    if (selectedMethod === "upload-finished-design") {
      return [
        "Selected product and specs from the product builder",
        "Uploaded final files and file-readiness context",
        "Clear handoff for review-first or checkout-first jobs",
      ];
    }

    return [
      "Product type and use case",
      "Custom design brief with audience and style expectations",
      "Content readiness and timeline needs before design starts",
    ];
  }, [selectedMethod]);

  const directOrderPath = product.mode !== "quote-only" && product.ctaMode !== "contact";
  const readyTemplateHref = directOrderPath ? "#order-builder" : buildQuoteHref({ productSlug: product.slug, method: "ready-template", templateId: selectedTemplate?.id, brief: templateBrief });
  const customizeTemplateHref = buildQuoteHref({ productSlug: product.slug, method: "customize-template", templateId: selectedTemplate?.id, brief: templateBrief });
  const customDesignHref = buildQuoteHref({ productSlug: product.slug, method: "request-custom-design", brief: customDesignSummary });
  const uploadReviewHref = buildQuoteHref({
    productSlug: product.slug,
    method: "upload-finished-design",
    brief: `Order method: Upload artwork. Customer plans to upload a finished design for ${product.title} and wants file review before production.`,
  });

  return (
    <section className="surface-card p-6" id="order-studio">
      <p className="editorial-kicker">Order studio</p>
      <h2 className="mt-2 text-3xl font-black text-ink">Choose how you want to order this product.</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
        Every product follows the same PrintMe logic: choose the product, confirm the specs, choose the right order path, preview what you can, then submit the right details for staff to handle the job clearly.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        {(Object.keys(orderMethodCopy) as ProductOrderMethod[]).map((method) => {
          const item = orderMethodCopy[method];
          const disabledTemplateMethod = (method === "ready-template" || method === "customize-template") && !canUseTemplates;

          return (
            <button
              key={method}
              type="button"
              onClick={() => {
                if (disabledTemplateMethod) return;
                setSelectedMethod(method);
              }}
              className={cn(
                "premium-surface flex h-full flex-col p-5 text-left transition",
                selectedMethod === method ? "border-brand bg-brand-soft/45 shadow-soft" : "hover:border-brand/30",
                disabledTemplateMethod ? "cursor-not-allowed opacity-60" : "",
              )}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
                <Icon name={item.icon} className="h-4.5 w-4.5" />
              </span>
              <h3 className="mt-5 text-base font-black leading-[1.04] text-ink">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate">{item.description}</p>
              <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-brand">
                {disabledTemplateMethod ? "Template flow coming for this product" : item.shortTitle}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-6">
          {(selectedMethod === "ready-template" || selectedMethod === "customize-template") && canUseTemplates ? (
            <section className="rounded-[1.5rem] border border-line bg-canvas p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Step 2: choose a design direction</p>
                  <h3 className="mt-2 text-2xl font-black text-ink">
                    {selectedMethod === "ready-template" ? "Pick the cleanest preset" : "Choose a template for PrintMe to adapt"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIndustryFilter("All")}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition",
                      industryFilter === "All" ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-slate",
                    )}
                  >
                    All
                  </button>
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => setIndustryFilter(industry)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition",
                        industryFilter === industry ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-slate",
                      )}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {visibleTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setActiveView(template.views[0]?.id ?? "front");
                    }}
                    className={cn(
                      "rounded-[1.35rem] border p-4 text-left transition hover:border-brand/30 hover:bg-white/95",
                      selectedTemplate?.id === template.id ? "border-brand bg-white shadow-soft" : "border-line bg-white/82",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-ink">{template.title}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate">{template.industry}</p>
                      </div>
                      <span className="rounded-full border border-line/80 bg-canvas px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate">
                        {template.recommendedSize}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate">{template.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.tags.map((tag) => (
                        <span key={tag} className="value-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {selectedMethod === "ready-template" && selectedTemplate ? (
            <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Step 3: edit the simple details</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Use a stored template with light personalization.</h3>
              <p className="mt-2 text-sm leading-6 text-slate">
                This is the fastest path. Edit the essentials, preview the direction, then continue into the builder or request a proof.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {selectedTemplateFields.map((field) => (
                  <Field key={field} label={fieldLabels[field]} hint="Only include what should appear on the preset.">
                    <Input
                      value={templateFields[field] ?? ""}
                      onChange={(event) => setTemplateFields((current) => ({ ...current, [field]: event.target.value }))}
                      placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
                    />
                  </Field>
                ))}
              </div>
              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.views.map((view) => (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() => setActiveView(view.id)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition",
                        activeView === view.id ? "border-brand bg-brand-soft text-brand" : "border-line bg-canvas text-slate",
                      )}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>
                <div className="mt-5">
                  <TemplateMockup template={selectedTemplate} viewId={activeView} previewValues={templateFields} />
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button href={readyTemplateHref}>
                  {directOrderPath ? "Continue to Specs and Checkout" : "Request Template Quote"}
                </Button>
                <Button href={customizeTemplateHref} variant="secondary">Need a PrintMe Proof First?</Button>
              </div>
            </section>
          ) : null}

          {selectedMethod === "customize-template" && selectedTemplate ? (
            <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Step 3: send the editable brief</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Choose a direction and tell PrintMe what should change.</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {selectedTemplateFields.map((field) => (
                  <Field key={field} label={fieldLabels[field]} hint="This gives the team the right content to place into the chosen direction.">
                    <Input
                      value={templateFields[field] ?? ""}
                      onChange={(event) => setTemplateFields((current) => ({ ...current, [field]: event.target.value }))}
                      placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
                    />
                  </Field>
                ))}
              </div>
              <Field
                label="Requested edits or customization notes"
                hint="Mention colour adjustments, logo placement, tone, missing content, back-side changes, or proof expectations."
                className="mt-5"
              >
                <Textarea
                  rows={5}
                  value={customizeNotes}
                  onChange={(event) => setCustomizeNotes(event.target.value)}
                  placeholder="Example: Keep the layout, switch to our clinic colours, add two doctors on the back, and leave space for QR booking."
                />
              </Field>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button href={customizeTemplateHref}>Send Structured Template Request</Button>
                <Button href="#order-builder" variant="secondary">Compare Specs First</Button>
              </div>
            </section>
          ) : null}

          {selectedMethod === "upload-finished-design" ? (
            <section className="space-y-5">
              <ArtworkUploadZone
                context={{ scope: "product", productSlug: product.slug, relatedLabel: `${product.title} upload-first order` }}
                title={`Upload your finished ${product.title.toLowerCase()} design`}
                description="Choose this path when the artwork is final and you mainly need file review, spec confirmation, and the right production handoff."
                helperText="Upload the print-ready file after confirming the size, sides, quantity, and any special finishing in the order builder."
                className="shadow-none"
              />
              <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Step 3: confirm the handoff</p>
                <div className="mt-4 grid gap-3">
                  {[
                    "Confirm the specs in the product builder so the uploaded file matches the final printed piece.",
                    "Use quote-first when you want PrintMe to review the file before any payment path is chosen.",
                    "Use direct checkout when the specs are clear and the file is already production-ready.",
                  ].map((item) => (
                    <div key={item} className="signal-card text-sm leading-6 text-slate">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button href="#order-builder">{directOrderPath ? "Continue to Specs and Checkout" : "Confirm Specs for Review"}</Button>
                  <Button href={uploadReviewHref} variant="secondary">Request File Review First</Button>
                </div>
              </div>
            </section>
          ) : null}

          {selectedMethod === "request-custom-design" ? (
            <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Step 3: build a proper design brief</p>
              <h3 className="mt-2 text-2xl font-black text-ink">Replace the vague email with a structured request.</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Business or brand name" hint="Who is this design for?">
                  <Input
                    value={customDesignBrief.businessName}
                    onChange={(event) => setCustomDesignBrief((current) => ({ ...current, businessName: event.target.value }))}
                    placeholder="Example: Northview Dental"
                  />
                </Field>
                <Field label="Audience or use case" hint="What should the finished piece help someone do?">
                  <Input
                    value={customDesignBrief.audience}
                    onChange={(event) => setCustomDesignBrief((current) => ({ ...current, audience: event.target.value }))}
                    placeholder="Example: New patient handout for local mail drop"
                  />
                </Field>
                <Field label="Style direction" hint="Modern, premium, bold, minimal, local, technical, etc.">
                  <Input
                    value={customDesignBrief.styleDirection}
                    onChange={(event) => setCustomDesignBrief((current) => ({ ...current, styleDirection: event.target.value }))}
                    placeholder="Example: Clean, minimal, premium, easy to scan"
                  />
                </Field>
                <Field label="Content or files ready" hint="What do you already have?">
                  <Input
                    value={customDesignBrief.contentReadiness}
                    onChange={(event) => setCustomDesignBrief((current) => ({ ...current, contentReadiness: event.target.value }))}
                    placeholder="Example: Logo, copy, and two photos are ready"
                  />
                </Field>
              </div>
              <Field label="Timeline needs" hint="Tell PrintMe when the piece needs to be approved, printed, or in hand." className="mt-5">
                <Textarea
                  rows={4}
                  value={customDesignBrief.timelineNeeds}
                  onChange={(event) => setCustomDesignBrief((current) => ({ ...current, timelineNeeds: event.target.value }))}
                  placeholder="Example: Need first proof this week and finished print for pickup early next week."
                />
              </Field>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button href={customDesignHref}>Send Custom Design Brief</Button>
                <Button href={`/quote-request?service=${product.slug}`} variant="secondary">Start with a Simpler Quote</Button>
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[1.5rem] border border-line bg-canvas p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Structured order handoff</p>
            <h3 className="mt-2 text-2xl font-black text-ink">What your team receives from this path</h3>
            <p className="mt-2 text-sm leading-6 text-slate">{orderMethodCopy[selectedMethod].staffBenefit}</p>
            <div className="mt-5 grid gap-3">
              {staffChecklist.map((item) => (
                <div key={item} className="signal-card">
                  <div className="flex items-start gap-3">
                    <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand" />
                    <p className="text-sm leading-6 text-slate">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Order path logic</p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate">
              <p><span className="font-black text-ink">Step 1:</span> choose the product.</p>
              <p><span className="font-black text-ink">Step 2:</span> confirm the specs in the builder.</p>
              <p><span className="font-black text-ink">Step 3:</span> pick the right order method.</p>
              <p><span className="font-black text-ink">Step 4:</span> preview or brief the design path.</p>
              <p><span className="font-black text-ink">Step 5:</span> submit a structured order, review, or quote request.</p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
