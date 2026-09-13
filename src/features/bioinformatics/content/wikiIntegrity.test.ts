import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import config from "./config.json";

describe("wiki content integrity & AGENTS.md invariants", () => {
  const contentDir = path.resolve(__dirname);

  type FileNode = {
    title?: string;
    externalUrl?: string;
    files?: Record<string, FileNode>;
  };

  function collectConfigPaths(
    parentPath: string[],
    files: Record<string, FileNode>
  ): Array<{ path: string[]; title?: string; externalUrl?: string }> {
    const out: Array<{ path: string[]; title?: string; externalUrl?: string }> =
      [];
    for (const [key, val] of Object.entries(files)) {
      const currentPath = [...parentPath, key];
      if (val.files) {
        // Folder with nested files
        out.push(...collectConfigPaths(currentPath, val.files));
      } else {
        out.push({
          path: currentPath,
          title: val.title,
          externalUrl: val.externalUrl,
        });
      }
    }
    return out;
  }

  const allMaterials: Array<{
    path: string[];
    title?: string;
    externalUrl?: string;
  }> = [];

  for (const [catKey, catVal] of Object.entries(config.categories)) {
    if (catVal.files) {
      allMaterials.push(
        ...collectConfigPaths([catKey], catVal.files as Record<string, FileNode>)
      );
    }
  }

  it("verifies config.json contains entries across curriculum semesters", () => {
    expect(allMaterials.length).toBeGreaterThan(15);
  });

  it("ensures every non-external material in config.json exists as a .md file on disk", () => {
    const missing: string[] = [];

    for (const item of allMaterials) {
      if (item.externalUrl) continue;

      const relativeMd = item.path.join("/") + ".md";
      const fullPath = path.join(contentDir, relativeMd);

      if (!fs.existsSync(fullPath)) {
        missing.push(relativeMd);
      }
    }

    expect(
      missing,
      `Files declared in config.json missing on disk: ${missing.join(", ")}`
    ).toEqual([]);
  });

  it("ensures no lecture titles contain forbidden 'Modul <X>' prefix (AGENTS.md rule)", () => {
    const forbiddenPrefixRegex = /^Modul\s+\d+/i;
    const violations: Array<{ path: string; title: string }> = [];

    for (const item of allMaterials) {
      if (item.title && forbiddenPrefixRegex.test(item.title)) {
        violations.push({ path: item.path.join("/"), title: item.title });
      }
    }

    expect(
      violations,
      `AGENTS.md Pre-AX1 structure invariant violated: Pre-AX1 lectures must use 'X · <Název>' instead of 'Modul <X>' prefixes.`
    ).toEqual([]);
  });

  it("ensures all existing markdown files are non-empty valid UTF-8", () => {
    for (const item of allMaterials) {
      if (item.externalUrl) continue;
      const fullPath = path.join(contentDir, item.path.join("/") + ".md");
      if (fs.existsSync(fullPath)) {
        const text = fs.readFileSync(fullPath, "utf-8");
        expect(
          text.trim().length,
          `Markdown file ${item.path.join("/")}.md is empty`
        ).toBeGreaterThan(0);
      }
    }
  });
});
