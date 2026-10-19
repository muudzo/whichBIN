import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  APPS,
  parseArgs,
  feedUrl,
  toEntries,
  toRow,
  scrapeAll,
  scrapeApps,
  buildReport,
  reportFileName,
} from './scraper.js';

// one review, shaped the way Apple's JSON feed sends it
const review = (id, overrides = {}) => ({
  id: { label: String(id) },
  author: { name: { label: 'someone' } },
  updated: { label: '2026-10-13T09:18:34-07:00' },
  'im:rating': { label: '4' },
  'im:version': { label: '5.2.3' },
  title: { label: `title ${id}` },
  content: { label: `text ${id}`, attributes: { type: 'text' } },
  ...overrides,
});

const reply = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const feedOf = (entries) => () => reply({ feed: { entry: entries } });
const fullPage = (page) => feedOf(Array.from({ length: 50 }, (_, i) => review(page * 100 + i)));
const pageOf = (url) => Number(url.match(/page=(\d+)/)[1]);
const appOf = (url) => url.match(/id=(\d+)/)[1];
const noWait = async () => {};

// a stand-in for Apple: `pages` maps a page number to a reply, any other page comes back empty
const fakeApple = (pages) => {
  const asked = [];
  const fetchFn = async (url) => {
    const page = pageOf(url);
    asked.push(page);
    return pages[page] ? pages[page]() : reply({ feed: {} });
  };
  return { fetchFn, asked };
};

const scrape = (fetchFn, extra = {}) => scrapeAll({ appId: '1', country: 'nl', fetchFn, wait: noWait, ...extra });

const result = (id, name, rows, complete = true) => ({
  app: { id, name },
  rows,
  pagesRead: 1,
  stoppedBecause: complete ? 'page 2 had no reviews' : 'page 1: HTTP 429',
  complete,
});

test('APPS lists seven different apps, each with a digits-only id and a name', () => {
  assert.equal(APPS.length, 7);
  assert.equal(new Set(APPS.map((app) => app.id)).size, 7);
  assert.ok(APPS.every((app) => /^\d+$/.test(app.id) && app.name));
});

test('parseArgs uses the Dutch store when no arguments are given', () => {
  assert.deepEqual(parseArgs([]), { country: 'nl' });
});

test('parseArgs accepts an uppercase store code', () => {
  assert.deepEqual(parseArgs(['NL']), { country: 'nl' });
});

test('parseArgs rejects a store code that is not two letters', () => {
  assert.throws(() => parseArgs(['nld']), /two-letter/);
});

test('parseArgs points to APPS when given an app id instead of a store', () => {
  assert.throws(() => parseArgs(['694013412']), /APPS/);
});

test('feedUrl points at the most-recent JSON feed, with a cache-buster only when asked', () => {
  const base = 'https://itunes.apple.com/nl/rss/customerreviews/page=2/id=1/sortby=mostrecent/json';
  assert.equal(feedUrl(2, { appId: '1', country: 'nl' }), base);
  assert.equal(feedUrl(2, { appId: '1', country: 'nl', fresh: 42 }), `${base}?fresh=42`);
});

test('toEntries returns nothing when the feed has no entries', () => {
  assert.deepEqual(toEntries({ feed: {} }), []);
  assert.deepEqual(toEntries(null), []);
});

test('toEntries turns a lone review object into a list', () => {
  assert.equal(toEntries({ feed: { entry: review(1) } }).length, 1);
});

test('toEntries drops entries that have no star rating', () => {
  const appInfo = { id: { label: 'app' }, title: { label: 'Afvalwijzer' } };
  assert.deepEqual(toEntries({ feed: { entry: [appInfo, review(1)] } }).map((entry) => entry.id.label), ['1']);
});

test('toRow keeps the review id and fields, and leaves out the author', () => {
  assert.deepEqual(toRow(review(7)), {
    id: '7',
    rating: 4,
    version: '5.2.3',
    date: '2026-10-13',
    title: 'title 7',
    text: 'text 7',
  });
});

test('toRow dates a review by the Dutch calendar day, not Apple’s Pacific one', () => {
  const lateEvening = review(1, { updated: { label: '2026-10-13T23:30:00-07:00' } }); // 08:30 on the 14th in Amsterdam
  assert.equal(toRow(lateEvening).date, '2026-10-14');
});

test('toRow leaves rating null and date empty when Apple sends something unreadable', () => {
  const row = toRow(review(1, { 'im:rating': { label: 'five' }, updated: { label: 'not a date' } }));
  assert.equal(row.rating, null);
  assert.equal(row.date, '');
});

test('scrapeAll reads until an empty page and calls the result complete', async () => {
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: fullPage(2), 3: feedOf([review(301)]) });
  const scraped = await scrape(fetchFn);
  assert.equal(scraped.rows.length, 101);
  assert.equal(scraped.pagesRead, 3);
  assert.equal(scraped.complete, true);
  assert.equal(scraped.stoppedBecause, 'page 4 had no reviews');
});

