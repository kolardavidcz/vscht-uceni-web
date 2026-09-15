import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createSuggestBranch,
  getGithubConfigFromEnv,
} from "../lib/server/githubSuggest.js";
import {
  checkRateLimit,
  getClientIp,
} from "../lib/server/rateLimit.js";

/**
 * POST /api/suggest-edit
 * Creates branch + commit + PR (manual merge). See lib/server/githubSuggest.ts
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

  const config = getGithubConfigFromEnv(process.env);
  if ("error" in config) {
    return res.status(503).json({ error: config.error });
  }

  try {
    const body = req.body || {};
    const result = await createSuggestBranch(config, {
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
      branch: result.branch,
      branchUrl: result.branchUrl,
      compareUrl: result.compareUrl,
      prUrl: result.prUrl,
      prNumber: result.prNumber,
      message: result.message,
    });
  } catch (err) {
    console.error("suggest-edit failed", err);
    return res.status(500).json({
      error: "Interní chyba serveru",
    });
  }
}
