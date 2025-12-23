import { createBrowserClient } from "@supabase/ssr";

export const db_client = createBrowserClient(
  process.env.NEXT_PUBLIC_DATABASE_URL,
  process.env.NEXT_PUBLIC_DATABASE_KEY
);