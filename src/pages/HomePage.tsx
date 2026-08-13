import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Binary,
  Biohazard,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Terminal,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const prefetchMicrobiology = () => {
  void import("@/features/microbiology/MicrobiologyRoutes");
};
const prefetchWiki = () => {
  void import("@/features/bioinformatics/pages/WikiPage");
};
const prefetchPython = () => {
  void import("@/features/python-analyzer/pages/PythonAnalyzerPage");
};

export function HomePage() {
  useEffect(() => {
    document.title = "VŠCHT Učení — Rozcestník";
  }, []);

  return (
    <div className="min-h-screen bg-brand-espresso text-slate-100 flex flex-col relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-orange/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-mocha/30 blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] left-[20%] w-[700px] h-[500px] rounded-full bg-brand-latte/10 blur-[130px] pointer-events-none" />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center relative z-10 w-full">
        <div className="text-center space-y-4 mb-16 animate-[fade-in-up_0.4s_ease]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-slate-300 tracking-wider uppercase backdrop-blur-md mb-2">
            <BookOpen size={14} className="text-brand-orange" />
            <span>VŠCHT Praha • Studijní materiály a nástroje</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-amber-100">
            VSCHT Učení
          </h1>
          <p className="text-xs sm:text-base text-slate-200 font-semibold max-w-xl mx-auto leading-relaxed">
            Interaktivní pomůcky a přehledné studijní materiály vytvořené studenty
            pro studenty. Zvolte sekci a začněte studovat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-[scale-in_0.35s_ease]">
          {/* Systematika — whole card is the link */}
          <Card
            variant="dark"
            hover
            onMouseEnter={prefetchMicrobiology}
            onTouchStart={prefetchMicrobiology}
            className="p-6 sm:p-8 group flex flex-col h-full relative overflow-hidden"
          >
            <Link
              to="/mikrobiologie"
              className="absolute inset-0 z-[1] rounded-2xl"
              aria-label="Systematika bakterií"
            />
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all pointer-events-none" />
            <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange w-max border border-brand-orange/20 group-hover:scale-110 transition-transform">
              <Biohazard size={24} />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-black tracking-tight mt-6 mb-2 text-white group-hover:text-brand-orange transition-colors">
              Systematika bakterií
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-6 flex-1">
              Procvičujte taxonomii a vlastnosti bakteriálních kmenů pomocí
              emoji. Obsahuje studijní režim a administraci.
            </p>
            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4 text-[10px] sm:text-xs font-black tracking-wider text-brand-orange uppercase gap-2">
              <span className="flex items-center gap-1.5">
                <ClipboardList size={14} />
                Pracovní list & kvíz
              </span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Card>

          {/* Bioinformatika — full card + nested shortcut chips above the link */}
          <Card
            variant="dark"
            hover
            onMouseEnter={prefetchWiki}
            onTouchStart={prefetchWiki}
            className="p-6 sm:p-8 group flex flex-col h-full relative overflow-hidden"
          >
            <Link
              to="/obor-bioinformatika"
              className="absolute inset-0 z-[1] rounded-2xl"
              aria-label="Obor Bioinformatika"
            />
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all pointer-events-none" />
            <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange w-max border border-brand-orange/20 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-black tracking-tight mt-6 mb-2 text-white group-hover:text-brand-orange transition-colors">
              Obor: Bioinformatika
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-3 flex-1">
              Studijní rozcestník, zápisky a materiály z předmětů. Markdown wiki
              s MathJax a interaktivním PA2→AG1 přehledem.
            </p>
            <div className="relative z-[2] flex flex-wrap gap-2 mb-5">
              <Link
                to="/obor-bioinformatika/1-semestr/bi-pa1/jak-cist"
                className="px-2.5 py-1 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange text-[10px] font-black tracking-wider uppercase rounded-md border border-brand-orange/20"
              >
                PA1
              </Link>
              <Link
                to="/obor-bioinformatika/ag1/pa2-ag1-overview"
                className="px-2.5 py-1 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 text-[10px] font-black tracking-wider uppercase rounded-md border border-orange-600/20"
              >
                AG1
              </Link>
              <Link
                to="/obor-bioinformatika"
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black tracking-wider uppercase rounded-md border border-white/10"
              >
                Wiki
              </Link>
            </div>
            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4 text-[10px] sm:text-xs font-black tracking-wider text-brand-orange uppercase gap-2">
              <span className="flex items-center gap-1.5">
                <Binary size={14} />
                Markdown wiki
              </span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Card>

          {/* Python — whole card is the link */}
          <Card
            variant="dark"
            hover
            onMouseEnter={prefetchPython}
            onTouchStart={prefetchPython}
            className="p-6 sm:p-8 group flex flex-col h-full relative overflow-hidden"
          >
            <Link
              to="/python-analyza"
              className="absolute inset-0 z-[1] rounded-2xl"
              aria-label="Python Analyzátor"
            />
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all pointer-events-none" />
            <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange w-max border border-brand-orange/20 group-hover:scale-110 transition-transform">
              <Terminal size={24} />
            </div>
            <h2 className="font-display text-lg sm:text-xl font-black tracking-tight mt-6 mb-2 text-white group-hover:text-brand-orange transition-colors">
              Python Analyzátor
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-6 flex-1">
              Anotovaný skript pro analýzu DNA/RNA — kopírování a mock běh v
              terminálu.
            </p>
            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4 text-[10px] sm:text-xs font-black tracking-wider text-brand-orange uppercase gap-2">
              <span className="flex items-center gap-1.5">
                <Terminal size={14} />
                Skript & demo
              </span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Card>
        </div>
      </main>

      <footer className="relative z-10 border-t border-brand-orange/10 py-6 text-center text-xs text-slate-500">
        VŠCHT Učení ·{" "}
        <a
          href="mailto:kolarv@vscht.cz"
          className="text-brand-orange hover:underline"
        >
          kolarv@vscht.cz
        </a>
      </footer>
    </div>
  );
}
