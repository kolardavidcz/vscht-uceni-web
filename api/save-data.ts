import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../lib/server/redis.js";
import {
  checkPassword,
  applyChanges,
  type MicrobiologyPayload,
} from "../lib/server/adminPatcher.js";
import {
  checkRateLimit,
  getClientIp,
} from "../lib/server/rateLimit.js";

const DATA_KEY = "microbiology:data";

/**
 * POST /api/save-data
 *
 * Prefer vectoral mode:
 *   { password, changes: AdminChange[] }
 * reads latest Redis snapshot, applies only these patches, writes back.
 *
 * Full replace (seed / reset):
 *   { password, data: MicrobiologyPayload }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting: max 15 attempts per minute per IP
  const clientIp = getClientIp(req.headers);
  const rateLimit = await checkRateLimit(clientIp, "save-data", 15, 60);
  res.setHeader("X-RateLimit-Limit", rateLimit.limit);
  res.setHeader("X-RateLimit-Remaining", rateLimit.remaining);
  res.setHeader("X-RateLimit-Reset", rateLimit.resetSeconds);

  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", rateLimit.resetSeconds);
    return res.status(429).json({
      error: "Příliš mnoho pokusů o uložení. Zkuste to prosím za chvíli.",
      detail: `Limit vyčerpán. Reset za ${rateLimit.resetSeconds} sekund.`,
    });
  }

  try {
    const rawBody =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
    if (Buffer.byteLength(rawBody, "utf8") > 2_000_000) {
      return res
        .status(413)
        .json({ error: "Payload je příliš velký (maximum je 2 MB)" });
    }

    const redis = getRedis();
    const body = req.body || {};
    if (!checkPassword(body.password)) {
      return res.status(401).json({ error: "Neplatné heslo" });
    }

    if (Array.isArray(body.changes) && body.changes.length > 1000) {
      return res
        .status(400)
        .json({ error: "Příliš mnoho změn v jednom požadavku (max 1000)" });
    }

    let payload: MicrobiologyPayload;

    if (Array.isArray(body.changes) && body.changes.length > 0) {
      // Always patch against the freshest shared snapshot
      const current =
        ((await redis.get(DATA_KEY)) as MicrobiologyPayload | null) || {
          worksheetData: [],
          emojiOptions: [],
          emojiCategories: [],
        };
      // If store empty but client sent baseline, seed first then patch
      if (
        (!current.worksheetData || current.worksheetData.length === 0) &&
        body.baseline?.worksheetData
      ) {
        payload = applyChanges(body.baseline as MicrobiologyPayload, body.changes);
      } else {
        payload = applyChanges(current, body.changes);
      }
    } else if (body.data?.worksheetData) {
      payload = {
        worksheetData: body.data.worksheetData,
        emojiOptions: body.data.emojiOptions || [],
        emojiCategories: body.data.emojiCategories || [],
      };
    } else {
      return res.status(400).json({
        error: "Očekávám { changes } (vectoral) nebo { data } (full replace)",
      });
    }

    await redis.set(DATA_KEY, payload);
    return res.status(200).json({ success: true, data: payload });
  } catch (err) {
    console.error("save-data failed", err);
    return res.status(500).json({
      error: "Uložení do Redis selhalo",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
