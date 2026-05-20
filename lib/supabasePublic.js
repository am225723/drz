import { createClient } from '@supabase/supabase-js';

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSubmitContactUrl() {
  const explicit = process.env.NEXT_PUBLIC_CONTACT_FUNCTION_URL;
  if (explicit) return explicit;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return '';
  return `${url.replace(/\/$/, '')}/functions/v1/submit-contact`;
}
