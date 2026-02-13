const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { loadApis, filterApis } = require('../src/apis');
const { requestHandler } = require('../src/server');

test('loads seed APIs', () => {
  const apis = loadApis();
  assert.ok(Array.isArray(apis));
  assert.ok(apis.length >= 4);
});

test('filters by country with exact match', () => {
  const apis = loadApis();
  const results = filterApis(apis, { country: 'Taiwan' });
  assert.ok(results.length > 0);
  assert.ok(results.every((item) => item.country === 'Taiwan'));
});

test('filters by pricing/category and q search', () => {
  const apis = loadApis();
  const results = filterApis(apis, {
    pricing: 'free',
    category: 'weather',
    q: 'noaa'
  });

  assert.equal(results.length, 1);
  assert.equal(results[0].id, 'us-noaa-nws');
});

test('GET /apis supports query filters', async () => {
  const server = http.createServer(requestHandler);

  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  const response = await fetch(
    `http://127.0.0.1:${port}/apis?country=Taiwan&pricing=free&category=weather&q=cwa`
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.total, 1);
  assert.equal(body.data[0].id, 'tw-cwa-opendata');

  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});
