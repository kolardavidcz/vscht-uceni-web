import { describe, expect, it } from "vitest";
import {
  printBadgeHtml,
  printRelClasses,
  stripMarkdownLinks,
} from "./printPlanDocument";

describe("stripMarkdownLinks", () => {
  it("strips markdown link syntax and leaves raw label", () => {
    expect(
      stripMarkdownLinks(
        "[1. První program v jazyce C++](https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/intro.html)"
      )
    ).toBe("1. První program v jazyce C++");
  });

  it("handles multiple markdown links in a string", () => {
    expect(
      stripMarkdownLinks("Lekce: [Téma A](https://a.cz) a [Téma B](https://b.cz)")
    ).toBe("Lekce: Téma A a Téma B");
  });

  it("returns plain text unchanged", () => {
    expect(stripMarkdownLinks("Plain text")).toBe("Plain text");
  });
});

describe("printBadgeHtml", () => {
  it("renders NO CODE NEEDED tag for no_code badge", () => {
    const html = printBadgeHtml(["no_code"], false);
    expect(html).toContain("NO CODE NEEDED");
    expect(html).toContain("chip-nocode");
  });

  it("renders multiple badge tags correctly", () => {
    const html = printBadgeHtml(["epic", "practice"], false);
    expect(html).toContain("EPIC");
    expect(html).toContain("PRACTICE");
  });

  it("renders low quality badge when lowQuality parameter is true", () => {
    const html = printBadgeHtml([], true);
    expect(html).toContain("LOW QUALITY");
  });

  it("returns empty string when no badges and lowQuality is false", () => {
    const html = printBadgeHtml([], false);
    expect(html).toBe("");
  });
});

describe("printRelClasses", () => {
  it("returns bar-orange for high relevance topics", () => {
    const rel = printRelClasses({
      weekNum: 1,
      weekTitle: "Týden 1",
      category: "PA2",
      source: "KSI",
      topic: "C++",
      relevance: 95,
      quality: true,
      badges: ["epic"],
    });
    expect(rel.bar).toBe("bar-orange");
    expect(rel.pct).toBe("pct-high");
  });

  it("returns bar-slate for low quality topics", () => {
    const rel = printRelClasses({
      weekNum: 1,
      weekTitle: "Týden 1",
      category: "PA2",
      source: "KSI",
      topic: "Old Topic",
      relevance: 95,
      quality: false,
      badges: [],
    });
    expect(rel.bar).toBe("bar-slate");
    expect(rel.pct).toBe("pct-muted");
  });
});
