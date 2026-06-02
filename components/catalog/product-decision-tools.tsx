"use client";

import { useMemo, useState } from "react";
import { getInteractivePreviewModel } from "@/data/interactive-preview";
import { cn } from "@/lib/utils";
import { PrintProduct } from "@/types";

const scenarioMap = [
  {
    key: "starter",
    label: "Small batch",
    detail: "Good when you are testing a design, ordering for one location, or validating a new message.",
  },
  {
    key: "steady",
    label: "Repeat use",
    detail: "Best when the product will be used regularly and needs a clean, dependable spec choice.",
  },
  {
    key: "campaign",
    label: "High-visibility push",
    detail: "Best when the product supports an event, launch, store opening, or local promotion.",
  },
] as const;

export function ProductDecisionTools({ product }: { product: PrintProduct }) {
  const [scenario, setScenario] = useState<(typeof scenarioMap)[number]["key"]>("steady");
  const previewModel = getInteractivePreviewModel(product.slug);

  const quantitySuggestions = useMemo(() => {
    const quantityOption = product.options.find((option) => option.group === "quantity");
    const choices = quantityOption?.choices ?? [];

    if (choices.length === 0) return [];

    if (scenario === "starter") return choices.slice(0, 2);
    if (scenario === "campaign") return choices.slice(-2);
    return choices.slice(1, 3);
  }, [product.options, scenario]);

  const scenarioGuidance = useMemo(() => {
    if (!previewModel) return [];

    if (scenario === "starter") {
      return [
        { label: "Safest size", detail: previewModel.sizeOptions.find((item) => item.featured)?.label ?? previewModel.sizeOptions[0]?.label ?? "Standard size" },
        { label: "Material path", detail: previewModel.materialOptions[0]?.detail ?? "Choose the easiest standard material first." },
        { label: "Best next step", detail: "Use the interactive preview to validate the message before increasing quantity." },
      ];
    }

    if (scenario === "campaign") {
      return [
        { label: "Visibility priority", detail: previewModel.recommendationPrompts[0]?.detail ?? "Choose the size and finish that read clearly from farther away." },
        { label: "Finishing note", detail: previewModel.finishOptions[previewModel.finishOptions.length - 1]?.detail ?? "Use the finish that best supports image and offer impact." },
        { label: "Best next step", detail: "Compare size and mockup mode to see whether the message still reads cleanly." },
      ];
    }

    return [
      { label: "Repeat-order fit", detail: previewModel.recommendationPrompts[previewModel.recommendationPrompts.length - 1]?.detail ?? "Choose the cleanest reliable spec for ongoing use." },
      { label: "Material path", detail: previewModel.materialOptions[0]?.detail ?? "Start with the most practical stock or material." },
      { label: "Best next step", detail: "Lock the repeatable spec in the configurator, then save the order path for faster reorders." },
    ];
  }, [previewModel, scenario]);

  const comparisonSignals = useMemo(() => {
    if (!previewModel) return [];

    const premiumMaterial = previewModel.materialOptions.find((item) => item.tone === "premium") ?? previewModel.materialOptions.at(-1);
    const durableMaterial =
      previewModel.materialOptions.find((item) => item.tone === "durable" || item.tone === "outdoor") ?? previewModel.materialOptions[0];
    const standardSize = previewModel.sizeOptions.find((item) => item.featured) ?? previewModel.sizeOptions[0];
    const premiumFinish = previewModel.finishOptions.at(-1) ?? previewModel.finishOptions[0];

    return [
      {
        label: "Safest standard setup",
        detail: `${standardSize?.label ?? "Standard size"} with ${previewModel.materialOptions[0]?.label ?? "standard material"} keeps the path faster and easier to repeat.`,
      },
      {
        label: "Premium upgrade path",
        detail: premiumMaterial
          ? `${premiumMaterial.label} with ${premiumFinish?.label ?? "a richer finish"} is better when hand feel or presentation matters more than lowest cost.`
          : "Use the higher-end stock and finish options when the printed piece has to feel more elevated.",
      },
      {
        label: "Harder-use option",
        detail: durableMaterial
          ? `${durableMaterial.label} is the safer choice when the product will be handled more often or used in tougher environments.`
          : "Ask PrintMe to review the best material when durability or installation matters more than speed.",
      },
    ];
  }, [previewModel]);

  const routeGuidance = useMemo(() => {
    if (product.ctaMode === "direct-order") {
      return {
        title: "Fastest route",
        detail: "Lock the core specs, choose the order method, and move into cart once the setup feels right.",
      };
    }

    if (product.ctaMode === "upload-first") {
      return {
        title: "Best file-led route",
        detail: "Use the preview to confirm format and specs, then upload the print-ready file for review before production.",
      };
    }

    return {
      title: "Safest guided route",
      detail: "Use the preview to narrow the direction, then request a quote or design review for staff confirmation.",
    };
  }, [product.ctaMode]);

  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Decision helper</p>
      <h2 className="mt-2 text-3xl font-black text-ink">Use-case guidance that narrows the right spec faster</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        Start with how the product will actually be used. PrintMe can still review the final setup, but this turns vague choices into a more confident decision path.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {scenarioMap.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setScenario(item.key)}
            className={cn(
              "rounded-[1.25rem] border p-4 text-left transition",
              scenario === item.key ? "border-brand bg-brand-soft text-brand" : "border-line bg-canvas text-slate hover:border-brand/20",
            )}
          >
            <p className="text-sm font-black text-ink">{item.label}</p>
            <p className="mt-2 text-sm leading-6">{item.detail}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <div className="rounded-[1.25rem] border border-line bg-canvas p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Quantity suggestions</p>
            {quantitySuggestions.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {quantitySuggestions.map((choice) => (
                  <div key={choice.value} className="signal-card">
                    <p className="text-sm font-black text-ink">{choice.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate">{choice.description ?? "A practical quantity option for this use case."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-[1rem] border border-line bg-white p-4 text-sm leading-6 text-slate">
                This product is better handled through a guided quote because quantity, material, or installation details depend on the job.
              </div>
            )}
          </div>

          <div className="rounded-[1.25rem] border border-line bg-white p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">{routeGuidance.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate">{routeGuidance.detail}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.25rem] border border-line bg-white p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">What PrintMe would recommend</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {scenarioGuidance.map((item) => (
                <div key={item.label} className="rounded-[1rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-line bg-white p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand">Standard vs premium vs harder-use</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {comparisonSignals.map((item) => (
                <div key={item.label} className="rounded-[1rem] border border-line bg-canvas p-4">
                  <p className="text-sm font-black text-ink">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
