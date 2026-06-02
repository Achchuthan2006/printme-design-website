import { NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/backend/schemas";
import { ensureStripeCustomer, recordCheckoutBillingRecord } from "@/lib/backend/billing";
import { dispatchOrderReceivedNotifications } from "@/lib/backend/notifications";
import { createPayloadFingerprint, resolveIdempotencyKey } from "@/lib/backend/idempotency";
import {
  findIdempotencyRecord,
  persistIdempotencyRecord,
  persistOrderDraft,
  recordAnalyticsEvent,
  recordNotificationInboxItem,
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
    let body: unknown;
    try {
      body = JSON.parse(rawBody) as unknown;
    } catch {
      return NextResponse.json({ message: "Checkout request body is invalid." }, { status: 400 });
    }
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

    const order = buildOrderSnapshot(parsed.data as CheckoutPayload);

    const persistence = await persistOrderDraft({
      payload: parsed.data as CheckoutPayload,
      order,
      paymentMode: order.paymentMode,
      requestMeta: {
        ipAddress: ip,
        userAgent: request.headers.get("user-agent") ?? undefined,
        referer: request.headers.get("referer") ?? undefined,
      },
    });

    const successUrl = `${env.siteUrl}/checkout/success?order=${encodeURIComponent(order.orderNumber)}&mode=${encodeURIComponent(order.paymentMode)}${order.amountDueLaterCents > 0 ? `&balance=${order.amountDueLaterCents}` : ""}`;
    const cancelUrl = `${env.siteUrl}/checkout/cancel?order=${encodeURIComponent(order.orderNumber)}&mode=${encodeURIComponent(order.paymentMode)}`;
    const billingCustomer = await ensureStripeCustomer({
      email: parsed.data.customer.email,
      fullName: parsed.data.customer.fullName,
      phone: parsed.data.customer.phone,
    });

    const session = await createCheckoutSession({
      order,
      mode: order.paymentMode,
      successUrl,
      cancelUrl,
      idempotencyKey,
      customerId: billingCustomer.stripeCustomerId,
    });

    if ("sessionId" in session && session.sessionId) {
      await updateOrderCheckoutSession({
        orderNumber: order.orderNumber,
        stripeSessionId: session.sessionId,
      });
    }

    await recordCheckoutBillingRecord({
      order,
      paymentMode: order.paymentMode,
      stripeCustomerId: billingCustomer.stripeCustomerId,
      stripeSessionId: "sessionId" in session ? session.sessionId : null,
      currency: "cad",
    });

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
    await recordAnalyticsEvent({
      eventName: "checkout_session_created",
      entityType: "order",
      entityId: order.orderNumber,
      source: "web",
      path: "/checkout",
      funnelName: "direct_checkout",
      funnelStage: "checkout",
      pageType: "checkout",
      journey: "direct_checkout",
      isConversion: true,
      value: order.amountDueNowCents / 100,
      currency: "CAD",
      properties: {
        paymentMode: order.paymentMode,
        fulfillmentMethod: parsed.data.fulfillmentMethod,
        itemCount: order.items.length,
        stripeStatus: session.status,
      },
    });
    await recordNotificationInboxItem({
      title: `New order created: ${order.orderNumber}`,
      detail: `Checkout started for ${order.items.length} item(s) with ${order.paymentMode} payment mode.`,
      audience: "staff",
      channel: session.status === "demo" ? "system" : "payment",
      priority: order.quoteReviewRequired ? "high" : "normal",
      actionHref: "/admin/orders",
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
