import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseArgs, feedUrl, toEntries, toRow, scrapeAll, buildReport, reportFileName } from './scraper.js';

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

test('parseArgs uses Omrin Afval in the Dutch store when no arguments are given', () => {
  assert.deepEqual(parseArgs([]), { appId: '694013412', country: 'nl' });
});

test('parseArgs accepts an uppercase store code', () => {
  assert.deepEqual(parseArgs(['694013412', 'NL']), { appId: '694013412', country: 'nl' });
});

test('parseArgs rejects an app id with letters in it', () => {
  assert.throws(() => parseArgs(['abc']), /only digits/);
});

test('parseArgs rejects a store code that is not two letters', () => {
  assert.throws(() => parseArgs(['1', 'nld']), /two-letter/);
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
  const result = await scrape(fetchFn);
  assert.equal(result.rows.length, 101);
  assert.equal(result.pagesRead, 3);
  assert.equal(result.complete, true);
  assert.equal(result.stoppedBecause, 'page 4 had no reviews');
});

test('scrapeAll stops at the page limit without asking for page 11', async () => {
  const pages = Object.fromEntries(Array.from({ length: 11 }, (_, i) => [i + 1, fullPage(i + 1)]));
  const { fetchFn, asked } = fakeApple(pages);
  const result = await scrape(fetchFn);
  assert.equal(result.rows.length, 500);
  assert.equal(result.complete, true);
  assert.equal(Math.max(...asked), 10);
});

test('scrapeAll calls a scrape cut short by HTTP 400 part-way incomplete', async () => {
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: fullPage(2), 3: () => reply({}, 400) });
  const result = await scrape(fetchFn);
  assert.equal(result.rows.length, 100);
  assert.equal(result.complete, false);
  assert.equal(result.stoppedBecause, 'page 3: HTTP 400');
});

test('scrapeAll calls a scrape cut short by rate limiting incomplete', async () => {
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: () => reply({}, 429) });
  const result = await scrape(fetchFn);
  assert.equal(result.rows.length, 50);
  assert.equal(result.complete, false);
});

test('scrapeAll reports a network error', async () => {
  const result = await scrape(async () => {
    throw new Error('getaddrinfo ENOTFOUND');
  });
  assert.equal(result.complete, false);
  assert.equal(result.stoppedBecause, 'page 1: network error (getaddrinfo ENOTFOUND)');
});

test('scrapeAll reports a reply it could not read as JSON', async () => {
  const brokenJson = async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('Unexpected token <');
    },
  });
  const result = await scrape(brokenJson);
  assert.equal(result.complete, false);
  assert.match(result.stoppedBecause, /could not be read as JSON \(Unexpected token <\)/);
});

test('scrapeAll keeps one copy of a review that turns up on two pages', async () => {
  const { fetchFn } = fakeApple({ 1: feedOf([review(1), review(2)]), 2: feedOf([review(2), review(3)]) });
  const result = await scrape(fetchFn);
  assert.deepEqual(result.rows.map((row) => row.id), ['1', '2', '3']);
});

test('scrapeAll pauses between pages but not after the last one', async () => {
  const pauses = [];
  const { fetchFn } = fakeApple({ 1: fullPage(1), 2: fullPage(2) });
  await scrape(fetchFn, { maxPages: 2, wait: async (ms) => pauses.push(ms) });
  assert.deepEqual(pauses, [500]);
});

test('buildReport counts the reviews and names a source without the cache-buster', () => {
  const report = buildReport({
    appId: '1',
    country: 'nl',
    rows: [toRow(review(1))],
    pagesRead: 1,
    stoppedBecause: 'page 2 had no reviews',
    complete: true,
    scrapedAt: '2026-10-19T12:00:00.000Z',
  });
  assert.equal(report.count, 1);
  assert.equal(report.source, 'https://itunes.apple.com/nl/rss/customerreviews/page=1/id=1/sortby=mostrecent/json');
});

test('reportFileName gives a cut-short scrape its own file, so it never replaces a complete one', () => {
  assert.equal(reportFileName({ appId: '1', country: 'nl', complete: true }), 'reviews-1-nl.json');
  assert.equal(reportFileName({ appId: '1', country: 'nl', complete: false }), 'reviews-1-nl.partial.json');
});
