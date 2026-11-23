import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Serverless API Architecture & ESM Imports (AGENTS.md invariants)", () => {
  const apiDir = path.resolve(__dirname, "../../api");

  it("ensures no subdirectories exist under api/ (AGENTS.md Rule 1)", () => {
    const entries = fs.readdirSync(apiDir, { withFileTypes: true });
    const subdirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(
      subdirs,
      "Vercel treats every file under api/ as a serverless endpoint. Shared code must live in lib/server/ instead of subdirectories under api/."
    ).toEqual([]);
  });

  it("ensures all relative imports in api/*.ts and lib/server/*.ts use explicit .js extensions (AGENTS.md Rule 2)", () => {
    const serverDirs = [
      apiDir,
      path.resolve(__dirname, "../../lib/server"),
    ];

    const relativeImportRegex = /from\s+["'](\.\.?\/[^"']+)["']/g;

    for (const dir of serverDirs) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      const tsFiles = entries
        .filter(
          (entry) =>
            entry.isFile() &&
            entry.name.endsWith(".ts") &&
            !entry.name.endsWith(".test.ts")
        )
        .map((entry) => entry.name);

      expect(tsFiles.length).toBeGreaterThan(0);

      for (const filename of tsFiles) {
        const filePath = path.join(dir, filename);
        const content = fs.readFileSync(filePath, "utf-8");

        let match: RegExpExecArray | null;
        while ((match = relativeImportRegex.exec(content)) !== null) {
          const importPath = match[1];
          expect(
            importPath.endsWith(".js"),
            `In ${filename}: Relative import "${importPath}" must have an explicit ".js" extension to prevent Vercel ESM runtime MODULE_NOT_FOUND errors.`
          ).toBe(true);
        }
      }
    }
  });
});
