import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "node:crypto";
import { checkPassword } from "../lib/server/adminPatcher.js";
import { checkRateLimit, getClientIp } from "../lib/server/rateLimit.js";
import {
  getWikiOverrides,
  getWikiSuggestions,
  isAllowedWikiPath,
  MAX_MARKDOWN_LENGTH,
  removeOverrideByPath,
  removeSuggestionById,
  sanitizeSingleLine,
  setWikiOverrides,
  setWikiSuggestions,
  upsertOverride,
} from "../lib/server/wikiStore.js";

function parseBody(req: VercelRequest): Record<string, unknown> | null {
  if (typeof req.body === "string") {
    if (!req.body.trim()) return {};
    try {
      const parsed = JSON.parse(req.body);
      return parsed && typeof parsed === "object"
        ? (parsed as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
  if (req.body && typeof req.body === "object") {
    return req.body as Record<string, unknown>;
  }
  return {};
}

/**
 * GET /api/wiki-data
 *   Public read of approved live wiki overrides (CDN cached + ETag).
 *
 * POST /api/wiki-data
 *   Admin management of wiki suggestions & live overrides (password protected):
 *   - { password, action: "list" }
 *   - { password, action: "approve", id, markdown? }
 *   - { password, action: "reject", id }
 *   - { password, action: "revert", filePath }
 *   - { password, action: "save_override", filePath, markdown, note? }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const overrides = await getWikiOverrides();
      const payload = { overrides };
      const etag = `W/"${createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("hex")
        .slice(0, 16)}"`;

      res.setHeader(
        "Cache-Control",
        "public, s-maxage=60, stale-while-revalidate=300"
      );
      res.setHeader("ETag", etag);

      if (req.headers["if-none-match"] === etag) {
        return res.status(304).end();
      }

      return res.status(200).json(payload);
    } catch (err) {
      console.error("GET /api/wiki-data failed", err);
      return res.status(500).json({ error: "Redis unavailable" });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  const clientIp = getClientIp(req.headers);
  const rateLimit = await checkRateLimit(clientIp, "wiki-admin", 30, 60);
  res.setHeader("X-RateLimit-Limit", rateLimit.limit);
  res.setHeader("X-RateLimit-Remaining", rateLimit.remaining);
  res.setHeader("X-RateLimit-Reset", rateLimit.resetSeconds);

  if (!rateLimit.allowed) {
    res.setHeader("Retry-After", rateLimit.resetSeconds);
    return res.status(429).json({
      error: "Příliš mnoho požadavků. Zkuste to za chvíli.",
    });
  }

  const body = parseBody(req);
  if (!body) {
    return res.status(400).json({ error: "Neplatný JSON payload" });
  }

  if (!checkPassword(body.password)) {
    return res.status(401).json({ error: "Neplatné heslo" });
  }

  const action = String(body.action || "");

  try {
    if (action === "list") {
      const [suggestions, overrides] = await Promise.all([
        getWikiSuggestions(),
        getWikiOverrides(),
      ]);
      return res.status(200).json({ success: true, suggestions, overrides });
    }

    if (action === "approve") {
      const id = String(body.id || "");
      if (!id) {
        return res.status(400).json({ error: "Chybí ID návrhu" });
      }
      const [suggestions, overrides] = await Promise.all([
        getWikiSuggestions(),
        getWikiOverrides(),
      ]);
      const target = suggestions.find((s) => s.id === id);
      if (!target) {
        return res.status(404).json({ error: "Návrh nebyl nalezen" });
      }

      const finalMarkdown =
        typeof body.markdown === "string" ? body.markdown : target.markdown;
      if (!finalMarkdown.trim() || finalMarkdown.length > MAX_MARKDOWN_LENGTH) {
        return res
          .status(400)
          .json({ error: "Neplatný obsah markdownu (prázdný nebo příliš velký)" });
      }

      const nextOverrides = upsertOverride(overrides, target.filePath, {
        markdown: finalMarkdown,
        updatedAt: new Date().toISOString(),
        updatedBy: target.authorName || "Admin",
        note: target.note,
      });
      const nextSuggestions = removeSuggestionById(suggestions, id);

      await Promise.all([
        setWikiOverrides(nextOverrides),
        setWikiSuggestions(nextSuggestions),
      ]);

      return res.status(200).json({
        success: true,
        suggestions: nextSuggestions,
        overrides: nextOverrides,
      });
    }

    if (action === "reject") {
      const id = String(body.id || "");
      if (!id) {
        return res.status(400).json({ error: "Chybí ID návrhu" });
      }
      const [suggestions, overrides] = await Promise.all([
        getWikiSuggestions(),
        getWikiOverrides(),
      ]);
      const nextSuggestions = removeSuggestionById(suggestions, id);
      await setWikiSuggestions(nextSuggestions);

      return res.status(200).json({
        success: true,
        suggestions: nextSuggestions,
        overrides,
      });
    }

    if (action === "revert") {
      const filePath = String(body.filePath || "").replace(/\\/g, "/");
      if (!isAllowedWikiPath(filePath)) {
        return res.status(400).json({ error: "Neplatná cesta souboru" });
      }
      const [suggestions, overrides] = await Promise.all([
        getWikiSuggestions(),
        getWikiOverrides(),
      ]);
      const nextOverrides = removeOverrideByPath(overrides, filePath);
      await setWikiOverrides(nextOverrides);

      return res.status(200).json({
        success: true,
        suggestions,
        overrides: nextOverrides,
      });
    }

    if (action === "save_override") {
      const filePath = String(body.filePath || "").replace(/\\/g, "/");
      const markdown = String(body.markdown ?? "");
      const note = body.note
        ? sanitizeSingleLine(String(body.note)).slice(0, 500)
        : undefined;

      if (!isAllowedWikiPath(filePath)) {
        return res.status(400).json({ error: "Neplatná cesta souboru" });
      }
      if (!markdown.trim() || markdown.length > MAX_MARKDOWN_LENGTH) {
        return res
          .status(400)
          .json({ error: "Neplatný obsah markdownu (prázdný nebo příliš velký)" });
      }

      const [suggestions, overrides] = await Promise.all([
        getWikiSuggestions(),
        getWikiOverrides(),
      ]);
      const nextOverrides = upsertOverride(overrides, filePath, {
        markdown,
        updatedAt: new Date().toISOString(),
        updatedBy: "Admin",
        ...(note ? { note } : {}),
      });
      await setWikiOverrides(nextOverrides);

      return res.status(200).json({
        success: true,
        suggestions,
        overrides: nextOverrides,
      });
    }

    return res.status(400).json({
      error: "Neznámá akce (očekávám list, approve, reject, revert nebo save_override)",
    });
  } catch (err) {
    console.error("POST /api/wiki-data failed", err);
    return res.status(500).json({ error: "Operace v databázi selhala" });
  }
}
