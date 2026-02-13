const DEFAULT_TIMEOUT_MS = 8_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_MAX_RESPONSE_SIZE = 1024 * 1024;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export function sanitizeHeaders(headers = {}) {
  const safeHeaders = { ...headers };
  delete safeHeaders.host;
  delete safeHeaders.cookie;
  delete safeHeaders.authorization;
  return safeHeaders;
}

export function toTargetUrl(baseUrl, path = '/', query = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(normalizedPath, baseUrl);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

export function mapProxyError(error) {
  if (error.name === 'AbortError') {
    return { code: 'UPSTREAM_TIMEOUT', message: 'Upstream request timed out.' };
  }

  if (error.code === 'EAI_AGAIN' || error.code === 'ENOTFOUND') {
    return { code: 'DNS_FAILURE', message: 'Cannot resolve upstream host.' };
  }

  if (error.code === 'ECONNREFUSED') {
    return { code: 'CONNECTION_REFUSED', message: 'Connection refused by upstream.' };
  }

  return { code: 'UPSTREAM_FAILURE', message: error.message || 'Unexpected upstream error.' };
}

function shouldSendBody(method, body) {
  return !['GET', 'HEAD'].includes(method.toUpperCase()) && body !== null && body !== undefined;
}

function toRequestBody(body) {
  if (typeof body === 'string') {
    return body;
  }

  return JSON.stringify(body);
}

function shouldRetryResponse(status) {
  return RETRYABLE_STATUS.has(status);
}

async function readResponseWithLimit(response, maxSizeBytes) {
  const chunks = [];
  let total = 0;
  const reader = response.body?.getReader();

  if (!reader) {
    const fallbackBuffer = Buffer.from(await response.arrayBuffer());
    const limited = fallbackBuffer.subarray(0, maxSizeBytes);
    return {
      bodyText: limited.toString('utf8'),
      sizeBytes: fallbackBuffer.length,
      truncated: fallbackBuffer.length > maxSizeBytes
    };
  }

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    total += value.length;

    if (total > maxSizeBytes) {
      const overflow = total - maxSizeBytes;
      chunks.push(value.subarray(0, value.length - overflow));
      await reader.cancel();
      return {
        bodyText: Buffer.concat(chunks).toString('utf8'),
        sizeBytes: total,
        truncated: true
      };
    }

    chunks.push(value);
  }

  return {
    bodyText: Buffer.concat(chunks).toString('utf8'),
    sizeBytes: total,
    truncated: false
  };
}

export async function requestWithRetry({
  url,
  method,
  headers,
  body,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retries = DEFAULT_RETRIES,
  maxResponseSize = DEFAULT_MAX_RESPONSE_SIZE
}) {
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const startedAt = Date.now();

    try {
      const response = await fetch(url, {
        method,
        headers: sanitizeHeaders(headers),
        body: shouldSendBody(method, body) ? toRequestBody(body) : undefined,
        signal: controller.signal
      });

      if (shouldRetryResponse(response.status) && attempt < retries) {
        attempt += 1;
        continue;
      }

      const durationMs = Date.now() - startedAt;
      const { bodyText, sizeBytes, truncated } = await readResponseWithLimit(response, maxResponseSize);

      return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        durationMs,
        headers: Object.fromEntries(response.headers.entries()),
        bodyText,
        responseSize: sizeBytes,
        truncated,
        retryCount: attempt
      };
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }

    attempt += 1;
  }

  throw lastError;
}
