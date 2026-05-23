import { env } from "@/lib/env";

export type AppRole = "customer" | "admin";

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return env.adminUserEmails.includes(email.toLowerCase());
}

export function resolveAppRole(email?: string | null): AppRole {
  return isAdminEmail(email) ? "admin" : "customer";
}
