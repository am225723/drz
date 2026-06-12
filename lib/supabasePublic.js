import { createClient } from '@supabase/supabase-js';

let functionAuthFetchPatched = false;
let browserSupabaseClient = null;

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function isSupabaseFunctionRequest(input) {
  const requestUrl = typeof input === 'string' ? input : input?.url || '';
  const supabaseUrl = getSupabaseUrl().replace(/\/$/, '');
  return Boolean(supabaseUrl && requestUrl.startsWith(`${supabaseUrl}/functions/v1/`));
}

function installFunctionAuthFetchPatch() {
  if (typeof window === 'undefined' || functionAuthFetchPatched) return;
  const anonKey = getSupabaseAnonKey();
  if (!anonKey) return;

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    if (!isSupabaseFunctionRequest(input)) return originalFetch(input, init);

    const headers = new Headers(init.headers || (typeof input !== 'string' ? input.headers : undefined));
    if (!headers.has('apikey')) headers.set('apikey', anonKey);
    if (!headers.has('Authorization')) headers.set('Authorization', `Bearer ${anonKey}`);

    return originalFetch(input, { ...init, headers });
  };
  functionAuthFetchPatched = true;
}

export function getSupabaseBrowserClient() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) return null;

  if (browserSupabaseClient) return browserSupabaseClient;

  browserSupabaseClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return browserSupabaseClient;
}

export function getSupabaseServerClient() {
  const url = getSupabaseUrl();
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
  installFunctionAuthFetchPatch();
  const explicit = process.env.NEXT_PUBLIC_CONTACT_FUNCTION_URL;
  if (explicit) return explicit;
  const url = getSupabaseUrl();
  if (!url) return '';
  return `${url.replace(/\/$/, '')}/functions/v1/submit-contact`;
}
