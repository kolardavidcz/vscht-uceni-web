import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, BookOpen, GraduationCap, ChevronRight, Terminal, Biohazard, Binary } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "VSCHT Učení - Rozcestník";
  }, []);

  return (
    <div className="min-h-screen bg-brand-espresso text-slate-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white relative overflow-hidden">
      {/* Background Glows (VŠCHT Pumpkin Spice Coffee Theme) */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-orange/15 blur-[120px] pointer-events-none animate-[pulse_10s_infinite_ease-in-out]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-mocha/30 blur-[140px] pointer-events-none animate-[pulse_15s_infinite_ease-in-out_2s]" />
      <div className="absolute top-[30%] left-[20%] w-[700px] h-[500px] rounded-full bg-brand-latte/10 blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center relative z-10 w-full">
        {/* Logo and Tagline */}
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs font-bold text-slate-350 tracking-wider uppercase backdrop-blur-md mb-2">
            <GraduationCap size={14} className="text-brand-orange" />
            <span>VŠCHT Praha • Studijní materiály a nástroje</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-amber-100">
            VSCHT Učení
          </h1>
          <p className="text-xs sm:text-base text-slate-200 font-semibold max-w-xl mx-auto leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            Interaktivní pomůcky a přehledné studijní materiály vytvořené studenty pro studenty. Zvolte sekci a začněte studovat.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animate-scale-in">
          
          {/* Card 1: Microbiology */}
          <Card 
            variant="dark"
            hoverEffects={true}
            onClick={() => navigate('/mikrobiologie')}
            className="p-6 sm:p-8 group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all duration-500" />
            
            <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange w-max border border-brand-orange/20 group-hover:scale-110 transition-transform duration-500">
              <Biohazard size={24} />
            </div>

            <h2 className="text-lg sm:text-xl font-black tracking-tight mt-6 mb-2 text-white group-hover:text-brand-orange transition-colors">
              Systematika bakterií
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-6 flex-1">
              Procvičujte si taxonomické zařazení a vlastnosti bakteriálních kmenů pomocí doplňování emoji. Obsahuje studijní režim a administraci.
            </p>

            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4 text-[10px] sm:text-xs font-black tracking-wider text-brand-orange group-hover:text-orange-405 uppercase gap-2">
              <span className="flex items-center gap-1.5">
                <ClipboardList size={14} />
                Pracovní list & kvíz
              </span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Card 2: Bioinformatics Wiki */}
          <Card 
            variant="dark"
            hoverEffects={true}
            onClick={() => navigate('/obor-bioinformatika')}
            className="p-6 sm:p-8 group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all duration-500" />

            <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange w-max border border-brand-orange/20 group-hover:scale-110 transition-transform duration-500">
              <BookOpen size={24} />
            </div>

            <h2 className="text-lg sm:text-xl font-black tracking-tight mt-6 mb-2 text-white group-hover:text-brand-orange transition-colors">
              Obor: Bioinformatika
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-3 flex-1">
              Studijní rozcestník, doporučená literatura, přednášky a odkazy z Moodle předmětů. Dynamicky načítáno a řazeno podle `.md` souborů.
            </p>

            {/* PA1 & AG1 Quick Links */}
            <div className="flex flex-wrap gap-2 mb-5 relative z-10" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => navigate('/obor-bioinformatika/pa1')}
                className="px-2.5 py-1 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange text-[10px] font-black tracking-wider uppercase rounded-md border border-brand-orange/20 hover:border-brand-orange/40 active:scale-95 transition-all cursor-pointer"
              >
                PA1
              </button>
              <button
                onClick={() => navigate('/obor-bioinformatika/ag1')}
                className="px-2.5 py-1 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 text-[10px] font-black tracking-wider uppercase rounded-md border border-orange-600/20 hover:border-orange-600/40 active:scale-95 transition-all cursor-pointer"
              >
                AG1
              </button>
              <button
                onClick={() => navigate('/obor-bioinformatika')}
                className="px-2.5 py-1 bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 text-[10px] font-black tracking-wider uppercase rounded-md border border-slate-500/20 hover:border-slate-500/40 active:scale-95 transition-all cursor-pointer"
              >
                Wiki
              </button>
            </div>

            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4 text-[10px] sm:text-xs font-black tracking-wider text-brand-orange group-hover:text-orange-400 uppercase gap-2">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} />
                Markdown Wiki & Moodle
              </span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Card 3: Python script & Bioinfo tool */}
          <Card 
            variant="dark"
            hoverEffects={true}
            onClick={() => navigate('/python-analyza')}
            className="p-6 sm:p-8 group flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/15 transition-all duration-500" />

            <div className="p-4 bg-brand-orange/10 rounded-2xl text-brand-orange w-max border border-brand-orange/20 group-hover:scale-110 transition-transform duration-500">
              <Terminal size={24} />
            </div>

            <h2 className="text-lg sm:text-xl font-black tracking-tight mt-6 mb-2 text-white group-hover:text-brand-orange transition-colors">
              Python Analyzátor
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed mb-6 flex-1">
              Spusťte interaktivní webovou analýzu nukleotidových sekvencí (GC obsah, transkripce, translace) nebo si zkopírujte lokální Python skript.
            </p>

            <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4 text-[10px] sm:text-xs font-black tracking-wider text-brand-orange group-hover:text-orange-400 uppercase gap-2">
              <span className="flex items-center gap-1.5">
                <Terminal size={14} />
                Analyzátor & Skripty
              </span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-orange/15 py-8 text-center text-xs text-slate-400 mt-auto relative z-10" style={{ background: '#0f0906', boxShadow: '0 -10px 30px rgba(249,93,18,0.04)' }}>
        <p>© 2026 VŠCHT Učení • Projekt pro podporu studia</p>
        <p className="mt-2 text-slate-400 flex items-center justify-center gap-2 flex-wrap">
          <span>Otázky a zpětná vazba:</span>
          <a href="mailto:kolarv@vscht.cz" className="text-brand-orange hover:text-brand-orange-text transition-colors">kolarv@vscht.cz</a>
        </p>
      </footer>
    </div>
  );
}
