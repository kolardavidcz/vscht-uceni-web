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

export type QuizScoreBreakdown = {
  total: number;
  answered: number;
  correct: number;
  partial: number;
  wrong: number;
};

/** Computes detailed score breakdown across all answer slots in the tree. */
export function getQuizScoreBreakdown(
  items: WorksheetItem[],
  selected: Record<string, string[]>
): QuizScoreBreakdown {
  const stats: QuizScoreBreakdown = {
    total: 0,
    answered: 0,
    correct: 0,
    partial: 0,
    wrong: 0,
  };

  const evaluateSlot = (fieldId: string, correct: string[]) => {
    stats.total++;
    const sel = selected[fieldId] || [];
    if (sel.length === 0) return;
    stats.answered++;
    if (correct.length > 0 && setsEqual(sel, correct)) {
      stats.correct++;
    } else if (sel.some((e) => correct.includes(e))) {
      stats.partial++;
    } else {
      stats.wrong++;
    }
  };

  const walk = (nodes: WorksheetItem[]) => {
    for (const item of nodes) {
      if (item.groups && item.groups.length > 0) {
        for (const g of item.groups) {
          evaluateSlot(fieldIdFor(item, g.id), g.correctEmojis || []);
        }
      } else if (item.correctEmojis && item.correctEmojis.length > 0) {
        evaluateSlot(item.id, item.correctEmojis);
      }
      if (item.children) walk(item.children);
    }
  };

  walk(items);
  return stats;
}

/** Checks whether a single worksheet item has at least one incorrect or incomplete answer slot. */
export function itemHasMistake(
  item: WorksheetItem,
  selected: Record<string, string[]>
): boolean {
  if (item.groups && item.groups.length > 0) {
    return item.groups.some((g) => {
      const corr = g.correctEmojis || [];
      if (corr.length === 0) return false;
      return !setsEqual(selected[fieldIdFor(item, g.id)] || [], corr);
    });
  }
  if (item.correctEmojis && item.correctEmojis.length > 0) {
    return !setsEqual(selected[item.id] || [], item.correctEmojis);
  }
  return false;
}

/** Filters worksheet tree for QuizPage search, phylum filter, and "mistakes only" review mode. */
export function filterWorksheetTree(
  items: WorksheetItem[],
  opts: {
    query: string;
    phylum: string;
    onlyMistakes: boolean;
    selected: Record<string, string[]>;
  }
): WorksheetItem[] {
  const q = opts.query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const norm = (s?: string) =>
    (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const walk = (nodes: WorksheetItem[]): WorksheetItem[] => {
    const out: WorksheetItem[] = [];
    for (const item of nodes) {
      const filteredChildren = item.children ? walk(item.children) : [];
      const hasSlots =
        Boolean(item.groups?.length) || Boolean(item.correctEmojis?.length);
      const matchesText =
        !q ||
        norm(item.name).includes(q) ||
        norm(item.description).includes(q) ||
        norm(item.hint).includes(q);
      const matchesMistake =
        !opts.onlyMistakes || (hasSlots && itemHasMistake(item, opts.selected));

      const selfMatches = matchesText && matchesMistake;
      if (selfMatches || filteredChildren.length > 0) {
        out.push(
          item.children
            ? { ...item, children: filteredChildren }
            : item
        );
      }
    }
    return out;
  };

  const rootPool =
    opts.phylum && opts.phylum !== "Vše"
      ? items.filter((i) => i.name === opts.phylum)
      : items;

  if (!q && !opts.onlyMistakes) return rootPool;
  return walk(rootPool);
}

/** Unbiased Fisher-Yates shuffle returning a new array. */
export function fisherYatesShuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Re-inserts a missed ("hard") flashcard a few positions ahead in the deck
 * so the student actively re-practices it within the same session.
 */
export function requeueHardCard<T>(
  pool: readonly T[],
  currentIndex: number,
  offset = 3
): T[] {
  if (currentIndex < 0 || currentIndex >= pool.length) return [...pool];
  const card = pool[currentIndex];
  const next = [...pool];
  const insertAt = Math.min(next.length, currentIndex + 1 + offset);
  next.splice(insertAt, 0, card);
  return next;
}
