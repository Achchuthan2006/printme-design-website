import { getSupabaseBrowserClient } from "@/lib/supabase";
import { ArtworkUploadContext, ArtworkUploadMetadata } from "@/types";

const UPLOAD_BUCKET = "print-files";
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(["pdf", "ai", "eps", "psd", "jpg", "jpeg", "png", "tif", "tiff", "zip"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/postscript",
  "application/illustrator",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.adobe.photoshop",
]);

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function validateArtworkFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_FILE_EXTENSIONS.has(extension)) {
    throw new Error("Please upload a print-ready file type such as PDF, AI, EPS, JPG, PNG, TIFF, PSD, or ZIP.");
  }

  if (file.size <= 0) {
    throw new Error("This file looks empty. Please choose the final artwork file and try again.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("This file is over 50 MB. Please compress it or contact PrintMe for large-file transfer help.");
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("This file type is not supported for secure upload. Please export a PDF, image, source file, or ZIP package.");
  }
}

function buildContextId(context: ArtworkUploadContext) {
  return context.quoteId ?? context.orderId ?? context.customerId ?? context.productSlug ?? "guest";
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
  const signedUpload = await getSignedUploadData(file, context);
  const path = signedUpload.path;

  if (!supabase) {
    const metadata = {
      ...createMetadata(file, context, null, true),
      id: signedUpload.metadataId,
      bucket: signedUpload.bucket,
    };
    await persistArtworkMetadata(metadata);
    return metadata;
  }

  if (!signedUpload.token) {
    const metadata = {
      ...createMetadata(file, context, null, true),
      id: signedUpload.metadataId,
      bucket: signedUpload.bucket,
    };
    await persistArtworkMetadata(metadata);
    return metadata;
  }

  const { error } = await supabase.storage.from(signedUpload.bucket ?? UPLOAD_BUCKET).uploadToSignedUrl(path, signedUpload.token, file);

  if (error) throw new Error(error.message);

  const metadata = {
    ...createMetadata(file, context, path),
    id: signedUpload.metadataId,
    bucket: signedUpload.bucket,
  };
  await persistArtworkMetadata(metadata);
  return metadata;
}

export async function uploadQuoteFile(file: File, quoteId: string) {
  const metadata = await uploadArtworkFile(file, { scope: "quote", quoteId });
  return { path: metadata.path, skipped: Boolean(metadata.skipped) };
}

async function persistArtworkMetadata(metadata: ArtworkUploadMetadata) {
  try {
    const supabase = getSupabaseBrowserClient();
    const session = supabase ? await supabase.auth.getSession() : null;
    await fetch("/api/uploads/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.data.session?.access_token
          ? { Authorization: `Bearer ${session.data.session.access_token}` }
          : {}),
      },
      body: JSON.stringify(metadata),
    });
  } catch {
    // Ignore metadata persistence errors so file upload UX still completes.
  }
}

async function getSignedUploadData(file: File, context: ArtworkUploadContext) {
  const supabase = getSupabaseBrowserClient();
  const session = supabase ? await supabase.auth.getSession() : null;

  const response = await fetch("/api/uploads/signed-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.data.session?.access_token
        ? { Authorization: `Bearer ${session.data.session.access_token}` }
        : {}),
    },
    body: JSON.stringify({
      fileName: safeFileName(file.name),
      fileSize: file.size,
      context: {
        ...context,
        customerId: context.customerId ?? buildContextId(context),
      },
    }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? "Unable to prepare secure upload.");
  }

  return (await response.json()) as {
    bucket: string;
    path: string;
    token: string | null;
    metadataId: string;
    skipped: boolean;
  };
}
