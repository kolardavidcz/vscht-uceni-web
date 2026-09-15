import { describe, expect, it } from "vitest";
import {
  createSuggestBranch,
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
  });
});
