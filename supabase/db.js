import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Runs our SQL against the Supabase project with psql. The connection string lives in
// supabase/.env (git-ignored) and is never printed.
//   npm run db:apply          apply new files in supabase/migrations/, then copy the items from items.json
//   npm run db:test           run supabase/tests/permissions.sql (it undoes its own rows)
//   npm run db:reset -- --yes drop our tables and functions to start again (only while nothing is live)

const HERE = new URL('./', import.meta.url);
const MIGRATIONS_DIR = new URL('./migrations/', HERE);
const TESTS_FILE = new URL('./tests/permissions.sql', HERE);
const ENV_FILE = new URL('./.env', HERE);
const ITEMS_FILE = new URL('../app/src/data/items.json', HERE);

// which migration files have run, kept outside "public" so the Data API never shows it
const SETUP_SQL = `
  set client_min_messages = warning;
  create schema if not exists private;
  create table if not exists private.applied_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  );`;

const RESET_SQL = `
  drop table if exists public.answers, public.scores, public.items cascade;
  drop function if exists public.item_stat, public.most_missed;
  delete from private.applied_migrations;`;

// a SQL string value: single quotes are doubled, so a value can't end the string early
const quote = (value) => `'${String(value).replaceAll("'", "''")}'`;

export function itemsUpsertSql(items) {
  const rows = items.map(({ id, bin }) => `(${quote(id)}, ${quote(bin)})`).join(', ');
  return `insert into public.items (id, bin) values ${rows}\non conflict (id) do update set bin = excluded.bin;`;
}

// expected: the items in items.json; actualLines: "id bin" per row from the database
export function itemDifferences(expected, actualLines) {
  const actual = new Map(actualLines.map((line) => line.split(' ')));
  const expectedIds = new Set(expected.map(({ id }) => id));

  const wrongOrMissing = expected.flatMap(({ id, bin }) => {
    if (!actual.has(id)) return [`${id}: in items.json but not in the database`];
    if (actual.get(id) !== bin) return [`${id}: items.json says ${bin}, the database says ${actual.get(id)}`];
    return [];
  });
  const extra = [...actual.keys()]
    .filter((id) => !expectedIds.has(id))
    .map((id) => `${id}: in the database but not in items.json`);

  return [...wrongOrMissing, ...extra];
}

export function pendingMigrations(files, applied) {
  const done = new Set(applied);
  return files.filter((file) => file.endsWith('.sql') && !done.has(file)).sort();
}

// psql with: no personal settings (-X), quiet (-q), stop at the first error (ON_ERROR_STOP)
function psql(args, { capture = false } = {}) {
  const result = spawnSync('psql', [process.env.DATABASE_URL, '-X', '-q', '-v', 'ON_ERROR_STOP=1', ...args], {
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.error) throw new Error(`Couldn't start psql (${result.error.message}). Is it installed?`);
  if (result.status !== 0) throw new Error('psql stopped with an error (see above).');
  return capture ? result.stdout.trim() : '';
}

const rows = (sql) => psql(['-At', '-c', sql], { capture: true }).split('\n').filter(Boolean);

function apply() {
  psql(['-c', SETUP_SQL]);
  const applied = rows('select name from private.applied_migrations');
  const pending = pendingMigrations(readdirSync(MIGRATIONS_DIR), applied);

  if (pending.length === 0) console.log('No new migrations.');
  for (const file of pending) {
    // -1 runs the file and its bookkeeping row in one transaction: all of it applies, or none of it
    psql(['-1', '-f', fileURLToPath(new URL(file, MIGRATIONS_DIR)), '-c', `insert into private.applied_migrations (name) values (${quote(file)})`]);
    console.log(`Applied ${file}`);
  }

  const { items } = JSON.parse(readFileSync(ITEMS_FILE, 'utf8'));
  psql(['-c', itemsUpsertSql(items)]);
  const differences = itemDifferences(items, rows("select id || ' ' || bin from public.items"));
  if (differences.length > 0) throw new Error(`The items table doesn't match items.json:\n  ${differences.join('\n  ')}`);
  console.log(`The database holds the same ${items.length} items as items.json.`);
}

function reset(args) {
  if (!args.includes('--yes')) {
    throw new Error('This drops answers, scores and items, with all their rows. Run it again as: npm run db:reset -- --yes');
  }
  psql(['-c', SETUP_SQL + RESET_SQL]);
  console.log('Dropped our tables and functions. Run npm run db:apply to build them again.');
}

const COMMANDS = {
  apply,
  reset,
  test: () => psql(['-f', fileURLToPath(TESTS_FILE)]),
};

function main() {
  const [command, ...args] = process.argv.slice(2);
  try {
    if (!COMMANDS[command]) throw new Error(`Unknown command "${command}". Use apply, test or reset.`);
    try {
      process.loadEnvFile(fileURLToPath(ENV_FILE));
    } catch {
      // no supabase/.env: fine when DATABASE_URL is already set, e.g. for a throwaway test database
    }
    if (!process.env.DATABASE_URL) {
      throw new Error('No connection string. Copy supabase/.env.example to supabase/.env and paste yours in.');
    }
    COMMANDS[command](args);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

// only run main() when this file is started directly, not when a test imports it
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
