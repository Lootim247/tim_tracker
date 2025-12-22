import "server-only"
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const url = process.env.DATABASE_URL;
  const key = process.env.DATABASE_KEY; // server-only key

  if (!url || !key) {
    throw new Error("Supabase URL or key is missing");
  }

  return createClient(url, key);
}