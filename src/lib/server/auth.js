"use server"
import "server-only"
import { createServerSupabase } from "@/lib/server/server_db"

// used for testing incoming api routes. Checks if a header contains the 
// required user
export async function getAuthenticatedUser(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('Missing access token');

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Unauthorized');

  return user;
}