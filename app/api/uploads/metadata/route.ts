import { NextResponse } from "next/server";
import { uploadMetadataSchema } from "@/lib/backend/schemas";
import { persistArtworkMetadataRecord } from "@/lib/backend/repository";
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
      customerId: parsed.data.context.customerId,
      productSlug: parsed.data.context.productSlug,
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
