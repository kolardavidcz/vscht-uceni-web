import { useMemo, useState } from "react";
import type { FimoAnalysisResult, MotifStatsRow } from "../lib/fimoAndItol";
import type { TaxonomyRecord } from "../lib/taxonomyStats";

interface MotifHeatmapSvgProps {
  analysis: FimoAnalysisResult;
  motifs: MotifStatsRow[];
  taxonomyByAcc: Map<string, TaxonomyRecord>;
}

function scoreToColor(val: number, maxVal: number): string {
  if (val <= 0 || maxVal <= 0) return "#1b120e";
  const t = Math.min(1, Math.pow(val / maxVal, 0.7));
  // Smooth espresso -> amber -> bright brand orange -> warm gold ramp
  if (t < 0.35) {
    const k = t / 0.35;
    const r = Math.round(27 + k * (124 - 27));
    const g = Math.round(18 + k * (45 - 18));
    const b = Math.round(14 + k * (18 - 14));
    return `rgb(${r},${g},${b})`;
  }
  if (t < 0.75) {
    const k = (t - 0.35) / 0.4;
    const r = Math.round(124 + k * (249 - 124));
    const g = Math.round(45 + k * (93 - 45));
    const b = Math.round(18 + k * (18 - 18));
    return `rgb(${r},${g},${b})`;
  }
  const k = (t - 0.75) / 0.25;
  const r = Math.round(249 + k * (254 - 249));
  const g = Math.round(93 + k * (215 - 93));
  const b = Math.round(18 + k * (170 - 18));
  return `rgb(${r},${g},${b})`;
}

export function MotifHeatmapSvg({
  analysis,
  motifs,
  taxonomyByAcc,
}: MotifHeatmapSvgProps) {
  const [hovered, setHovered] = useState<{
    seqId: string;
    motif: string;
    score: number;
    species: string;
  } | null>(null);

  const visibleSeqs = analysis.sequenceOrder.slice(0, 60);
  const maxScore = useMemo(() => {
    let mx = 1;
    for (const seq of visibleSeqs) {
      const row = analysis.scoreMatrix.get(seq);
      for (const m of motifs) {
        const v = row?.get(m.motif) ?? 0;
        if (v > mx) mx = v;
      }
    }
    return mx;
  }, [analysis, motifs, visibleSeqs]);

  if (motifs.length === 0 || visibleSeqs.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center text-sm text-slate-400">
        Žádné motivy neodpovídají aktuálnímu filtru.
      </div>
    );
  }

  const labelWidth = 118;
  const cellW = Math.max(28, Math.min(54, Math.floor(520 / motifs.length)));
  const cellH = 18;
  const topPad = 62;
  const svgW = labelWidth + motifs.length * cellW + 16;
  const svgH = topPad + visibleSeqs.length * cellH + 14;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 min-h-[24px]">
        {hovered ? (
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="text-white font-bold">{hovered.seqId}</span>
            {hovered.species && (
              <span className="text-slate-400 font-sans italic">{hovered.species}</span>
            )}
            <span className="text-brand-orange font-bold">{hovered.motif}</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-amber-200">
              -log₁₀(p) = {hovered.score > 0 ? hovered.score.toFixed(2) : "chybí"}
            </span>
          </div>
        ) : (
          <span className="text-slate-400">
            Najeďte myší na buňku pro detailní skóre -log₁₀(p)
            {analysis.sequenceOrder.length > 60
              ? ` (zobrazeno prvních 60 z ${analysis.sequenceOrder.length} sekvencí)`
              : ""}
          </span>
        )}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>0</span>
          <span
            className="inline-block w-24 h-2.5 rounded-sm border border-white/10"
            style={{
              background:
                "linear-gradient(to right, #1b120e, #7c2d12, #f95d12, #fed7aa)",
            }}
          />
          <span>{maxScore.toFixed(0)}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#110906] p-3">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto"
          style={{ minWidth: `${Math.min(svgW, 640)}px` }}
          role="img"
          aria-label="Heatmapa FIMO skóre motivů (-log10 p-value)"
        >
          {/* Column headers */}
          {motifs.map((m, ci) => {
            const x = labelWidth + ci * cellW + cellW / 2;
            return (
              <g key={`col-${m.motif}`} transform={`translate(${x}, ${topPad - 8})`}>
                <text
                  transform="rotate(-38)"
                  textAnchor="start"
                  fontSize="10.5"
                  fontFamily="ui-monospace, monospace"
                  fontWeight="700"
                  fill={m.category === "clade-specific" ? "#fb923c" : "#cbd5e1"}
                >
                  {m.motif}
                </text>
              </g>
            );
          })}

          {/* Rows */}
          {visibleSeqs.map((seqId, ri) => {
            const y = topPad + ri * cellH;
            const rowMap = analysis.scoreMatrix.get(seqId);
            const species = taxonomyByAcc.get(seqId)?.scientificName ?? "";
            return (
              <g key={`row-${seqId}`}>
                <text
                  x={labelWidth - 8}
                  y={y + cellH - 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="ui-monospace, monospace"
                  fill="#cbd5e1"
                >
                  {seqId}
                </text>
                {motifs.map((m, ci) => {
                  const score = rowMap?.get(m.motif) ?? 0;
                  const x = labelWidth + ci * cellW;
                  return (
                    <rect
                      key={`${seqId}-${m.motif}`}
                      x={x + 1}
                      y={y + 1}
                      width={cellW - 2}
                      height={cellH - 2}
                      rx={2}
                      fill={scoreToColor(score, maxScore)}
                      stroke={
                        hovered?.seqId === seqId && hovered?.motif === m.motif
                          ? "#ffffff"
                          : "rgba(255,255,255,0.04)"
                      }
                      strokeWidth={
                        hovered?.seqId === seqId && hovered?.motif === m.motif ? 1.2 : 0.5
                      }
                      onMouseEnter={() =>
                        setHovered({ seqId, motif: m.motif, score, species })
                      }
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
