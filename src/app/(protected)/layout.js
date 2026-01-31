"use server"
import "server-only"
import { redirect } from "next/navigation"
import { getAuthenticatedUser } from "@/lib/server/auth"
import { getRelatedUsers, getRelatedStories } from "@/lib/shared/db_rpcs"
import { createServerSupabase } from "@/lib/server/server_db"
import { LayoutProvider } from "@/components/client/contexts"

export default async function ProtectedLayout({ children }) {
  let user = null;
  try {
    user = await getAuthenticatedUser()
    if (!user) redirect("/enter")
  } catch (err) {
    redirect("/enter")
  }
  
  const db = await createServerSupabase()
  const related_users = await getRelatedUsers(db, user.id)
  const related_stories = await getRelatedStories(db)

  // value={{ user: null, friends: null, story_info: null }}
  // value={{ user: user.id, friends: related_users, story_info: related_stories }}
  return (
    <LayoutProvider value={{ user: user.id, friends: related_users, story_info: related_stories }}>
      {children}
    </LayoutProvider>
  )
}
