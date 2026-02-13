import test from 'node:test';
import assert from 'node:assert/strict';
import { mapProxyError, sanitizeHeaders, toTargetUrl } from '../src/proxy-client.js';

test('toTargetUrl builds query string', () => {
  const url = toTargetUrl('https://example.com', '/v1/items', { q: 'book', page: 2 });
  assert.equal(url.toString(), 'https://example.com/v1/items?q=book&page=2');
});

test('sanitizeHeaders removes sensitive headers', () => {
  const result = sanitizeHeaders({ host: 'x', authorization: 'secret', accept: 'application/json' });
  assert.deepEqual(result, { accept: 'application/json' });
});

test('mapProxyError maps timeout and fallback', () => {
  assert.equal(mapProxyError({ name: 'AbortError' }).code, 'UPSTREAM_TIMEOUT');
  assert.equal(mapProxyError({ message: 'oops' }).code, 'UPSTREAM_FAILURE');
});
