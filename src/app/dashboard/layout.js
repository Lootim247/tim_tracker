"use server"
import "server-only"
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/server/server_db";

export default async function ProtectedLayout({ children }) {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/enter");

  return children;
}
