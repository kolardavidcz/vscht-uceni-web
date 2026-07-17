import { cn } from "@/lib/cn";

/** Lightweight 2D morphology preview from emoji trait set. */
export function CellMorphology({
  taxonEmojis,
  className = "",
}: {
  taxonEmojis: string[];
  className?: string;
}) {
  const isGramPositive = taxonEmojis.includes("🔵");
  const isGramNegative = taxonEmojis.includes("🔴");
  const isWallLess = taxonEmojis.includes("🧱❌");
  const isRod = taxonEmojis.includes("🌭");
  const isCoccus = taxonEmojis.some((e) =>
    ["⚪", "🍇", "⛓️"].includes(e)
  );
  const isSpirillum = taxonEmojis.includes("〰️");
  const isFilamentous = taxonEmojis.includes("🌿");
  const isChain = taxonEmojis.includes("⛓️");
  const isCluster = taxonEmojis.includes("🍇");
  const isMotile = taxonEmojis.includes("🏃");
  const isSpore = taxonEmojis.includes("🛡️");

  let wallColor = "border-stone-300 bg-stone-100";
  let wallLabel = "Neznámá stěna";
  if (isGramPositive) {
    wallColor = "border-indigo-600 bg-indigo-50 border-4";
    wallLabel = "G+ (silný peptidoglykan)";
  } else if (isGramNegative) {
    wallColor = "border-rose-500 bg-rose-50 border-double border-4";
    wallLabel = "G- (vnější membrána)";
  } else if (isWallLess) {
    wallColor = "border-dashed border-amber-400 bg-amber-50";
    wallLabel = "Bez buněčné stěny";
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/80",
        className
      )}
    >
      <div className="relative w-24 h-16 bg-white border border-stone-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
        {isMotile && (
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <svg className="w-full h-full stroke-indigo-400 stroke-2 fill-none" viewBox="0 0 100 100">
              <path d="M 5,50 C 15,35 25,65 35,50" />
              <path d="M 95,50 C 85,65 75,35 65,50" />
            </svg>
          </div>
        )}
        <div className="z-10 relative">
          {isRod && (
            <div className={cn("w-16 h-7 rounded-full border relative", wallColor)}>
              {isSpore && (
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-600" />
              )}
            </div>
          )}
          {isCoccus && !isRod && (
            isChain ? (
              <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={cn("w-4 h-4 rounded-full border-2", wallColor)} />
                ))}
              </div>
            ) : isCluster ? (
              <div className="relative w-10 h-9">
                <div className={cn("absolute top-0 left-1 w-4 h-4 rounded-full border-2", wallColor)} />
                <div className={cn("absolute top-0 left-5 w-4 h-4 rounded-full border-2", wallColor)} />
                <div className={cn("absolute top-3 left-0 w-4 h-4 rounded-full border-2", wallColor)} />
                <div className={cn("absolute top-3.5 left-3.5 w-4 h-4 rounded-full border-2", wallColor)} />
              </div>
            ) : (
              <div className={cn("w-8 h-8 rounded-full border-2", wallColor)} />
            )
          )}
          {isSpirillum && !isRod && !isCoccus && (
            <svg className="w-16 h-5" viewBox="0 0 100 40">
              <path
                d="M 5,20 C 20,2 35,38 50,20 C 65,2 80,38 95,20"
                className={cn(
                  "fill-none stroke-[4px]",
                  isGramPositive ? "stroke-indigo-600" : isGramNegative ? "stroke-rose-500" : "stroke-stone-400"
                )}
              />
            </svg>
          )}
          {isFilamentous && !isRod && !isCoccus && !isSpirillum && (
            <svg className="w-14 h-7" viewBox="0 0 100 50">
              <path
                d="M 50,48 L 50,30 M 50,30 L 30,18 M 50,30 L 70,20 M 30,18 L 15,15 M 70,20 L 85,12"
                className={cn(
                  "fill-none stroke-[3px]",
                  isGramPositive ? "stroke-indigo-600" : isGramNegative ? "stroke-rose-500" : "stroke-stone-400"
                )}
              />
            </svg>
          )}
          {!isRod && !isCoccus && !isSpirillum && !isFilamentous && (
            <span className="text-[9px] font-black text-stone-400">N/A</span>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-black text-stone-700">{wallLabel}</div>
        <div className="text-[9px] text-stone-500 mt-0.5">
          {[
            isRod ? "Tyčinka" : isCoccus ? "Kok" : isSpirillum ? "Spirála" : isFilamentous ? "Vláknitá" : null,
            isMotile ? "Bičíky" : null,
            isSpore ? "Spory" : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </div>
    </div>
  );
}
