import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

// the Dutch waste apps whose reviews we collect; the id is the number in each app's App Store URL
export const APPS = [
  { id: '694013412', name: 'Omrin Afval' }, // Leeuwarden and the rest of Friesland
  { id: '479597294', name: 'Afvalwijzer' },
  { id: '1537977535', name: 'Circulus' },
  { id: '1537096947', name: 'HVC App' },
  { id: '1386637391', name: 'Almere Afval' },
  { id: '742028202', name: 'Afvalstoffendienst' }, // 's-Hertogenbosch
  { id: '1470962213', name: 'PreZero inzamelwijzer' },
];

const DEFAULT_COUNTRY = 'nl'; // which App Store: nl = the Netherlands
const MAX_PAGES = 10; // Apple serves pages 1–10 (50 reviews each); past the last review a page comes back empty
const PAUSE_MS = 500; // wait between requests, so we don't hammer Apple's server
const TIMEOUT_MS = 15000; // give up on a request that takes longer than 15 seconds
const TIME_ZONE = 'Europe/Amsterdam'; // Apple stamps reviews in US Pacific time; save the Dutch calendar day instead
const OUT_DIR = new URL('./out/', import.meta.url); // out/ next to this file, wherever it's run from

export function parseArgs(argv) {
  const [store = DEFAULT_COUNTRY] = argv;
  const country = store.toLowerCase(); // "NL" and "nl" are the same store

  if (!/^[a-z]{2}$/.test(country)) {
    throw new Error(
      `The store must be a two-letter country code like "nl" (got "${store}"). ` +
        'To change which apps are scraped, edit APPS at the top of scraper.js.',
    );
  }

  return { country };
}

// the address the scraper will be pointing to
export function feedUrl(page, { appId, country, fresh }) {
  const url = `https://itunes.apple.com/${country}/rss/customerreviews/page=${page}/id=${appId}/sortby=mostrecent/json`;
  return fresh ? `${url}?fresh=${fresh}` : url;
}

