import { NextResponse } from "next/server";
import { dispatchQuoteReceivedNotifications } from "@/lib/backend/notifications";
import { persistQuoteRequest } from "@/lib/backend/repository";
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

    const body = await request.json();
    const parsed = quoteRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? "Please check your form input." },
        { status: 400 },
      );
    }

    const storedQuote = await persistQuoteRequest(parsed.data, {
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
      referer: request.headers.get("referer") ?? undefined,
    });
    const emailResult = await dispatchQuoteReceivedNotifications(parsed.data);

    logInfo("Quote request received", {
      quoteNumber: storedQuote.quoteNumber,
      service: parsed.data.serviceNeeded,
      persisted: storedQuote.persisted,
      legacyFallback: Boolean(storedQuote.legacyFallback),
      emailSkipped: Boolean(emailResult.skipped),
    });

    return NextResponse.json({
      message: "Quote request submitted successfully.",
      quoteNumber: storedQuote.quoteNumber,
      status: storedQuote.status,
      emailStatus: emailResult,
      storageConfigured: storedQuote.persisted,
    });
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
