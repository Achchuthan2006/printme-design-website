import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let browserClient: ReturnType<typeof createClient> | null = null;
let serverClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(env.supabaseUrl, env.supabaseAnonKey);
  }

  return browserClient;
}

export function getSupabaseServerClient() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }

  if (!serverClient) {
    serverClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClient;
}

// Future integration point:
// - add signed upload URLs for artwork
// - connect authenticated customer dashboards
// - store order history and tracking events
