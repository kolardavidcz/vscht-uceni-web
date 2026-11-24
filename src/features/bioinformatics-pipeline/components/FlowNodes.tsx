import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  Download,
  ExternalLink,
  FileCode2,
  Play,
  Upload,
} from "lucide-react";

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Downward vertical connector arrow on the central pipeline spine. */
export function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="grid grid-cols-[1fr_48px_1fr] items-center py-1 select-none">
      <div />
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-6 bg-slate-500/70" />
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          width="12"
          height="8"
          className="text-slate-400 -mt-0.5"
        >
          <path d="M6 8 0 0h12L6 8Z" fill="currentColor" />
        </svg>
      </div>
      <div className="pl-2 min-w-0">
        {label && (
          <span className="text-[11px] font-semibold text-amber-200/90 leading-tight block">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

interface ScriptStepNodeProps {
  scriptName: string;
  githubPath?: string;
  arrowLabel?: string;
  children?: ReactNode;
}

/** Left rounded Python/local script node alongside the central vertical arrow. */
export function ScriptStepNode({
  scriptName,
  githubPath,
  arrowLabel = "lokální skript",
  children,
}: ScriptStepNodeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] items-center gap-3 md:gap-0 my-1">
      <div className="rounded-2xl border border-white/20 bg-[#140b07] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileCode2 size={15} className="text-brand-orange shrink-0" />
            <span className="font-mono text-xs sm:text-[13px] font-bold text-white truncate">
              {scriptName}
            </span>
          </div>
          {githubPath && (
            <a
              href={`https://github.com/kolardavidcz/GH48/blob/master/${githubPath}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-orange transition-colors shrink-0"
            >
              GH48 zdroj
              <ExternalLink size={10} />
            </a>
          )}
        </div>
        {children}
      </div>

      {/* Center vertical spine */}
      <div className="hidden md:flex flex-col items-center justify-center h-full py-1 select-none">
        <div className="w-0.5 flex-1 min-h-[28px] bg-slate-500/70" />
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          width="12"
          height="8"
          className="text-slate-400 -mt-0.5"
        >
          <path d="M6 8 0 0h12L6 8Z" fill="currentColor" />
        </svg>
      </div>

      <div className="hidden md:flex items-center pl-2">
        <span className="text-[11px] font-mono text-slate-400">{arrowLabel}</span>
      </div>
    </div>
  );
}

interface VizNodeProps {
  id: string;
  step: number;
  title: string;
  status: string;
  ready?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

/** Wide crimson-ember-bordered visualization & metrics container. */
export function VizNode({
  id,
  step,
  title,
  status,
  ready = false,
  actions,
  children,
}: VizNodeProps) {
  return (
    <section
      aria-labelledby={id}
      className={`w-full rounded-2xl border-2 p-4 sm:p-5 space-y-4 transition-colors ${
        ready
          ? "border-[#b4341c]/80 bg-[#160a07] shadow-[0_0_0_1px_rgba(180,52,28,0.18)]"
          : "border-[#7c2d12]/45 bg-[#120906]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2.5 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-[#b4341c]/25 border border-[#b4341c]/60 text-orange-200 font-mono text-xs font-black flex items-center justify-center shrink-0">
            {step}
          </span>
          <h2 id={id} className="font-display text-sm sm:text-base font-black text-white">
            {title}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-black/35 border border-white/10 text-slate-300">
            {status}
          </span>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-1.5">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

interface NeedInputNodeProps {
  needTitle: string;
  links: { label: string; url: string }[];
  upstreamFile?: { filename: string; content: string } | null;
  actions?: ReactNode;
}

/** Right-offset orange-bordered requirement gate along the central pipeline spine. */
export function NeedInputNode({
  needTitle,
  links,
  upstreamFile,
  actions,
}: NeedInputNodeProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_48px_1fr] items-center gap-3 md:gap-0 my-1">
      <div className="hidden md:block" />

      {/* Center vertical spine */}
      <div className="hidden md:flex flex-col items-center justify-center h-full py-1 select-none">
        <div className="w-0.5 flex-1 min-h-[28px] bg-brand-orange/60" />
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          width="12"
          height="8"
          className="text-brand-orange -mt-0.5"
        >
          <path d="M6 8 0 0h12L6 8Z" fill="currentColor" />
        </svg>
      </div>

      {/* Right orange requirement card */}
      <div className="rounded-2xl border-2 border-brand-orange/80 bg-brand-orange/[0.08] p-4 space-y-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
          Požadovaný vstup
        </div>
        <div className="text-xs sm:text-[13px] font-bold text-white leading-snug">
          {needTitle}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {upstreamFile && upstreamFile.content.trim().length > 0 && (
            <button
              type="button"
              onClick={() => triggerDownload(upstreamFile.filename, upstreamFile.content)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/60 border border-white/15 text-[11px] font-mono text-slate-200 cursor-pointer"
            >
              <Download size={11} className="text-brand-orange" />
              {upstreamFile.filename}
            </button>
          )}
          {links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/40 hover:border-brand-orange border border-white/15 text-[11px] font-semibold text-amber-200 transition-colors"
            >
              {l.label}
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 pt-0.5">{actions}</div>}
      </div>
    </div>
  );
}

interface ForkStepNodeProps {
  altLabel: string;
  localTitle: string;
  localButtonLabel: string;
  onLocalRun: () => void;
  localDisabled?: boolean;
  localParams?: ReactNode;
  localMiniSummary: string;
  providerTitle: string;
  upstreamFile?: { filename: string; content: string } | null;
  providerLinks: { label: string; url: string }[];
  uploadLabel: string;
  uploadAccept: string;
  uploadedName?: string;
  onUploadFile: (text: string, filename: string) => void;
  rawEditor?: ReactNode;
}

/**
 * Two-branch flowchart fork:
 * - Left: Continue locally (button + compact params + mini result box)
 * - Right: Better external provider (script output -> provider -> upload result back into pipeline)
 */
export function ForkStepNode({
  altLabel,
  localTitle,
  localButtonLabel,
  onLocalRun,
  localDisabled = false,
  localParams,
  localMiniSummary,
  providerTitle,
  upstreamFile,
  providerLinks,
  uploadLabel,
  uploadAccept,
  uploadedName,
  onUploadFile,
  rawEditor,
}: ForkStepNodeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = async (file: File) => {
    const txt = await file.text();
    onUploadFile(txt, file.name);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void readFile(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void readFile(f);
    e.target.value = "";
  };

  return (
    <div className="my-1">
      <FlowArrow label={altLabel} />

      {/* Top horizontal split bracket (desktop) */}
      <div aria-hidden="true" className="hidden md:grid grid-cols-2 px-[24%]">
        <div className="h-3 border-t-2 border-l-2 border-slate-500/60 rounded-tl-xl" />
        <div className="h-3 border-t-2 border-r-2 border-slate-500/60 rounded-tr-xl" />
      </div>

      {/* Left (local) vs Right (external provider) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* LEFT COLUMN: Continue locally */}
        <div className="flex flex-col justify-between gap-2.5">
          <div className="rounded-2xl border border-white/20 bg-[#140b07] p-4 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lokální větev
                </span>
                <span className="font-mono text-[11px] font-bold text-white">
                  {localTitle}
                </span>
              </div>

              {localParams && (
                <div className="flex flex-wrap items-end gap-2.5 text-xs bg-black/25 rounded-lg p-2.5 border border-white/5">
                  {localParams}
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={localDisabled}
              onClick={onLocalRun}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-text disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Play size={13} />
              {localButtonLabel}
            </button>
          </div>

          {/* Left mini result pill matching sketch */}
          <div className="rounded-xl border border-[#b4341c]/70 bg-[#160a07] px-3 py-2 text-[11px] font-mono text-slate-200 flex items-center justify-between gap-2">
            <span className="text-orange-200/90">Lokální stav:</span>
            <span className="truncate">{localMiniSummary}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: External better provider */}
        <div className="flex flex-col justify-between gap-1.5">
          {/* 1. Script output -> input for external provider */}
          <div className="rounded-xl border border-white/20 bg-[#140b07] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-300">
              Výstup skriptu → vstup pro server
            </span>
            {upstreamFile && upstreamFile.content.trim().length > 0 ? (
              <button
                type="button"
                onClick={() =>
                  triggerDownload(upstreamFile.filename, upstreamFile.content)
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-mono font-semibold text-white cursor-pointer"
              >
                <Download size={11} className="text-brand-orange" />
                {upstreamFile.filename}
              </button>
            ) : (
              <span className="text-[11px] font-mono text-slate-500">bez dat</span>
            )}
          </div>

          {/* Small downward arrow */}
          <div aria-hidden="true" className="flex flex-col items-center py-0.5">
            <div className="w-0.5 h-3 bg-slate-500/70" />
            <svg viewBox="0 0 10 6" width="10" height="6" className="text-slate-400">
              <path d="M5 6 0 0h10L5 6Z" fill="currentColor" />
            </svg>
          </div>

          {/* 2. Better provider links + return dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border p-4 space-y-3 flex-1 transition-colors ${
              dragging
                ? "border-brand-orange bg-brand-orange/10"
                : "border-white/20 bg-[#140b07]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/90">
                Externí nástroj ({providerTitle})
              </span>
              {uploadedName && (
                <span className="px-2 py-0.5 rounded bg-brand-orange/15 border border-brand-orange/35 font-mono text-[10px] text-orange-100 truncate max-w-[160px]">
                  {uploadedName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {providerLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/40 hover:border-brand-orange border border-white/15 text-xs font-semibold text-amber-200 transition-colors"
                >
                  {l.label}
                  <ExternalLink size={11} />
                </a>
              ))}
            </div>

            <div className="pt-1 border-t border-white/10 space-y-2">
              <input
                ref={inputRef}
                type="file"
                accept={uploadAccept}
                onChange={handleChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-white/25 hover:border-brand-orange bg-black/30 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              >
                <Upload size={13} className="text-brand-orange" />
                {uploadLabel}
              </button>
              {rawEditor}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom converge bracket + downward arrow into shared VizNode */}
      <div aria-hidden="true" className="hidden md:grid grid-cols-2 px-[24%] mt-1">
        <div className="h-3 border-b-2 border-l-2 border-slate-500/60 rounded-bl-xl" />
        <div className="h-3 border-b-2 border-r-2 border-slate-500/60 rounded-br-xl" />
      </div>
      <FlowArrow />
    </div>
  );
}
