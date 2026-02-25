-- Launch Mission telemetry table (Supabase/Postgres)
-- Run in Supabase SQL Editor or as a migration.

create table if not exists public.launch_mission_telemetry (
  id bigserial primary key,
  timestamp timestamptz not null default now(),
  ip varchar(64) not null,
  user_agent varchar(512) not null default '',
  accept_language varchar(512) not null default '',
  referer varchar(512) not null default '',
  method varchar(16) not null,
  path varchar(256) not null,
  query_params jsonb not null default '{}'::jsonb,
  cookies jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_launch_mission_telemetry_timestamp
  on public.launch_mission_telemetry (timestamp desc);

create index if not exists idx_launch_mission_telemetry_path
  on public.launch_mission_telemetry (path);
