
-- 1. Waste items and their correct bins.
-- The migration runner populates this table from items.json.

create table public.items (
  id text primary key,
  bin text not null check (
    bin in (
      'sortibak', 'biobak', 'papierbak',
      'glasbak', 'textielbak', 'not-a-bin'
    )
  )
);

-- 2. Answers submitted by players.

create table public.answers (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  round int not null check (round >= 1),
  item_id text not null references public.items (id),
  chosen_bin text not null check (
    chosen_bin in (
      'sortibak', 'biobak', 'papierbak',
      'glasbak', 'textielbak', 'not-a-bin'
    )
  ),
  created_at timestamptz not null default now()
);

--3. Leaderboard scores.

create table public.scores (
  id bigint generated always as identity primary key,
  nickname text not null check (
    nickname ~ '^(Blue|Brave|Swift|Sunny|Clever|Lucky|Bold|Quick|Happy|Tidy) (Stork|Skater|Terp|Horse|Heron|Sailor|Tulip|Canal|Windmill|Otter) [1-9][0-9]$'
  ),
  score int not null check (score between 0 and 1400),
  correct int not null,
  total int not null check (total between 1 and 10),
  created_at timestamptz not null default now(),
  constraint scores_correct_range
    check (correct between 0 and total)
);

-- 4. Remove browser permissions before granting the minimum needed.

revoke all on table public.items
  from public, anon, authenticated;

revoke all on table public.answers
  from public, anon, authenticated;

revoke all on table public.scores
  from public, anon, authenticated;

grant insert on table public.answers to anon;
grant insert, select on table public.scores to anon;

-- 5. Enable Row Level Security.

alter table public.items enable row level security;
alter table public.answers enable row level security;
alter table public.scores enable row level security;

create policy "Anonymous users can submit answers"
  on public.answers
  for insert to anon
  with check (true);

create policy "Anonymous users can submit scores"
  on public.scores
  for insert to anon
  with check (true);

create policy "Anonymous users can read leaderboard"
  on public.scores
  for select to anon
  using (true);

-- 6. Statistics for one requested item.
-- Always returns one row, even if the item doesn't exist.

create function public.item_stat(p_item_id text)
returns table (
  item_id text,
  wrong bigint,
  total bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p_item_id as item_id,
    count(a.id) filter (
      where a.chosen_bin <> i.bin
    ) as wrong,
    count(a.id) as total
  from (select 1) as seed
  left join public.items as i
    on i.id = p_item_id
  left join public.answers as a
    on a.item_id = i.id;
$$;

-- 7. Items with at least one wrong answer, most missed first.

create function public.most_missed(p_limit int)
returns table (
  item_id text,
  wrong bigint,
  total bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    i.id as item_id,
    count(a.id) filter (
      where a.chosen_bin <> i.bin
    ) as wrong,
    count(a.id) as total
  from public.items as i
  join public.answers as a
    on a.item_id = i.id
  group by i.id
  having count(a.id) filter (
    where a.chosen_bin <> i.bin
  ) >= 1
  order by wrong desc, i.id asc
  limit greatest(coalesce(p_limit, 0), 0);
$$;

-- 8. Permit browser execution of only these functions.

revoke execute on function public.item_stat(text)
  from public, anon, authenticated;

revoke execute on function public.most_missed(int)
  from public, anon, authenticated;

grant execute on function public.item_stat(text) to anon;
grant execute on function public.most_missed(int) to anon;
