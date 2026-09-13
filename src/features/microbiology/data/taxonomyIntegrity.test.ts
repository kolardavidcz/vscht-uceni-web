import { describe, expect, it } from "vitest";
import { emojiOptions } from "./emojis";
import { worksheetData } from "./zastupci";
import type { WorksheetItem } from "../types";

describe("microbiology taxonomy data integrity (catalog invariant)", () => {
  const allKnownEmojis = new Set(emojiOptions.map((o) => o.emoji));

  function collectItems(items: WorksheetItem[]): WorksheetItem[] {
    const out: WorksheetItem[] = [];
    for (const item of items) {
      out.push(item);
      if (item.children) {
        out.push(...collectItems(item.children));
      }
    }
    return out;
  }

  const allTaxa = collectItems(worksheetData);

  it("contains at least 50 taxonomic entries", () => {
    expect(allTaxa.length).toBeGreaterThanOrEqual(50);
  });

  it("ensures every taxon has a unique, non-empty ID", () => {
    const ids = new Set<string>();
    const duplicates: string[] = [];

    for (const item of allTaxa) {
      expect(item.id, `Taxon without ID found: ${item.name}`).toBeTruthy();
      if (ids.has(item.id)) {
        duplicates.push(item.id);
      }
      ids.add(item.id);
    }

    expect(
      duplicates,
      `Duplicate taxon IDs found in zastupci.ts: ${duplicates.join(", ")}`
    ).toEqual([]);
  });

  it("ensures every group within a taxon has a unique ID", () => {
    for (const item of allTaxa) {
      if (item.groups && item.groups.length > 0) {
        const groupIds = new Set<string>();
        for (const group of item.groups) {
          expect(
            group.id,
            `Taxon ${item.name} has a group without an ID`
          ).toBeTruthy();
          expect(
            groupIds.has(group.id),
            `Taxon ${item.name} has duplicate group ID: ${group.id}`
          ).toBe(false);
          groupIds.add(group.id);
        }
      }
    }
  });

  it("validates all taxon correctEmojis exist in emojiOptions", () => {
    const invalidEmojis: Array<{ taxon: string; emoji: string }> = [];

    for (const item of allTaxa) {
      for (const emoji of item.correctEmojis || []) {
        if (!allKnownEmojis.has(emoji)) {
          invalidEmojis.push({ taxon: item.name, emoji });
        }
      }
      for (const group of item.groups || []) {
        for (const emoji of group.correctEmojis || []) {
          if (!allKnownEmojis.has(emoji)) {
            invalidEmojis.push({
              taxon: `${item.name} (${group.label || group.id})`,
              emoji,
            });
          }
        }
      }
    }

    expect(
      invalidEmojis,
      `Taxon emojis not registered in emojiOptions: ${JSON.stringify(invalidEmojis)}`
    ).toEqual([]);
  });
});
