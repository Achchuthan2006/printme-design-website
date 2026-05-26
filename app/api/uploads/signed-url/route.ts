import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/backend/auth";
import { signedUploadRequestSchema } from "@/lib/backend/schemas";
import { createArtworkSignedUpload } from "@/lib/backend/storage";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { logError } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit({ key: `upload-signed-url:${ip}`, limit: 30, windowMs: 60_000 });

    if (!rateLimit.allowed) {
      return NextResponse.json({ message: "Too many upload requests. Please wait a moment and try again." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = signedUploadRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Upload request is incomplete." }, { status: 400 });
    }

    const auth = await authenticateRequest(request);
    const signedUpload = await createArtworkSignedUpload({
      fileName: parsed.data.fileName,
      fileSize: parsed.data.fileSize,
      context: parsed.data.context,
      ownerId: auth?.user.id ?? parsed.data.context.customerId,
    });

    return NextResponse.json(signedUpload);
  } catch (error) {
    logError("Signed upload URL generation failed", error);
    return NextResponse.json({ message: "Unable to prepare secure upload right now." }, { status: 500 });
  }
}
