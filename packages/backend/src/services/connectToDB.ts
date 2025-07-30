import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface EnvVariables {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const SUPABASE_URL: string = process.env.SUPABASE_URL as string;
const SUPABASE_ANON_KEY: string = process.env.SUPABASE_ANON_KEY as string;

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
