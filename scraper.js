import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DEFAULT_APP_ID = '479597294'; 
const DEFAULT_COUNTRY = 'nl'; // which App Store: nl = the Netherlands
const MAX_PAGES = 10; // Apple serves pages 1–10 (50 reviews each); page 11 answers HTTP 400
const PAUSE_MS = 500; // wait between requests, so we don't hammer Apple's server
const TIMEOUT_MS = 15000; 
const END_OF_FEED_STATUS = 400; 