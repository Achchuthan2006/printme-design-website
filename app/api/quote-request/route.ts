import { NextResponse } from "next/server";
import { dispatchQuoteReceivedNotifications } from "@/lib/backend/notifications";
import { createPayloadFingerprint, resolveIdempotencyKey } from "@/lib/backend/idempotency";
import {
  findIdempotencyRecord,
  persistIdempotencyRecord,
  persistQuoteRequest,
  recordAnalyticsEvent,
  recordNotificationInboxItem,
} from "@/lib/backend/repository";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError, logInfo } from "@/lib/logger";
import { quoteRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `quote:${ip}`, limit: 8, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many quote requests. Please wait a moment and try again." }, { status: 429 });
    }

    const rawBody = await request.text();
    let body: unknown;
    try {
      body = JSON.parse(rawBody) as unknown;
    } catch {
      return NextResponse.json({ message: "Quote request body is invalid." }, { status: 400 });
    }
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Please check your form input." },
        { status: 400 },
      );
    }

    const requestHash = createPayloadFingerprint(rawBody);
    const idempotencyKey = resolveIdempotencyKey(request, "quote-request", requestHash);

    if (!idempotencyKey) {
      return NextResponse.json({ message: "Please retry the request with a valid idempotency key." }, { status: 400 });
    }

    const existing = await findIdempotencyRecord("quote-request", idempotencyKey);
    if (existing) {
      if (existing.requestHash !== requestHash) {
        return NextResponse.json(
          { message: "This idempotency key is already associated with a different quote request." },
          { status: 409 },
        );
      }

      return NextResponse.json(existing.responseBody, { status: existing.statusCode });
    }

    const storedQuote = await persistQuoteRequest(parsed.data, {
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      referer: request.headers.get("referer") ?? undefined,
    });
    const emailResult = await dispatchQuoteReceivedNotifications({
      quoteNumber: storedQuote.quoteNumber,
      input: parsed.data,
    });
    await recordAnalyticsEvent({
      eventName: "quote_submitted",
      entityType: "quote",
      entityId: storedQuote.quoteNumber,
      source: "web",
      path: "/quote-request",
      funnelName: "quote_to_cash",
      funnelStage: "quote_request",
      pageType: "quote_request",
      journey: "quote_to_cash",
      isConversion: true,
      properties: {
        serviceNeeded: parsed.data.serviceNeeded,
        fulfillmentMethod: parsed.data.fulfillmentMethod,
        persisted: storedQuote.persisted,
      },
    });
    await recordNotificationInboxItem({
      title: `New quote submitted: ${parsed.data.serviceNeeded}`,
      detail: `${storedQuote.quoteNumber} is ready for staff review and customer follow-up.`,
      audience: "staff",
      channel: "workflow",
      priority: "high",
      actionHref: "/admin/quotes",
    });

    const responseBody = {
      message: "Quote request submitted successfully.",
      quoteNumber: storedQuote.quoteNumber,
      status: storedQuote.status,
      emailStatus: emailResult,
      storageConfigured: storedQuote.persisted,
    };

    await persistIdempotencyRecord({
      scope: "quote-request",
      key: idempotencyKey,
      requestHash,
      statusCode: 200,
      responseBody,
    });

    logInfo("Quote request received", {
      quoteNumber: storedQuote.quoteNumber,
      service: parsed.data.serviceNeeded,
      persisted: storedQuote.persisted,
      legacyFallback: Boolean(storedQuote.legacyFallback),
      emailSkipped: Boolean(emailResult.skipped),
    });

    return NextResponse.json(responseBody);
  } catch (error) {
    logError("Quote request submission failed", error);

    return NextResponse.json(
      {
        message: "We could not submit your request right now. Please try again later or call PrintMe directly.",
      },
      { status: 500 },
    );
  }
}
