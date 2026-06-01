alter table public.good_fit_questionnaires
  add column if not exists risk_level text not null default 'standard',
  add column if not exists internal_flags jsonb not null default '[]'::jsonb,
  add column if not exists location_eligibility text,
  add column if not exists payment_pathway text,
  add column if not exists scheduling_timeline text,
  add column if not exists communication_consent boolean not null default false,
  add column if not exists safety_stay_safe text,
  add column if not exists ketamine_prior_treatment jsonb not null default '[]'::jsonb,
  add column if not exists substance_use_pattern text;

create index if not exists good_fit_questionnaires_risk_created_idx
  on public.good_fit_questionnaires(risk_level, created_at desc);
