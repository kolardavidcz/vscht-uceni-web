import type { VercelRequest, VercelResponse } from "@vercel/node";
import { checkRateLimit, getClientIp } from "../lib/server/rateLimit.js";
import { submitWikiSuggestion } from "../lib/server/wikiStore.js";

/**
 * POST /api/suggest-edit
 * Stores a community wiki edit proposal in Upstash Redis for review in the Admin Panel.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting: max 10 edit suggestions per hour per IP
  const clientIp = getClientIp(req.headers);
  const rateLimit = await checkRateLimit(clientIp, "suggest-edit", 10, 3600);
  res.setHeader("X-RateLimit-Limit", rateLimit.limit);
  res.setHeader("X-RateLimit-Remaining", rateLimit.remaining);
  res.setHeader("X-RateLimit-Reset", rateLimit.resetSeconds);

  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", rateLimit.resetSeconds);
    return res.status(429).json({
      error: "Příliš mnoho návrhů úprav. Zkuste to prosím později.",
      detail: `Limit 10 požadavků za hodinu byl vyčerpán. Reset za ${Math.ceil(
        rateLimit.resetSeconds / 60
      )} minut.`,
    });
  }

  try {
    res.setHeader("Cache-Control", "no-store");

    let body: Record<string, unknown> = {};
    if (typeof req.body === "string") {
      try {
        const parsed = req.body.trim() ? JSON.parse(req.body) : {};
        body =
          parsed && typeof parsed === "object"
            ? (parsed as Record<string, unknown>)
            : {};
      } catch {
        return res.status(400).json({ error: "Neplatný JSON payload" });
      }
    } else if (req.body && typeof req.body === "object") {
      body = req.body as Record<string, unknown>;
    }

    const result = await submitWikiSuggestion({
      filePath: String(body.filePath || ""),
      title: String(body.title || "wiki"),
      markdown: String(body.markdown ?? ""),
      note: body.note ? String(body.note) : undefined,
      authorName: body.authorName ? String(body.authorName) : undefined,
    });

    if (!result.ok) {
      return res.status(result.status).json({
        error: result.error,
        detail: result.detail,
      });
    }

    return res.status(200).json({
      success: true,
      id: result.suggestion.id,
      createdAt: result.suggestion.createdAt,
      message:
        "Návrh úpravy byl uložen do databáze a čeká na schválení v administraci.",
    });
  } catch (err) {
    console.error("suggest-edit failed", err);
    return res.status(500).json({
      error: "Uložení návrhu do databáze selhalo",
    });
  }
}
