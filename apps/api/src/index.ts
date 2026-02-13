import cors from 'cors';
import express from 'express';
import { providers } from './providers/index.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/apis', (_req, res) => {
  const list = Object.values(providers).map((provider) => provider.metadata());
  res.json(list);
});

app.get('/apis/:id', (req, res) => {
  const provider = providers[req.params.id];
  if (!provider) {
    res.status(404).json({ message: 'Provider not found' });
    return;
  }
  res.json(provider.metadata());
});

app.post('/apis/:id/test', async (req, res) => {
  const provider = providers[req.params.id];
  if (!provider) {
    res.status(404).json({ message: 'Provider not found' });
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
