interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function get(key: string, windowMs: number): Bucket {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
  }
  return b;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const b = get(key, windowMs);
  b.count += 1;
  return b.count <= limit;
}

export interface LockoutState {
  locked: boolean;
  retryAfterMs: number;
}

const LOCK_LIMIT = 5;
const LOCK_WINDOW = 15 * 60 * 1000;

export function checkLockout(key: string): LockoutState {
  const b = buckets.get(`lock:${key}`);
  if (!b) return { locked: false, retryAfterMs: 0 };
  const now = Date.now();
  if (now >= b.resetAt) {
    buckets.delete(`lock:${key}`);
    return { locked: false, retryAfterMs: 0 };
  }
  return { locked: true, retryAfterMs: b.resetAt - now };
}

export function registerFailure(key: string): void {
  const k = `lock:${key}`;
  const b = get(k, LOCK_WINDOW);
  b.count += 1;
  if (b.count >= LOCK_LIMIT) b.resetAt = Date.now() + LOCK_WINDOW;
}

export function clearFailures(key: string): void {
  buckets.delete(`lock:${key}`);
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "local";
}
