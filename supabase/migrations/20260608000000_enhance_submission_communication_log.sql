-- Adds metadata used by the admin submission communication composer.

alter table public.communication_log
  add column if not exists purpose text,
  add column if not exists tone text,
  add column if not exists reviewed_by_admin boolean not null default false;

create index if not exists communication_log_purpose_idx on public.communication_log(purpose, created_at desc);
