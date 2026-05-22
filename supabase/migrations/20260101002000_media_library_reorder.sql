-- Add media library support and reorder fields for CMS pages.

alter table public.pages
  add column if not exists sort_order integer not null default 0;

create index if not exists pages_sort_order_idx on public.pages(published, sort_order, updated_at desc);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  url text unique not null,
  alt_text text,
  source text,
  usage text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create index if not exists media_assets_public_idx on public.media_assets(published, category, sort_order);

drop trigger if exists media_assets_set_updated_at on public.media_assets;
create trigger media_assets_set_updated_at before update on public.media_assets for each row execute procedure public.set_updated_at();

alter table public.media_assets enable row level security;

drop policy if exists "public can read published media assets" on public.media_assets;
create policy "public can read published media assets" on public.media_assets for select using (published = true);

drop policy if exists "authorized users can read all media assets" on public.media_assets;
create policy "authorized users can read all media assets" on public.media_assets for select using (public.has_role('viewer'));

drop policy if exists "editors can insert media assets" on public.media_assets;
create policy "editors can insert media assets" on public.media_assets for insert with check (public.has_role('editor'));

drop policy if exists "editors can update media assets" on public.media_assets;
create policy "editors can update media assets" on public.media_assets for update using (public.has_role('editor')) with check (public.has_role('editor'));

drop policy if exists "admins can delete media assets" on public.media_assets;
create policy "admins can delete media assets" on public.media_assets for delete using (public.is_admin());

insert into public.media_assets (title, category, usage, source, url, alt_text, sort_order, published)
values
  ('Homepage Psychotherapy Tile', 'Homepage', 'Psychotherapy service tile', 'Pexels', 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Comfortable therapy setting with notebook and warm professional atmosphere', 1, true),
  ('Homepage Medication Management Tile', 'Homepage', 'Medication management service tile', 'Pexels', 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1600', 'Medication and clinical care materials arranged in a clean healthcare setting', 2, true),
  ('Practice Logo', 'Brand', 'Site logo and admin reference', 'Local asset', '/logo.png', 'Integrative Psychiatry logo', 3, true),
  ('Dr. Zelisko Headshot', 'Brand', 'Homepage and about page portrait', 'Local asset', '/headshot.jpeg', 'Douglas Zelisko, MD professional portrait', 4, true),
  ('Journal Desk', 'Stock', 'Psychotherapy and whole-person care sections', 'Unsplash', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=85', 'Open journal and reading material on a calm desk', 5, true),
  ('Consultation Room', 'Stock', 'Medication management and evaluation sections', 'Unsplash', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=85', 'Professional consultation room with calm clinical styling', 6, true)
on conflict (url) do update set
  title = excluded.title,
  category = excluded.category,
  usage = excluded.usage,
  source = excluded.source,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order,
  published = excluded.published,
  updated_at = now();
