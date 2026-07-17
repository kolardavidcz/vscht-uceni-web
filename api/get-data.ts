import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

const KV_KEY = "microbiology:data";

/**
 * GET /api/get-data
 * Loads microbiology worksheet + emoji catalog from Vercel KV.
 * Returns 404 when empty so the client falls back to bundled static data.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await kv.get(KV_KEY);
    if (!data) {
      return res.status(404).json({ error: "No data in KV" });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("get-data failed", err);
    return res.status(500).json({
      error: "KV unavailable",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
