import { useId, useMemo, useState, type ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  type?: "text" | "number";
  sortable?: boolean;
  align?: "left" | "right";
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
}

interface SortableDataTableProps<T> {
  caption: string;
  rows: T[];
  rowKey: (row: T, index: number) => string;
  columns: TableColumn<T>[];
  defaultSortKey?: string;
  defaultSortDir?: "ascending" | "descending";
  emptyMessage?: string;
  maxRows?: number;
}

const textCollator = new Intl.Collator("cs", {
  numeric: true,
  sensitivity: "base",
});

/**
 * Semantic, keyboard-scrollable, sortable table adhering to
 * modern-web-guidance (`responsive-table` + `sortable-table`):
 * - `<button type="button">` inside `<th scope="col">`
 * - `aria-sort` exclusively on the active sorted `<th>`
 * - `Intl.Collator` for strings and raw numeric values for numbers
 * - single visually-hidden `role="status"` live announcement per sort
 */
export function SortableDataTable<T>({
  caption,
  rows,
  rowKey,
  columns,
  defaultSortKey,
  defaultSortDir = "descending",
  emptyMessage = "Žádné záznamy k zobrazení.",
  maxRows = 250,
}: SortableDataTableProps<T>) {
  const captionId = useId();
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [sortDir, setSortDir] = useState<"ascending" | "descending">(defaultSortDir);
  const [statusMessage, setStatusMessage] = useState("");

  const activeCol = useMemo(
    () => columns.find((c) => c.key === sortKey) ?? null,
    [columns, sortKey]
  );

  const sortedRows = useMemo(() => {
    if (!activeCol || !activeCol.sortValue) return rows;
    const factor = sortDir === "ascending" ? 1 : -1;
    const isNum = activeCol.type === "number";
    const keyed = rows.map((row, idx) => ({
      row,
      idx,
      val: activeCol.sortValue!(row),
    }));
    keyed.sort((a, b) => {
      const cmp = isNum
        ? Number(a.val) - Number(b.val)
        : textCollator.compare(String(a.val), String(b.val));
      return cmp !== 0 ? cmp * factor : a.idx - b.idx;
    });
    return keyed.map((k) => k.row);
  }, [rows, activeCol, sortDir]);

  const visibleRows = sortedRows.slice(0, maxRows);

  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable || !col.sortValue) return;
    const nextDir: "ascending" | "descending" =
      sortKey === col.key
        ? sortDir === "ascending"
          ? "descending"
          : "ascending"
        : "ascending";
    setSortKey(col.key);
    setSortDir(nextDir);
    const dirLabel = nextDir === "ascending" ? "vzestupně" : "sestupně";
    setStatusMessage(
      `Seřazeno podle ${col.label}, ${dirLabel}, ${rows.length} řádků.`
    );
  };

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="relative">
      <div role="status" className="bio-sr-status">
        {statusMessage}
      </div>
      <div
        tabIndex={0}
        role="region"
        aria-labelledby={captionId}
        className="bio-table-wrapper rounded-xl border border-white/10 bg-[#140b07]"
      >
        <table className="bio-table text-xs sm:text-[13px]">
          <caption id={captionId} className="sr-only">
            {caption}
          </caption>
          <thead className="bg-[#1f120b] text-slate-300 border-b border-white/10">
            <tr>
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === "right" ? "text-right justify-end" : "text-left";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={isSorted ? sortDir : undefined}
                    data-type={col.type ?? "text"}
                    className={`border-b border-white/10 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap ${
                      col.sortable ? "" : "px-3 py-2.5"
                    } ${col.align === "right" ? "text-right" : "text-left"}`}
                  >
                    {col.sortable && col.sortValue ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className={`hover:text-brand-orange transition-colors ${alignClass}`}
                      >
                        <span>{col.label}</span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          width="10"
                          height="10"
                          className="bio-sort-icon"
                        >
                          <path
                            d="M6 2.25 10.25 8.5H1.75L6 2.25Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {visibleRows.map((row, idx) => (
              <tr
                key={rowKey(row, idx)}
                className="hover:bg-brand-orange/[0.06] transition-colors"
              >
                {columns.map((col, colIdx) => {
                  const isRowHeader = colIdx === 0;
                  const cellClass = `px-3 py-2 whitespace-nowrap ${
                    col.align === "right" ? "text-right tabular-nums" : "text-left"
                  }`;
                  if (isRowHeader) {
                    return (
                      <th
                        key={col.key}
                        scope="row"
                        className={`${cellClass} font-mono font-semibold text-white bg-[#140b07] sticky left-0 z-[1] border-r border-white/5`}
                      >
                        {col.render(row)}
                      </th>
                    );
                  }
                  return (
                    <td key={col.key} className={cellClass}>
                      {col.render(row)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > maxRows && (
        <p className="mt-2 text-xs text-slate-400">
          Zobrazeno prvních {maxRows} z {rows.length} řádků (plná data jsou obsažena v exportu).
        </p>
      )}
    </div>
  );
}
