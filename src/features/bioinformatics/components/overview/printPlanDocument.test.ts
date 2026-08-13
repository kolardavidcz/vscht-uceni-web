import { describe, expect, it } from "vitest";
import { printBadgeHtml, printRelClasses } from "./printPlanDocument";

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
