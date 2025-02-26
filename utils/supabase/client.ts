import { createBrowserClient } from '@supabase/ssr'

// Supabase URLとKey
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);