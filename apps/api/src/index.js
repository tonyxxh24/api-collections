import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { providers } from './providers/index.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedPath = path.resolve(__dirname, '../../../data/apis/seed.json');

function loadSeedApis() {
  const raw = fs.readFileSync(seedPath, 'utf8');
  return JSON.parse(raw);
}

function normalizeSeedMetadata(item) {
  return {
    id: item.id,
    name: item.name,
    description: `${item.organization} · ${item.category} · ${item.country}`,
    docsUrl: item.docsUrl,
    country: item.country,
    organization: item.organization,
    pricing: item.pricing,
    authType: item.authType,
    category: item.category,
    tags: item.tags,
    status: item.status,
    testable: false
  };
}

function getApiCatalog() {
  const providerItems = Object.values(providers).map((provider) => ({
    ...provider.metadata(),
    testable: true
  }));

  const seedItems = loadSeedApis().map(normalizeSeedMetadata);

  const unique = new Map();
  [...seedItems, ...providerItems].forEach((item) => {
    unique.set(item.id, item);
  });

  return [...unique.values()];
}

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/apis', (_req, res) => {
  res.json(getApiCatalog());
});

app.get('/apis/:id', (req, res) => {
  const api = getApiCatalog().find((item) => item.id === req.params.id);
  if (!api) {
    res.status(404).json({ message: 'Provider not found' });
    return;
  }

  res.json(api);
});

app.post('/apis/:id/test', async (req, res) => {
  const provider = providers[req.params.id];
  if (!provider) {
    res.status(404).json({
      message: 'This API is metadata-only in current frontend catalog and does not support proxy test.'
    });
    return;
  }

  try {
    const built = provider.buildRequest({ payload: req.body });
    const response = await fetch(built.url, {
      method: built.method,
      headers: built.headers,
      body: built.body
    });

    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    const normalized = provider.normalizeResponse(response, data);
    res.status(response.status).json(normalized);
  } catch (error) {
    res.status(500).json({
      message: 'Proxy request failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
