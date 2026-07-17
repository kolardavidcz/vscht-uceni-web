import type { WorksheetItem } from "../types";

export function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((e) => b.includes(e)) && b.every((e) => a.includes(e));
}

export function fieldIdFor(
  item: WorksheetItem,
  groupId?: string
): string {
  return groupId ? `${item.id}_${groupId}` : item.id;
}

export function countTotal(items: WorksheetItem[]): number {
  let count = 0;
  for (const item of items) {
    if (item.groups && item.groups.length > 0) {
      count += item.groups.length;
    } else if (item.correctEmojis && item.correctEmojis.length > 0) {
      count++;
    }
    if (item.children) count += countTotal(item.children);
  }
  return count;
}

export function countAnswered(
  items: WorksheetItem[],
  selected: Record<string, string[]>
): number {
  let count = 0;
  for (const item of items) {
    if (item.groups && item.groups.length > 0) {
      for (const g of item.groups) {
        if ((selected[fieldIdFor(item, g.id)] || []).length > 0) count++;
      }
    } else if (item.correctEmojis && item.correctEmojis.length > 0) {
      if ((selected[item.id] || []).length > 0) count++;
    }
    if (item.children) count += countAnswered(item.children, selected);
  }
  return count;
}

export function countCorrect(
  items: WorksheetItem[],
  selected: Record<string, string[]>
): number {
  let count = 0;
  for (const item of items) {
    if (item.groups && item.groups.length > 0) {
      for (const g of item.groups) {
        const sel = selected[fieldIdFor(item, g.id)] || [];
        const corr = g.correctEmojis || [];
        if (corr.length > 0 && setsEqual(sel, corr)) count++;
      }
    } else if (item.correctEmojis && item.correctEmojis.length > 0) {
      const sel = selected[item.id] || [];
      if (setsEqual(sel, item.correctEmojis)) count++;
    }
    if (item.children) count += countCorrect(item.children, selected);
  }
  return count;
}

export type FlatTaxon = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  correctEmojis: string[];
  hint?: string;
  breadcrumbs: { id: string; name: string; type?: string }[];
  fieldId: string;
  groupLabel?: string;
};

export function flattenTaxa(
  items: WorksheetItem[],
  breadcrumbs: FlatTaxon["breadcrumbs"] = []
): FlatTaxon[] {
  const out: FlatTaxon[] = [];
  for (const item of items) {
    const crumbs = [...breadcrumbs, { id: item.id, name: item.name, type: item.type }];
    if (item.groups && item.groups.length > 0) {
      for (const g of item.groups) {
        out.push({
          id: item.id,
          name: item.name,
          type: item.type,
          description: item.description,
          correctEmojis: g.correctEmojis || [],
          hint: item.hint,
          breadcrumbs: crumbs,
          fieldId: fieldIdFor(item, g.id),
          groupLabel: g.label,
        });
      }
    } else if (item.correctEmojis && item.correctEmojis.length > 0) {
      out.push({
        id: item.id,
        name: item.name,
        type: item.type,
        description: item.description,
        correctEmojis: item.correctEmojis,
        hint: item.hint,
        breadcrumbs: crumbs,
        fieldId: item.id,
      });
    }
    if (item.children) out.push(...flattenTaxa(item.children, crumbs));
  }
  return out;
}

export function updateItemInTree(
  items: WorksheetItem[],
  id: string,
  updater: (item: WorksheetItem) => WorksheetItem
): WorksheetItem[] {
  return items.map((item) => {
    if (item.id === id) return updater(item);
    if (item.children) {
      return { ...item, children: updateItemInTree(item.children, id, updater) };
    }
    return item;
  });
}
