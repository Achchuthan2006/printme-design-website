import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function getSupabaseBrowserClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}

export function getSupabaseServerClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Future integration point:
// - add signed upload URLs for artwork
// - connect authenticated customer dashboards
// - store order history and tracking events
