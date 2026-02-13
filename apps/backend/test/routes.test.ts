import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../src/app.js';

describe('API routes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /apis returns all API metadata', async () => {
    const response = await request(app).get('/apis');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(2);
  });

  it('GET /apis/:id returns a single API metadata entry', async () => {
    const response = await request(app).get('/apis/weather');

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe('weather');
  });

  it('GET /apis/:id returns 404 for unknown API', async () => {
    const response = await request(app).get('/apis/unknown');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('API not found');
  });

  it('POST /apis/:id/test validates payload shape', async () => {
    const response = await request(app).post('/apis/weather/test').send({ method: 'PUT' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request payload');
  });

  it('POST /apis/:id/test proxies payload to external API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 200,
      json: async () => ({ ok: true })
    } as Response);

    const payload = {
      method: 'POST',
      path: '/run',
      body: { q: 'hello' }
    };

    const response = await request(app).post('/apis/weather/test').send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 200, body: { ok: true } });
    expect(fetchSpy).toHaveBeenCalledWith('https://example.com/weather/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: 'hello' })
    });
  });
});
