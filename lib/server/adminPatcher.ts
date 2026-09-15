/**
 * Server-side microbiology data patching logic.
 * Contains pure tree transformation operations applied by POST /api/save-data.
 */

import { createHash, timingSafeEqual } from "node:crypto";

export interface TreeItem {
  id: string;
  name?: string;
  correctEmojis?: string[];
  groups?: Array<{ id: string; correctEmojis: string[] }>;
  children?: TreeItem[];
  [key: string]: unknown;
}

export interface EmojiOption {
  emoji: string;
  label: string;
  category: string;
}

export interface EmojiCategory {
  key: string;
  label: string;
}

export interface MicrobiologyPayload {
  worksheetData: TreeItem[];
  emojiOptions: EmojiOption[];
  emojiCategories: EmojiCategory[];
}

export type AdminChange = {
  type: string;
  id?: string;
  parentId?: string | null;
  direction?: "up" | "down";
  fields?: Record<string, unknown>;
  item?: TreeItem;
  category?: EmojiCategory;
  key?: string;
  index?: number;
  emoji?: EmojiOption | string;
  oldEmoji?: string;
  label?: string;
  emojiOptions?: EmojiOption[];
  emojiCategories?: EmojiCategory[];
  data?: MicrobiologyPayload;
  [key: string]: unknown;
};

/**
 * Validates admin password against environment variable or default fallback.
 *
 * @param password Provided password from client request.
 * @returns True if password matches expected value.
 */
export function checkPassword(password: unknown): boolean {
  const expected =
    process.env.MICROBIOLOGY_ADMIN_PASSWORD || "bavi_nas_mikrobiologie";
  if (typeof password !== "string" || !password) return false;

  const hashA = createHash("sha256").update(password).digest();
  const hashB = createHash("sha256").update(expected).digest();
  return timingSafeEqual(hashA, hashB);
}

const DANGEROUS_PROPERTIES = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Recursively updates fields of an item with matching id in the taxonomy tree.
 */
export function walkUpdate(
  items: TreeItem[],
  id: string,
  fields: Record<string, unknown>
): boolean {
  for (const item of items) {
    if (item.id === id) {
      for (const [key, value] of Object.entries(fields)) {
        if (!DANGEROUS_PROPERTIES.has(key)) {
          item[key] = value;
        }
      }
      return true;
    }
    if (item.children && walkUpdate(item.children, id, fields)) return true;
  }
  return false;
}

/**
 * Recursively removes an item with matching id from the taxonomy tree.
 */
export function walkDelete(items: TreeItem[], id: string): TreeItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) =>
      item.children
        ? { ...item, children: walkDelete(item.children, id) }
        : item
    );
}

/**
 * Recursively adds an item as a child of parentId, or appends to root if parentId is null.
 */
export function walkAdd(
  items: TreeItem[],
  parentId: string | null,
  newItem: TreeItem
): TreeItem[] {
  if (!parentId) return [...items, newItem];
  return items.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...(item.children || []), newItem],
      };
    }
    if (item.children) {
      return { ...item, children: walkAdd(item.children, parentId, newItem) };
    }
    return item;
  });
}

/**
 * Reorders an item up or down among its immediate siblings.
 */
export function walkMove(
  items: TreeItem[],
  id: string,
  direction: "up" | "down"
): TreeItem[] {
  const index = items.findIndex((i) => i.id === id);
  if (index !== -1) {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return items;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  }
  return items.map((item) =>
    item.children
      ? { ...item, children: walkMove(item.children, id, direction) }
      : item
  );
}

/**
 * Recursively updates emoji character references across taxon and group definitions.
 */
export function rewriteEmojiInTree(
  items: TreeItem[],
  oldEmoji: string,
  newEmoji: string
): TreeItem[] {
  return items.map((item) => {
    const next: TreeItem = { ...item };
    if (next.correctEmojis) {
      next.correctEmojis = next.correctEmojis.map((e) =>
        e === oldEmoji ? newEmoji : e
      );
    }
    if (next.groups) {
      next.groups = next.groups.map((g) => ({
        ...g,
        correctEmojis: g.correctEmojis.map((e) =>
          e === oldEmoji ? newEmoji : e
        ),
      }));
    }
    if (next.children) {
      next.children = rewriteEmojiInTree(next.children, oldEmoji, newEmoji);
    }
    return next;
  });
}

