/**
 * Local /api/* middleware for Vite dev.
 * Vercel serverless handlers under /api are NOT executed by `pnpm dev`.
 * Supports /api/suggest-edit and /api/wiki-data using Upstash Redis when configured,
 * or an in-memory fallback store for zero-config local development.
 */
import type { ServerResponse } from "node:http";
import type { Plugin, Connect } from "vite";
import { loadEnv } from "vite";
import { checkPassword } from "./lib/server/adminPatcher";
import {
  appendSuggestion,
  isAllowedWikiPath,
  MAX_MARKDOWN_LENGTH,
  removeOverrideByPath,
  removeSuggestionById,
  sanitizeSingleLine,
  validateSuggestionInput,
  upsertOverride,
  type WikiOverrideMap,
  type WikiSuggestion,
} from "./lib/server/wikiStore";

let devSuggestions: WikiSuggestion[] = [];
let devOverrides: WikiOverrideMap = {};

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(
  res: ServerResponse,
  status: number,
  payload: unknown
) {
  if (res.writableEnded || res.headersSent) {
    console.error("[local-api] cannot send JSON, response already finished");
    return;
  }
  try {
    const body = JSON.stringify(payload);
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Length", Buffer.byteLength(body));
    res.end(body);
  } catch (e) {
    console.error("[local-api] sendJson failed", e);
    try {
      res.statusCode = 500;
      res.end(
        '{"error":"Failed to serialize response","detail":"see server console"}'
      );
    } catch {
      /* ignore */
    }
  }
}

export function localApiPlugin(): Plugin {
  return {
    name: "local-api",
    enforce: "pre",
    configureServer(server) {
      const env = {
        ...process.env,
        ...loadEnv(server.config.mode, server.config.envDir || process.cwd(), ""),
      };
      if (env.MICROBIOLOGY_ADMIN_PASSWORD && !process.env.MICROBIOLOGY_ADMIN_PASSWORD) {
        process.env.MICROBIOLOGY_ADMIN_PASSWORD = env.MICROBIOLOGY_ADMIN_PASSWORD;
      }

      // Register early so SPA fallback never swallows /api/*
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "").split("?")[0];
        if (url !== "/api/suggest-edit" && url !== "/api/wiki-data") {
          next();
          return;
        }

        void (async () => {
          try {
            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.end();
              return;
            }

            if (url === "/api/wiki-data" && req.method === "GET") {
              sendJson(res, 200, { overrides: devOverrides });
              return;
            }

            if (req.method !== "POST") {
              sendJson(res, 405, { error: "Method not allowed" });
              return;
            }

            const raw = await readBody(req);
            let body: Record<string, unknown> = {};
            if (raw.trim()) {
              try {
                body = JSON.parse(raw) as Record<string, unknown>;
              } catch {
                sendJson(res, 400, {
                  error: "Neplatný JSON body",
                  detail: raw.slice(0, 200),
                });
                return;
              }
            }

            if (url === "/api/suggest-edit") {
              const validated = validateSuggestionInput({
                filePath: String(body.filePath || ""),
                title: String(body.title || "wiki"),
                markdown: String(body.markdown ?? ""),
                note: body.note ? String(body.note) : undefined,
                authorName: body.authorName ? String(body.authorName) : undefined,
              });
              if (!validated.ok) {
                sendJson(res, validated.status, {
                  error: validated.error,
                  detail: validated.detail,
                });
                return;
              }
              devSuggestions = appendSuggestion(devSuggestions, validated.suggestion);
              console.log(
                "[local-api] stored wiki suggestion",
                validated.suggestion.id,
                validated.suggestion.filePath
              );
              sendJson(res, 200, {
                success: true,
                id: validated.suggestion.id,
                createdAt: validated.suggestion.createdAt,
                message:
                  "Návrh úpravy byl uložen do lokální dev paměti (v produkci do Upstash Redis).",
              });
              return;
            }

            // POST /api/wiki-data (admin actions)
            if (!checkPassword(body.password)) {
              sendJson(res, 401, { error: "Neplatné heslo" });
              return;
            }

            const action = String(body.action || "");
            if (action === "list") {
              sendJson(res, 200, {
                success: true,
                suggestions: devSuggestions,
                overrides: devOverrides,
              });
              return;
            }
            if (action === "approve") {
              const id = String(body.id || "");
              const target = devSuggestions.find((s) => s.id === id);
              if (!target) {
                sendJson(res, 404, { error: "Návrh nebyl nalezen" });
                return;
              }
              const finalMarkdown =
                typeof body.markdown === "string" ? body.markdown : target.markdown;
              if (!finalMarkdown.trim() || finalMarkdown.length > MAX_MARKDOWN_LENGTH) {
                sendJson(res, 400, { error: "Neplatný obsah markdownu" });
                return;
              }
              devOverrides = upsertOverride(devOverrides, target.filePath, {
                markdown: finalMarkdown,
                updatedAt: new Date().toISOString(),
                updatedBy: target.authorName || "Admin",
                note: target.note,
              });
              devSuggestions = removeSuggestionById(devSuggestions, id);
              sendJson(res, 200, {
                success: true,
                suggestions: devSuggestions,
                overrides: devOverrides,
              });
              return;
            }
            if (action === "reject") {
              const id = String(body.id || "");
              devSuggestions = removeSuggestionById(devSuggestions, id);
              sendJson(res, 200, {
                success: true,
                suggestions: devSuggestions,
                overrides: devOverrides,
              });
              return;
            }
            if (action === "revert") {
              const filePath = String(body.filePath || "").replace(/\\/g, "/");
              if (!isAllowedWikiPath(filePath)) {
                sendJson(res, 400, { error: "Neplatná cesta souboru" });
                return;
              }
              devOverrides = removeOverrideByPath(devOverrides, filePath);
              sendJson(res, 200, {
                success: true,
                suggestions: devSuggestions,
                overrides: devOverrides,
              });
              return;
            }
            if (action === "save_override") {
              const filePath = String(body.filePath || "").replace(/\\/g, "/");
              const markdown = String(body.markdown ?? "");
              const note = body.note
                ? sanitizeSingleLine(String(body.note)).slice(0, 500)
                : undefined;
              if (!isAllowedWikiPath(filePath) || !markdown.trim()) {
                sendJson(res, 400, { error: "Neplatná data" });
                return;
              }
              devOverrides = upsertOverride(devOverrides, filePath, {
                markdown,
                updatedAt: new Date().toISOString(),
                updatedBy: "Admin",
                ...(note ? { note } : {}),
              });
              sendJson(res, 200, {
                success: true,
                suggestions: devSuggestions,
                overrides: devOverrides,
              });
              return;
            }

            sendJson(res, 400, { error: "Neznámá akce" });
          } catch (err) {
            console.error("[local-api] request crashed", err);
            sendJson(res, 500, {
              error: "Interní chyba (local API)",
              detail: err instanceof Error ? err.message : String(err),
            });
          }
        })();
      });
    },
  };
}
