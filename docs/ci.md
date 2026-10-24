# CI: automatic checks on GitHub

The workflow is `.github/workflows/ci.yml` (GitHub Actions). It **only checks**: it never deploys, and it never contacts the real Supabase project.

## When it runs

- Every push to `main`.
- Every pull request, from any branch.
- A newer push to the same branch or pull request cancels the run that's still going.

## The three jobs

They run side by side, and a pull request shows each one as a separate check.

| Job | What it does | The same thing on your computer |
|---|---|---|
| **Root tests (scraper, database runner)** | The scraper's and the database runner's tests (`node --test`). Nothing to install. | `npm test` |
| **App (lint, type check, unit tests, build)** | Installs exactly what `app/package-lock.json` lists, then lint (oxlint), type check, unit tests (Vitest) and the production build | in `app/`: `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build` |
| **Database permission tests (throwaway Postgres)** | Starts an empty Postgres 17, adds Supabase's browser roles, applies every file in `supabase/migrations/`, copies the items from `items.json`, then runs the 16 tests in `supabase/tests/permissions.sql` | `npm run db:apply`, then `npm run db:test` (on your real project) |

All jobs use Node 22 (LTS, the same version as local development). The app job caches npm downloads, keyed on `app/package-lock.json`.

## Why the database job is safe

- The database is a **service container**: a fresh Postgres that exists only for that one job and is deleted afterwards.
- `DATABASE_URL` is written in `ci.yml` and points at that container (`localhost`). The step "Stop unless this is the throwaway database" ends the job if it points anywhere else.
- **No secrets are used**, so there's nothing to leak, and pull requests from forks work the same way.
- The job never runs `db:reset`. `db:test` undoes its own rows anyway.

**How it compares with the real project.** A plain Postgres has no Supabase browser roles, so `supabase/tests/ci-setup.sql` adds `anon` and `authenticated` with the same default rights a new Supabase project gives them. That makes the permission tests prove the same thing.

Two differences, both of which make CI stricter:
- Every migration is applied **from scratch** on each run. So a migration that only works because of a change made by hand in the Supabase dashboard fails here.
- There is no "automatic RLS" setting. Your SQL has to switch row level security on itself, and `001` does.

## Not in CI (yet)

- **Browser tests** (Playwright on four phone sizes). Run them locally with `cd app && npm run test:e2e`. They could become a fourth job; it would install Chromium and WebKit and add a few minutes per run.
- **Deploying.** Nothing deploys. That is a separate step, only when it's asked for.
- **Checks against the real Supabase project.** Run `npm run db:test` locally; it uses `supabase/.env`.

## Setting it up on GitHub

- **Nothing to configure:** there are no secrets or variables. Once `ci.yml` is pushed, runs appear under the repository's **Actions** tab and on each pull request.
- **Optional:** make `main` require green checks before merging. Go to **Settings → Branches → Add rule** for `main`, choose **Require status checks to pass**, and pick the three jobs. Their names show up there after the first run.

## When a check fails

Open the pull request's **Checks** tab (or **Actions**), then the red job, then the red step. Its log ends with the error.

| Red step | Usually means | Fix |
|---|---|---|
| Install (exactly what package-lock.json says) | `package.json` and `package-lock.json` disagree, e.g. a dependency was added without its lockfile | In `app/`: `npm install`, then commit both files |
| Lint | oxlint found an error (warnings don't fail the job) | In `app/`: `npm run lint` |
| Type check | A TypeScript error; the log names the file and line | In `app/`: `npm run typecheck` |
| Unit tests | A test failed; the log names it and shows expected against received | In `app/`: `npm run test:run` |
| Build | Vite couldn't bundle the app | In `app/`: `npm run build` |
| Root tests (`npm test`) | A scraper or database runner test failed | `npm test` in the repo folder |
| Stop unless this is the throwaway database | `DATABASE_URL` in `ci.yml` was changed | Put back `postgresql://postgres:postgres@localhost:5432/postgres`. Never point CI at the real project |
| Add the Supabase browser roles | Postgres didn't start in time | Re-run the job. If it keeps failing, read the job's "Initialize containers" step |
| Apply the migrations and copy the items | A migration has an SQL error (the log names the file and line), or an item in `items.json` breaks a rule in the `items` table | Fix the migration or the item. If a migration only works on the real project, it relies on a change made by hand: put that change in a migration |
| Permission tests | One of the 16 tests failed | Read its `FAIL:` line and hint; it's the same file as `npm run db:test` |
| A job shows **Cancelled** | A newer push started a new run | Nothing to fix |

For a failure that looks like GitHub's side (a download timing out, a container not starting), use **Re-run failed jobs** before changing anything.
