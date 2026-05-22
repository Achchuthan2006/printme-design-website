import { getSupabaseBrowserClient } from "@/lib/supabase";

export async function uploadQuoteFile(file: File, quoteId: string) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return { path: null, skipped: true };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `quotes/${quoteId}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("print-files").upload(path, file, {
    upsert: false,
  });

  if (error) throw new Error(error.message);

  return { path, skipped: false };
}
