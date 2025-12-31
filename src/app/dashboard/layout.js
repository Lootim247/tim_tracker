"use server"
import "server-only"
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/server/auth";
import { LayoutProvider } from "@/components/client/layout-context";
import { getRelatedUsers } from "@/lib/shared/db_rpcs";
import { createServerSupabase } from "@/lib/server/server_db";

export default async function ProtectedLayout({ children }) {
  const user = await getAuthenticatedUser()
  if (!user) redirect("/enter");

  const db = await createServerSupabase()
  const related_users = await getRelatedUsers(db, user.id)

  return (
    <LayoutProvider value={{friends: related_users, user: user.id}}> {children} </LayoutProvider>
  );
}
