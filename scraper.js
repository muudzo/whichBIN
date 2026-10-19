import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_APP_ID = '479597294'; 
const DEFAULT_COUNTRY = 'nl'; // which App Store: nl = the Netherlands
const MAX_PAGES = 10; // Apple serves pages 1–10 (50 reviews each); page 11 answers HTTP 400
const PAUSE_MS = 500; // wait between requests, so we don't hammer Apple's server
const TIMEOUT_MS = 15000; 
const END_OF_FEED_STATUS = 400; 

export function parseArgs(argv) {
  const [appId = DEFAULT_APP_ID, country = DEFAULT_COUNTRY] = argv;


  if (!/^\d+$/.test(appId)) {
    throw new Error(`The app id must be only digits (got "${appId}"). Find it in the app's App Store URL.`);
  }


  if (!/^[a-z]{2}$/.test(country)) {
    throw new Error(`The store must be a two-letter country code like "nl" (got "${country}").`);
  }
  return { appId, country };
}
//the address the scraper will be pointing to 
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
  } catch {
    return { entries: [], problem: 'the reply was not valid JSON', status: response.status };
  }
}

export function toEntries(data) {
  const entry = data?.feed?.entry;
  if (!entry) return [];
  const list = Array.isArray(entry) ? entry : [entry];
  return list.filter((item) => item?.['im:rating']?.label);
}

const labelOf = (field) => field?.label ?? '';

const ratingOf = (field) => {
  const stars = Number.parseInt(labelOf(field), 10);
  return Number.isInteger(stars) ? stars : null;
};

export function toRow(entry) {
  return {
    rating: ratingOf(entry['im:rating']),
    version: labelOf(entry['im:version']),
    date: labelOf(entry.updated).slice(0, 10), // "2026-10-13T09:18:34-07:00" → "2026-10-13"
    title: labelOf(entry.title),
    text: labelOf(entry.content),
  };
}

const idOf = (entry) => labelOf(entry.id);

//wrap reviews with where and when they came from
export function buildReport({ appId, country, rows, pagesRead, stoppedBecause, complete, scrapedAt }) {
  return {
    appId,
    country,
    source: feedUrl(1, { appId, country }),
    scrapedAt,
    pagesRead,
    stoppedBecause,
    complete,
    count: rows.length,
    reviews: rows,
  };
}


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uniqueById = (entries) =>
  entries.filter(
    (entry, index) => idOf(entry) === '' || entries.findIndex((other) => idOf(other) === idOf(entry)) === index,
  );


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
    const { entries, problem, status } = await fetchPage(page, { appId, country, fresh }, fetchFn);

    if (problem) {
      // HTTP 400 after at least one good page = Apple saying "no more pages".
      // Anything else (HTTP 400 on page 1, 429, 500, network error) = cut short.
      const isEndOfFeed = status === END_OF_FEED_STATUS && page > 1;
      return finish(collected, page - 1, `page ${page}: ${problem}`, isEndOfFeed);
    }
    if (entries.length === 0) {
      return finish(collected, page - 1, `page ${page} had no reviews`, true);
    }

    collected = [...collected, ...entries]; // a new list each time, not push()
    if (page < maxPages) await wait(PAUSE_MS);
  }

  return finish(collected, maxPages, `reached the ${maxPages}-page limit`, true);
}

const finish = (entries, pagesRead, stoppedBecause, complete) => ({
  rows: uniqueById(entries).map(toRow),
  pagesRead,
  stoppedBecause,
  complete,
  });

  const OUT_DIR = new URL('./out/', import.meta.url);

async function main() {
  try {
    const { appId, country } = parseArgs(process.argv.slice(2));
    console.log(`Scraping app ${appId} in the "${country}" App Store…`);

    const { rows, pagesRead, stoppedBecause, complete } = await scrapeAll({ appId, country });

    if (rows.length === 0) {
      console.error(`No reviews saved. Stopped at ${stoppedBecause}.`);
      process.exitCode = 1;
      return;
    }

    const report = buildReport({
      appId,
      country,
      rows,
      pagesRead,
      stoppedBecause,
      complete,
      scrapedAt: new Date().toISOString(), // e.g. "2026-10-19T12:00:00.000Z" (UTC)
    });

    await mkdir(OUT_DIR, { recursive: true });
    const outFile = new URL(`reviews-${appId}-${country}.json`, OUT_DIR);
   
    await writeFile(outFile, JSON.stringify(report, null, 2) + '\n', 'utf8');

    console.log(`Saved ${report.count} reviews from ${pagesRead} pages to ${fileURLToPath(outFile)}`);
    console.log(`Stopped because: ${stoppedBecause}`);

    
      console.error('Warning: this scrape was cut short by an error, so the file is incomplete. Run it again.');
      process.exitCode = 1;
    }
  } catch (error) {
    // Anything not planned for ends up here, with a readable message
.
    console.error(`Scraper failed: ${error.message}`);
    process.exitCode = 1;
  }
}


if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
