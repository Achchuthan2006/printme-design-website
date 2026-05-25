"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input } from "@/components/ui/form-controls";
import { StatusBadge } from "@/components/account/status-badge";
import { SummaryStrip } from "@/components/platform/summary-strip";
import { StatusTimeline } from "@/components/platform/status-timeline";
import { accountOrderProgress, accountQuoteProgress, demoOrders, demoQuotes } from "@/data/account";

export function OrderStatusExperience() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const order = useMemo(
    () => demoOrders.find((item) => item.orderNumber.toLowerCase() === reference.trim().toLowerCase()),
    [reference],
  );
  const quote = useMemo(
    () => demoQuotes.find((item) => item.id.toLowerCase() === reference.trim().toLowerCase() || item.service.toLowerCase() === reference.trim().toLowerCase()),
    [reference],
  );

  const resultType = order ? "order" : quote ? "quote" : null;
  const timeline =
    resultType === "order"
      ? accountOrderProgress[order!.id]
      : resultType === "quote"
        ? accountQuoteProgress[quote!.id]
        : null;

  return (
    <div className="container-shell space-y-8">
      <form
        className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <Field label="Order or quote number" hint="Example: PM-20260522-A12FQ">
            <Input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Enter your order or quote number" aria-describedby="order-status-help" />
          </Field>
          <Field label="Email address" hint="Used for account-ready tracking and support verification">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </Field>
          <Button type="submit" className="w-full lg:w-auto">Check My Status</Button>
        </div>
        <p id="order-status-help" className="mt-4 rounded-2xl border border-brand/15 bg-brand-soft px-4 py-3 text-xs leading-5 text-brand">
          Demo tracking is enabled here with preview account records. Live account-based status, timeline events, and notification history are already architected into the platform direction.
        </p>
      </form>

      {submitted ? (
        resultType ? (
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="surface-card p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">{resultType === "order" ? "Order found" : "Quote found"}</p>
                  <h2 className="mt-2 text-3xl font-black text-ink">
                    {resultType === "order" ? order!.orderNumber : quote!.service}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate">
                    {resultType === "order"
                      ? `${order!.date} • ${order!.fulfillmentMethod} • ${order!.items.join(", ")}`
                      : `${quote!.requestedDate} • ${quote!.summary}`}
                  </p>
                </div>
                <StatusBadge status={resultType === "order" ? order!.status : quote!.status} />
              </div>

              <SummaryStrip
                items={
                  resultType === "order"
                    ? [
                        { label: "Status", value: order!.status.replace(/_/g, " "), detail: "Current customer-facing order state." },
                        { label: "Fulfillment", value: order!.fulfillmentMethod, detail: "Pickup or delivery path for this job." },
                        { label: "Items", value: String(order!.items.length), detail: "Configured items tied to this order." },
                        { label: "Total", value: order!.total, detail: "Most recent order total on file." },
                      ]
                    : [
                        { label: "Status", value: quote!.status.replace(/_/g, " "), detail: "Current quote workflow state." },
                        { label: "Service", value: quote!.service, detail: "The product or print category under review." },
                        { label: "Requested", value: quote!.requestedDate, detail: "Original quote request date." },
                        { label: "Next phase", value: "Staff follow-up", detail: "Quote workflows are designed to move into pricing or approval next." },
                      ]
                }
                className="mt-6"
              />

              <div className="mt-6 rounded-[1.25rem] border border-line bg-canvas p-4 text-sm leading-6 text-slate">
                <p className="font-black text-ink">Recommended next step</p>
                <p className="mt-1">
                  {resultType === "order"
                    ? "Use support if the deadline changed, you need to swap files, or you want pickup timing confirmed."
                    : "Use support if you need to add files, clarify sizing, or approve the quote faster."}
                </p>
              </div>
            </section>

            <div className="space-y-6">
              <StatusTimeline title="Progress timeline" items={timeline ?? []} />
              <section className="surface-card p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Escalation options</p>
                <h2 className="mt-2 text-2xl font-black text-ink">Need a faster answer?</h2>
                <p className="mt-3 text-sm leading-6 text-slate">
                  Call the shop for urgent timing, use support for detailed questions, or open your account to manage repeat orders, files, and invoices in one place.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <Button href="tel:+14165721999" className="w-full">Call PrintMe</Button>
                  <Button href="/support" variant="secondary" className="w-full">Open Support</Button>
                  <Button href="/account" variant="secondary" className="w-full">Open Account</Button>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <FeedbackMessage tone="error">
            No matching preview order or quote was found. Try a known order number like `PM-20260522-A12FQ`, or contact PrintMe directly if timing is urgent.
          </FeedbackMessage>
        )
      ) : null}
    </div>
  );
}
