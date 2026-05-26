import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/backend/schemas";
import { dispatchOrderReceivedNotifications } from "@/lib/backend/notifications";
import { createPayloadFingerprint, resolveIdempotencyKey } from "@/lib/backend/idempotency";
import {
  findIdempotencyRecord,
  persistIdempotencyRecord,
  persistOrderDraft,
  recordOperationalWarning,
  updateOrderCheckoutSession,
} from "@/lib/backend/repository";
import { buildOrderSnapshot } from "@/lib/orders";
import { env } from "@/lib/env";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError, logInfo } from "@/lib/logger";
import { createCheckoutSession } from "@/lib/stripe";
import { CheckoutPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `checkout:${ip}`, limit: 20, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many checkout attempts. Please wait a moment and try again." }, { status: 429 });
    }

    const rawBody = await request.text();
    const body = JSON.parse(rawBody) as unknown;
    const parsed = checkoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Please check your checkout details and try again." }, { status: 400 });
    }

    const requestHash = createPayloadFingerprint(rawBody);
    const idempotencyKey = resolveIdempotencyKey(request, "checkout-session", requestHash);

    if (!idempotencyKey) {
      return NextResponse.json({ message: "Please retry checkout with a valid idempotency key." }, { status: 400 });
    }

    const existing = await findIdempotencyRecord("checkout-session", idempotencyKey);
    if (existing) {
      if (existing.requestHash !== requestHash) {
        return NextResponse.json(
          { message: "This idempotency key is already associated with a different checkout attempt." },
          { status: 409 },
        );
      }

      return NextResponse.json(existing.responseBody, { status: existing.statusCode });
    }

    if (parsed.data.paymentMode === "deposit") {
      return NextResponse.json({ message: "Deposit checkout is not enabled yet. Please use secure online payment for now." }, { status: 400 });
    }

    const order = buildOrderSnapshot(parsed.data as CheckoutPayload);

    const persistence = await persistOrderDraft({
      payload: parsed.data as CheckoutPayload,
      order,
      paymentMode: parsed.data.paymentMode,
      requestMeta: {
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        referer: request.headers.get("referer") ?? undefined,
      },
    });

    const successUrl = `${env.siteUrl}/checkout/success?order=${encodeURIComponent(order.orderNumber)}`;
    const cancelUrl = `${env.siteUrl}/checkout/cancel?order=${encodeURIComponent(order.orderNumber)}`;

    const session = await createCheckoutSession({
      order,
      mode: parsed.data.paymentMode,
      successUrl,
      cancelUrl,
      idempotencyKey,
    });

    if ("sessionId" in session && session.sessionId) {
      await updateOrderCheckoutSession({
        orderNumber: order.orderNumber,
        stripeSessionId: session.sessionId,
      });
    }

    if (!persistence.persisted) {
      await recordOperationalWarning("Order draft could not be persisted to the primary repository.", {
        orderNumber: order.orderNumber,
      });
    }

    const notificationResult = await dispatchOrderReceivedNotifications({
      order,
      payload: parsed.data as CheckoutPayload,
      demo: session.status === "demo",
    });

    logInfo("Checkout session created", {
      orderNumber: order.orderNumber,
      stripeStatus: session.status,
      itemCount: order.items.length,
      persisted: persistence.persisted,
      notificationSkipped: Boolean(notificationResult.skipped),
    });

    const responseBody = {
      order,
      checkoutUrl: session.url,
      stripeStatus: session.status,
    };

    await persistIdempotencyRecord({
      scope: "checkout-session",
      key: idempotencyKey,
      requestHash,
      statusCode: 200,
      responseBody,
    });

    return NextResponse.json(responseBody);
  } catch (error) {
    logError("Checkout session failed", error);

    return NextResponse.json(
      {
        message: "Unable to start checkout right now. Please review your cart or contact PrintMe for help.",
      },
      { status: 500 },
    );
  }
}
