-- Run once in the SQL editor of the Supabase project selected for the landing page.
-- No existing product tables are modified.
create table if not exists public.waruru_waitlist (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique check (phone ~ '^010[0-9]{8}$'),
  consent_version text not null,
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '1 year' - interval '10 minutes'
);
create table if not exists public.waruru_waitlist_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  attempts integer not null default 1,
  primary key (ip_hash,window_start)
);
alter table public.waruru_waitlist enable row level security;
alter table public.waruru_waitlist_limits enable row level security;
revoke all on public.waruru_waitlist, public.waruru_waitlist_limits from anon, authenticated;

create or replace function public.register_waruru_waitlist(p_phone text,p_consent_version text,p_ip_hash text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  attempts_now integer;
  bucket timestamptz := to_timestamp(floor(extract(epoch from now()) / 600) * 600);
begin
  if p_phone is null or p_phone !~ '^010[0-9]{8}$'
    or p_consent_version is distinct from '2026-10-08.v1'
    or p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid registration';
  end if;
  insert into public.waruru_waitlist_limits(ip_hash,window_start,attempts)
  values(p_ip_hash,bucket,1)
  on conflict(ip_hash,window_start) do update
    set attempts = public.waruru_waitlist_limits.attempts + 1
  returning attempts into attempts_now;
  if attempts_now > 5 then return 'rate_limited'; end if;
  -- A retry never changes the original consent or prolongs retention.
  insert into public.waruru_waitlist(phone,consent_version)
  values(p_phone,p_consent_version) on conflict(phone) do nothing;
  return 'registered';
end;
$$;
revoke all on function public.register_waruru_waitlist(text,text,text) from public,anon,authenticated;
grant execute on function public.register_waruru_waitlist(text,text,text) to service_role;

-- Enable the Supabase Cron (pg_cron) extension before these statements.
-- Required for the retention stated in the form; do not open collection without this job.
create extension if not exists pg_cron;
select cron.schedule('waruru-waitlist-retention','*/10 * * * *',
  $job$ delete from public.waruru_waitlist where expires_at <= now();
        delete from public.waruru_waitlist_limits where window_start < now() - interval '23 hours'; $job$);
