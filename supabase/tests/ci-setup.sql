-- Only for the throwaway Postgres that CI starts and deletes on every run (.github/workflows/ci.yml).
-- Never run this against the real Supabase project: it already has these roles.
--
-- A plain Postgres doesn't have Supabase's browser roles. This adds them with the same default
-- rights a new Supabase project gives them (every right on new tables and functions in "public"),
-- so the permission tests prove the same thing here as on the real project.

create role anon nologin;
create role authenticated nologin;

grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
