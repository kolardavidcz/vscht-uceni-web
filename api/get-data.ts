import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../lib/server/redis.js";

const DATA_KEY = "microbiology:data";

/**
 * GET /api/get-data
 * Loads microbiology worksheet + emoji catalog from Upstash Redis.
 * Returns 404 when empty so the client falls back to bundled static data.
 *
 * Client soft-upgrades: paints static data first, then applies this response
 * in the background when available.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const redis = getRedis();
    const data = await redis.get(DATA_KEY);
    if (!data) {
      return res.status(404).json({ error: "No data in Redis" });
    }
    // Short edge cache — admin edits still visible within ~60s
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return res.status(200).json(data);
  } catch (err) {
    console.error("get-data failed", err);
    return res.status(500).json({
      error: "Redis unavailable",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
