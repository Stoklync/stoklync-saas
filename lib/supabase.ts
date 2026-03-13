import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const noOpLock = async <R>(_n: string, _t: number, fn: () => Promise<R>) => fn();

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key, { auth: { lock: noOpLock } }) : null;
