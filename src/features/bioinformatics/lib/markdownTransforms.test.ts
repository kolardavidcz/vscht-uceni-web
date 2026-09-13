import { describe, expect, it } from "vitest";
import {
  protectMathSyntax,
  replaceEmojis,
} from "../components/MarkdownView";
import { searchNavTree, type NavNode } from "./contentLoader";

describe("markdownTransforms & nav tree search", () => {
  describe("protectMathSyntax", () => {
    it("protects underscores in inline math from markdown emphasis parsing", () => {
      const input = "Formula $x_i + y_j = z_{i,j}$ in text";
      const protectedText = protectMathSyntax(input);
      expect(protectedText).toBe("Formula $x\\_i + y\\_j = z\\_{i,j}$ in text");
    });

    it("leaves underscores outside of math syntax unmodified", () => {
      const input = "Variable my_variable_name and math $a_b$";
      const protectedText = protectMathSyntax(input);
      expect(protectedText).toBe(
        "Variable my_variable_name and math $a\\_b$"
      );
    });

    it("protects backslashed curly braces in display math", () => {
      const input = "$$ A = \\{1, 2, 3\\} $$";
      const protectedText = protectMathSyntax(input);
      expect(protectedText).toBe("$$ A = \\\\{1, 2, 3\\\\} $$");
    });

    it("ignores escaped currency dollar signs", () => {
      const input = "Price is \\$100 and formula is $x_1$";
      const protectedText = protectMathSyntax(input);
      expect(protectedText).toBe("Price is \\$100 and formula is $x\\_1$");
    });
  });

  describe("replaceEmojis (AGENTS.md emoji vector badge invariant)", () => {
    it("converts check and cross emojis outside code into vector badge spans", () => {
      const input = "Valid ✅ and invalid ❌";
      const result = replaceEmojis(input);
      expect(result).toContain('<span class="inline-icon-check" aria-label="ano"></span>');
      expect(result).toContain('<span class="inline-icon-cross" aria-label="ne"></span>');
    });

    it("preserves emojis unmodified inside inline code and fenced code blocks", () => {
      const input = "Normal ✅ and `code ✅` and ```\ncode block ❌\n```";
      const result = replaceEmojis(input);
      expect(result).toContain('<span class="inline-icon-check" aria-label="ano"></span> and `code ✅`');
      expect(result).toContain("code block ❌");
    });
  });

  describe("searchNavTree single-pass sidebar search", () => {
    const mockTree: NavNode[] = [
      {
        type: "folder",
        key: "bi-pa1",
        title: "BI-PA1 - Programování v C",
        order: 1,
        children: [
          {
            type: "file",
            key: "wsl-setup",
            title: "WSL a setup",
            order: 1,
            material: {
              key: "wsl-setup",
              title: "WSL a setup",
              path: "1-semestr/bi-pa1/wsl-setup.md",
              segments: ["1-semestr", "bi-pa1", "wsl-setup"],
              pathOrders: [1, 1, 1],
              fileOrder: 1,
              categoryKey: "1-semestr",
              categoryLabel: "1. Semestr",
              categoryOrder: 1,
              raw: "",
            },
          },
          {
            type: "file",
            key: "kalendar",
            title: "Kalendář cvičení",
            order: 2,
            material: {
              key: "kalendar",
              title: "Kalendář cvičení",
              path: "1-semestr/bi-pa1/kalendar.md",
              segments: ["1-semestr", "bi-pa1", "kalendar"],
              pathOrders: [1, 1, 2],
              fileOrder: 2,
              categoryKey: "1-semestr",
              categoryLabel: "1. Semestr",
              categoryOrder: 1,
              raw: "",
            },
          },
        ],
      },
    ];

    it("returns all nodes when query is empty", () => {
      expect(searchNavTree(mockTree, "")).toEqual(mockTree);
      expect(searchNavTree(mockTree, "   ")).toEqual(mockTree);
    });

    it("retains entire folder when folder title or key matches query", () => {
      const results = searchNavTree(mockTree, "pa1");
      expect(results).toHaveLength(1);
      expect(results[0].key).toBe("bi-pa1");
      // All children preserved
      if (results[0].type === "folder") {
        expect(results[0].children).toHaveLength(2);
      }
    });

    it("filters to only matching file when querying specific material", () => {
      const results = searchNavTree(mockTree, "kalendář");
      expect(results).toHaveLength(1);
      if (results[0].type === "folder") {
        expect(results[0].children).toHaveLength(1);
        expect(results[0].children[0].key).toBe("kalendar");
      }
    });

    it("returns empty array when query does not match anything", () => {
      const results = searchNavTree(mockTree, "nonexistent-topic");
      expect(results).toHaveLength(0);
    });
  });
});
