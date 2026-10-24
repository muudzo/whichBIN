-- What the Which Bin database must allow and refuse (SCRUM-51). Run with: npm run db:test
--
-- Everything runs in one transaction that is undone (rolled back) at the end,
-- so the tests leave no rows in the real project. psql stops at the first failure,
-- which also undoes the transaction.
--
-- "Refused" tests use a DO block: the statement must raise the named error.
-- If it runs without an error, the block raises FAIL with a hint.

begin;

-- Act as a browser: requests made with the publishable key run as the "anon" role.
set local role anon;

-- answers ------------------------------------------------------------------------------

\echo '1. A browser can save an answer'
insert into public.answers (session_id, round, item_id, chosen_bin)
values ('00000000-0000-4000-8000-000000000001', 1, 'jam-jar', 'glasbak');

\echo '2. A browser can save an answer with the short session id some phones make (32 hex characters)'
insert into public.answers (session_id, round, item_id, chosen_bin)
values ('0123456789abcdef0123456789abcdef', 1, 'jam-jar', 'glasbak');

\echo '3. A browser cannot read individual answers'
do $$ begin
  perform 1 from public.answers;
  raise exception 'FAIL: a browser could read answers. Hint: grant anon only insert on answers.';
exception when insufficient_privilege then null;
end $$;

\echo '4. A browser cannot change answers'
do $$ begin
  update public.answers set chosen_bin = 'biobak';
  raise exception 'FAIL: a browser was allowed to update answers. Hint: no update grant for anon.';
exception when insufficient_privilege then null;
end $$;

\echo '5. A browser cannot delete answers'
do $$ begin
  delete from public.answers;
  raise exception 'FAIL: a browser was allowed to delete answers. Hint: no delete grant for anon.';
exception when insufficient_privilege then null;
end $$;

\echo '6. An answer for an item that does not exist is refused'
do $$ begin
  insert into public.answers (session_id, round, item_id, chosen_bin)
  values ('00000000-0000-4000-8000-000000000001', 1, 'no-such-item', 'glasbak');
  raise exception 'FAIL: an unknown item was saved. Hint: item_id references items.';
exception when foreign_key_violation then null;
end $$;

\echo '7. An answer with a bin that does not exist is refused'
do $$ begin
  insert into public.answers (session_id, round, item_id, chosen_bin)
  values ('00000000-0000-4000-8000-000000000001', 1, 'jam-jar', 'kitchen-sink');
  raise exception 'FAIL: an unknown bin was saved. Hint: a check on chosen_bin.';
exception when check_violation or foreign_key_violation or invalid_text_representation then null;
end $$;

\echo '8. An answer for round 0 is refused'
do $$ begin
  insert into public.answers (session_id, round, item_id, chosen_bin)
  values ('00000000-0000-4000-8000-000000000001', 0, 'jam-jar', 'glasbak');
  raise exception 'FAIL: round 0 was saved. Hint: a check that round is 1 or more.';
exception when check_violation then null;
end $$;

-- items ------------------------------------------------------------------------------

\echo '9. A browser cannot add or change items'
do $$ begin
  insert into public.items (id, bin) values ('fake-item', 'glasbak');
  raise exception 'FAIL: a browser could add an item. Hint: no grants on items for anon.';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  update public.items set bin = 'biobak';
  raise exception 'FAIL: a browser could change items. Hint: no grants on items for anon.';
exception when insufficient_privilege then null;
end $$;

-- scores -----------------------------------------------------------------------------

\echo '10. A browser can save a score with a generated nickname, and read it back'
insert into public.scores (nickname, score, correct, total) values ('Swift Stork 42', 1400, 10, 10);
do $$ begin
  if not exists (select 1 from public.scores where nickname = 'Swift Stork 42' and score = 1400) then
    raise exception 'FAIL: the saved score could not be read back. Hint: grant select and add a select policy.';
  end if;
end $$;

\echo '11. A typed nickname is refused (only generated ones reach the public leaderboard)'
do $$ begin
  insert into public.scores (nickname, score, correct, total) values ('Michael', 100, 1, 10);
  raise exception 'FAIL: a typed nickname was saved. Hint: a regex check (~) on nickname.';
exception when check_violation then null;
end $$;

\echo '12. Impossible scores are refused'
do $$ begin
  insert into public.scores (nickname, score, correct, total) values ('Swift Stork 42', 5000, 10, 10);
  raise exception 'FAIL: a score above 1400 was saved.';
exception when check_violation then null;
end $$;
do $$ begin
  insert into public.scores (nickname, score, correct, total) values ('Swift Stork 42', 100, 11, 10);
  raise exception 'FAIL: more correct answers than items was saved.';
exception when check_violation then null;
end $$;

\echo '13. A browser cannot change or delete scores'
do $$ begin
  update public.scores set score = 0;
  raise exception 'FAIL: a browser was allowed to update scores. Hint: no update grant for anon.';
exception when insufficient_privilege then null;
end $$;
do $$ begin
  delete from public.scores;
  raise exception 'FAIL: a browser was allowed to delete scores. Hint: no delete grant for anon.';
exception when insufficient_privilege then null;
end $$;

-- counts -----------------------------------------------------------------------------

\echo '14. item_stat counts right and wrong by comparing each answer with the items table'
do $$
declare
  before record;
  after record;
begin
  select * into before from public.item_stat('wine-glass');
  insert into public.answers (session_id, round, item_id, chosen_bin) values
    ('00000000-0000-4000-8000-000000000001', 1, 'wine-glass', 'glasbak'),   -- wrong: wine glasses go in the sortibak
    ('00000000-0000-4000-8000-000000000001', 1, 'wine-glass', 'sortibak');  -- right
  select * into after from public.item_stat('wine-glass');
  if after.item_id <> 'wine-glass' or after.wrong <> before.wrong + 1 or after.total <> before.total + 2 then
    raise exception 'FAIL: item_stat went from %/% to %/%, expected one more wrong and two more in total',
      before.wrong, before.total, after.wrong, after.total;
  end if;
end $$;

\echo '15. item_stat returns zeros for an item nobody has answered'
do $$
declare
  stat record;
begin
  select * into stat from public.item_stat('no-such-item');
  if stat.wrong is distinct from 0::bigint or stat.total is distinct from 0::bigint then
    raise exception 'FAIL: expected 0 wrong of 0, got % of %', stat.wrong, stat.total;
  end if;
end $$;

\echo '16. most_missed lists the most-missed items first, up to the limit, without items nobody got wrong'
-- 1,000 wrong answers make the mattress the most-missed item, whatever real answers exist.
insert into public.answers (session_id, round, item_id, chosen_bin)
select '00000000-0000-4000-8000-000000000001', 1, 'mattress', 'sortibak' from generate_series(1, 1000);
do $$
declare
  missed text[];
begin
  select array_agg(item_id) into missed from public.most_missed(2);
  if missed[1] is distinct from 'mattress' or cardinality(missed) > 2 then
    raise exception 'FAIL: most_missed(2) returned %', missed;
  end if;
  if exists (select 1 from public.most_missed(50) where wrong = 0) then
    raise exception 'FAIL: most_missed listed an item nobody got wrong';
  end if;
  if exists (
    select 1 from (select wrong, lag(wrong) over () as previous from public.most_missed(50)) as rows
    where wrong > previous
  ) then
    raise exception 'FAIL: most_missed is not sorted from most to fewest wrong';
  end if;
end $$;

\echo 'All tests passed. Undoing the test rows.'
rollback;
