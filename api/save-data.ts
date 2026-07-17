import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getRedis } from "../lib/server/redis.js";

const DATA_KEY = "microbiology:data";

type TreeItem = {
  id: string;
  name?: string;
  correctEmojis?: string[];
  groups?: Array<{ id: string; correctEmojis: string[] }>;
  children?: TreeItem[];
  [key: string]: unknown;
};

type Payload = {
  worksheetData: TreeItem[];
  emojiOptions: Array<{ emoji: string; label: string; category: string }>;
  emojiCategories: Array<{ key: string; label: string }>;
};

function checkPassword(password: unknown): boolean {
  const expected =
    process.env.MICROBIOLOGY_ADMIN_PASSWORD || "bavi_nas_mikrobiologie";
  return typeof password === "string" && password === expected;
}

function walkUpdate(
  items: TreeItem[],
  id: string,
  fields: Record<string, unknown>
): boolean {
  for (const item of items) {
    if (item.id === id) {
      Object.assign(item, fields);
      return true;
    }
    if (item.children && walkUpdate(item.children, id, fields)) return true;
  }
  return false;
}

function walkDelete(items: TreeItem[], id: string): TreeItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) =>
      item.children
        ? { ...item, children: walkDelete(item.children, id) }
        : item
    );
}

function walkAdd(
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

function walkMove(
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

function rewriteEmojiInTree(
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
 * Apply a list of small ops onto the latest snapshot.
 * Order matters; ops are applied sequentially.
 */
function applyChanges(
  base: Payload,
  changes: Array<Record<string, unknown>>
): Payload {
  let next: Payload = structuredClone(base);

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
          const cat = change.category as { key: string; label: string };
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
            change.emoji as Payload["emojiOptions"][number],
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
          next.emojiOptions = change.emojiOptions as Payload["emojiOptions"];
        }
        if (change.emojiCategories) {
          next.emojiCategories =
            change.emojiCategories as Payload["emojiCategories"];
        }
        break;
      case "REPLACE_ALL":
        if (change.data && typeof change.data === "object") {
          next = structuredClone(change.data as Payload);
        }
        break;
      default:
        break;
    }
  }

  return next;
}

/**
 * POST /api/save-data
 *
 * Prefer vectoral mode:
 *   { password, changes: AdminChange[] }
 * reads latest Redis snapshot, applies only these patches, writes back.
 *
 * Full replace (seed / reset):
 *   { password, data: Payload }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const redis = getRedis();
    const body = req.body || {};
    if (!checkPassword(body.password)) {
      return res.status(401).json({ error: "Neplatné heslo" });
    }

    let payload: Payload;

    if (Array.isArray(body.changes) && body.changes.length > 0) {
      // Always patch against the freshest shared snapshot
      const current =
        ((await redis.get(DATA_KEY)) as Payload | null) || {
          worksheetData: [],
          emojiOptions: [],
          emojiCategories: [],
        };
      // If store empty but client sent baseline, seed first then patch
      if (
        (!current.worksheetData || current.worksheetData.length === 0) &&
        body.baseline?.worksheetData
      ) {
        payload = applyChanges(body.baseline as Payload, body.changes);
      } else {
        payload = applyChanges(current, body.changes);
      }
    } else if (body.data?.worksheetData) {
      payload = {
        worksheetData: body.data.worksheetData,
        emojiOptions: body.data.emojiOptions || [],
        emojiCategories: body.data.emojiCategories || [],
      };
    } else {
      return res.status(400).json({
        error: "Očekávám { changes } (vectoral) nebo { data } (full replace)",
      });
    }

    await redis.set(DATA_KEY, payload);
    return res.status(200).json({ success: true, data: payload });
  } catch (err) {
    console.error("save-data failed", err);
    return res.status(500).json({
      error: "Uložení do Redis selhalo",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
