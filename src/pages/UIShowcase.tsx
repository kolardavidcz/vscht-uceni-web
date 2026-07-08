import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Copy, Check, RotateCcw, Sparkles, BookOpen, 
  Layers, Table, ChevronRight, HelpCircle, AlertCircle, Info, ExternalLink
} from 'lucide-react';

export default function UIShowcase() {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'flashcards' | 'matrix' | 'docs'>('cards');
  
  // Showcase overall background theme
  const [pageTheme, setPageTheme] = useState<'light' | 'dark'>('dark');

  // Dynamic color palette states
  const [lightPal, setLightPal] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [darkPal, setDarkPal] = useState<'A' | 'B' | 'C' | 'D'>('D'); // Defaults to Prague Orange!
  
  // Background animation states
  const [enableFloat, setEnableFloat] = useState(true);
  
  // Card styling classes based on selected theme
  const cardClass = pageTheme === 'dark'
    ? 'card-surface-dark border border-slate-800 text-slate-100'
    : 'card-surface border border-slate-200 bg-white/90 text-slate-800 shadow-xs';
  
  // Card 1 hover spotlight states
  const card1Ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Flashcards state
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSlideRevealed, setIsSlideRevealed] = useState(false);
  const [flashcardRating, setFlashcardRating] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(65);

  // Matrix tab state
  const [sortField, setSortField] = useState<'name' | 'phylum' | 'gram' | 'pathogen'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string } | null>(null);

  // Docs tab state
  const [activeDocSection, setActiveDocSection] = useState<'intro' | 'variables' | 'functions'>('intro');
  const [fadeTransition, setFadeTransition] = useState(false);

  // Sample data for sortable matrix
  const [bacteriaList, setBacteriaList] = useState([
    { id: '1', name: 'Escherichia coli', phylum: 'Proteobacteria', gram: 'Gram-negativní', morphology: 'Tyčinka', metabolism: 'Fakultativní', pathogen: 'Ano (některé kmeny)', emoji: '🦠' },
    { id: '2', name: 'Bacillus subtilis', phylum: 'Firmicutes', gram: 'Gram-pozitivní', morphology: 'Tyčinka', metabolism: 'Aerobní', pathogen: 'Ne', emoji: '🥖' },
    { id: '3', name: 'Streptococcus pneumoniae', phylum: 'Firmicutes', gram: 'Gram-pozitivní', morphology: 'Kok', metabolism: 'Fakultativní', pathogen: 'Ano', emoji: '🍇' },
    { id: '4', name: 'Pseudomonas aeruginosa', phylum: 'Proteobacteria', gram: 'Gram-negativní', morphology: 'Tyčinka', metabolism: 'Aerobní', pathogen: 'Ano', emoji: '🧪' }
  ]);

  // Code sample
  const sampleCode = `#include <stdio.h>

int main() {
    // Ukázka bioinformatického výpočtu v C
    char dna[] = "ATGCGATCGATCGATCGATCGATCGATCGATC";
    int gc_count = 0;
    int total = 0;

    for (int i = 0; dna[i] != '\\0'; i++) {
        if (dna[i] == 'G' || dna[i] == 'C') {
            gc_count++;
        }
        total++;
    }

    double gc_content = (double)gc_count / total * 100.0;
    printf("GC Obsah: %.2f%%\\n", gc_content);
    return 0;
}`;

  // Copy code utility
  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Card spotlight handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card1Ref.current) return;
    const rect = card1Ref.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Sort function for Matrix
  const handleSort = (field: 'name' | 'phylum' | 'gram' | 'pathogen') => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedBacteria = [...bacteriaList].sort((a, b) => {
    const valA = a[sortField].toLowerCase();
    const valB = b[sortField].toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  }).filter(item => 
    item.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
    item.phylum.toLowerCase().includes(matrixSearch.toLowerCase())
  );

  // Transition helper for Doc switcher
  const handleDocSectionChange = (section: 'intro' | 'variables' | 'functions') => {
    setFadeTransition(true);
    setTimeout(() => {
      setActiveDocSection(section);
      setFadeTransition(false);
    }, 150);
  };

  return (
    <div 
      style={{
        // Light theme custom variables mapping
        '--light-primary': lightPal === 'A' ? '#0d9488' : lightPal === 'B' ? '#7c3aed' : lightPal === 'C' ? '#2563eb' : '#f95d12',
        '--light-bg-alpha': lightPal === 'A' ? 'rgba(13, 148, 136, 0.08)' : lightPal === 'B' ? 'rgba(124, 58, 237, 0.08)' : lightPal === 'C' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(249, 93, 18, 0.08)',
        '--light-border-alpha': lightPal === 'A' ? 'rgba(13, 148, 136, 0.2)' : lightPal === 'B' ? 'rgba(124, 58, 237, 0.2)' : lightPal === 'C' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(249, 93, 18, 0.2)',

        // Dark theme custom variables mapping
        '--dark-primary': darkPal === 'A' ? '#34d399' : darkPal === 'B' ? '#22d3ee' : darkPal === 'C' ? '#fbbf24' : '#f95d12',
        '--dark-secondary': darkPal === 'A' ? '#10b981' : darkPal === 'B' ? '#a78bfa' : darkPal === 'C' ? '#38bdf8' : '#fbbf24',
        '--dark-glow': darkPal === 'A' ? 'rgba(52, 211, 153, 0.12)' : darkPal === 'B' ? 'rgba(34, 211, 238, 0.12)' : darkPal === 'C' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(249, 93, 18, 0.12)',
        '--dark-bg-blob': darkPal === 'A' ? 'rgba(52, 211, 153, 0.08)' : darkPal === 'B' ? 'rgba(34, 211, 238, 0.08)' : darkPal === 'C' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(249, 93, 18, 0.08)',
      } as React.CSSProperties}
      className={`min-h-screen flex flex-col font-sans selection:bg-brand-orange selection:text-white relative overflow-hidden transition-colors duration-300 ${
        pageTheme === 'dark' ? 'bg-[#0f0906] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      
      {/* Background drifting glow blobs */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000`} 
        style={{
          background: 'var(--dark-bg-blob)',
          animation: enableFloat ? 'float-demo 15s infinite ease-in-out' : 'none',
          opacity: pageTheme === 'dark' ? 1 : 0.15
        }}
      />
      <div 
        className={`absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000`} 
        style={{
          background: 'var(--dark-bg-blob)',
          animation: enableFloat ? 'float-demo 20s infinite ease-in-out 2s' : 'none',
          opacity: pageTheme === 'dark' ? 1 : 0.15
        }}
      />

      {/* CSS Styles for Showcase Demos */}
      <style>{`
        @keyframes float-demo {
          0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
          50% { transform: translateY(-30px) scale(1.05) rotate(10deg); }
        }
        
        /* Rotating border animation */
        .rotating-border-card {
          position: relative;
          background: rgba(15, 23, 42, 0.7);
          border-radius: 1.5rem;
          overflow: hidden;
          z-index: 1;
        }
        .rotating-border-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            transparent 20%,
            var(--dark-primary) 40%,
            var(--dark-secondary) 50%,
            var(--dark-primary) 60%,
            transparent 80%
          );
          animation: border-rotate 6s linear infinite;
          z-index: -2;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .rotating-border-card:hover::before {
          opacity: 1;
        }
        .rotating-border-card::after {
          content: '';
          position: absolute;
          inset: 1px;
          background: rgba(15, 23, 42, 0.95);
          border-radius: calc(1.5rem - 1px);
          z-index: -1;
        }

        @keyframes border-rotate {
          100% { transform: rotate(360deg); }
        }

        /* Light Sweep reflection effect */
        .card-sweep {
          position: relative;
          overflow: hidden;
        }
        .card-sweep::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.75s;
        }
        .card-sweep:hover::before {
          left: 150%;
        }

        /* 3D Card Flip styles */
        .flip-container {
          perspective: 1000px;
          width: 100%;
          min-height: 220px;
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-active {
          transform: rotateY(180deg);
        }
        .flip-front, .flip-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .flip-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Header */}
      <header className={`${
        pageTheme === 'dark' ? 'page-header-dark bg-slate-950/80 border-slate-800' : 'page-header bg-opacity-95 bg-white border-slate-200'
      } sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                pageTheme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-205 border-slate-200 text-slate-700'
              }`}
              title="Zpět na rozcestník"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className={`text-lg sm:text-2xl font-black tracking-tight truncate ${
                pageTheme === 'dark' 
                  ? 'bg-clip-text text-transparent bg-linear-to-r from-white via-indigo-300 to-sky-200'
                  : 'text-slate-900'
              }`}>
                ✨ Interaktivní Prototypy & UI Showcase
              </h1>
              <p className={`text-xs sm:text-sm font-medium tracking-wide ${
                pageTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>Vyzkoušejte navrhované designové změny v reálném čase</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Background mode toggle */}
            <div className="flex items-center gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider hidden md:inline">Téma ukázky:</label>
              <button
                onClick={() => setPageTheme(pageTheme === 'dark' ? 'light' : 'dark')}
                className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  pageTheme === 'light' 
                    ? 'bg-slate-150 border-slate-300 text-slate-700 hover:bg-slate-200' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                {pageTheme === 'light' ? '☀️ Světlé' : '🌙 Tmavé'}
              </button>
            </div>

            <div className="h-6 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider hidden md:inline">Animace:</label>
              <button
                onClick={() => setEnableFloat(!enableFloat)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                  enableFloat ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {enableFloat ? 'Aktivní' : 'Vypnuto'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full z-10">
        
        {/* DYNAMIC COLOR PALETTE SELECTORS */}
        <div className={`p-5 mb-8 space-y-4 ${cardClass}`}>
          <div className="flex items-center gap-2" style={{ color: 'var(--light-primary)' }}>
            <Sparkles size={18} />
            <h3 className="text-xs font-black uppercase tracking-wider">Volba barevných palet (Vyzkoušejte všechny možnosti)</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Light Theme Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                🧪 Mikrobiologie (Světlý režim) — Vyberte paletu:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'A', label: 'Teal & Mint', colors: ['#0d9488', '#ecfdf5'] },
                  { key: 'B', label: 'Amethyst', colors: ['#7c3aed', '#f5f3ff'] },
                  { key: 'C', label: 'Ice Blue', colors: ['#2563eb', '#eff6ff'] },
                  { key: 'D', label: 'UCT Orange 🇨🇿', colors: ['#f95d12', '#fff7ed'] }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setLightPal(opt.key as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                      lightPal === opt.key 
                        ? 'border-white bg-slate-900 text-white font-black' 
                        : 'border-slate-850 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.colors[0] }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.colors[1] }} />
                    </div>
                    <span className="text-[10px] block truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Theme Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                🧬 Bioinformatika & Python (Tmavý režim) — Vyberte paletu:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'A', label: 'Cyber Forest', colors: ['#34d399', '#10b981'] },
                  { key: 'B', label: 'Nebula', colors: ['#22d3ee', '#a78bfa'] },
                  { key: 'C', label: 'Amber Code', colors: ['#fbbf24', '#38bdf8'] },
                  { key: 'D', label: 'UCT Orange 🇨🇿', colors: ['#f95d12', '#ea580c'] }
                ].map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setDarkPal(opt.key as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                      darkPal === opt.key 
                        ? 'border-white bg-slate-900 text-white font-black' 
                        : 'border-slate-850 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.colors[0] }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: opt.colors[1] }} />
                    </div>
                    <span className="text-[10px] block truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl max-w-2xl mb-8 border ${
          pageTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-200/60 border-slate-350'
        }`}>
          {[
            { id: 'cards', label: '1. Karta & Hover Efekty', icon: Layers },
            { id: 'flashcards', label: '2. Kartičky (Flip vs Slide)', icon: Sparkles },
            { id: 'matrix', label: '3. Matice (Sticky/Sort)', icon: Table },
            { id: 'docs', label: '4. Dokumentace & Code Block', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-650/20'
                    : pageTheme === 'dark'
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      : 'text-slate-650 hover:text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Icon size={14} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.label.split('.')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: CARD EFFECTS PROTOTYPES */}
        {activeTab === 'cards' && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Spotlight Glow Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dark-primary)' }} />
                    Spotlight Glow & Magnetický efekt
                  </h3>
                  <span 
                    style={{ color: 'var(--dark-primary)', borderColor: 'var(--dark-primary)', backgroundColor: 'var(--dark-glow)' }}
                    className="text-[10px] border px-2 py-0.5 rounded-full font-bold"
                  >
                    Prototyp s barevnými tóny
                  </span>
                </div>
                
                <div 
                  ref={card1Ref}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="card-surface-dark p-6 min-h-[220px] relative overflow-hidden group cursor-pointer border border-white/5 hover:scale-[1.02] duration-300"
                  style={{
                    borderColor: isHovered ? 'var(--dark-primary)' : 'rgba(255,255,255,0.05)',
                    boxShadow: isHovered ? `0 20px 50px var(--dark-glow)` : 'none'
                  }}
                >
                  {/* Spotlight Radial Background using CSS Variables */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, var(--dark-glow), transparent 80%)`
                    }}
                  />

                  <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                    <div>
                      <div 
                        style={{ backgroundColor: 'var(--dark-glow)', borderColor: 'var(--dark-primary)', color: 'var(--dark-primary)' }}
                        className="p-3.5 rounded-2xl border w-fit group-hover:scale-110 transition-all duration-300"
                      >
                        <Sparkles size={20} />
                      </div>
                      <h4 
                        style={{ color: isHovered ? 'var(--dark-primary)' : 'white' }}
                        className="text-lg font-black tracking-tight mt-4 transition-colors"
                      >
                        Spotlight Karta
                      </h4>
                      <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                        Pohybujte myší nad touto kartou. Kruhový světelný kužel (spotlight) následuje pozici vašeho kurzoru a vytváří úžasný efekt hloubky.
                      </p>
                    </div>
                    <div 
                      style={{ color: 'var(--dark-primary)' }}
                      className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mt-4"
                    >
                      Vyzkoušet pohyb
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Navrženo pro rozcestníky a hlavní navigační panely pro moderní "wow" efekt.</p>
              </div>

              {/* Rotating Gradient Border & Shine Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--dark-secondary)' }} />
                    Rotating Gradient Border & Sweep Shine
                  </h3>
                  <span 
                    style={{ color: 'var(--dark-secondary)', borderColor: 'var(--dark-secondary)', backgroundColor: 'var(--dark-bg-blob)' }}
                    className="text-[10px] border px-2 py-0.5 rounded-full font-bold"
                  >
                    Prototyp Home
                  </span>
                </div>

                <div className="rotating-border-card card-sweep p-6 min-h-[220px] group cursor-pointer duration-300 hover:scale-[1.02] flex flex-col justify-between">
                  <div className="relative z-10 flex flex-col justify-between h-full min-h-[170px]">
                    <div>
                      <div 
                        style={{ backgroundColor: 'var(--dark-bg-blob)', borderColor: 'var(--dark-secondary)', color: 'var(--dark-secondary)' }}
                        className="p-3.5 rounded-2xl border w-fit group-hover:scale-110 transition-all duration-300"
                      >
                        <Layers size={20} />
                      </div>
                      <h4 
                        style={{ color: 'white' }}
                        className="text-lg font-black tracking-tight mt-4 group-hover:text-slate-200 transition-colors"
                      >
                        Sweep & Border Gradient
                      </h4>
                      <p className="text-sm text-slate-400 mt-2 font-medium leading-relaxed">
                        Najeďte myší nad kartu. Karta aktivuje rotující barevný okraj a přes její povrch přeběhne rychlý odlesk světla (shine sweep).
                      </p>
                    </div>
                    <div 
                      style={{ color: 'var(--dark-secondary)' }}
                      className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mt-4"
                    >
                      Vyzkoušet najetí
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Používá hardwarově akcelerované CSS gradienty. Vhodné pro prémiové zvýraznění nejdůležitější sekce.</p>
              </div>

            </div>

            {/* Entrance animations prototype selector */}
            <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl mt-4">
              <h4 className="text-sm font-bold text-slate-350 mb-3 uppercase tracking-wider">Simulace sekvenčního načítání (Stagger entrance)</h4>
              <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
                Home page karty se v současnosti objevují najednou. Zde je ukázka navrhovaného kaskádového efektu (stagger delay 100ms), který dává stránce plynulejší pocit z načítání.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <button 
                  onClick={() => {
                    const el = document.getElementById('stagger-demo-box');
                    if (el) {
                      el.style.opacity = '0';
                      setTimeout(() => el.style.opacity = '1', 50);
                    }
                  }} 
                  className="btn-primary text-xs"
                >
                  <RotateCcw size={14} />
                  Znovu spustit animaci
                </button>
              </div>

              <div id="stagger-demo-box" className="grid grid-cols-3 gap-4 transition-opacity duration-150">
                {[
                  { title: 'Karta 1', color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5', delay: 'animate-[scale-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]' },
                  { title: 'Karta 2', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5', delay: 'animate-[scale-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)_100ms_both]' },
                  { title: 'Karta 3', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5', delay: 'animate-[scale-in_0.3s_cubic-bezier(0.34,1.56,0.64,1)_200ms_both]' }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 border rounded-xl font-black text-center text-xs uppercase tracking-widest ${item.color} ${item.delay}`}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: FLASHCARD COMPARISON & COMPLETION */}
        {activeTab === 'flashcards' && (
          <div className="space-y-8 animate-fade-in-up">
            
            <div className="p-4 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl text-xs text-indigo-300 font-medium">
              💡 <strong>Porovnání konceptů:</strong> Vyzkoušejte si, jak se liší tradiční odhalování odpovědi pod otázkou (Slide-reveal) a moderní 3D otočení kartičky (3D Flip).
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Option A: 3D Flip Card */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md" style={{ backgroundColor: 'var(--light-primary)' }} />
                    Možnost A: 3D Card Flip
                  </h3>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full font-bold">Doporučeno</span>
                </div>

                <div className="flip-container cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`flip-inner ${isFlipped ? 'flip-active' : ''}`}>
                    
                    {/* Front of Card */}
                    <div className={`flip-front p-6 flex flex-col justify-between text-left h-full ${cardClass}`}>
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Otázka 12/45 • Kmen</span>
                          <span className="text-xs">❓</span>
                        </div>
                        <h4 className={`text-xl font-black mt-4 ${pageTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Firmicutes</h4>
                        <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                          Popište hlavní morfologické a fyziologické vlastnosti tohoto kmenu, zejména barvení buněčné stěny a schopnost tvorby klidových stadií.
                        </p>
                      </div>
                      <div 
                        style={{ color: 'var(--light-primary)' }}
                        className="text-[10px] font-black uppercase tracking-wider flex items-center justify-between mt-4"
                      >
                        <span>Klikněte pro odhalení odpovědi</span>
                        <span>Otočit ↻</span>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div 
                      style={{ borderColor: 'var(--light-border-alpha)' }}
                      className={`flip-back p-6 flex flex-col justify-between text-left h-full ${cardClass} ${pageTheme === 'light' ? 'bg-white' : 'bg-slate-950'}`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span style={{ color: 'var(--light-primary)' }} className="text-[9px] font-black uppercase tracking-wider">Odpověď • Firmicutes</span>
                          <span className="text-xs text-emerald-400">✓</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-md">🟣 G+</span>
                          <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider rounded-md">🌭 Tyčinky/Koky</span>
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-md">🛡️ Tvoří spory</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">
                          Nízký obsah G+C v DNA. Obsahuje rody Bacillus a Clostridium (tyčinky) a Streptococcus/Staphylococcus (koky).
                        </p>
                      </div>
                      
                      <div 
                        style={{ color: 'var(--light-primary)' }}
                        className="text-[10px] font-black uppercase tracking-wider flex items-center justify-between mt-4"
                      >
                        <span>Klikněte pro návrat k otázce</span>
                        <span>Otočit ↺</span>
                      </div>
                    </div>

                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Hmatový, herní pocit. Skvělé pro rychlé testování (kartička se chová jako fyzický papírek).</p>
              </div>

              {/* Option B: Slide-reveal Panel */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-md bg-purple-500" />
                    Možnost B: Slide-reveal Panel
                  </h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold">Zachovává kontext</span>
                </div>

                <div 
                  className={`p-6 flex flex-col justify-between text-left min-h-[220px] transition-all cursor-pointer ${cardClass}`}
                  onClick={() => setIsSlideRevealed(!isSlideRevealed)}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Otázka 12/45 • Kmen</span>
                      <span className="text-xs">❓</span>
                    </div>
                    <h4 className="text-xl font-black text-white mt-4">Firmicutes</h4>
                    <p className="text-xs text-slate-400 mt-2 font-medium leading-relaxed">
                      Popište hlavní morfologické a fyziologické vlastnosti tohoto kmenu, zejména barvení buněčné stěny a schopnost tvorby klidových stadií.
                    </p>

                    <div className={`mt-4 pt-4 border-t border-slate-800 transition-all duration-300 origin-top overflow-hidden ${
                      isSlideRevealed ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-md">🟣 G+</span>
                        <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-wider rounded-md">🌭 Tyčinky/Koky</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider rounded-md">🛡️ Tvoří spory</span>
                      </div>
                      <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                        Odpověď: Nízký obsah G+C v DNA. Obsahuje rody Bacillus a Clostridium a Streptococcus.
                      </p>
                    </div>
                  </div>
                  
                  {!isSlideRevealed && (
                    <div className="text-[10px] font-black uppercase tracking-wider text-purple-400 mt-4 flex items-center justify-between">
                      <span>Klikněte pro zobrazení odpovědi pod otázkou</span>
                      <span>Zobrazit ↓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">Udržuje otázku i odpověď viditelné najednou na obrazovce. Lepší pro dlouhé texty.</p>
              </div>

            </div>

            {/* Self-Rating buttons visual design */}
            <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider mb-3">Interaktivní Ohodnocení & Vizuální Progress Bar</h4>
              
              <div className="mb-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Průchod balíčkem</span>
                  <span>{currentProgress}% Hotovo</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 p-[1px]">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${currentProgress}%`, backgroundColor: 'var(--light-primary)' }}
                  />
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={currentProgress} 
                  onChange={(e) => setCurrentProgress(Number(e.target.value))} 
                  className="w-full accent-indigo-500 h-1 cursor-pointer bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'hard', label: 'Neumím', color: 'border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10' },
                  { key: 'medium', label: 'Skoro', color: 'border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10' },
                  { key: 'easy', label: 'Umím!', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10' }
                ].map(rating => (
                  <button
                    key={rating.key}
                    onClick={() => setFlashcardRating(rating.key)}
                    style={{
                      borderColor: flashcardRating === rating.key ? 'var(--light-primary)' : ''
                    }}
                    className={`p-3 border rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex flex-col items-center gap-1 ${rating.color} ${
                      flashcardRating === rating.key ? 'ring-2 ring-indigo-500 scale-[1.03]' : ''
                    }`}
                  >
                    <span>{rating.label}</span>
                    {flashcardRating === rating.key && <span className="text-[9px] font-bold text-slate-300">Zvoleno</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Test completion modal mockup */}
            <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider">Závěrečná statistika (konec balíčku)</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">Aktuálně se po dojetí otázek spustí pouze systémové okno alert(). Navrhujeme tento plnohodnotný přehled.</p>
              </div>
              <button 
                onClick={() => setShowCompletionModal(!showCompletionModal)}
                className="btn-primary text-xs whitespace-nowrap"
              >
                {showCompletionModal ? 'Skrýt přehled' : 'Zobrazit přehled'}
              </button>
            </div>

            {showCompletionModal && (
              <div 
                style={{ borderColor: 'var(--light-border-alpha)' }}
                className={`p-6 max-w-md mx-auto text-center space-y-4 animate-scale-in ${cardClass}`}
              >
                <div 
                  style={{ color: 'var(--light-primary)', backgroundColor: 'var(--light-bg-alpha)', borderColor: 'var(--light-border-alpha)' }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto border"
                >
                  🎉
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Balíček dokončen!</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Gratulujeme k projití všech kartiček kmenu Firmicutes.</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-850">
                  <div>
                    <span className="text-sm font-black text-emerald-400">18</span>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Umím</p>
                  </div>
                  <div>
                    <span className="text-sm font-black text-amber-400">7</span>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Skoro</p>
                  </div>
                  <div>
                    <span className="text-sm font-black text-rose-400">4</span>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Neumím</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setFlashcardRating(null);
                      setShowCompletionModal(false);
                    }} 
                    style={{ backgroundColor: 'var(--light-primary)' }}
                    className="btn-primary text-xs flex-1 border-0"
                  >
                    Spustit znovu
                  </button>
                  <button 
                    onClick={() => setShowCompletionModal(false)}
                    className="btn-secondary text-xs flex-1 bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-350"
                  >
                    Zavřít
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: MATRIX & STICKY GRID */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-fade-in-up">
            
            <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl text-xs text-emerald-300 font-medium">
              💡 <strong>Novinky v matici:</strong> Kliknutím na záhlaví sloupců můžete tabulku řadit. První sloupec je fixní při horizontálním scrollu. Sloupce jsou barevně kódovány a buňky ✓ mají zvýšený kontrast s tooltipem.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Hledat bakterii..."
                value={matrixSearch}
                onChange={(e) => setMatrixSearch(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Zobrazeno {sortedBacteria.length} / {bacteriaList.length} taxonů
              </div>
              {matrixSearch && (
                <button 
                  onClick={() => setMatrixSearch('')}
                  className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Zrušit filtr
                </button>
              )}
            </div>

            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80 shadow-lg relative max-w-full overflow-x-auto">
              
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-[9px] font-black uppercase tracking-wider select-none">
                    <th className="p-3 sticky left-0 bg-slate-900 text-slate-400 z-20 w-44">Taxon</th>
                    <th className="p-3 text-slate-400">Kategorie</th>
                    
                    <th colSpan={2} className="p-3 text-center bg-purple-500/10 text-purple-400 border-x border-slate-800">
                      Morfologie
                    </th>
                    
                    <th colSpan={2} className="p-3 text-center bg-teal-500/10 text-teal-400">
                      Metabolismus
                    </th>
                    
                    <th className="p-3 text-center bg-rose-500/10 text-rose-400 border-l border-slate-800">Patogen</th>
                  </tr>
                  
                  <tr className="border-b border-slate-800 bg-slate-905 text-[10px] font-bold text-slate-400">
                    <th 
                      onClick={() => handleSort('name')}
                      className="p-3 sticky left-0 bg-slate-900 hover:text-white cursor-pointer select-none z-20 w-44 border-r border-slate-850"
                    >
                      Jméno {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    <th 
                      onClick={() => handleSort('phylum')}
                      className="p-3 hover:text-white cursor-pointer select-none"
                    >
                      Zařazení {sortField === 'phylum' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                    
                    <th className="p-3 text-center bg-purple-500/5 border-l border-slate-800">Gram barvení</th>
                    <th className="p-3 text-center bg-purple-500/5 border-r border-slate-800">Tvar</th>
                    
                    <th className="p-3 text-center bg-teal-500/5">Aerobní</th>
                    <th className="p-3 text-center bg-teal-500/5 border-r border-slate-800">Fakultativní</th>
                    
                    <th 
                      onClick={() => handleSort('pathogen')}
                      className="p-3 text-center bg-rose-500/5 hover:text-white cursor-pointer select-none"
                    >
                      Riziko {sortField === 'pathogen' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  </tr>
                </thead>
                
                <tbody className="text-xs font-medium text-slate-300">
                  {sortedBacteria.map((bacteria) => (
                    <tr 
                      key={bacteria.id}
                      className="border-b border-slate-850/50 hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="p-3 sticky left-0 bg-slate-950 font-black text-white z-10 border-r border-slate-850">
                        <span className="mr-1.5">{bacteria.emoji}</span>
                        {bacteria.name}
                      </td>
                      <td className="p-3 text-slate-450">
                        <span 
                          style={{ color: 'var(--light-primary)', borderColor: 'var(--light-border-alpha)', backgroundColor: 'var(--light-bg-alpha)' }}
                          className="text-[10px] border px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
                        >
                          {bacteria.phylum}
                        </span>
                      </td>
                      
                      <td 
                        onMouseEnter={() => setHoveredCell({ row: bacteria.id, col: 'gram' })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-3 text-center border-l border-slate-850 relative ${
                          bacteria.gram === 'Gram-negativní' ? 'bg-rose-500/5 text-rose-300' : 'bg-blue-500/5 text-blue-300'
                        }`}
                      >
                        {bacteria.gram === 'Gram-negativní' ? '🔴 G-' : '🔵 G+'}
                        {hoveredCell?.row === bacteria.id && hoveredCell?.col === 'gram' && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 bg-slate-900 border border-slate-800 text-[10px] text-white p-2 rounded-lg shadow-xl whitespace-nowrap">
                            Barvení stěny: <strong>{bacteria.gram}</strong>
                          </div>
                        )}
                      </td>
                      
                      <td className="p-3 text-center border-r border-slate-850">{bacteria.morphology}</td>
                      
                      <td 
                        onMouseEnter={() => setHoveredCell({ row: bacteria.id, col: 'aerobic' })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-3 text-center relative ${
                          bacteria.metabolism === 'Aerobní' ? 'text-emerald-400 font-bold' : 'text-slate-600'
                        }`}
                        style={{
                          backgroundColor: bacteria.metabolism === 'Aerobní' ? 'var(--light-bg-alpha)' : ''
                        }}
                      >
                        {bacteria.metabolism === 'Aerobní' ? '✓' : '—'}
                        {hoveredCell?.row === bacteria.id && hoveredCell?.col === 'aerobic' && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 bg-slate-900 border border-slate-800 text-[10px] text-white p-2 rounded-lg shadow-xl whitespace-nowrap">
                            Aerobní metabolismus: <strong>{bacteria.metabolism === 'Aerobní' ? 'ANO' : 'NE'}</strong>
                          </div>
                        )}
                      </td>

                      <td 
                        onMouseEnter={() => setHoveredCell({ row: bacteria.id, col: 'facultative' })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`p-3 text-center border-r border-slate-850 relative ${
                          bacteria.metabolism === 'Fakultativní' ? 'text-emerald-400 font-bold' : 'text-slate-650'
                        }`}
                        style={{
                          backgroundColor: bacteria.metabolism === 'Fakultativní' ? 'var(--light-bg-alpha)' : ''
                        }}
                      >
                        {bacteria.metabolism === 'Fakultativní' ? '✓' : '—'}
                        {hoveredCell?.row === bacteria.id && hoveredCell?.col === 'facultative' && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 bg-slate-900 border border-slate-800 text-[10px] text-white p-2 rounded-lg shadow-xl whitespace-nowrap">
                            Fakultativní metabolismus: <strong>{bacteria.metabolism === 'Fakultativní' ? 'ANO' : 'NE'}</strong>
                          </div>
                        )}
                      </td>
                      
                      <td className={`p-3 text-center ${
                        bacteria.pathogen.startsWith('Ano') ? 'bg-rose-500/10 text-rose-455 font-bold' : 'text-emerald-400'
                      }`}>
                        {bacteria.pathogen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTATION & CODE COPY TOOLS */}
        {activeTab === 'docs' && (
          <div className="space-y-6 animate-fade-in-up">
            
            <div className="p-4 bg-sky-955/20 border border-sky-900/40 rounded-2xl text-xs text-sky-300 font-medium">
              💡 <strong>Novinky v dokumentaci:</strong> Ukázka drobečkové navigace (Breadcrumbs), jemného crossfadu při přepnutí kapitol a kopírování kódu z bloků na jedno kliknutí.
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Navigace (Breadcrumbs)</h4>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-900/40 border border-slate-800/80 px-3 py-2 rounded-xl w-fit">
                <span className="hover:text-indigo-400 cursor-pointer">AG1</span>
                <span>/</span>
                <span className="hover:text-indigo-400 cursor-pointer">Přednášky</span>
                <span>/</span>
                <span className="text-slate-200">01-slozitost.md</span>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Sekce dokumentu</h4>
                <div className="flex flex-col gap-1">
                  {[
                    { id: 'intro', label: '1. Úvod do složitosti' },
                    { id: 'variables', label: '2. Velká O notace' },
                    { id: 'functions', label: '3. Příklady výpočtů' }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => handleDocSectionChange(sec.id as any)}
                      style={{
                        color: activeDocSection === sec.id ? 'var(--dark-primary)' : '',
                        borderColor: activeDocSection === sec.id ? 'var(--dark-primary)' : '',
                        backgroundColor: activeDocSection === sec.id ? 'var(--dark-glow)' : ''
                      }}
                      className={`text-left px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeDocSection === sec.id 
                          ? 'border-l-2 pl-4.5' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-[10px] font-black text-slate-505 uppercase tracking-wider">Zobrazený obsah (s crossfadem)</h4>
                  <span className="text-[9px] text-slate-500 font-bold">Kapitola {activeDocSection === 'intro' ? '1' : activeDocSection === 'variables' ? '2' : '3'}</span>
                </div>

                <div className={`p-6 min-h-[140px] transition-opacity duration-150 ${cardClass} ${
                  fadeTransition ? 'opacity-0' : 'opacity-100'
                }`}>
                  {activeDocSection === 'intro' && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white">Úvod do asymtotické složitosti</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Asymptotická složitost popisuje chování algoritmů při růstu velikosti vstupních dat ($N$). Zajímají nás hlavně časové nároky v nejhorším možném případě (worst-case scenario), což nám dává garanci horního odhadu doby běhu.
                      </p>
                    </div>
                  )}
                  {activeDocSection === 'variables' && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white">Definice Velké O</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Řekneme, že funkce $f(N)$ je $O(g(N))$, pokud existují kladné konstanty $c$ a $n_0$ takové, že pro všechna $N \ge n_0$ platí:
                      </p>
                      <div 
                        style={{ color: 'var(--dark-primary)', borderColor: 'var(--dark-border-alpha)' }}
                        className="bg-slate-900/80 p-2.5 rounded-lg border text-center font-mono text-xs"
                      >
                        f(N) ≤ c × g(N)
                      </div>
                    </div>
                  )}
                  {activeDocSection === 'functions' && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-white">Příklady algoritmů</h3>
                      <ul className="text-xs text-slate-400 leading-relaxed font-medium list-disc list-inside space-y-1">
                        <li><strong>O(1)</strong> — Přístup k prvku v poli indexem</li>
                        <li><strong>O(log N)</strong> — Binární vyhledávání v seřazeném poli</li>
                        <li><strong>O(N)</strong> — Nalezení minima v neseřazeném poli</li>
                        <li><strong>O(N log N)</strong> — Efektivní třídění (Merge Sort, Quick Sort)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Kód s kopírováním (Prototyp)</h4>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check size={12} className="text-emerald-400 animate-bounce-subtle" />
                      <span className="text-emerald-400">Zkopírováno!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Kopírovat kód</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed shadow-inner">
                {sampleCode}
              </pre>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-brand-orange/15 bg-brand-espresso py-6 text-center text-xs text-slate-450 mt-12 shadow-[0_-8px_24px_rgba(249,93,18,0.04)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 VŠCHT Učení • UI Showcase</div>
          <div className="flex gap-4">
            <a href="mailto:kolarv@vscht.cz" className="hover:text-brand-orange transition-colors">kolarv@vscht.cz</a>
            <span className="text-slate-800">|</span>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[9px] bg-brand-roast px-2 py-0.5 rounded-md">VŠCHT Praha</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
