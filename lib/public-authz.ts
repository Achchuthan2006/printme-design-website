export type PublicAppRole = "customer" | "admin";

function parseList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

const publicAdminEmails = parseList(process.env.NEXT_PUBLIC_ADMIN_USER_EMAILS);

export function isPublicAdminEmail(email?: string | null) {
  if (!email) return false;
  return publicAdminEmails.includes(email.toLowerCase());
}

export function resolvePublicAppRole(email?: string | null): PublicAppRole {
  return isPublicAdminEmail(email) ? "admin" : "customer";
}
