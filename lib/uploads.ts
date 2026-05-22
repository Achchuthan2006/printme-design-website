import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ArtworkUploadContext, ArtworkUploadMetadata } from "@/types";

const UPLOAD_BUCKET = "print-files";
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(["pdf", "ai", "eps", "psd", "jpg", "jpeg", "png", "tif", "tiff", "zip"]);

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function validateArtworkFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_FILE_EXTENSIONS.has(extension)) {
    throw new Error("Please upload a print-ready file type such as PDF, AI, EPS, JPG, PNG, TIFF, PSD, or ZIP.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("This file is over 50 MB. Please compress it or contact PrintMe for large-file transfer help.");
  }
}

function buildContextId(context: ArtworkUploadContext) {
  return context.quoteId ?? context.orderId ?? context.customerId ?? context.productSlug ?? "guest";
}

function buildUploadPath(file: File, context: ArtworkUploadContext) {
  return `${context.scope}/${buildContextId(context)}/${Date.now()}-${safeFileName(file.name)}`;
}

function createMetadata(file: File, context: ArtworkUploadContext, path: string | null, skipped = false): ArtworkUploadMetadata {
  return {
    id: crypto.randomUUID(),
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
    bucket: UPLOAD_BUCKET,
    path,
    uploadedAt: new Date().toISOString(),
    status: "uploaded",
    context,
    skipped,
  };
}

export async function uploadArtworkFile(file: File, context: ArtworkUploadContext) {
  validateArtworkFile(file);

  const supabase = getSupabaseBrowserClient();
  const path = buildUploadPath(file, context);

  if (!supabase) {
    return createMetadata(file, context, null, true);
  }

  const { error } = await supabase.storage.from(UPLOAD_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw new Error(error.message);

  // TODO: Insert this metadata into public.uploads once authenticated quote/order IDs are available in the flow.
  return createMetadata(file, context, path);
}

export async function uploadQuoteFile(file: File, quoteId: string) {
  const metadata = await uploadArtworkFile(file, { scope: "quote", quoteId });
  return { path: metadata.path, skipped: Boolean(metadata.skipped) };
}
