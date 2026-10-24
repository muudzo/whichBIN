import { test } from 'node:test';
import assert from 'node:assert/strict';
import { itemDifferences, itemsUpsertSql, pendingMigrations } from './db.js';

test('itemsUpsertSql writes one row per item and updates the bin of an item that already exists', () => {
  const sql = itemsUpsertSql([
    { id: 'jam-jar', bin: 'glasbak' },
    { id: 'pizza-box', bin: 'sortibak' },
  ]);

  assert.equal(
    sql,
    "insert into public.items (id, bin) values ('jam-jar', 'glasbak'), ('pizza-box', 'sortibak')\n" +
      'on conflict (id) do update set bin = excluded.bin;',
  );
});

test('itemsUpsertSql doubles single quotes, so a value cannot end the SQL string early', () => {
  const sql = itemsUpsertSql([{ id: "o'brien", bin: 'glasbak' }]);

  assert.match(sql, /\('o''brien', 'glasbak'\)/);
});

test('itemDifferences is empty when the database holds exactly the items in items.json', () => {
  const items = [
    { id: 'jam-jar', bin: 'glasbak' },
    { id: 'pizza-box', bin: 'sortibak' },
  ];

  assert.deepEqual(itemDifferences(items, ['pizza-box sortibak', 'jam-jar glasbak']), []);
});

test('itemDifferences names items that are missing, in the wrong bin, or only in the database', () => {
  const items = [
    { id: 'jam-jar', bin: 'glasbak' },
    { id: 'pizza-box', bin: 'sortibak' },
  ];

  assert.deepEqual(itemDifferences(items, ['jam-jar biobak', 'old-item glasbak']), [
    'jam-jar: items.json says glasbak, the database says biobak',
    'pizza-box: in items.json but not in the database',
    'old-item: in the database but not in items.json',
  ]);
});

test('pendingMigrations returns the .sql files not applied yet, in name order', () => {
  const files = ['002_more.sql', 'README.md', '001_tables_and_permissions.sql', '003_later.sql'];

  assert.deepEqual(pendingMigrations(files, ['001_tables_and_permissions.sql']), ['002_more.sql', '003_later.sql']);
});
