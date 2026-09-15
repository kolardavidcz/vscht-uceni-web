/**
 * Serverless rate limiter using Upstash Redis with in-memory fallback.
 * Used to protect public endpoints (suggest-edit, save-data) against brute force and DoS.
 */
import { tryGetRedis } from "./redis.js";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// In-memory fallback map for environments without Redis (local dev, vitest runs)
const memoryBuckets = new Map<string, { count: number; expiresAt: number }>();

/**
 * Resets the in-memory fallback rate limit store. Useful for isolated test suites.
 */
export function clearMemoryRateLimits(): void {
  memoryBuckets.clear();
}

/**
 * Checks and increments rate limit counter for a given identifier and action.
 *
 * @param identifier Client identifier (IP address or hashed key).
 * @param action Namespace for the action being limited (e.g. "suggest-edit", "save-data").
 * @param limit Maximum allowed requests within the time window.
 * @param windowSeconds Time window duration in seconds.
 * @returns Rate limit status with remaining quota and TTL.
 */
export async function checkRateLimit(
  identifier: string,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const cleanId = (identifier || "unknown")
    .replace(/[^a-zA-Z0-9_.-]/g, "_")
    .slice(0, 64);
  const key = `ratelimit:${action}:${cleanId}`;
  const now = Math.floor(Date.now() / 1000);

  const redis = tryGetRedis();
  if (redis) {
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSeconds);
      }
      let ttl = await redis.ttl(key);
      if (ttl < 0) {
        await redis.expire(key, windowSeconds);
        ttl = windowSeconds;
      }
      return {
        allowed: current <= limit,
        limit,
        remaining: Math.max(0, limit - current),
        resetSeconds: Math.max(1, ttl),
      };
    } catch (err) {
      console.warn(
        `[rateLimit] Redis rate limit failed for ${key}, falling back to memory:`,
        err
      );
    }
  }

  // In-memory fallback
  const bucket = memoryBuckets.get(key);
  if (!bucket || now >= bucket.expiresAt) {
    memoryBuckets.set(key, { count: 1, expiresAt: now + windowSeconds });
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - 1),
      resetSeconds: windowSeconds,
    };
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  return {
    allowed: bucket.count <= limit,
    limit,
    remaining,
    resetSeconds: Math.max(1, bucket.expiresAt - now),
  };
}

/**
 * Extracts client IP address safely from incoming HTTP headers.
 *
 * @param headers Request headers dictionary.
 * @returns Client IP address string or "127.0.0.1" fallback.
 */
export function getClientIp(
  headers: Record<string, string | string[] | undefined>
): string {
  const xForwardedFor = headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(xForwardedFor) && xForwardedFor.length > 0) {
    return xForwardedFor[0].split(",")[0].trim();
  }
  const xRealIp = headers["x-real-ip"];
  if (typeof xRealIp === "string") {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}
