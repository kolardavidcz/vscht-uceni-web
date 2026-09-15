import { describe, expect, it } from "vitest";
import {
  applyChanges,
  checkPassword,
  type AdminChange,
  type MicrobiologyPayload,
} from "./adminPatcher";

describe("adminPatcher pure vectoral patching engine", () => {
  const samplePayload: MicrobiologyPayload = {
    worksheetData: [
      {
        id: "kmen-1",
        name: "Proteobacteria",
        type: "Kmen",
        children: [
          {
            id: "rod-1",
            name: "Escherichia",
            type: "Rod",
            correctEmojis: ["🔴", "🌭"],
            groups: [
              {
                id: "g-1",
                correctEmojis: ["🔴", "🌭"],
              },
            ],
          },
          {
            id: "rod-2",
            name: "Salmonella",
            type: "Rod",
            correctEmojis: ["🔴", "🌭"],
          },
        ],
      },
      {
        id: "kmen-2",
        name: "Firmicutes",
        type: "Kmen",
        children: [],
      },
    ],
    emojiOptions: [
      { emoji: "🔴", label: "Gram-negativní", category: "Stěna" },
      { emoji: "🌭", label: "Tyčinka", category: "Morfologie" },
      { emoji: "⚪", label: "Kok", category: "Morfologie" },
    ],
    emojiCategories: [
      { key: "Stěna", label: "Buněčná stěna" },
      { key: "Morfologie", label: "Morfologie" },
    ],
  };

  describe("checkPassword", () => {
    it("validates default fallback password", () => {
      delete process.env.MICROBIOLOGY_ADMIN_PASSWORD;
      expect(checkPassword("bavi_nas_mikrobiologie")).toBe(true);
      expect(checkPassword("wrong_password")).toBe(false);
      expect(checkPassword(null)).toBe(false);
      expect(checkPassword(12345)).toBe(false);
    });

    it("validates against custom env password", () => {
      process.env.MICROBIOLOGY_ADMIN_PASSWORD = "secret_lab_pass";
      expect(checkPassword("secret_lab_pass")).toBe(true);
      expect(checkPassword("bavi_nas_mikrobiologie")).toBe(false);
      delete process.env.MICROBIOLOGY_ADMIN_PASSWORD;
    });
  });

  describe("applyChanges operations", () => {
    it("UPDATE_ITEM: updates fields on root and nested items", () => {
      const changes: AdminChange[] = [
        {
          type: "UPDATE_ITEM",
          id: "rod-1",
          fields: { description: "Modelový organismus", hint: "Střevní flóra" },
        },
      ];
      const result = applyChanges(samplePayload, changes);
      const rod1 = result.worksheetData[0].children?.[0];
      expect(rod1?.description).toBe("Modelový organismus");
      expect(rod1?.hint).toBe("Střevní flóra");
      // Baseline not mutated
      expect(samplePayload.worksheetData[0].children?.[0].description).toBeUndefined();
    });

    it("DELETE_ITEM: recursively deletes an item", () => {
      const changes: AdminChange[] = [{ type: "DELETE_ITEM", id: "rod-2" }];
      const result = applyChanges(samplePayload, changes);
      const remainingIds = result.worksheetData[0].children?.map((c) => c.id);
      expect(remainingIds).toEqual(["rod-1"]);
    });

    it("ADD_ITEM: adds item at root or under a parent", () => {
      const changes: AdminChange[] = [
        {
          type: "ADD_ITEM",
          parentId: null,
          item: { id: "kmen-3", name: "Actinobacteria", children: [] },
        },
        {
          type: "ADD_ITEM",
          parentId: "kmen-2",
          item: { id: "rod-3", name: "Bacillus", correctEmojis: ["🔵", "🌭"] },
        },
      ];
      const result = applyChanges(samplePayload, changes);
      expect(result.worksheetData.map((k) => k.id)).toEqual([
        "kmen-1",
        "kmen-2",
        "kmen-3",
      ]);
      expect(result.worksheetData[1].children?.map((c) => c.id)).toEqual(["rod-3"]);
    });

    it("MOVE_ITEM: reorders items up and down safely with boundary protection", () => {
      const changes: AdminChange[] = [
        // Move rod-2 up -> becomes first child
        { type: "MOVE_ITEM", id: "rod-2", direction: "up" },
        // Try to move rod-2 up again (at index 0) -> should be no-op
        { type: "MOVE_ITEM", id: "rod-2", direction: "up" },
      ];
      const result = applyChanges(samplePayload, changes);
      expect(result.worksheetData[0].children?.map((c) => c.id)).toEqual([
        "rod-2",
        "rod-1",
      ]);
    });

    it("ADD_CATEGORY, DELETE_CATEGORY, MOVE_CATEGORY", () => {
      const changes: AdminChange[] = [
        {
          type: "ADD_CATEGORY",
          category: { key: "Fyziologie", label: "Fyziologie" },
        },
        { type: "DELETE_CATEGORY", key: "Stěna" },
        { type: "MOVE_CATEGORY", index: 1, direction: "up" },
      ];
      const result = applyChanges(samplePayload, changes);
      expect(result.emojiCategories).toEqual([
        { key: "Fyziologie", label: "Fyziologie" },
        { key: "Morfologie", label: "Morfologie" },
      ]);
    });

    it("UPDATE_EMOJI: updates emoji in options and cascades rewrite into all tree nodes and groups", () => {
      const changes: AdminChange[] = [
        {
          type: "UPDATE_EMOJI",
          oldEmoji: "🌭",
          emoji: "🥖",
          label: "Tyčinka (bageta)",
        },
      ];
      const result = applyChanges(samplePayload, changes);
      const updatedOption = result.emojiOptions.find((e) => e.emoji === "🥖");
      expect(updatedOption).toBeDefined();
      expect(updatedOption?.label).toBe("Tyčinka (bageta)");

      // Verify cascade in tree node
      const rod1 = result.worksheetData[0].children?.[0];
      expect(rod1?.correctEmojis).toEqual(["🔴", "🥖"]);
      // Verify cascade in groups
      expect(rod1?.groups?.[0].correctEmojis).toEqual(["🔴", "🥖"]);
    });

    it("REPLACE_ALL: replaces the full payload cleanly", () => {
      const fresh: MicrobiologyPayload = {
        worksheetData: [{ id: "reset", name: "Reset" }],
        emojiOptions: [],
        emojiCategories: [],
      };
      const result = applyChanges(samplePayload, [
        { type: "REPLACE_ALL", data: fresh },
      ]);
      expect(result.worksheetData).toEqual([{ id: "reset", name: "Reset" }]);
    });

    it("UPDATE_ITEM: rejects prototype pollution payloads", () => {
      const maliciousPayload = JSON.parse(
        '{"__proto__": {"polluted": true}, "constructor": {"polluted": true}, "name": "SafeName"}'
      );
      const changes: AdminChange[] = [
        {
          type: "UPDATE_ITEM",
          id: "rod-1",
          fields: maliciousPayload,
        },
      ];
      const result = applyChanges(samplePayload, changes);
      expect((Object.prototype as Record<string, unknown>).polluted).toBeUndefined();
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(result.worksheetData[0].children?.[0].name).toBe("SafeName");
    });
  });
});
