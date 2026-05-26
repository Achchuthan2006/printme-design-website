import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/backend/auth";
import { dispatchUploadReceivedNotification } from "@/lib/backend/notifications";
import { uploadMetadataSchema } from "@/lib/backend/schemas";
import {
  getUploadNotificationContext,
  persistArtworkMetadataRecord,
  recordAnalyticsEvent,
  recordNotificationInboxItem,
} from "@/lib/backend/repository";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError, logInfo } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `upload-metadata:${ip}`, limit: 40, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many upload events. Please wait a moment and try again." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = uploadMetadataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Upload metadata is incomplete." }, { status: 400 });
    }

    const auth = await authenticateRequest(request);
    const profileId = auth?.user.id ?? parsed.data.context.customerId;
    const result = await persistArtworkMetadataRecord({
      fileId: parsed.data.id,
      fileName: parsed.data.fileName,
      fileSize: parsed.data.fileSize,
      mimeType: parsed.data.mimeType,
      bucket: parsed.data.bucket,
      path: parsed.data.path,
      status: parsed.data.status,
      scope: parsed.data.context.scope,
      quoteId: parsed.data.context.quoteId,
      orderId: parsed.data.context.orderId,
      customerId: profileId,
      productSlug: parsed.data.context.productSlug,
    });

    const notificationContext = await getUploadNotificationContext({
      profileId,
      quoteNumber: parsed.data.context.quoteId,
      orderNumber: parsed.data.context.orderId,
    });

    if (notificationContext?.customerEmail) {
      await dispatchUploadReceivedNotification({
        fileId: parsed.data.id,
        customerEmail: notificationContext.customerEmail,
        fileName: parsed.data.fileName,
        relatedLabel: parsed.data.context.orderId ?? parsed.data.context.quoteId ?? parsed.data.context.productSlug,
      });
    }
    await recordAnalyticsEvent({
      eventName: "upload_received",
      entityType: "upload",
      entityId: parsed.data.id,
      profileId: profileId ?? null,
      source: "web",
      path: "/upload-artwork",
      funnelStage: "artwork_upload",
      properties: {
        scope: parsed.data.context.scope,
        quoteId: parsed.data.context.quoteId,
        orderId: parsed.data.context.orderId,
        fileName: parsed.data.fileName,
      },
    });
    await recordNotificationInboxItem({
      title: `Artwork uploaded: ${parsed.data.fileName}`,
      detail: `A new file was linked to ${parsed.data.context.orderId ?? parsed.data.context.quoteId ?? "the account library"} and should be reviewed.`,
      audience: "staff",
      channel: "workflow",
      priority: "high",
      actionHref: "/admin/uploads",
    });

    logInfo("Upload metadata received", {
      fileName: parsed.data.fileName,
      persisted: result.persisted,
      scope: parsed.data.context.scope,
    });

    return NextResponse.json({ ok: true, persisted: result.persisted });
  } catch (error) {
    logError("Upload metadata persistence failed", error);
    return NextResponse.json({ message: "Unable to record upload metadata right now." }, { status: 500 });
  }
}
