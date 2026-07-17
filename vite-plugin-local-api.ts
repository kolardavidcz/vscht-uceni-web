/**
 * Local /api/* for Vite dev.
 * Vercel serverless handlers under /api are NOT executed by `npm run dev`.
 */
import type { Plugin, Connect } from "vite";
import { loadEnv } from "vite";
import {
  createSuggestBranch,
  getGithubConfigFromEnv,
} from "./lib/server/githubSuggest";

function readBody(req: Connect.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(
  res: Connect.ServerResponse,
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

      // Register early so SPA fallback never swallows /api/*
      server.middlewares.use((req, res, next) => {
        const url = (req.url || "").split("?")[0];
        if (url !== "/api/suggest-edit") {
          next();
          return;
        }

        // Fully async path — never leave Connect without a response
        void (async () => {
          try {
            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.end();
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

            const config = getGithubConfigFromEnv(env);
            if ("error" in config) {
              sendJson(res, 503, { error: config.error });
              return;
            }

            console.log(
              "[local-api] suggest-edit",
              String(body.filePath || ""),
              "token=" + (config.token ? "yes" : "no")
            );

            const result = await createSuggestBranch(config, {
              filePath: String(body.filePath || ""),
              title: String(body.title || "wiki"),
              markdown: String(body.markdown ?? ""),
              note: body.note ? String(body.note) : undefined,
              authorName: body.authorName
                ? String(body.authorName)
                : undefined,
            });

            if (!result.ok) {
              sendJson(res, result.status, {
                error: result.error,
                detail: result.detail,
              });
              return;
            }

            sendJson(res, 200, {
              success: true,
              branch: result.branch,
              branchUrl: result.branchUrl,
              compareUrl: result.compareUrl,
              prUrl: result.prUrl,
              prNumber: result.prNumber,
              message: result.message,
            });
          } catch (err) {
            console.error("[local-api] suggest-edit crashed", err);
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
