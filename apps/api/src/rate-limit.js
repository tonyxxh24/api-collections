const store = new Map();

export function createRateLimiter({ windowMs = 60_000, maxRequests = 30 } = {}) {
  return ({ key }) => {
    const now = Date.now();
    const bucket = store.get(key);

    if (!bucket || now - bucket.start > windowMs) {
      store.set(key, { start: now, count: 1 });
      return {
        allowed: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        resetAt: now + windowMs
      };
    }

    bucket.count += 1;
    const remaining = Math.max(0, maxRequests - bucket.count);

    return {
      allowed: bucket.count <= maxRequests,
      limit: maxRequests,
      remaining,
      resetAt: bucket.start + windowMs
    };
  };
}
