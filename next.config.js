/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
    NEXT_PUBLIC_CONTACT_FUNCTION_URL:
      process.env.NEXT_PUBLIC_CONTACT_FUNCTION_URL ||
      (supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/functions/v1/submit-contact` : ''),
  },
};

module.exports = nextConfig;
