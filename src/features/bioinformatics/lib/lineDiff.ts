/**
 * Lightweight line-by-line diff utility for reviewing wiki markdown suggestions.
 * Uses Myers-style / LCS DP on changed slice (trimming common prefix/suffix first
 * so large markdown files diff in sub-millisecond time).
 */

export type DiffLine = {
  type: "context" | "add" | "remove";
  oldLine?: number;
  newLine?: number;
  text: string;
};

export type DiffSummary = {
  lines: DiffLine[];
  added: number;
  removed: number;
};

export function computeLineDiff(before: string, after: string): DiffSummary {
  const a = before.replace(/\r\n/g, "\n").split("\n");
  const b = after.replace(/\r\n/g, "\n").split("\n");

  // Fast trim of common prefix & suffix
  let prefix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) {
    prefix++;
  }

  let suffix = 0;
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  ) {
    suffix++;
  }

  const midA = a.slice(prefix, a.length - suffix);
  const midB = b.slice(prefix, b.length - suffix);

  const lines: DiffLine[] = [];
  for (let i = 0; i < prefix; i++) {
    lines.push({ type: "context", oldLine: i + 1, newLine: i + 1, text: a[i] });
  }

  let added = 0;
  let removed = 0;

  // Guard worst-case O(n*m) memory for huge completely-rewritten files
  if (midA.length * midB.length > 400_000) {
    for (let i = 0; i < midA.length; i++) {
      lines.push({
        type: "remove",
        oldLine: prefix + i + 1,
        text: midA[i],
      });
      removed++;
    }
    for (let j = 0; j < midB.length; j++) {
      lines.push({
        type: "add",
        newLine: prefix + j + 1,
        text: midB[j],
      });
      added++;
    }
  } else {
    const n = midA.length;
    const m = midB.length;
    const cols = m + 1;
    const dp = new Int32Array((n + 1) * cols);

    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        if (midA[i] === midB[j]) {
          dp[i * cols + j] = dp[(i + 1) * cols + (j + 1)] + 1;
        } else {
          const down = dp[(i + 1) * cols + j];
          const right = dp[i * cols + (j + 1)];
          dp[i * cols + j] = down >= right ? down : right;
        }
      }
    }

    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (midA[i] === midB[j]) {
        lines.push({
          type: "context",
          oldLine: prefix + i + 1,
          newLine: prefix + j + 1,
          text: midA[i],
        });
        i++;
        j++;
      } else if (dp[(i + 1) * cols + j] >= dp[i * cols + (j + 1)]) {
        lines.push({
          type: "remove",
          oldLine: prefix + i + 1,
          text: midA[i],
        });
        removed++;
        i++;
      } else {
        lines.push({
          type: "add",
          newLine: prefix + j + 1,
          text: midB[j],
        });
        added++;
        j++;
      }
    }
    while (i < n) {
      lines.push({
        type: "remove",
        oldLine: prefix + i + 1,
        text: midA[i],
      });
      removed++;
      i++;
    }
    while (j < m) {
      lines.push({
        type: "add",
        newLine: prefix + j + 1,
        text: midB[j],
      });
      added++;
      j++;
    }
  }

  for (let k = 0; k < suffix; k++) {
    const oldIdx = a.length - suffix + k;
    const newIdx = b.length - suffix + k;
    lines.push({
      type: "context",
      oldLine: oldIdx + 1,
      newLine: newIdx + 1,
      text: a[oldIdx],
    });
  }

  return { lines, added, removed };
}

/**
 * Collapses long unchanged stretches to +/- `contextRadius` lines around each change.
 */
export function buildCompactDiff(
  lines: readonly DiffLine[],
  contextRadius = 3
): Array<DiffLine | { type: "skip"; count: number }> {
  const keep = new Array<boolean>(lines.length).fill(false);

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].type !== "context") {
      const start = Math.max(0, i - contextRadius);
      const end = Math.min(lines.length - 1, i + contextRadius);
      for (let k = start; k <= end; k++) keep[k] = true;
    }
  }

  const out: Array<DiffLine | { type: "skip"; count: number }> = [];
  let skipped = 0;

  for (let i = 0; i < lines.length; i++) {
    if (keep[i]) {
      if (skipped > 0) {
        out.push({ type: "skip", count: skipped });
        skipped = 0;
      }
      out.push(lines[i]);
    } else {
      skipped++;
    }
  }
  if (skipped > 0) {
    out.push({ type: "skip", count: skipped });
  }

  return out;
}
