import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

function requestJson(port, path, payload) {
  return fetch(`http://127.0.0.1:${port}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

test('POST /apis/:id/test rejects absolute path', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await requestJson(port, '/apis/jsonplaceholder/test', {
      method: 'GET',
      path: 'https://evil.example/hack'
    });
    const payload = await res.json();
    assert.equal(res.status, 400);
    assert.equal(payload.code, 'INVALID_PATH');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /apis/:id/test validates method', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await requestJson(port, '/apis/jsonplaceholder/test', {
      method: 'TRACE',
      path: '/posts/1'
    });
    const payload = await res.json();
    assert.equal(res.status, 400);
    assert.equal(payload.code, 'INVALID_METHOD');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
