import { createClient } from '@supabase/supabase-js';

// Use the anon key for client-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use the service key for server-side operations only
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL');
}

// Client-side Supabase instance (limited permissions)
export const supabaseClient = createClient(
  supabaseUrl, 
  supabaseAnonKey || ''
);

// Server-side Supabase instance (admin permissions)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null; 