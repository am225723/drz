create table if not exists public.communication_log (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid,
  submission_type text not null default 'contact_submissions',
  channel text not null,
  direction text not null default 'outbound',
  recipient text not null,
  subject text,
  body text not null,
  status text not null,
  provider text,
  provider_message_id text,
  error text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists communication_log_submission_idx on public.communication_log(submission_id, created_at desc);
create index if not exists communication_log_status_idx on public.communication_log(status, created_at desc);

alter table public.communication_log enable row level security;

create policy "authorized users can read communication logs"
  on public.communication_log for select
  using (public.has_role('viewer'));

create policy "admins and editors can insert communication logs"
  on public.communication_log for insert
  with check (public.has_role('editor'));
