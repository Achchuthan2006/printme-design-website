"use client";

import { useMemo, useState } from "react";
import { ArtworkUploadZone } from "@/components/upload/artwork-upload-zone";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getTemplatesForProduct } from "@/data/templates";
import { ProductTemplate, PrintProduct } from "@/types";
import { cn } from "@/lib/utils";

function TemplateMockup({ template, viewId }: { template: ProductTemplate; viewId: string }) {
  const view = template.views.find((item) => item.id === viewId) ?? template.views[0];
  const accent =
    view.accent === "ink"
      ? "bg-ink text-white"
      : view.accent === "soft"
        ? "bg-[#f4efe8] text-ink"
        : "bg-brand text-white";

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
        <h3 className="mt-5 text-2xl font-black leading-[0.95]">{view.headline}</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 opacity-85">{view.detail}</p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="h-2 rounded-full bg-white/70" />
          <div className="h-2 rounded-full bg-white/40" />
          <div className="h-2 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}

export function WebToPrintStudio({ product }: { product: PrintProduct }) {
  const templates = useMemo(() => getTemplatesForProduct(product.slug), [product.slug]);
  const industries = Array.from(new Set(templates.map((template) => template.industry)));
  const [industryFilter, setIndustryFilter] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<ProductTemplate | null>(templates[0] ?? null);
  const [activeView, setActiveView] = useState<string>(templates[0]?.views[0]?.id ?? "front");

  const visibleTemplates = industryFilter === "All" ? templates : templates.filter((template) => template.industry === industryFilter);

  return (
    <section className="surface-card p-6" id="design-lab">
      <p className="editorial-kicker">Web-to-print studio</p>
      <h2 className="mt-2 text-3xl font-black text-ink">Choose upload, template, or design help without leaving the product page</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate">
        This is the cleaner PrintMe version of a web-to-print workflow: pick the product, choose your path, preview the direction, then continue into specs, upload, quote, or checkout.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Upload your design",
            detail: "Best when your file is mostly ready and you want a fast print-readiness check.",
            cta: "Upload artwork below",
            icon: "upload",
          },
          {
            title: "Browse templates",
            detail: "Best when you want a clean starting point before final customization or file prep.",
            cta: templates.length > 0 ? `${templates.length} template starters` : "Template readiness coming",
            icon: "spark",
          },
          {
            title: "Need custom design?",
            detail: "Best when the content exists but the artwork still needs setup, cleanup, or layout help.",
            cta: "Start with a quote",
            icon: "document",
          },
        ].map((item, index) => (
          <article key={item.title} className="premium-surface p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/15 bg-brand-soft text-brand">
              <Icon name={item.icon} className="h-4.5 w-4.5" />
            </span>
            <h3 className="mt-5 text-lg font-black text-ink">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate">{item.detail}</p>
            <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-brand">{item.cta}</p>
            {index === 2 ? (
              <div className="mt-4">
                <Button href={`/quote-request?service=${product.slug}`} variant="secondary" className="px-4 py-2 text-[11px]">
                  Request design help
                </Button>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
        <div className="space-y-6">
          {templates.length > 0 ? (
            <section className="rounded-[1.5rem] border border-line bg-canvas p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Browse templates</p>
                  <h3 className="mt-2 text-2xl font-black text-ink">Start from a cleaner template base</h3>
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
          ) : (
            <div className="rounded-[1.35rem] border border-line bg-canvas p-5 text-sm leading-6 text-slate">
              <p className="font-black text-ink">Template browsing is being added for this product family.</p>
              <p className="mt-2">For now, upload your own design or start with a quote so PrintMe can help shape the right artwork path.</p>
            </div>
          )}

          <ArtworkUploadZone
            context={{ scope: "product", productSlug: product.slug, relatedLabel: `${product.title} web-to-print flow` }}
            title={`Upload your ${product.title.toLowerCase()} design`}
            description="Send your own artwork first if you already have a file and want PrintMe to check size, sides, bleed, and print readiness."
            helperText="PDF is best. AI, EPS, PSD, JPG, PNG, TIFF, and ZIP packages are also accepted."
            className="shadow-none"
          />
        </div>

        <div className="space-y-6">
          {selectedTemplate ? (
            <section className="rounded-[1.5rem] border border-line bg-canvas p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Template preview</p>
              <h3 className="mt-2 text-2xl font-black text-ink">{selectedTemplate.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate">{selectedTemplate.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedTemplate.views.map((view) => (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setActiveView(view.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] transition",
                      activeView === view.id ? "border-brand bg-brand-soft text-brand" : "border-line bg-white text-slate",
                    )}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <TemplateMockup template={selectedTemplate} viewId={activeView} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button href="#order-builder">Use this template direction</Button>
                <Button href={`/quote-request?service=${product.slug}`} variant="secondary">
                  Ask PrintMe to adapt it
                </Button>
              </div>
            </section>
          ) : null}

          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-[0_14px_26px_rgba(18,17,16,0.05)]">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">File rules made simple</p>
            <div className="mt-4 grid gap-3">
              {[
                "Front and back files should be clearly named when the product prints both sides.",
                "Use PDF when possible for the most stable print setup and proofing path.",
                "If you are unsure about bleed, resolution, or safe area, upload the file anyway and PrintMe will flag the issue first.",
              ].map((item) => (
                <div key={item} className="signal-card text-sm leading-6 text-slate">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
