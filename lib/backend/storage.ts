import { randomUUID } from "node:crypto";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isSupabaseServerConfigured } from "@/lib/env";
import { logWarn } from "@/lib/logger";
import { uploadMetadataSchema } from "@/lib/backend/schemas";

const DEFAULT_BUCKET = "print-files";
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(["pdf", "ai", "eps", "psd", "jpg", "jpeg", "png", "tif", "tiff", "zip"]);

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function buildContextId(context: { quoteId?: string; orderId?: string; customerId?: string; productSlug?: string }) {
  return context.quoteId ?? context.orderId ?? context.customerId ?? context.productSlug ?? "guest";
}

export function validateArtworkFileDescriptor(input: { fileName: string; fileSize: number }) {
  const extension = input.fileName.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_FILE_EXTENSIONS.has(extension)) {
    throw new Error("Please upload a print-ready file type such as PDF, AI, EPS, JPG, PNG, TIFF, PSD, or ZIP.");
  }

  if (input.fileSize > MAX_FILE_SIZE_BYTES) {
    throw new Error("This file is over 50 MB. Please compress it or contact PrintMe for large-file transfer help.");
  }
}

export function buildArtworkStoragePath(input: {
  fileName: string;
  context: { scope: "quote" | "order" | "account" | "product"; quoteId?: string; orderId?: string; customerId?: string; productSlug?: string };
  ownerId?: string;
}) {
  const ownerSegment = input.ownerId ?? "guest";
  const contextSegment = buildContextId(input.context);
  return `${input.context.scope}/${ownerSegment}/${contextSegment}/${Date.now()}-${safeFileName(input.fileName)}`;
}

export async function createArtworkSignedUpload(input: {
  fileName: string;
  fileSize: number;
  context: { scope: "quote" | "order" | "account" | "product"; quoteId?: string; orderId?: string; customerId?: string; productSlug?: string };
  ownerId?: string;
}) {
  validateArtworkFileDescriptor({ fileName: input.fileName, fileSize: input.fileSize });

  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) {
    return {
      bucket: DEFAULT_BUCKET,
      path: buildArtworkStoragePath(input),
      token: null,
      metadataId: randomUUID(),
      skipped: true,
    };
  }

  const path = buildArtworkStoragePath(input);
  const { data, error } = await supabase.storage.from(DEFAULT_BUCKET).createSignedUploadUrl(path);

  if (error || !data?.token) {
    logWarn("Signed upload URL generation skipped", { fileName: input.fileName, reason: error?.message ?? "missing token" });
    return {
      bucket: DEFAULT_BUCKET,
      path,
      token: null,
      metadataId: randomUUID(),
      skipped: true,
    };
  }

  return {
    bucket: DEFAULT_BUCKET,
    path,
    token: data.token,
    metadataId: randomUUID(),
    skipped: false,
  };
}

export function validateUploadMetadataPayload(input: unknown) {
  return uploadMetadataSchema.safeParse(input);
}
