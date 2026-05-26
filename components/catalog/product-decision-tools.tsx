"use client";

import { useMemo, useState } from "react";
import { PrintProduct } from "@/types";

const scenarioMap = [
  { key: "starter", label: "Small batch", detail: "Good when you are testing a design or ordering for one location." },
  { key: "steady", label: "Steady use", detail: "Best when the product is used weekly or handed out regularly." },
  { key: "campaign", label: "Campaign push", detail: "Best when the product supports an event, launch, or multi-day promotion." },
];

export function ProductDecisionTools({ product }: { product: PrintProduct }) {
  const [scenario, setScenario] = useState("steady");

  const quantitySuggestions = useMemo(() => {
    const quantityOption = product.options.find((option) => option.group === "quantity");
    const choices = quantityOption?.choices ?? [];

    if (choices.length === 0) return [];

    if (scenario === "starter") return choices.slice(0, 2);
    if (scenario === "campaign") return choices.slice(-2);
    return choices.slice(1, 3);
  }, [product.options, scenario]);

  return (
    <section className="surface-card p-6">
      <p className="editorial-kicker">Decision helper</p>
      <h2 className="mt-2 text-3xl font-black text-ink">Not sure which quantity or path fits your job?</h2>
      <p className="mt-3 text-sm leading-7 text-slate">
        Start with how the product will be used. PrintMe can still review the final specs, but this narrows the decision faster.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {scenarioMap.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setScenario(item.key)}
            className={`rounded-[1.25rem] border p-4 text-left transition ${
              scenario === item.key ? "border-brand bg-brand-soft text-brand" : "border-line bg-canvas text-slate hover:border-brand/20"
            }`}
          >
            <p className="text-sm font-black text-ink">{item.label}</p>
            <p className="mt-2 text-sm leading-6">{item.detail}</p>
          </button>
        ))}
      </div>
      {quantitySuggestions.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {quantitySuggestions.map((choice) => (
            <div key={choice.value} className="signal-card">
              <p className="text-sm font-black text-ink">{choice.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate">{choice.description ?? "A practical quantity option for this use case."}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
          This product is better handled through a guided quote, because quantity and specs depend on the job.
        </div>
      )}
    </section>
  );
}
