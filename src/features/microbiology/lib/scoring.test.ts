import { describe, expect, it } from "vitest";
import {
  countAnswered,
  countCorrect,
  countTotal,
  fieldIdFor,
  filterWorksheetTree,
  fisherYatesShuffle,
  flattenTaxa,
  getQuizScoreBreakdown,
  requeueHardCard,
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

  describe("getQuizScoreBreakdown & filterWorksheetTree", () => {
    const tree: WorksheetItem[] = [
      {
        id: "p1",
        name: "Proteobacteria",
        type: "Kmen",
        correctEmojis: [],
        children: [
          { id: "s1", name: "Escherichia coli", correctEmojis: ["🔴", "🌭"] },
          { id: "s2", name: "Salmonella", correctEmojis: ["🔴", "🏃"] },
          { id: "s3", name: "Vibrio", correctEmojis: ["🔴", "💧"] },
        ],
      },
    ];

    it("computes exact, partial, and wrong counts accurately", () => {
      const stats = getQuizScoreBreakdown(tree, {
        s1: ["🔴", "🌭"], // exact
        s2: ["🔴"], // partial
        s3: ["🔵"], // wrong
      });
      expect(stats).toEqual({
        total: 3,
        answered: 3,
        correct: 1,
        partial: 1,
        wrong: 1,
      });
    });

    it("filters only mistaken items when onlyMistakes is enabled", () => {
      const filtered = filterWorksheetTree(tree, {
        query: "",
        phylum: "Vše",
        onlyMistakes: true,
        selected: {
          s1: ["🔴", "🌭"],
          s2: ["🔴"],
        },
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].children?.map((c) => c.id)).toEqual(["s2", "s3"]);
    });
  });

  describe("flashcard deck helpers (fisherYatesShuffle & requeueHardCard)", () => {
    it("fisherYatesShuffle preserves all items without mutating input", () => {
      const orig = [1, 2, 3, 4, 5, 6];
      const shuffled = fisherYatesShuffle(orig);
      expect(shuffled).toHaveLength(orig.length);
      expect([...shuffled].sort((a, b) => a - b)).toEqual(orig);
      expect(orig).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("requeueHardCard re-inserts missed card ahead in the deck", () => {
      const deck = ["A", "B", "C", "D", "E"];
      expect(requeueHardCard(deck, 0, 2)).toEqual(["A", "B", "C", "A", "D", "E"]);
      expect(requeueHardCard(deck, 4, 3)).toEqual(["A", "B", "C", "D", "E", "E"]);
    });
  });
});
