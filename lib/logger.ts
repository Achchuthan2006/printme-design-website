import { isProduction } from "@/lib/env";

type LogContext = Record<string, unknown>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: isProduction() ? undefined : error.stack,
    };
  }

  return { message: String(error) };
}

export function logInfo(message: string, context?: LogContext) {
  console.info(JSON.stringify({ level: "info", message, context, timestamp: new Date().toISOString() }));
}

export function logWarn(message: string, context?: LogContext) {
  console.warn(JSON.stringify({ level: "warn", message, context, timestamp: new Date().toISOString() }));
}

export function logError(message: string, error: unknown, context?: LogContext) {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      error: serializeError(error),
      context,
      timestamp: new Date().toISOString(),
    }),
  );
}

export function publicErrorMessage(fallback: string) {
  return fallback;
}
