import { User } from "@supabase/supabase-js";
import { resolveAppRole } from "@/lib/authz";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isSupabaseServerConfigured } from "@/lib/env";
import { logWarn } from "@/lib/logger";
import { CustomerProfile } from "@/types";

export interface AuthenticatedRequestContext {
  user: User;
  role: "customer" | "admin";
  isAdmin: boolean;
  accessToken: string;
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.toLowerCase().startsWith("bearer ")) return null;
  return header.slice(7).trim();
}

async function getPersistedRole(user: User) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured() || !user.email) {
    return resolveAppRole(user.email);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .or(`auth_user_id.eq.${user.id},email.eq.${user.email}`)
    .maybeSingle();

  if (error) {
    logWarn("Persisted role lookup skipped", { userId: user.id, reason: error.message });
    return resolveAppRole(user.email);
  }

  const persistedRole = (data as { role?: string } | null)?.role;
  return persistedRole === "admin" ? "admin" : resolveAppRole(user.email);
}

export async function authenticateRequest(request: Request): Promise<AuthenticatedRequestContext | null> {
  const accessToken = getBearerToken(request);
  const supabase = getSupabaseServerClient();

  if (!accessToken || !supabase || !isSupabaseServerConfigured()) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    logWarn("Authenticated request lookup failed", { reason: error?.message ?? "missing user" });
    return null;
  }

  const role = await getPersistedRole(data.user);

  return {
    user: data.user,
    role,
    isAdmin: role === "admin",
    accessToken,
  };
}

export function buildProfileDraftFromUser(user: User, role?: "customer" | "admin"): CustomerProfile {
  return {
    authUserId: user.id,
    fullName: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : user.email?.split("@")[0] ?? "PrintMe customer",
    email: user.email ?? "",
    phone: typeof user.user_metadata?.phone === "string" ? user.user_metadata.phone : undefined,
    companyName: typeof user.user_metadata?.company_name === "string" ? user.user_metadata.company_name : undefined,
    role: role ?? resolveAppRole(user.email),
    accountStatus: "active",
    communicationPreferences: {
      emailUpdates: true,
      smsUpdates: false,
      marketingEmails: false,
    },
  };
}