export async function fetchPage(page, options, fetchFn = fetch) {
  let response;
  try {
    response = await fetchFn(feedUrl(page, options), { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    return { entries: [], problem: `network error (${error.message})`, status: null };
  }

  if (!response.ok) {
    return { entries: [], problem: `HTTP ${response.status}`, status: response.status };
  }

  try {
    const data = await response.json();
    return { entries: toEntries(data), problem: null, status: response.status };
  } catch (error) {
    // also lands here if the timeout hits while the body is still downloading, so say what happened
    return { entries: [], problem: `the reply could not be read as JSON (${error.message})`, status: response.status };
  }
}

export function toEntries(data) {
  const entry = data?.feed?.entry;
  if (!entry) return [];
  const list = Array.isArray(entry) ? entry : [entry]; // a feed with one review sends an object, not a list
  return list.filter((item) => item?.['im:rating']?.label); // keep only entries that are real reviews
}

const labelOf = (field) => field?.label ?? '';

const ratingOf = (field) => {
  const stars = Number.parseInt(labelOf(field), 10);
  return Number.isInteger(stars) ? stars : null;
};

const dayFormat = new Intl.DateTimeFormat('en', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });

// "2026-10-13T23:30:00-07:00" is already the 14th in Amsterdam → "2026-10-14"
const dateOf = (field) => {
  const moment = new Date(labelOf(field));
  if (Number.isNaN(moment.getTime())) return '';
  const part = Object.fromEntries(dayFormat.formatToParts(moment).map(({ type, value }) => [type, value]));
  return `${part.year}-${part.month}-${part.day}`;
};

const idOf = (entry) => labelOf(entry.id);

export function toRow(entry) {
  return {
    id: idOf(entry), // Apple's review id, so a quote can be traced back and runs can be compared
    rating: ratingOf(entry['im:rating']),
    version: labelOf(entry['im:version']),
    date: dateOf(entry.updated),
    title: labelOf(entry.title),
    text: labelOf(entry.content),
  };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// a review posted mid-scrape pushes the list down, so one can turn up on two pages; keep the first copy
const uniqueById = (entries) =>
  entries.filter(
    (entry, index) => idOf(entry) === '' || entries.findIndex((other) => idOf(other) === idOf(entry)) === index,
  );

const finish = (entries, pagesRead, stoppedBecause, complete) => ({
  rows: uniqueById(entries).map(toRow),
  pagesRead,
  stoppedBecause,
  complete,
});

export async function scrapeAll({
  appId,
  country,
  maxPages = MAX_PAGES,
  fetchFn = fetch,
  wait = sleep,
  fresh = Date.now(),
}) {
  let collected = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const { entries, problem } = await fetchPage(page, { appId, country, fresh }, fetchFn);

    if (problem) {
      // any error (400, 429, 500, network, bad JSON) means pages may be missing: cut short
      return finish(collected, page - 1, `page ${page}: ${problem}`, false);
    }
    if (entries.length === 0) {
      // Apple's real "no more reviews": HTTP 200 with an empty page
      return finish(collected, page - 1, `page ${page} had no reviews`, true);
    }

    collected = [...collected, ...entries]; // a new list each time, not push()
    if (page < maxPages) await wait(PAUSE_MS);
  }

  return finish(collected, maxPages, `reached the ${maxPages}-page limit`, true);
}

// one app after another, never at the same time, so Apple only sees one request every half second
export async function scrapeApps({ apps, country, maxPages, fetchFn, wait = sleep, fresh }) {
  let results = [];

  for (const [index, app] of apps.entries()) {
    const scraped = await scrapeAll({ appId: app.id, country, maxPages, fetchFn, wait, fresh });
    results = [...results, { app, ...scraped }]; // an app that fails stays in (complete: false) and the next one still runs
    if (index < apps.length - 1) await wait(PAUSE_MS);
  }

  return results;
}

// one file for all apps: a summary per app, then every review tagged with the app it is about
export function buildReport({ country, results, scrapedAt }) {
  const reviews = results.flatMap(({ app, rows }) => rows.map((row) => ({ appId: app.id, app: app.name, ...row })));

  return {
    country,
    scrapedAt,
    complete: results.every((scraped) => scraped.complete),
    count: reviews.length,
    apps: results.map(({ app, rows, pagesRead, stoppedBecause, complete }) => ({
      id: app.id,
      name: app.name,
      source: feedUrl(1, { appId: app.id, country }),
      count: rows.length,
      pagesRead,
      stoppedBecause,
      complete,
    })),
    reviews,
  };
}

// a cut-short scrape gets its own file, so a failed rerun never replaces an earlier complete one
export const reportFileName = ({ country, complete }) => `reviews-${country}${complete ? '' : '.partial'}.json`;

const summaryLine = (app) =>
  `  ${app.complete ? '✓' : '✗'} ${app.name}: ${app.count} reviews (stopped because: ${app.stoppedBecause})`;

async function main() {
  try {
    const { country } = parseArgs(process.argv.slice(2));
    console.log(`Scraping ${APPS.length} apps in the "${country}" App Store…`);

    const results = await scrapeApps({ apps: APPS, country });
    const report = buildReport({
      country,
      results,
      scrapedAt: new Date().toISOString(), // e.g. "2026-10-19T12:00:00.000Z" (UTC)
    });

    report.apps.forEach((app) => console.log(summaryLine(app)));

    if (report.count === 0) {
      // an empty first page looks the same for a wrong id as for an app nobody has reviewed
      console.error(`No reviews saved. Check the ids in APPS, or these apps have no reviews in the "${country}" store.`);
      process.exitCode = 1;
      return;
    }

    await mkdir(OUT_DIR, { recursive: true });
    const outFile = new URL(reportFileName(report), OUT_DIR);
    await writeFile(outFile, JSON.stringify(report, null, 2) + '\n', 'utf8');

    console.log(`Saved ${report.count} reviews from ${report.apps.length} apps to ${fileURLToPath(outFile)}`);

    if (!report.complete) {
      console.error('Warning: at least one app was cut short by an error (✗ above), so this was saved as a .partial file.');
      console.error('Any earlier complete file was left alone. Run it again to get everything.');
      process.exitCode = 1;
    }
  } catch (error) {
    // Anything not planned for ends up here, with a readable message.
    console.error(`Scraper failed: ${error.message}`);
    process.exitCode = 1;
  }
}

// only run main() when this file is started directly (node scraper.js), not when a test imports it
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
