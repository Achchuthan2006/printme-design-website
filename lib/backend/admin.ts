import { getSupabaseServerClient } from "@/lib/supabase";
import { isSupabaseServerConfigured } from "@/lib/env";

export interface AdminDashboardSnapshot {
  openQuotes: number;
  activeOrders: number;
  pendingUploadReviews: number;
  readyForPickup: number;
}

export async function getAdminDashboardSnapshot(): Promise<AdminDashboardSnapshot> {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) {
    return {
      openQuotes: 0,
      activeOrders: 0,
      pendingUploadReviews: 0,
      readyForPickup: 0,
    };
  }

  const [quotes, orders, uploads, pickups] = await Promise.all([
    supabase.from("quote_requests").select("id", { count: "exact", head: true }).in("status", ["submitted", "under_review", "waiting_for_files", "quoted"]),
    supabase.from("orders").select("id", { count: "exact", head: true }).in("workflow_status", ["payment_pending", "paid", "in_production", "on_hold", "ready_for_pickup"]),
    supabase.from("artwork_uploads").select("id", { count: "exact", head: true }).in("status", ["uploaded", "awaiting_review", "proof_required"]),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("workflow_status", "ready_for_pickup"),
  ]);

  return {
    openQuotes: quotes.count ?? 0,
    activeOrders: orders.count ?? 0,
    pendingUploadReviews: uploads.count ?? 0,
    readyForPickup: pickups.count ?? 0,
  };
}

export async function searchOperationalRecords({
  type,
  query,
}: {
  type: "orders" | "quotes" | "uploads";
  query?: string;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase || !isSupabaseServerConfigured()) return [];

  if (type === "orders") {
    let builder = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(25);
    if (query) builder = builder.or(`order_number.ilike.%${query}%,customer_email.ilike.%${query}%,customer_full_name.ilike.%${query}%`);
    const { data } = await builder;
    return data ?? [];
  }

  if (type === "quotes") {
    let builder = supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(25);
    if (query) builder = builder.or(`quote_number.ilike.%${query}%,email.ilike.%${query}%,full_name.ilike.%${query}%`);
    const { data } = await builder;
    return data ?? [];
  }

  let builder = supabase.from("artwork_uploads").select("*").order("created_at", { ascending: false }).limit(25);
  if (query) builder = builder.or(`file_name.ilike.%${query}%,order_number.ilike.%${query}%,quote_number.ilike.%${query}%`);
  const { data } = await builder;
  return data ?? [];
}
