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
