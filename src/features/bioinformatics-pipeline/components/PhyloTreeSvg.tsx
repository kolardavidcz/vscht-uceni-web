import { useMemo } from "react";
import { layoutPhylogram, type PhyloNode } from "../lib/newickParser";
import type { TaxRank, TaxonomyRecord } from "../lib/taxonomyStats";
import type { MappingStatus } from "../lib/characterizedMapper";

interface PhyloTreeSvgProps {
  root: PhyloNode;
  cladogram: boolean;
  showBootstrap: boolean;
  bootstrapThreshold: number;
  taxonomyByAcc: Map<string, TaxonomyRecord>;
  colorMode: "taxonomy" | "motif";
  taxRank: TaxRank;
  taxonColorMap: Map<string, string>;
  highlightMotif: string | null;
  presentMotifSet: Set<string> | null;
  charStatusByLeaf: Map<string, MappingStatus>;
  selectedLeaf: string | null;
  onSelectLeaf: (leafId: string) => void;
  svgId?: string;
}

export function PhyloTreeSvg({
  root,
  cladogram,
  showBootstrap,
  bootstrapThreshold,
  taxonomyByAcc,
  colorMode,
  taxRank,
  taxonColorMap,
  highlightMotif,
  presentMotifSet,
  charStatusByLeaf,
  selectedLeaf,
  onSelectLeaf,
  svgId = "gh48-phylo-svg",
}: PhyloTreeSvgProps) {
  const layout = useMemo(
    () =>
      layoutPhylogram(root, {
        cladogram,
        plotWidth: 400,
        rowHeight: 24,
        paddingLeft: 18,
        paddingRight: 300,
        paddingY: 22,
      }),
    [root, cladogram]
  );

  const scaleBarLength = useMemo(() => {
    if (cladogram || layout.maxDepth <= 0) return null;
    const raw = layout.maxDepth / 4;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const nice = Math.max(0.05, Math.round(raw / pow) * pow);
    const px = (nice / layout.maxDepth) * (layout.plotRight - layout.plotLeft);
    return { value: nice, px };
  }, [cladogram, layout]);

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#110906] p-3">
      <svg
        id={svgId}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="w-full min-w-[680px] h-auto select-none"
        role="img"
        aria-label={`Fylogenetický strom (${layout.leafOrder.length} listů)`}
      >
        {/* Rectangular phylogram edges */}
        <g fill="none" stroke="#64748b" strokeWidth="1.35" strokeLinecap="round">
          {layout.edges.map((e) => (
            <path
              key={`${e.parentId}-${e.childId}`}
              d={`M ${e.x1.toFixed(1)} ${e.y1.toFixed(1)} V ${e.y2.toFixed(1)} H ${e.x2.toFixed(1)}`}
            />
          ))}
        </g>

        {/* Internal node bootstrap markers */}
        {showBootstrap &&
          layout.nodes
            .filter((n) => !n.isLeaf && n.node.ufboot !== null)
            .map((n) => {
              const uf = n.node.ufboot!;
              const strong = uf >= bootstrapThreshold;
              return (
                <g key={`boot-${n.node.id}`}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={strong ? 3.2 : 2.1}
                    fill={strong ? "#f95d12" : "#475569"}
                  />
                  {strong && (
                    <text
                      x={n.x - 4}
                      y={n.y - 5}
                      textAnchor="end"
                      fontSize="9"
                      fontFamily="ui-monospace, monospace"
                      fill="#fdba74"
                    >
                      {n.node.supportRaw}
                    </text>
                  )}
                </g>
              );
            })}

        {/* Leaf tips + color strips + labels */}
        {layout.nodes
          .filter((n) => n.isLeaf)
          .map((n) => {
            const acc = n.node.name;
            const tax = taxonomyByAcc.get(acc);
            const taxonVal = tax ? tax[taxRank] || "Nezařazeno" : "Nezařazeno";
            const hasMotif = presentMotifSet?.has(acc) ?? false;
            const dotColor =
              colorMode === "motif" && highlightMotif
                ? hasMotif
                  ? "#f95d12"
                  : "#334155"
                : taxonColorMap.get(taxonVal) ?? "#94a3b8";

            const charStatus = charStatusByLeaf.get(acc);
            const isSelected = selectedLeaf === acc;
            const speciesShort = tax?.scientificName
              ? tax.scientificName.length > 26
                ? `${tax.scientificName.slice(0, 25)}…`
                : tax.scientificName
              : "";

            return (
              <g
                key={`leaf-${n.node.id}`}
                onClick={() => onSelectLeaf(acc)}
                className="cursor-pointer group"
              >
                {/* Selection highlight bar */}
                {isSelected && (
                  <rect
                    x={layout.plotRight + 4}
                    y={n.y - 10}
                    width={layout.width - layout.plotRight - 10}
                    height={20}
                    rx={4}
                    fill="rgba(249, 93, 18, 0.16)"
                    stroke="rgba(249, 93, 18, 0.5)"
                    strokeWidth="0.8"
                  />
                )}

                {/* Dotted guide line to aligned column */}
                <line
                  x1={n.x + 5}
                  y1={n.y}
                  x2={layout.plotRight + 8}
                  y2={n.y}
                  stroke="rgba(148,163,184,0.18)"
                  strokeDasharray="2 3"
                  strokeWidth="1"
                />

                {/* Tip circle */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={isSelected ? 4.8 : 3.6}
                  fill={dotColor}
                  stroke={isSelected ? "#fff" : "#0f0906"}
                  strokeWidth="1"
                />

                {/* Color strip swatch */}
                <rect
                  x={layout.plotRight + 10}
                  y={n.y - 7}
                  width={10}
                  height={14}
                  rx={2}
                  fill={dotColor}
                />

                {/* Characterized badge (red star / orange dot) */}
                {charStatus && charStatus !== "unmatched" && (
                  <circle
                    cx={layout.plotRight + 28}
                    cy={n.y}
                    r={4}
                    fill={charStatus === "direct" ? "#ef4444" : "#f97316"}
                  >
                    <title>
                      {charStatus === "direct"
                        ? "Charakterizovaný enzym (přímá shoda)"
                        : "Charakterizovaný enzym (MMseqs2 proxy)"}
                    </title>
                  </circle>
                )}

                {/* Accession + Species label */}
                <text
                  x={layout.plotRight + (charStatus && charStatus !== "unmatched" ? 37 : 26)}
                  y={n.y + 3.5}
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  fontWeight={isSelected ? "700" : "500"}
                  fill={isSelected ? "#ffffff" : "#e2e8f0"}
                >
                  {acc}
                </text>
                {speciesShort && (
                  <text
                    x={layout.plotRight + 126}
                    y={n.y + 3.5}
                    fontSize="10.5"
                    fontStyle="italic"
                    fill="#94a3b8"
                  >
                    {speciesShort}
                  </text>
                )}
              </g>
            );
          })}

        {/* Branch-length scale bar */}
        {scaleBarLength && (
          <g transform={`translate(${layout.plotLeft}, ${layout.height - 14})`}>
            <line
              x1={0}
              y1={0}
              x2={scaleBarLength.px}
              y2={0}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <line x1={0} y1={-3} x2={0} y2={3} stroke="#94a3b8" strokeWidth="1.5" />
            <line
              x1={scaleBarLength.px}
              y1={-3}
              x2={scaleBarLength.px}
              y2={3}
              stroke="#94a3b8"
              strokeWidth="1.5"
            />
            <text
              x={scaleBarLength.px / 2}
              y={-5}
              textAnchor="middle"
              fontSize="9.5"
              fontFamily="ui-monospace, monospace"
              fill="#94a3b8"
            >
              {scaleBarLength.value.toFixed(2)} subst./pozice
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
