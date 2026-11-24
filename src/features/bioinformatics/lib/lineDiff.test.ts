import { describe, expect, it } from "vitest";
import { buildCompactDiff, computeLineDiff } from "./lineDiff";

describe("lineDiff (Admin wiki review diff engine)", () => {
  it("reports zero additions and removals for identical text", () => {
    const res = computeLineDiff("a\nb\nc", "a\nb\nc");
    expect(res.added).toBe(0);
    expect(res.removed).toBe(0);
    expect(res.lines.every((l) => l.type === "context")).toBe(true);
  });

  it("detects added, removed, and modified lines accurately", () => {
    const res = computeLineDiff(
      "# Nadpis\nřádek 1\nstarý text\nřádek 3",
      "# Nadpis\nřádek 1\nnový text\npřidaný řádek\nřádek 3"
    );
    expect(res.removed).toBe(1);
    expect(res.added).toBe(2);
    expect(res.lines.some((l) => l.type === "remove" && l.text === "starý text")).toBe(true);
    expect(res.lines.some((l) => l.type === "add" && l.text === "nový text")).toBe(true);
    expect(res.lines.some((l) => l.type === "add" && l.text === "přidaný řádek")).toBe(true);
  });

  it("compacts long unchanged stretches around edits", () => {
    const before = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n");
    const after = before.replace("line 10", "line 10 EDITED");
    const diff = computeLineDiff(before, after);
    const compact = buildCompactDiff(diff.lines, 2);
    expect(compact.some((item) => item.type === "skip")).toBe(true);
    expect(compact.length).toBeLessThan(diff.lines.length);
  });
});
