/**
 * Vectoral admin change ops.
 * Each edit is a small patch applied server-side onto the latest KV snapshot,
 * so two admins editing different taxa don't clobber each other with full-tree PUT.
 */

export type AdminChange =
  | { type: "UPDATE_ITEM"; id: string; fields: Record<string, unknown> }
  | { type: "DELETE_ITEM"; id: string }
  | { type: "ADD_ITEM"; parentId: string | null; item: Record<string, unknown> }
  | { type: "MOVE_ITEM"; id: string; direction: "up" | "down" }
  | {
      type: "ADD_CATEGORY";
      category: { key: string; label: string };
    }
  | { type: "DELETE_CATEGORY"; key: string }
  | { type: "MOVE_CATEGORY"; index: number; direction: "up" | "down" }
  | {
      type: "ADD_EMOJI";
      emoji: { emoji: string; label: string; category: string };
    }
  | {
      type: "UPDATE_EMOJI";
      oldEmoji: string;
      emoji: string;
      label: string;
    }
  | { type: "DELETE_EMOJI"; emoji: string }
  | {
      type: "SET_EMOJIS";
      emojiOptions: unknown;
      emojiCategories?: unknown;
    };
