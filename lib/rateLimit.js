const store = new Map();

export function rateLimit({ max = 10, windowMs = 60000 } = {}) {
  return function check(key) {
    const now = Date.now();
    const record = store.get(key);
    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true, remaining: max - 1 };
    }
    if (record.count >= max) {
      return { ok: false, remaining: 0 };
    }
    record.count++;
    return { ok: true, remaining: max - record.count };
  };
}

export const authLimiter = rateLimit({ max: 5, windowMs: 15 * 60 * 1000 });
export const apiLimiter = rateLimit({ max: 60, windowMs: 60 * 1000 });
export const clickLimiter = rateLimit({ max: 5, windowMs: 60 * 1000 });
