import http from 'node:http';
import { getApiMetadata } from './metadata.js';
import { createRateLimiter } from './rate-limit.js';
import { mapProxyError, requestWithRetry, toTargetUrl } from './proxy-client.js';

const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 20 });

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    ...headers
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function requestHandler(req, res) {
  const match = req.url?.match(/^\/apis\/([^/]+)\/test$/);

  if (req.method !== 'POST' || !match) {
    return sendJson(res, 404, { error: 'Not found' });
  }

  const apiId = match[1];
  const metadata = getApiMetadata(apiId);
  if (!metadata) {
    return sendJson(res, 404, { error: 'API metadata not found.' });
  }

  let parsedBody;
  try {
    parsedBody = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON body.' });
  }

  const { method = 'GET', path = '/', query = {}, headers = {}, body = null, timeoutMs = 8000, retries = 2 } = parsedBody;
  const targetUrl = toTargetUrl(metadata.baseUrl, path, query);

  if (!metadata.allowedHosts.includes(targetUrl.hostname)) {
    return sendJson(res, 400, {
      error: 'Target host is not in allowlist.',
      code: 'HOST_NOT_ALLOWED'
    });
  }

  const rateLimit = limiter({ key: `${req.socket.remoteAddress}:${apiId}` });
  const rateHeaders = {
    'X-RateLimit-Limit': String(rateLimit.limit),
    'X-RateLimit-Remaining': String(rateLimit.remaining),
    'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000))
  };

  if (!rateLimit.allowed) {
    return sendJson(
      res,
      429,
      {
        error: 'Rate limit exceeded.',
        code: 'RATE_LIMITED',
        hint: 'Please retry after the reset time shown in X-RateLimit-Reset.'
      },
      rateHeaders
    );
  }

  try {
    const result = await requestWithRetry({
      url: targetUrl,
      method,
      headers,
      body,
      timeoutMs,
      retries,
      maxResponseSize: 1024 * 1024
    });

    return sendJson(
      res,
      200,
      {
        request: {
          method,
          url: targetUrl.toString(),
          headers,
          query,
          body
        },
        response: {
          status: result.status,
          statusText: result.statusText,
          durationMs: result.durationMs,
          headers: result.headers,
          body: result.bodyText,
          bodySummary: {
            bytes: result.responseSize,
            truncated: result.truncated
          },
          retryCount: result.retryCount
        },
        rateLimit: {
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          resetAt: rateLimit.resetAt
        }
      },
      rateHeaders
    );
  } catch (error) {
    const mapped = mapProxyError(error);
    return sendJson(res, 502, { code: mapped.code, error: mapped.message }, rateHeaders);
  }
}

export function createServer() {
  return http.createServer((req, res) => {
    requestHandler(req, res);
  });
}

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 3001);
  createServer().listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}
