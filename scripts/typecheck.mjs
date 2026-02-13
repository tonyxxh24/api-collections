import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`Typecheck failed: ${message}`);
  process.exitCode = 1;
}

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function validateSeedData() {
  const seed = readJson('data/apis/seed.json');
  const allowedPricing = new Set(['free', 'paid', 'hybrid']);

  assert(Array.isArray(seed), '`data/apis/seed.json` must be an array.');

  for (const [index, api] of seed.entries()) {
    const label = `seed[${index}]`;

    assert(typeof api.id === 'string' && api.id.length > 0, `${label}.id must be a non-empty string.`);
    assert(typeof api.name === 'string' && api.name.length > 0, `${label}.name must be a non-empty string.`);
    assert(typeof api.country === 'string' && api.country.length > 0, `${label}.country must be a non-empty string.`);
    assert(typeof api.organization === 'string' && api.organization.length > 0, `${label}.organization must be a non-empty string.`);
    assert(allowedPricing.has(api.pricing), `${label}.pricing must be one of free/paid/hybrid.`);
    assert(typeof api.baseUrl === 'string' && /^https?:\/\//.test(api.baseUrl), `${label}.baseUrl must be a URL.`);
    assert(Array.isArray(api.tags), `${label}.tags must be an array.`);
    assert(typeof api.visualizationHints === 'object' && api.visualizationHints !== null, `${label}.visualizationHints is required.`);
  }
}

async function validateApiMetadata() {
  const mod = await import(path.join(root, 'apps/api/src/metadata.js'));
  const entries = Object.entries(mod.apiMetadata || {});

  assert(entries.length > 0, 'apps/api/src/metadata.js must export at least one API metadata item.');

  for (const [key, item] of entries) {
    assert(item.id === key, `metadata.${key}.id must match key.`);
    assert(typeof item.baseUrl === 'string' && /^https?:\/\//.test(item.baseUrl), `metadata.${key}.baseUrl must be a URL.`);
    assert(Array.isArray(item.allowedHosts) && item.allowedHosts.length > 0, `metadata.${key}.allowedHosts must be a non-empty array.`);
  }
}

function validateWebPages() {
  const requiredPages = [
    'apps/web/app/page.js',
    'apps/web/app/dashboard/page.js',
    'apps/web/app/api/[id]/page.js'
  ];

  for (const p of requiredPages) {
    assert(fs.existsSync(path.join(root, p)), `${p} is required.`);
  }
}

const scopeArg = process.argv.find((arg) => arg.startsWith('--scope='));
const scope = scopeArg ? scopeArg.split('=')[1] : 'all';

if (scope === 'all' || scope === 'api' || scope === 'root') {
  validateSeedData();
  await validateApiMetadata();
}

if (scope === 'all' || scope === 'web') {
  validateWebPages();
}

if (!process.exitCode) {
  console.log(`Typecheck passed (scope: ${scope}).`);
}
