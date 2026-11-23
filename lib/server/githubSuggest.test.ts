import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createSuggestBranch,
  encodeRepoPath,
  getGithubConfigFromEnv,
  isAllowedPath,
  neutralizeMentions,
  sanitizeHeader,
  slugify,
  type GithubSuggestConfig,
} from "./githubSuggest";

describe("githubSuggest security allowlist & helpers", () => {
  describe("isAllowedPath", () => {
    it("accepts valid content markdown paths", () => {
      expect(
        isAllowedPath(
          "src/features/bioinformatics/content/1-semestr/bi-pa1/wsl-a-setup.md"
        )
      ).toBe(true);
      expect(
        isAllowedPath("src/features/bioinformatics/content/guide.md")
      ).toBe(true);
    });

    it("normalizes Windows backslashes", () => {
      expect(
        isAllowedPath(
          "src\\features\\bioinformatics\\content\\1-semestr\\bi-pa1\\wsl-a-setup.md"
        )
      ).toBe(true);
    });

    it("rejects path traversal attempts with ..", () => {
      expect(
        isAllowedPath(
          "src/features/bioinformatics/content/../../api/save-data.ts"
        )
      ).toBe(false);
      expect(
        isAllowedPath(
          "src/features/bioinformatics/content/../content/test.md"
        )
      ).toBe(false);
    });

    it("rejects non-markdown files", () => {
      expect(
        isAllowedPath("src/features/bioinformatics/content/config.json")
      ).toBe(false);
      expect(
        isAllowedPath("src/features/bioinformatics/content/image.png")
      ).toBe(false);
    });

    it("rejects files outside the wiki content tree", () => {
      expect(isAllowedPath("package.json")).toBe(false);
      expect(isAllowedPath("api/save-data.ts")).toBe(false);
      expect(isAllowedPath("src/pages/HomePage.tsx")).toBe(false);
      expect(isAllowedPath("public/favicon.ico")).toBe(false);
    });
  });

  describe("slugify", () => {
    it("strips Czech diacritics and produces clean url-safe slugs", () => {
      expect(slugify("Příliš žluťoučký kůň")).toBe("prilis-zlutoucky-kun");
      expect(slugify("Grafy v C++ & Reprezentace")).toBe(
        "grafy-v-c-reprezentace"
      );
    });

    it("strips leading/trailing hyphens and truncates to 40 chars", () => {
      const longTitle = "A".repeat(60);
      const slug = slugify(longTitle);
      expect(slug.length).toBeLessThanOrEqual(40);
      expect(slugify("---hello---world---")).toBe("hello-world");
    });
  });

  describe("neutralizeMentions", () => {
    it("inserts zero-width spaces into @ mentions to prevent pinging users", () => {
      expect(neutralizeMentions("Hello @octocat and @admin")).toBe(
        "Hello @\u200Boctocat and @\u200Badmin"
      );
      expect(neutralizeMentions("No mentions here")).toBe("No mentions here");
    });
  });

  describe("sanitizeHeader", () => {
    it("strips newlines and carriage returns to prevent CRLF injection in commit and PR titles", () => {
      expect(sanitizeHeader("Title\r\nwith\nnewlines")).toBe(
        "Title with newlines"
      );
      expect(sanitizeHeader("  spaced  ")).toBe("spaced");
    });
  });

  describe("getGithubConfigFromEnv", () => {
    it("returns error when no token is present", () => {
      const res = getGithubConfigFromEnv({});
      expect("error" in res).toBe(true);
    });

    it("returns config when GITHUB_TOKEN or GH_TOKEN is present", () => {
      const cfg = getGithubConfigFromEnv({ GITHUB_TOKEN: "fake-token" });
      expect("token" in cfg).toBe(true);
      if ("token" in cfg) {
        expect(cfg.token).toBe("fake-token");
        expect(cfg.owner).toBe("kolardavidcz");
        expect(cfg.repo).toBe("vscht-uceni-web");
        expect(cfg.defaultBranch).toBe("main");
      }
    });

    it("respects custom owner, repo, and default branch", () => {
      const cfg = getGithubConfigFromEnv({
        GH_TOKEN: "gh-token",
        GITHUB_OWNER: "custom-owner",
        GITHUB_REPO: "custom-repo",
        GITHUB_DEFAULT_BRANCH: "develop",
      });
      if ("token" in cfg) {
        expect(cfg.owner).toBe("custom-owner");
        expect(cfg.repo).toBe("custom-repo");
        expect(cfg.defaultBranch).toBe("develop");
      }
    });
  });

  describe("createSuggestBranch validation guards", () => {
    const mockConfig: GithubSuggestConfig = {
      token: "mock-token",
      owner: "mock-owner",
      repo: "mock-repo",
      defaultBranch: "main",
    };

    it("rejects unauthorized file path immediately without calling GitHub API", async () => {
      const res = await createSuggestBranch(mockConfig, {
        filePath: "package.json",
        title: "Malicious Edit",
        markdown: "# Malicious",
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.status).toBe(400);
        expect(res.error).toContain("Neplatná cesta");
      }
    });

    it("rejects payloads with markdown exceeding maximum size", async () => {
      const hugeMarkdown = "X".repeat(2_500_000);
      const res = await createSuggestBranch(mockConfig, {
        filePath: "src/features/bioinformatics/content/test.md",
        title: "Too Large",
        markdown: hugeMarkdown,
      });
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.status).toBe(400);
        expect(res.error).toContain("velký");
      }
    });

    it("encodes repository paths segment-by-segment without encoding slashes", () => {
      expect(
        encodeRepoPath(
          "src/features/bioinformatics/content/1-semestr/bi-pa1/wsl a setup.md"
        )
      ).toBe(
        "src/features/bioinformatics/content/1-semestr/bi-pa1/wsl%20a%20setup.md"
      );
    });
  });

  describe("createSuggestBranch end-to-end mocked GitHub flow", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("creates branch, commits encoded file path, and opens PR without ReferenceErrors", async () => {
      const calls: Array<{ url: string; method: string }> = [];
      const mockFetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
        const urlStr = String(url);
        const method = init?.method || "GET";
        calls.push({ url: urlStr, method });

        const jsonResp = (data: unknown, status = 200) =>
          new Response(JSON.stringify(data), {
            status,
            headers: { "Content-Type": "application/json" },
          });

        if (urlStr.endsWith("/git/ref/heads/main")) {
          return jsonResp({ object: { sha: "base-sha-123" } });
        }
        if (urlStr.endsWith("/git/refs") && method === "POST") {
          return jsonResp({ ref: "refs/heads/suggest/test" }, 201);
        }
        if (urlStr.includes("/contents/") && method === "GET") {
          return jsonResp({ sha: "file-sha-456" });
        }
        if (urlStr.endsWith("/user")) {
          return jsonResp({
            id: 42,
            login: "kolardavidcz",
            name: "David Kolar",
            email: "test@example.com",
          });
        }
        if (urlStr.includes("/contents/") && method === "PUT") {
          return jsonResp({ commit: { sha: "commit-sha-789" } });
        }
        if (urlStr.endsWith("/pulls") && method === "POST") {
          return jsonResp({
            html_url: "https://github.com/mock-owner/mock-repo/pull/99",
            number: 99,
          });
        }
        return jsonResp({ message: "unexpected" }, 404);
      });

      vi.stubGlobal("fetch", mockFetch);

      const res = await createSuggestBranch(
        {
          token: "tok",
          owner: "mock-owner",
          repo: "mock-repo",
          defaultBranch: "main",
        },
        {
          filePath:
            "src/features/bioinformatics/content/1-semestr/bi-pa1/wsl-a-setup.md",
          title: "WSL a setup",
          markdown: "# WSL a setup\n\nOpravený návod",
          note: "Oprava překlepu @ping",
          authorName: "Student\nInjected",
        }
      );

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.prNumber).toBe(99);
        expect(res.branch).toMatch(/^suggest\/wsl-a-setup-/);
        expect(res.prUrl).toBe("https://github.com/mock-owner/mock-repo/pull/99");
      }
      expect(
        calls.some(
          (c) =>
            c.method === "PUT" &&
            c.url.includes(
              "/contents/src/features/bioinformatics/content/1-semestr/bi-pa1/wsl-a-setup.md"
            )
        )
      ).toBe(true);
    });
  });
});