/**
 * Applies a list of small ops onto the latest snapshot sequentially.
 *
 * @param base Baseline microbiology payload snapshot.
 * @param changes Ordered list of admin change operations.
 * @returns Updated microbiology payload snapshot.
 */
export function applyChanges(
  base: MicrobiologyPayload,
  changes: AdminChange[]
): MicrobiologyPayload {
  let next: MicrobiologyPayload = structuredClone(base);

  for (const change of changes) {
    const type = change.type;
    switch (type) {
      case "UPDATE_ITEM":
        if (typeof change.id === "string") {
          walkUpdate(
            next.worksheetData,
            change.id,
            (change.fields as Record<string, unknown>) || {}
          );
        }
        break;
      case "DELETE_ITEM":
        if (typeof change.id === "string") {
          next.worksheetData = walkDelete(next.worksheetData, change.id);
        }
        break;
      case "ADD_ITEM":
        if (change.item && typeof change.item === "object") {
          next.worksheetData = walkAdd(
            next.worksheetData,
            (change.parentId as string | null) ?? null,
            change.item as TreeItem
          );
        }
        break;
      case "MOVE_ITEM":
        if (
          typeof change.id === "string" &&
          (change.direction === "up" || change.direction === "down")
        ) {
          next.worksheetData = walkMove(
            next.worksheetData,
            change.id,
            change.direction
          );
        }
        break;
      case "ADD_CATEGORY":
        if (change.category && typeof change.category === "object") {
          const cat = change.category as EmojiCategory;
          if (!next.emojiCategories.some((c) => c.key === cat.key)) {
            next.emojiCategories = [...next.emojiCategories, cat];
          }
        }
        break;
      case "DELETE_CATEGORY":
        if (typeof change.key === "string") {
          next.emojiCategories = next.emojiCategories.filter(
            (c) => c.key !== change.key
          );
        }
        break;
      case "MOVE_CATEGORY": {
        const index = Number(change.index);
        const direction = change.direction;
        if (
          Number.isFinite(index) &&
          (direction === "up" || direction === "down")
        ) {
          const target = direction === "up" ? index - 1 : index + 1;
          const cats = [...next.emojiCategories];
          if (target >= 0 && target < cats.length) {
            [cats[index], cats[target]] = [cats[target], cats[index]];
            next.emojiCategories = cats;
          }
        }
        break;
      }
      case "ADD_EMOJI":
        if (change.emoji && typeof change.emoji === "object") {
          next.emojiOptions = [
            ...next.emojiOptions,
            change.emoji as EmojiOption,
          ];
        }
        break;
      case "UPDATE_EMOJI": {
        const oldEmoji = String(change.oldEmoji || "");
        const emoji = String(change.emoji || "");
        const label = String(change.label || "");
        if (oldEmoji && emoji) {
          next.emojiOptions = next.emojiOptions.map((e) =>
            e.emoji === oldEmoji ? { ...e, emoji, label } : e
          );
          next.worksheetData = rewriteEmojiInTree(
            next.worksheetData,
            oldEmoji,
            emoji
          );
        }
        break;
      }
      case "DELETE_EMOJI":
        if (typeof change.emoji === "string") {
          next.emojiOptions = next.emojiOptions.filter(
            (e) => e.emoji !== change.emoji
          );
        }
        break;
      case "SET_EMOJIS":
        if (change.emojiOptions) {
          next.emojiOptions = change.emojiOptions as EmojiOption[];
        }
        if (change.emojiCategories) {
          next.emojiCategories = change.emojiCategories as EmojiCategory[];
        }
        break;
      case "REPLACE_ALL":
        if (change.data && typeof change.data === "object") {
          next = structuredClone(change.data as MicrobiologyPayload);
        }
        break;
      default:
        break;
    }
  }

  return next;
}
