import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../lib/server/redis.js";
import {
  checkPassword,
  applyChanges,
  type MicrobiologyPayload,
} from "../lib/server/adminPatcher.js";

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

  try {
    const redis = getRedis();
    const body = req.body || {};
    if (!checkPassword(body.password)) {
      return res.status(401).json({ error: "Neplatné heslo" });
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
