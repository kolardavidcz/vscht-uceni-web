/**
 * Upstash Redis client (replacement for deprecated @vercel/kv).
 *
 * Env (any of these pairs work):
 *   UPSTASH_REDIS_REST_URL  + UPSTASH_REDIS_REST_TOKEN  (Marketplace Redis)
 *   KV_REST_API_URL         + KV_REST_API_TOKEN         (legacy Vercel KV / migrated store)
 */
import { Redis } from "@upstash/redis";

let client: Redis | null = null;

export function getRedis(): Redis {
  if (client) return client;

  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Redis not configured. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN " +
        "(or legacy KV_REST_API_URL + KV_REST_API_TOKEN)."
    );
  }

  client = new Redis({ url, token });
  return client;
}
