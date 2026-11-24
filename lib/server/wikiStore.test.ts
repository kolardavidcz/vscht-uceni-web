import { describe, expect, it } from "vitest";
import {
  appendSuggestion,
  isAllowedWikiPath,
  removeOverrideByPath,
  removeSuggestionById,
  sanitizeSingleLine,
  upsertOverride,
  validateSuggestionInput,
  type WikiOverrideMap,
  type WikiSuggestion,
} from "./wikiStore";

describe("wikiStore (Redis wiki suggestions & live overrides)", () => {
  describe("isAllowedWikiPath", () => {
    it("accepts valid bioinformatics markdown paths", () => {
      expect(
        isAllowedWikiPath(
          "src/features/bioinformatics/content/1-semestr/bi-pa1/wsl-a-setup.md"
        )
      ).toBe(true);
    });

    it("rejects traversal, non-markdown, double slashes, and control chars", () => {
      expect(
        isAllowedWikiPath(
          "src/features/bioinformatics/content/../../api/save-data.ts"
        )
      ).toBe(false);
      expect(
        isAllowedWikiPath("src/features/bioinformatics/content/config.json")
      ).toBe(false);
      expect(
        isAllowedWikiPath("src/features/bioinformatics/content//a.md")
      ).toBe(false);
      expect(
        isAllowedWikiPath("src/features/bioinformatics/content/a.md\n")
      ).toBe(false);
    });
  });

  describe("validateSuggestionInput", () => {
    it("normalizes valid suggestion payloads cleanly", () => {
      const res = validateSuggestionInput(
        {
          filePath:
            "src\\features\\bioinformatics\\content\\1-semestr\\oach-i.md",
          title: "OACH I\r\nExtra",
          markdown: "# OACH I\n\nOpravený text",
          note: "  Překlep v rovnici  ",
          authorName: "Anna\nNováková",
        },
        "2026-11-24T08:00:00.000Z",
        "sug-1"
      );

      expect(res.ok).toBe(true);
      if (res.ok) {
        expect(res.suggestion).toEqual({
          id: "sug-1",
          filePath: "src/features/bioinformatics/content/1-semestr/oach-i.md",
          title: "OACH I Extra",
          markdown: "# OACH I\n\nOpravený text",
          note: "Překlep v rovnici",
          authorName: "Anna Nováková",
          createdAt: "2026-11-24T08:00:00.000Z",
        });
      }
    });

    it("rejects empty markdown, oversized markdown, and disallowed paths", () => {
      expect(
        validateSuggestionInput({
          filePath: "package.json",
          title: "Bad",
          markdown: "hi",
        }).ok
      ).toBe(false);

      expect(
        validateSuggestionInput({
          filePath: "src/features/bioinformatics/content/1-semestr/oach-i.md",
          title: "Empty",
          markdown: "   \n ",
        }).ok
      ).toBe(false);

      expect(
        validateSuggestionInput({
          filePath: "src/features/bioinformatics/content/1-semestr/oach-i.md",
          title: "Huge",
          markdown: "x".repeat(450_000),
        }).ok
      ).toBe(false);
    });
  });

  describe("queue & override pure operations", () => {
    const s1: WikiSuggestion = {
      id: "1",
      filePath: "src/features/bioinformatics/content/1-semestr/oach-i.md",
      title: "OACH I",
      markdown: "# OACH I v1",
      createdAt: "2026-11-24T08:00:00.000Z",
    };
    const s2: WikiSuggestion = {
      id: "2",
      filePath: "src/features/bioinformatics/content/1-semestr/oach-i.md",
      title: "OACH I",
      markdown: "# OACH I v2",
      createdAt: "2026-11-24T08:05:00.000Z",
    };

    it("prepends suggestions and enforces queue cap", () => {
      const list = appendSuggestion([s1], s2, 1);
      expect(list.map((s) => s.id)).toEqual(["2"]);
    });

    it("removes suggestions by id without mutating input", () => {
      const orig = [s2, s1];
      const next = removeSuggestionById(orig, "1");
      expect(next.map((s) => s.id)).toEqual(["2"]);
      expect(orig).toHaveLength(2);
    });

    it("upserts and reverts live overrides safely", () => {
      let map: WikiOverrideMap = {};
      map = upsertOverride(map, s1.filePath, {
        markdown: s1.markdown,
        updatedAt: s1.createdAt,
        updatedBy: "Admin",
      });
      expect(map[s1.filePath]?.markdown).toBe("# OACH I v1");

      // Ignores disallowed path
      map = upsertOverride(map, "package.json", {
        markdown: "evil",
        updatedAt: s1.createdAt,
      });
      expect(map["package.json"]).toBeUndefined();

      map = removeOverrideByPath(map, s1.filePath);
      expect(map[s1.filePath]).toBeUndefined();
    });

    it("sanitizes single-line headers", () => {
      expect(sanitizeSingleLine("  Ahoj\r\nSvěte  ")).toBe("Ahoj Světe");
    });
  });
});
