-- Voer uit in de SQL Editor van je eigen Supabase-project.
create table if not exists public.workspaces (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null default '{"dossiers":[],"tasks":[],"history":[],"revision":0}'::jsonb,
 version integer not null default 0
);
alter table public.workspaces enable row level security;
revoke all on public.workspaces from anon;
grant select, insert, update on public.workspaces to authenticated;
drop policy if exists "Eigen overzicht lezen" on public.workspaces;
create policy "Eigen overzicht lezen" on public.workspaces for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Eigen overzicht toevoegen" on public.workspaces;
create policy "Eigen overzicht toevoegen" on public.workspaces for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Eigen overzicht wijzigen" on public.workspaces;
create policy "Eigen overzicht wijzigen" on public.workspaces for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
