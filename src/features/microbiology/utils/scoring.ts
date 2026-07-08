import { WorksheetItem } from '../../../types';

export const countTotal = (items: WorksheetItem[]): number => {
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
};

export const countAnswered = (items: WorksheetItem[], selectedEmojis: Record<string, string[]>): number => {
  let count = 0;
  for (const item of items) {
    if (item.groups && item.groups.length > 0) {
      for (const g of item.groups) {
        const fieldId = `${item.id}_${g.id}`;
        const sel = selectedEmojis[fieldId] || [];
        if (sel.length > 0) count++;
      }
    } else if (item.correctEmojis && item.correctEmojis.length > 0) {
      const fieldId = item.id;
      const sel = selectedEmojis[fieldId] || [];
      if (sel.length > 0) count++;
    }
    if (item.children) count += countAnswered(item.children, selectedEmojis);
  }
  return count;
};

export const countCorrect = (items: WorksheetItem[], selectedEmojis: Record<string, string[]>): number => {
  let count = 0;
  for (const item of items) {
    if (item.groups && item.groups.length > 0) {
      for (const g of item.groups) {
        const fieldId = `${item.id}_${g.id}`;
        const sel = selectedEmojis[fieldId] || [];
        const corr = g.correctEmojis || [];
        if (corr.length > 0 && corr.every(e => sel.includes(e)) && sel.every(e => corr.includes(e))) {
          count++;
        }
      }
    } else if (item.correctEmojis && item.correctEmojis.length > 0) {
      const fieldId = item.id;
      const sel = selectedEmojis[fieldId] || [];
      const corr = item.correctEmojis;
      if (corr.every(e => sel.includes(e)) && sel.every(e => corr.includes(e))) {
        count++;
      }
    }
    if (item.children) count += countCorrect(item.children, selectedEmojis);
  }
  return count;
};
