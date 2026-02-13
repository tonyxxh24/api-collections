import test from 'node:test';
import assert from 'node:assert/strict';
import { mapProxyError, requestWithRetry, sanitizeHeaders, toTargetUrl } from '../src/proxy-client.js';

test('toTargetUrl builds query string', () => {
  const url = toTargetUrl('https://example.com', '/v1/items', { q: 'book', page: 2 });
  assert.equal(url.toString(), 'https://example.com/v1/items?q=book&page=2');
});

test('toTargetUrl keeps path relative to base url', () => {
  const url = toTargetUrl('https://example.com/api', 'v1/items', { lang: 'zh' });
  assert.equal(url.toString(), 'https://example.com/v1/items?lang=zh');
});

test('sanitizeHeaders removes sensitive headers', () => {
  const result = sanitizeHeaders({ host: 'x', authorization: 'secret', accept: 'application/json' });
  assert.deepEqual(result, { accept: 'application/json' });
});

test('mapProxyError maps timeout and fallback', () => {
  assert.equal(mapProxyError({ name: 'AbortError' }).code, 'UPSTREAM_TIMEOUT');
  assert.equal(mapProxyError({ message: 'oops' }).code, 'UPSTREAM_FAILURE');
});

test('requestWithRetry retries for retryable status', async () => {
  const originalFetch = global.fetch;
  let count = 0;

  global.fetch = async () => {
    count += 1;
    if (count === 1) {
      return new Response('busy', { status: 503, statusText: 'Service Unavailable' });
    }
    return new Response('{"ok":true}', {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  };

  try {
    const result = await requestWithRetry({
      url: new URL('https://example.com/test'),
      method: 'GET',
      headers: {},
      retries: 1
    });

    assert.equal(count, 2);
    assert.equal(result.status, 200);
    assert.equal(result.retryCount, 1);
  } finally {
    global.fetch = originalFetch;
  }
});