test('scrapeAll stops at the page limit without asking for page 11', async () => {
  const pages = Object.fromEntries(Array.from({ length: 11 }, (_, i) => [i + 1, fullPage(i + 1)]));
  const { fetchFn, asked } = fakeApple(pages);
  const scraped = await scrape(fetchFn);
  assert.equal(scraped.rows.length, 500);
  assert.equal(scraped.complete, true);
  assert.equal(Math.max(...asked), 10);
});

test('scrapeAll calls a scrape cut short by HTTP 400 part-way incomplete', async () => {
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: fullPage(2), 3: () => reply({}, 400) });
  const scraped = await scrape(fetchFn);
  assert.equal(scraped.rows.length, 100);
  assert.equal(scraped.complete, false);
  assert.equal(scraped.stoppedBecause, 'page 3: HTTP 400');
});

test('scrapeAll calls a scrape cut short by rate limiting incomplete', async () => {
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: () => reply({}, 429) });
  const scraped = await scrape(fetchFn);
  assert.equal(scraped.rows.length, 50);
  assert.equal(scraped.complete, false);
});

test('scrapeAll reports a network error', async () => {
  const scraped = await scrape(async () => {
    throw new Error('getaddrinfo ENOTFOUND');
  });
  assert.equal(scraped.complete, false);
  assert.equal(scraped.stoppedBecause, 'page 1: network error (getaddrinfo ENOTFOUND)');
});

test('scrapeAll reports a reply it could not read as JSON', async () => {
  const brokenJson = async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('Unexpected token <');
    },
  });
  const scraped = await scrape(brokenJson);
  assert.equal(scraped.complete, false);
  assert.match(scraped.stoppedBecause, /could not be read as JSON \(Unexpected token <\)/);
});

test('scrapeAll keeps one copy of a review that turns up on two pages', async () => {
  const { fetchFn } = fakeApple({ 1: feedOf([review(1), review(2)]), 2: feedOf([review(2), review(3)]) });
  const scraped = await scrape(fetchFn);
  assert.deepEqual(scraped.rows.map((row) => row.id), ['1', '2', '3']);
});

test('scrapeAll pauses between pages but not after the last one', async () => {
  const pauses = [];
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: fullPage(2) });
  await scrape(fetchFn, { maxPages: 2, wait: async (ms) => pauses.push(ms) });
  assert.deepEqual(pauses, [500]);
});

test('scrapeApps scrapes each app in turn and keeps going after one fails', async () => {
  const apps = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
    { id: '3', name: 'Three' },
  ];
  const fetchFn = async (url) => {
    if (appOf(url) === '2') return reply({}, 500);
    return pageOf(url) === 1 ? feedOf([review(`${appOf(url)}01`)])() : reply({ feed: {} });
  };
  const results = await scrapeApps({ apps, country: 'nl', fetchFn, wait: noWait });
  assert.deepEqual(
    results.map(({ app, rows, complete }) => [app.name, rows.length, complete]),
    [
      ['One', 1, true],
      ['Two', 0, false],
      ['Three', 1, true],
    ],
  );
});

test('scrapeApps pauses between apps but not after the last one', async () => {
  const pauses = [];
  const { fetchFn } = fakeApple({ 1: feedOf([review(1)]) });
  const apps = [
    { id: '1', name: 'One' },
    { id: '2', name: 'Two' },
  ];
  await scrapeApps({ apps, country: 'nl', fetchFn, maxPages: 1, wait: async (ms) => pauses.push(ms) });
  assert.deepEqual(pauses, [500]);
});

test('buildReport tags every review with its app and sums up each app', () => {
  const results = [result('1', 'One', [toRow(review(11)), toRow(review(12))]), result('2', 'Two', [toRow(review(21))])];
  const report = buildReport({ country: 'nl', results, scrapedAt: '2026-10-19T12:00:00.000Z' });
  assert.equal(report.count, 3);
  assert.equal(report.complete, true);
  assert.deepEqual(
    report.reviews.map((row) => [row.appId, row.app, row.id]),
    [
      ['1', 'One', '11'],
      ['1', 'One', '12'],
      ['2', 'Two', '21'],
    ],
  );
  assert.deepEqual(report.apps[0], {
    id: '1',
    name: 'One',
    source: 'https://itunes.apple.com/nl/rss/customerreviews/page=1/id=1/sortby=mostrecent/json',
    count: 2,
    pagesRead: 1,
    stoppedBecause: 'page 2 had no reviews',
    complete: true,
  });
});

test('buildReport calls the whole report incomplete when one app was cut short', () => {
  const results = [result('1', 'One', [toRow(review(11))]), result('2', 'Two', [], false)];
  assert.equal(buildReport({ country: 'nl', results, scrapedAt: '' }).complete, false);
});

test('reportFileName gives a cut-short scrape its own file, so it never replaces a complete one', () => {
  assert.equal(reportFileName({ country: 'nl', complete: true }), 'reviews-nl.json');
  assert.equal(reportFileName({ country: 'nl', complete: false }), 'reviews-nl.partial.json');
});
