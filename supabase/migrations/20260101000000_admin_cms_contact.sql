-- Supabase schema for Integrative Psychiatry admin/CMS/contact system.
-- Apply with: supabase db push

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  preferred_name text,
  dob date,
  mobile text,
  email text,
  contact_preference jsonb not null default '[]'::jsonb,
  voicemail_consent boolean not null default false,
  visit_type text,
  availability jsonb not null default '[]'::jsonb,
  reason_for_care text,
  brief_context text,
  payment_type jsonb not null default '[]'::jsonb,
  insurance_provider text,
  oon_acknowledgment boolean not null default false,
  status text not null default 'new' check (status in ('new', 'reviewed', 'archived')),
  admin_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id)
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  seo_title text,
  seo_description text,
  content_json jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  excerpt text,
  body text,
  takeaways jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_status_created_idx on public.contact_submissions(status, created_at desc);
create index if not exists contact_submissions_search_idx on public.contact_submissions using gin (to_tsvector('english', coalesce(full_name,'') || ' ' || coalesce(email,'') || ' ' || coalesce(reason_for_care,'')));
create index if not exists articles_public_idx on public.articles(published, sort_order, updated_at desc);
create index if not exists faqs_public_idx on public.faqs(published, category, sort_order);
create index if not exists pages_slug_public_idx on public.pages(slug, published);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at before update on public.pages for each row execute procedure public.set_updated_at();

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at before update on public.articles for each row execute procedure public.set_updated_at();

drop trigger if exists faqs_set_updated_at on public.faqs;
create trigger faqs_set_updated_at before update on public.faqs for each row execute procedure public.set_updated_at();

create or replace function public.current_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(public.current_role() = 'admin', false);
$$;

create or replace function public.has_role(required_role text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select case
    when required_role = 'viewer' then public.current_role() in ('admin', 'editor', 'viewer')
    when required_role = 'editor' then public.current_role() in ('admin', 'editor')
    when required_role = 'admin' then public.current_role() = 'admin'
    else false
  end;
$$;

alter table public.profiles enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.pages enable row level security;
alter table public.articles enable row level security;
alter table public.faqs enable row level security;
alter table public.audit_log enable row level security;

-- profiles
create policy "profiles can read own profile" on public.profiles for select using (id = auth.uid());
create policy "admins can read all profiles" on public.profiles for select using (public.is_admin());
create policy "admins can manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- contact submissions: no public insert/select/update/delete. Edge Function uses service role.
create policy "authorized users can read submissions" on public.contact_submissions for select using (public.has_role('viewer'));
create policy "admins can update submissions" on public.contact_submissions for update using (public.is_admin()) with check (public.is_admin());

-- CMS public read + admin/editor write
create policy "public can read published pages" on public.pages for select using (published = true);
create policy "authorized users can read all pages" on public.pages for select using (public.has_role('viewer'));
create policy "editors can insert pages" on public.pages for insert with check (public.has_role('editor'));
create policy "editors can update pages" on public.pages for update using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "admins can delete pages" on public.pages for delete using (public.is_admin());

create policy "public can read published articles" on public.articles for select using (published = true);
create policy "authorized users can read all articles" on public.articles for select using (public.has_role('viewer'));
create policy "editors can insert articles" on public.articles for insert with check (public.has_role('editor'));
create policy "editors can update articles" on public.articles for update using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "admins can delete articles" on public.articles for delete using (public.is_admin());

create policy "public can read published faqs" on public.faqs for select using (published = true);
create policy "authorized users can read all faqs" on public.faqs for select using (public.has_role('viewer'));
create policy "editors can insert faqs" on public.faqs for insert with check (public.has_role('editor'));
create policy "editors can update faqs" on public.faqs for update using (public.has_role('editor')) with check (public.has_role('editor'));
create policy "admins can delete faqs" on public.faqs for delete using (public.is_admin());

-- audit logs
create policy "admins can read audit log" on public.audit_log for select using (public.is_admin());
create policy "authorized users can insert audit log" on public.audit_log for insert with check (public.has_role('viewer'));

-- Helpful one-time first-admin helper. Run manually in SQL editor after creating an auth user:
-- insert into public.profiles (id, email, full_name, role)
-- select id, email, 'Douglas Zelisko', 'admin' from auth.users where email = 'YOUR_EMAIL@example.com'
-- on conflict (id) do update set role = 'admin', email = excluded.email;
