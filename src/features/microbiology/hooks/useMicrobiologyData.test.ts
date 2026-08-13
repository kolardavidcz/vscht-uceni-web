import { describe, expect, it } from "vitest";
import { enrichWorksheetData, emojiOptions } from "../data/emojis";
import { worksheetData } from "../data/zastupci";

describe("enrichWorksheetData", () => {
  it("enriches species with matching emoji option data", () => {
    const result = enrichWorksheetData(worksheetData, emojiOptions);
    expect(result.length).toBeGreaterThan(0);
    const firstGroup = result[0];
    expect(firstGroup.name).toBeDefined();
  });

  it("handles missing emojis gracefully without crashing", () => {
    const result = enrichWorksheetData(worksheetData, []);
    expect(result).toBeDefined();
    expect(result.length).toBe(worksheetData.length);
  });
});
