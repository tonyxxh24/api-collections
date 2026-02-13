import express from 'express';
import { apis } from './data.js';
import { testRequestSchema } from './types.js';

export const app = express();

app.use(express.json());

app.get('/apis', (_req, res) => {
  res.json({ data: apis });
});

app.get('/apis/:id', (req, res) => {
  const api = apis.find((entry) => entry.id === req.params.id);
  if (!api) {
    res.status(404).json({ error: 'API not found' });
    return;
  }

  res.json({ data: api });
});

app.post('/apis/:id/test', async (req, res) => {
  const api = apis.find((entry) => entry.id === req.params.id);
  if (!api) {
    res.status(404).json({ error: 'API not found' });
    return;
  }

  const parsed = testRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request payload' });
    return;
  }

  const externalResponse = await fetch(`${api.endpoint}${parsed.data.path}`, {
    method: parsed.data.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: parsed.data.body ? JSON.stringify(parsed.data.body) : undefined
  });

  const body = await externalResponse.json();

  res.json({
    status: externalResponse.status,
    body
  });
});
