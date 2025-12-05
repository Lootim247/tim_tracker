import { createClient } from '@supabase/supabase-js';

export const db = createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY
);