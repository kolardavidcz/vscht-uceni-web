import { describe, expect, it } from "vitest";
import {
  countAnswered,
  countCorrect,
  countTotal,
  fieldIdFor,
  flattenTaxa,
  setsEqual,
  updateItemInTree,
} from "./scoring";
import type { WorksheetItem } from "../types";

describe("microbiology quiz scoring & tree utilities", () => {
  describe("setsEqual", () => {
    it("returns true for sets with same elements in any order", () => {
      expect(setsEqual(["🔴", "🌭"], ["🌭", "🔴"])).toBe(true);
      expect(setsEqual([], [])).toBe(true);
    });

    it("returns false for sets with different elements or lengths", () => {
      expect(setsEqual(["🔴", "🌭"], ["🔴"])).toBe(false);
      expect(setsEqual(["🔴", "🌭"], ["🔴", "⚪"])).toBe(false);
    });
  });

  describe("fieldIdFor", () => {
    it("returns id without group suffix when groupId is omitted", () => {
      const item: WorksheetItem = {
        id: "ecoli",
        name: "Escherichia coli",
        correctEmojis: [],
      };
      expect(fieldIdFor(item)).toBe("ecoli");
    });

    it("returns compound id with group suffix when groupId is present", () => {
      const item: WorksheetItem = {
        id: "ecoli",
        name: "Escherichia coli",
        correctEmojis: [],
      };
      expect(fieldIdFor(item, "groupA")).toBe("ecoli_groupA");
    });
  });

  describe("quiz metrics: countTotal, countAnswered, countCorrect", () => {
    const tree: WorksheetItem[] = [
      {
        id: "root-1",
        name: "Phylum 1",
        correctEmojis: [],
        children: [
          {
            id: "spec-1",
            name: "Species 1",
            correctEmojis: ["🔴", "🌭"],
          },
          {
            id: "spec-2",
            name: "Species 2 with groups",
            correctEmojis: [],
            groups: [
              { id: "g1", label: "Morphology", correctEmojis: ["🔵", "⚪"] },
              { id: "g2", label: "Physiology", correctEmojis: ["💨"] },
            ],
          },
        ],
      },
    ];

    it("countTotal counts all testable items and groups in tree", () => {
      // spec-1 has 1 quiz item; spec-2 has 2 groups -> total = 3
      expect(countTotal(tree)).toBe(3);
    });

    it("countAnswered counts user selections matching item field IDs", () => {
      const selected: Record<string, string[]> = {
        "spec-1": ["🔴", "🌭"],
        "spec-2_g1": ["🔵"],
      };
      expect(countAnswered(tree, selected)).toBe(2);
    });

    it("countCorrect scores only completely accurate selections", () => {
      const selected: Record<string, string[]> = {
        "spec-1": ["🌭", "🔴"], // Correct, order swapped
        "spec-2_g1": ["🔵"], // Incomplete, missing ⚪
        "spec-2_g2": ["💨"], // Correct
      };
      expect(countCorrect(tree, selected)).toBe(2);
    });
  });

  describe("flattenTaxa", () => {
    it("produces flat items with accurate breadcrumbs and fieldIds", () => {
      const tree: WorksheetItem[] = [
        {
          id: "phylum-1",
          name: "Proteobacteria",
          type: "Kmen",
          correctEmojis: [],
          children: [
            {
              id: "species-1",
              name: "E. coli",
              type: "Zástupce",
              correctEmojis: ["🔴", "🌭"],
            },
          ],
        },
      ];

      const flat = flattenTaxa(tree);
      expect(flat).toHaveLength(1);
      expect(flat[0].name).toBe("E. coli");
      expect(flat[0].fieldId).toBe("species-1");
      expect(flat[0].breadcrumbs).toEqual([
        { id: "phylum-1", name: "Proteobacteria", type: "Kmen" },
        { id: "species-1", name: "E. coli", type: "Zástupce" },
      ]);
    });
  });

  describe("updateItemInTree", () => {
    it("mutates target item in place through updater function", () => {
      const tree: WorksheetItem[] = [
        {
          id: "p1",
          name: "Old Name",
          correctEmojis: [],
          children: [{ id: "c1", name: "Child", correctEmojis: [] }],
        },
      ];
      const updated = updateItemInTree(tree, "p1", (item) => ({
        ...item,
        name: "New Name",
      }));
      expect(updated[0].name).toBe("New Name");
      expect(updated[0].children?.[0].name).toBe("Child");
    });
  });
});
