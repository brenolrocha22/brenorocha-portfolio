import "server-only";

/**
 * Fixed-window rate limiter kept in memory.
 *
 * BEST-EFFORT ONLY: on Vercel each serverless instance has its own memory, instances
 * are recycled at any time and requests may hit different instances. It slows down a
 * single noisy client but is not a global guarantee. If spam shows up, swap the
 * implementation for Upstash Ratelimit (same `checkRateLimit` signature) and/or a
 * Vercel Firewall rule — see docs/architecture/technical-architecture.md §5.
 */

type Window = { count: number; resetAt: number };

const MAX_TRACKED_KEYS = 5_000;
const windows = new Map<string, Window>();

export type RateLimitOptions = { limit: number; windowMs: number };
export type RateLimitResult = { allowed: boolean; remaining: number; resetAt: number };

function prune(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  // Hard cap so a flood of distinct keys cannot grow memory without bound.
  while (windows.size >= MAX_TRACKED_KEYS) {
    const oldest = windows.keys().next().value;
    if (oldest === undefined) break;
    windows.delete(oldest);
  }
}

export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetAt <= now) {
    prune(now);
    const resetAt = now + windowMs;
    windows.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}
