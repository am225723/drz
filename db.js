const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Hostinger Supabase connection check.
// Uses the public CMS pages table rather than contact_submissions.
if (process.env.CHECK_SUPABASE_CONNECTION === 'true') {
  supabase
    .from('pages')
    .select('id, slug, title')
    .limit(1)
    .then(({ data, error }) => {
      if (error) console.error('Supabase connection error:', error.message);
      else console.log('Supabase connected:', data);
    });
}

module.exports = supabase;
