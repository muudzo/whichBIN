# Which Bin? · Database (Supabase)

SCRUM-51. I write the SQL; `tests/permissions.sql` says what it must allow and refuse. Plan: `notes/plans/2026-10-24-supabase.md`.

## 1. Set up (once)

1. On supabase.com, choose **New project**, region **Central EU (Frankfurt)**. Keep the database password in a password manager.
2. **Connect → Session pooler**: copy the connection string. Copy `supabase/.env.example` to `supabase/.env` and paste it in, with your password in place of `[YOUR-PASSWORD]`.
3. **Project Settings → API Keys**: copy the project URL and the **publishable** key into `app/.env.local` (see `app/.env.example`).

The publishable key is made for browsers: it ends up in the game's code, so anyone can read it. That's why the database itself has to refuse everything a browser shouldn't do. The database password and the secret key never leave this computer.

## 2. The quick lesson (a library app, so your file stays yours)

**Tables and checks.** The database refuses any row that breaks a rule, whoever sends it.

```sql
create table public.books (
  id text primary key,
  shelf text not null check (shelf in ('fiction', 'science', 'kids'))
);

create table public.loans (
  id bigint generated always as identity primary key,  -- the database numbers the rows
  book_id text not null references public.books (id),  -- must be a book that exists
  days int not null check (days between 1 and 28),     -- anything else is refused
  card text not null check (card ~ '^LIB-[0-9]{4}$'),  -- ~ is a regex match
  created_at timestamptz not null default now()        -- the database sets the time, not the browser
);
```

**Grants: what a role may do at all.** Browsers are the role `anon`. Supabase gives `anon` every right on a new table by default, so take them all away first, then give back only what's needed.

```sql
revoke all on public.loans from anon, authenticated;
grant insert on public.loans to anon;
```

**Row level security: which rows.** With it switched on, a role needs a grant **and** a policy. A grant without a policy is refused, and a policy without a grant is refused too.

```sql
alter table public.loans enable row level security;
create policy "browsers can add loans" on public.loans for insert to anon with check (true);
create policy "browsers can read books" on public.books for select to anon using (true);
```

**Counting.** `count(*) filter (where …)` counts only some rows. Without `group by` you always get exactly one row, with 0 when nothing matches. With `group by` you get one row per group; `having` filters on the counts.

```sql
-- one book: always one row
select count(*) filter (where l.days > 21) as long_loans, count(*) as total
from public.loans l join public.books b on b.id = l.book_id
where l.book_id = 'dune';

-- the three most-borrowed books with more than 5 loans
select l.book_id, count(*) as total
from public.loans l
group by l.book_id
having count(*) > 5
order by total desc
limit 3;
```

**A function browsers may call.** It can count rows that browsers can't read, and returns only the counts.

```sql
create function public.loan_count(p_book_id text)
returns table (book_id text, total bigint)  -- count(*) gives a bigint
language sql
security definer      -- runs with the owner's rights, so it can read the loans
set search_path = ''  -- sees only names written in full (public.loans), so nobody can slip in a fake table
as $$
  select p_book_id, count(*) from public.loans l where l.book_id = p_book_id;
$$;

revoke execute on function public.loan_count(text) from public, anon, authenticated;
grant execute on function public.loan_count(text) to anon;
```

## 3. My file: `migrations/001_tables_and_permissions.sql`

Create `items` before `answers`, because answers point to items. The names below have to match, because the tests and the game use them.

**`items`**: the right bin for each item. `npm run db:apply` fills it from `app/src/data/items.json`; I only create the table.
- `id` text, primary key
- `bin` text, not null, one of `sortibak`, `biobak`, `papierbak`, `glasbak`, `textielbak`, `not-a-bin`
- Browsers: no access at all.

**`answers`**: one row per answer.
- `id` bigint, identity, primary key
- `session_id` uuid, not null (the random id per visit)
- `round` int, not null, 1 or more
- `item_id` text, not null, references `items`
- `chosen_bin` text, not null, one of the 6 bins
- `created_at` timestamptz, not null, set by the database
- No right/wrong column: the counts compare `chosen_bin` with `items.bin`, so a browser can't fake a result.
- Browsers: **insert only**.

**`scores`**: one row per saved round, read by the leaderboard.
- `id` bigint, identity, primary key
- `nickname` text, not null, only generated names. This regex copies the word lists in `app/src/domain/nickname.ts`, so change both together:
  `^(Blue|Brave|Swift|Sunny|Clever|Lucky|Bold|Quick|Happy|Tidy) (Stork|Skater|Terp|Horse|Heron|Sailor|Tulip|Canal|Windmill|Otter) [1-9][0-9]$`
- `score` int, not null, 0 to 1400 (10 items × 100 points + 8 streak bonuses × 50)
- `correct` int, not null, from 0 up to `total`
- `total` int, not null, 1 to 10
- `created_at` timestamptz, not null, set by the database
- Browsers: **insert and select**.

**`item_stat(p_item_id text)`** returns `table (item_id text, wrong bigint, total bigint)`: exactly one row for that item, also when nobody answered it (0 and 0). `wrong` counts the answers whose `chosen_bin` isn't the item's `bin`.

**`most_missed(p_limit int)`** returns `table (item_id text, wrong bigint, total bigint)`: only items with at least 1 wrong answer, most wrong first, at most `p_limit` rows.

Both functions: `security definer`, `set search_path = ''`, and browsers may execute them.

## 4. Run it

- `npm run db:apply` applies each new file in `migrations/` once, then copies the items from `items.json` and checks they match.
- `npm run db:test` prints each test as it runs. It stops at the first failure with a `FAIL:` line and a hint, and always undoes its test rows.
- **Changed `001` after applying it?** While nothing is live: `npm run db:reset -- --yes`, then `npm run db:apply`. Once the game is live, never reset; add a new file such as `002_….sql` instead.
