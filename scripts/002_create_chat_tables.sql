-- Make RLS safe & policies idempotent (profiles table only – the one throwing errors)

-- Ensure RLS on profiles
do $$
begin
  if not exists (select 1 from pg_tables where schemaname='public' and tablename='profiles') then
    create table public.profiles (
      id uuid primary key,
      email text,
      full_name text,
      avatar_url text,
      created_at timestamptz default now()
    );
  end if;
  -- enable RLS if not already
  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    join pg_catalog.pg_policy p on p.polrelid = c.oid
    where n.nspname='public' and c.relname='profiles'
    limit 1
  ) then
    -- no policies yet → ensure RLS on
    execute 'alter table public.profiles enable row level security';
  else
    -- RLS may already be enabled; do nothing
    null;
  end if;
end$$;

-- Create "view own profile" policy if missing
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='profiles'
      and policyname='Users can view own profile'
  ) then
    create policy "Users can view own profile"
      on public.profiles for select
      using (auth.uid() = id);
  end if;
end $$;

-- Create "update own profile" policy if missing
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public'
      and tablename='profiles'
      and policyname='Users can update own profile'
  ) then
    create policy "Users can update own profile"
      on public.profiles for update
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;
