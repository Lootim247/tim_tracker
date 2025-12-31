"use server"
import "server-only"
import { createServerSupabase } from "@/lib/server/server_db"

export async function getAuthenticatedUser() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}