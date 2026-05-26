import { createHash } from "node:crypto";
import { idempotencyKeySchema } from "@/lib/backend/schemas";

function normalizeScope(scope: string) {
  return scope.trim().toLowerCase();
}

export function createPayloadFingerprint(payload: string) {
  return createHash("sha256").update(payload).digest("hex");
}

export function resolveIdempotencyKey(request: Request, scope: string, payloadFingerprint: string) {
  const headerValue = request.headers.get("x-idempotency-key")?.trim();

  if (!headerValue) {
    return `${normalizeScope(scope)}:${payloadFingerprint}`;
  }

  const parsed = idempotencyKeySchema.safeParse(headerValue);
  if (!parsed.success) {
    return null;
  }

  return `${normalizeScope(scope)}:${parsed.data}`;
}
