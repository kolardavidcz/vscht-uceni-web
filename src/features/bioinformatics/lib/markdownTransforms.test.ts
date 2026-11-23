import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import {
  MarkdownView,
  protectMathSyntax,
  replaceEmojis,
  wikiSanitizeSchema,
} from "../components/MarkdownView";
import { searchNavTree, type NavNode } from "./contentLoader";
import {
  extractHeadings,
  searchMaterialsFullText,
  slugifyHeading,
} from "./wikiHelpers";

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

    it("does NOT corrupt shell variables with $ and _ inside fenced or inline code blocks", () => {
      const input = [
        "Inline `$PROG < $IN_FILE` and math $a_b$.",
        "```bash",
        'for IN_FILE in $REFERENCE_FOLDER; do',
        '  "$PROG" < "$IN_FILE" > my_out.txt',
        "done",
        "```",
      ].join("\n");
      const protectedText = protectMathSyntax(input);
      expect(protectedText).toContain("`$PROG < $IN_FILE`");
      expect(protectedText).toContain('"$PROG" < "$IN_FILE" > my_out.txt');
      expect(protectedText).toContain("$a\\_b$");
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

  describe("wikiSanitizeSchema (XSS prevention & safe HTML allowlist)", () => {
    it("allows safe semantic elements like div, span, details, summary, and iframe", () => {
      expect(wikiSanitizeSchema.tagNames).toContain("div");
      expect(wikiSanitizeSchema.tagNames).toContain("span");
      expect(wikiSanitizeSchema.tagNames).toContain("details");
      expect(wikiSanitizeSchema.tagNames).toContain("summary");
      expect(wikiSanitizeSchema.tagNames).toContain("iframe");
    });

    it("does not allow dangerous tags like script, object, or embed", () => {
      expect(wikiSanitizeSchema.tagNames).not.toContain("script");
      expect(wikiSanitizeSchema.tagNames).not.toContain("object");
      expect(wikiSanitizeSchema.tagNames).not.toContain("embed");
      expect(wikiSanitizeSchema.tagNames).not.toContain("base");
    });

    it("does not allow inline event handlers in allowed attributes", () => {
      const allAttrs = [
        ...(wikiSanitizeSchema.attributes?.["*"] || []),
        ...(wikiSanitizeSchema.attributes?.a || []),
      ];
      const eventHandlers = allAttrs.filter(
        (attr) => typeof attr === "string" && attr.startsWith("on")
      );
      expect(eventHandlers).toEqual([]);
    });

    it("restricts iframe src attribute strictly to YouTube embeds", () => {
      const iframeAttrs = wikiSanitizeSchema.attributes?.iframe || [];
      const srcRule = iframeAttrs.find(
        (rule) => Array.isArray(rule) && rule[0] === "src"
      );
      expect(srcRule).toBeDefined();
      if (Array.isArray(srcRule) && srcRule[1] instanceof RegExp) {
        const regex = srcRule[1] as RegExp;
        expect(regex.test("https://www.youtube.com/embed/9zpToW-YgwE")).toBe(true);
        expect(regex.test("https://www.youtube-nocookie.com/embed/9zpToW-YgwE")).toBe(true);
        expect(regex.test("https://malicious-site.com/embed/123")).toBe(false);
        expect(regex.test("javascript:alert(1)")).toBe(false);
      }
    });

    it("strictly limits protocols to http, https, and mailto for hrefs", () => {
      const hrefProtocols = wikiSanitizeSchema.protocols?.href || [];
      expect(hrefProtocols).toContain("http");
      expect(hrefProtocols).toContain("https");
      expect(hrefProtocols).toContain("mailto");
      expect(hrefProtocols).not.toContain("javascript");
      expect(hrefProtocols).not.toContain("data");
    });

    it("preserves safe inline SVG diagrams, data-label, download, and YouTube embeds while stripping XSS", () => {
      const md = [
        "## 4. Lokální testování ze souborů (`testshell.sh`)",
        "",
        '<div class="print-tablet-workspace" data-label="Místo pro řešení"></div>',
        '<a href="/rekurze_bro.cpp" download="rekurze_bro.cpp">Stáhnout</a>',
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="10" fill="#f95d12" /><text x="50" y="50" text-anchor="middle">v1</text></svg>',
        '<iframe src="https://www.youtube.com/embed/9zpToW-YgwE" allowfullscreen></iframe>',
        '<iframe src="https://evil.example/embed/123"></iframe>',
        '<script>alert(1)</script><img src="x" onerror="alert(2)" /><a href="javascript:alert(3)">bad</a><svg><foreignObject><div>bad</div></foreignObject></svg>',
      ].join("\n");

      const html = renderToStaticMarkup(
        createElement(MemoryRouter, null, createElement(MarkdownView, { content: md }))
      );

      // Legitimate features preserved
      expect(html).toContain('id="4-lokalni-testovani-ze-souboru-testshellsh"');
      expect(html).toContain('data-label="Místo pro řešení"');
      expect(html).toContain('download="rekurze_bro.cpp"');
      expect(html).toContain("<svg");
      expect(html).toContain("<circle");
      expect(html).toContain('cx="50"');
      expect(html).toContain("https://www.youtube.com/embed/9zpToW-YgwE");
      expect(html.toLowerCase()).toContain("allowfullscreen");
      expect(html).not.toContain('node="[object Object]"');

      // XSS vectors stripped
      expect(html).not.toContain("<script");
      expect(html).not.toContain("onerror");
      expect(html).not.toContain("javascript:alert");
      expect(html).not.toContain("evil.example");
      expect(html).not.toContain("foreignObject");
    });
  });

  describe("wikiHelpers (heading slugs, TOC extraction, full-text search)", () => {
    it("generates Czech diacritic-free slugs matching existing anchor links", () => {
      expect(
        slugifyHeading("4. Lokální testování ze souborů (`testshell.sh`)")
      ).toBe("4-lokalni-testovani-ze-souboru-testshellsh");
    });

    it("extracts h2/h3 headings while skipping fenced code blocks and deduplicating IDs", () => {
      const md = [
        "# Main Title",
        "## Úvod",
        "```bash",
        "## Not a heading",
        "```",
        "### Detail",
        "## Úvod",
      ].join("\n");
      const headings = extractHeadings(md);
      expect(headings).toEqual([
        { level: 2, text: "Úvod", id: "uvod" },
        { level: 3, text: "Detail", id: "detail" },
        { level: 2, text: "Úvod", id: "uvod-2" },
      ]);
    });

    it("performs diacritic-insensitive full-text search across body content", () => {
      const sample = [
        {
          key: "debug",
          title: "Jak to spravit",
          categoryKey: "1-semestr",
          categoryLabel: "1. Semestr",
          categoryOrder: 1,
          fileOrder: 1,
          pathOrders: [1],
          path: "1-semestr/debug.md",
          segments: ["1-semestr", "debug"],
          raw: "# Debug\n\nPoužijte Valgrind pro kontrolu úniků paměti.",
        },
      ];
      const hits = searchMaterialsFullText(sample, "uniku pameti");
      expect(hits).toHaveLength(1);
      expect(hits[0].material.key).toBe("debug");
      expect(hits[0].snippet).toContain("úniků paměti");
    });
  });
});

