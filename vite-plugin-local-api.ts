/**
 * Local /api/* for Vite dev — Vercel serverless files under /api are NOT run by `npm run dev`.
 * Loads env from .env / .env.local via Vite loadEnv.
 */
import type { Plugin, Connect } from "vite";
import { loadEnv } from "vite";
import {
  createSuggestBranch,
  getGithubConfigFromEnv,
} from "./api/lib/githubSuggest";

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
  const body = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
}

export function localApiPlugin(): Plugin {
  return {
    name: "local-api",
    configureServer(server) {
      const env = {
        ...process.env,
        ...loadEnv(server.config.mode, server.config.envDir || process.cwd(), ""),
      };

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] || "";
        if (url !== "/api/suggest-edit") {
          next();
          return;
        }

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }

        try {
          const raw = await readBody(req);
          let body: Record<string, unknown> = {};
          if (raw) {
            try {
              body = JSON.parse(raw) as Record<string, unknown>;
            } catch {
              sendJson(res, 400, { error: "Neplatný JSON body" });
              return;
            }
          }

          const config = getGithubConfigFromEnv(env);
          if ("error" in config) {
            sendJson(res, 503, { error: config.error });
            return;
          }

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
          console.error("[local-api] suggest-edit", err);
          sendJson(res, 500, {
            error: "Interní chyba (local API)",
            detail: err instanceof Error ? err.message : String(err),
          });
        }
      });
    },
  };
}
