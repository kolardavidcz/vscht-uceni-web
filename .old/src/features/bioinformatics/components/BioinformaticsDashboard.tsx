import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Menu, FileText, FolderOpen } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { parseMarkdown } from '../utils/markdownParser';
import { PA2ToAG1Overview } from './PA2ToAG1Overview';
import config from '../content/config.json';

// Vite magic: Eager glob load of all Markdown materials under content folder
const rawFiles = import.meta.glob('/src/features/bioinformatics/content/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

interface Material {
  filePath: string;
  fileName: string;
  courseKey?: string;      // e.g. "pa1"
  subcategoryKey?: string; // e.g. "prednasky"
  subcategoryLabel?: string; // e.g. "Přednášky"
  folderKey: string;       // e.g. "1-semestr" or "pa1"
  folderLabel: string;     // e.g. "1. Semestr" or "PA1"
  fileKey: string;         // e.g. "shell"
  title: string;           // First H1 or formatted filename
  content: string;
}

export function BioinformaticsDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  // Helper to format course URLs
  const getMaterialUrl = (item: Material) => {
    if (item.courseKey && item.subcategoryKey) {
      return `/obor-bioinformatika/${item.courseKey}/${item.subcategoryKey}/${item.fileKey}`;
    } else if (item.courseKey) {
      return `/obor-bioinformatika/${item.courseKey}/${item.fileKey}`;
    } else {
      return `/obor-bioinformatika/${item.fileKey}`;
    }
  };

  // Parse glob files into structured documents
  const materials = useMemo((): Material[] => {
    const items: Material[] = [];
    
    for (const [filePath, content] of Object.entries(rawFiles)) {
      const contentParts = filePath.split('/content/');
      const relativePath = contentParts[1] || '';
      const segments = relativePath.split('/');
      
      let folderKey = '0-obecne';
      let fileName = 'doc.md';
      let fileKey = 'doc';
      let courseKey: string | undefined = undefined;
      let subcategoryKey: string | undefined = undefined;
      let subcategoryLabel: string | undefined = undefined;

      if (segments.length === 2) {
        // Flat folder structure: e.g. "1-semestr/shell.md"
        folderKey = segments[0];
        fileName = segments[1];
        fileKey = fileName.replace('.md', '');
      } else if (segments.length >= 3) {
        // Nested course structure: e.g. "pa1/prednasky/01-uvod.md"
        courseKey = segments[0];
        subcategoryKey = segments[1];
        folderKey = courseKey;
        fileName = segments[segments.length - 1];
        fileKey = fileName.replace('.md', '');
      } else if (segments.length === 1) {
        fileName = segments[0] || 'doc.md';
        fileKey = fileName.replace('.md', '');
      }

      // Parse folder human label
      let folderLabel = folderKey;
      const categoryConfig = (config.categories as any)[folderKey];
      if (categoryConfig && categoryConfig.label) {
        folderLabel = categoryConfig.label;
      } else {
        if (folderKey.startsWith('0-')) {
          folderLabel = 'Obecné informace';
        } else if (folderKey === 'pre-ag1') {
          folderLabel = 'PA2 / Příprava na AG1';
        } else if (folderKey === 'pa1') {
          folderLabel = 'PA1 - Programování a Algoritmy 1';
        } else if (folderKey === 'ag1') {
          folderLabel = 'AG1 - Algoritmy a Grafy 1';
        } else if (folderKey.includes('semestr')) {
          const num = folderKey.split('-')[0];
          folderLabel = `${num}. semestr`;
        }
      }

      // Predefined Czech translations for subcategories
      if (subcategoryKey) {
        if (categoryConfig?.subcategories?.[subcategoryKey]?.label) {
          subcategoryLabel = categoryConfig.subcategories[subcategoryKey].label;
        } else {
          const subTranslations: Record<string, string> = {
            'prednasky': 'Přednášky',
            'cviceni': 'Cvičení',
            'progtest': 'Progtest / Úkoly',
            'zkouska': 'Příprava na zkoušku',
            'projekty': 'Projekty'
          };
          subcategoryLabel = subTranslations[subcategoryKey] || (subcategoryKey.charAt(0).toUpperCase() + subcategoryKey.slice(1));
        }
      }

      // Parse title from first H1 or make it readable
      let title = fileKey.charAt(0).toUpperCase() + fileKey.slice(1).replace(/-/g, ' ');
      
      if (categoryConfig?.files?.[fileKey]?.title) {
        title = categoryConfig.files[fileKey].title;
      } else {
        const h1Match = content.match(/^#\s+(.*)$/m);
        if (h1Match && h1Match[1]) {
          title = h1Match[1].trim();
        }
      }

      items.push({
        filePath,
        fileName,
        courseKey,
        subcategoryKey,
        subcategoryLabel,
        folderKey,
        folderLabel,
        fileKey,
        title,
        content
      });
    }

    // Sort: 0-obecne first, then PA1/AG1/PA2, then by semester number, then by fileKey
    return items.sort((a, b) => {
      if (a.folderKey !== b.folderKey) {
        const orderA = (config.categories as any)[a.folderKey]?.order ?? 999;
        const orderB = (config.categories as any)[b.folderKey]?.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.folderKey.localeCompare(b.folderKey);
      }
      
      if (a.subcategoryKey !== b.subcategoryKey) {
         const catConfigA = (config.categories as any)[a.folderKey];
         const subOrderA = catConfigA?.subcategories?.[a.subcategoryKey || '']?.order ?? 999;
         const subOrderB = catConfigA?.subcategories?.[b.subcategoryKey || '']?.order ?? 999;
         if (subOrderA !== subOrderB) return subOrderA - subOrderB;
         return (a.subcategoryKey || '').localeCompare(b.subcategoryKey || '');
      }

      const catConfig = (config.categories as any)[a.folderKey];
      const orderA = catConfig?.files?.[a.fileKey]?.order ?? 999;
      const orderB = catConfig?.files?.[b.fileKey]?.order ?? 999;
      
      if (orderA !== orderB) return orderA - orderB;
      return a.fileKey.localeCompare(b.fileKey);
    });
  }, []);

  // Filter materials based on search query
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const query = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(query) ||
        m.content.toLowerCase().includes(query) ||
        m.folderLabel.toLowerCase().includes(query) ||
        (m.subcategoryLabel && m.subcategoryLabel.toLowerCase().includes(query))
      );
    });
  }, [materials, searchQuery]);

  // Group materials by folder
  const groupedMaterials = useMemo(() => {
    const groups: Record<string, { label: string; items: Material[]; isCourse: boolean }> = {};
    
    for (const item of filteredMaterials) {
      if (!groups[item.folderKey]) {
        groups[item.folderKey] = {
          label: item.folderLabel,
          items: [],
          isCourse: !!item.courseKey
        };
      }
      groups[item.folderKey].items.push(item);
    }
    
    return groups;
  }, [filteredMaterials]);

  const sortedGroupedEntries = useMemo(() => {
    return Object.entries(groupedMaterials).sort(([keyA, valA], [keyB, valB]) => {
      const orderA = (config.categories as any)[keyA]?.order ?? 999;
      const orderB = (config.categories as any)[keyB]?.order ?? 999;
      
      if (orderA !== orderB) return orderA - orderB;
      return valA.label.localeCompare(valB.label);
    });
  }, [groupedMaterials]);

  // Helper to group course items by subcategory
  const getCourseSubcategories = (items: Material[]) => {
    const subs: Record<string, { label: string; items: Material[] }> = {};
    for (const item of items) {
      const subKey = item.subcategoryKey || 'general';
      const subLabel = item.subcategoryLabel || 'Ostatní';
      if (!subs[subKey]) {
        subs[subKey] = {
          label: subLabel,
          items: []
        };
      }
      subs[subKey].items.push(item);
    }
    return subs;
  };

  // Determine currently active material
  const activeMaterial = useMemo((): Material | null => {
    if (materials.length === 0) return null;
    
    const pathParts = window.location.pathname.split('/obor-bioinformatika/');
    const relativePath = pathParts[1] || '';
    if (!relativePath) {
      return materials[0];
    }

    const segments = relativePath.split('/');
    
    // Match based on parameters
    let found = materials.find(m => {
      if (segments.length === 1) {
        return !m.courseKey && m.fileKey === segments[0];
      } else if (segments.length === 2) {
        return m.courseKey === segments[0] && !m.subcategoryKey && m.fileKey === segments[1];
      } else if (segments.length >= 3) {
        return m.courseKey === segments[0] && m.subcategoryKey === segments[1] && m.fileKey === segments[2];
      }
      return false;
    });

    if (!found && segments.length === 1) {
      // Fallback: if segments[0] is a course key (e.g. 'pa1'), find its first document
      const courseDoc = materials.find(m => m.courseKey === segments[0]);
      if (courseDoc) return courseDoc;
    }

    return found || materials[0];
  }, [materials, window.location.pathname]);

  // Redirect to first material if no material key is in URL on mount/update
  useEffect(() => {
    const pathParts = window.location.pathname.split('/obor-bioinformatika/');
    const relativePath = pathParts[1] || '';
    if (!relativePath && materials.length > 0) {
      navigate(`/obor-bioinformatika/${materials[0].fileKey}`, { replace: true });
    }
  }, [materials, navigate]);

  // Set document title dynamically based on active material
  useEffect(() => {
    if (activeMaterial) {
      document.title = `${activeMaterial.title} - Tipy Bioinformatika`;
    } else {
      document.title = "Tipy Bioinformatika";
    }
  }, [activeMaterial]);

  // Trigger MathJax rendering when active document changes, with a small delay to let React finish DOM updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof (window as any).MathJax !== 'undefined') {
        (window as any).MathJax.typesetPromise?.();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeMaterial]);

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50/20 via-slate-50 to-amber-50/20 text-slate-800 antialiased selection:bg-brand-orange selection:text-white flex flex-col">
      {/* Header */}
      <header className="page-header bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost shrink-0"
              title="Zpět na rozcestník"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight truncate bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-amber-100">
                🧬 Obor: Bioinformatika a chemická informatika
              </h1>
              <p className="text-brand-peach text-[10px] sm:text-xs font-medium tracking-wide">Materiály, studijní tipy a návody pro programování, algoritmy a wiki</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="block lg:hidden p-2.5 bg-white/10 hover:bg-white/20 active:scale-95 rounded-xl border border-white/10 cursor-pointer text-brand-peach"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Navigation Sidebar (Desktop) / Dropdown (Mobile) */}
        <aside className={`lg:w-80 shrink-0 flex flex-col gap-4 lg:block ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <Card className="p-4 space-y-4 h-full flex flex-col">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Hledat v materiálech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-brand-orange rounded-xl outline-hidden transition-all text-xs font-semibold"
              />
            </div>

            {/* Folder Hierarchy list */}
            <nav className="space-y-3 flex-1 pr-1">
              {sortedGroupedEntries.map(([folderKey, group]) => {
                const isCourse = group.isCourse;

                if (isCourse) {
                  const subcategories = getCourseSubcategories(group.items);

                  return (
                    <div key={folderKey} className="space-y-1">
                      {/* Course Header — Static (Always expanded) */}
                      <div className="w-full flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 py-1.5 bg-slate-100/50 rounded-lg border border-slate-200/85">
                        <span className="flex items-center gap-1.5">
                          <FolderOpen size={12} className="text-brand-orange" />
                          <span>{group.label}</span>
                        </span>
                      </div>

                      {/* Course Subcategories Content — Always visible */}
                      <div className="space-y-2 pl-2 border-l border-slate-200 ml-2 mt-1 animate-scale-in">
                        {Object.entries(subcategories).map(([subKey, sub]) => {
                          return (
                            <div key={subKey} className="space-y-1">
                              {/* Subcategory Header — Static */}
                              <div className="w-full flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-wider px-2 py-0.5">
                                <span>{sub.label}</span>
                              </div>

                              {/* Documents list */}
                              <div className="space-y-0.5 pl-1.5 border-l border-slate-200 ml-1.5 animate-scale-in">
                                {sub.items.map(item => {
                                  const isActive = activeMaterial?.filePath === item.filePath;
                                  return (
                                    <button
                                      key={item.filePath}
                                      onClick={() => {
                                        navigate(getMaterialUrl(item));
                                        setMobileMenuOpen(false);
                                      }}
                                      className="w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer group bg-transparent text-slate-655 hover:text-slate-900 hover:bg-slate-100"
                                      style={isActive ? { background: '#f95d12', color: 'white', boxShadow: '0 4px 6px -1px rgba(249, 93, 18, 0.15)' } : {}}
                                    >
                                      <span className="truncate flex items-center gap-1.5">
                                        <FileText size={12} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'} />
                                        {item.title}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // Legacy flat/course-less folder display — Static (Always expanded)
                return (
                  <div key={folderKey} className="space-y-1">
                    <div className="w-full flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-wider px-2 py-1.5 bg-slate-100/30 rounded-lg border border-slate-150">
                      <span className="flex items-center gap-1.5">
                        <FolderOpen size={12} className="text-slate-450" />
                        <span>{group.label}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-0.5 pl-2 border-l border-slate-200 ml-2 mt-1 animate-scale-in">
                      {group.items.map(item => {
                        const isActive = activeMaterial?.filePath === item.filePath;
                        return (
                          <button
                            key={item.filePath}
                            onClick={() => {
                              navigate(getMaterialUrl(item));
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer group bg-transparent text-slate-655 hover:text-slate-900 hover:bg-slate-100"
                            style={isActive ? { background: '#f95d12', color: 'white', boxShadow: '0 4px 6px -1px rgba(249, 93, 18, 0.15)' } : {}}
                          >
                            <span className="truncate flex items-center gap-1.5">
                              <FileText size={12} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-500'} />
                              {item.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {materials.length === 0 && (
                <p className="text-xs text-slate-400 font-medium text-center py-6">Žádné Markdown soubory nenalezeny.</p>
              )}
            </nav>
          </Card>
        </aside>

        {/* Viewport for Markdown Content Rendering */}
        <main className="flex-1 min-w-0">
          <Card className="p-5 sm:p-8 flex flex-col h-full bg-white/90">
            {activeMaterial ? (
              activeMaterial.fileKey === 'pa2-ag1-overview' ? (
                <div className="flex-1 flex flex-col">
                  {/* Semester info banner */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <Badge variant="slate">
                      {activeMaterial.folderLabel}
                    </Badge>
                    <span className="text-[10px] font-mono select-none opacity-60">
                      {activeMaterial.fileName}
                    </span>
                  </div>
                   <div 
                     className="markdown-body mb-6 prose prose-slate max-w-none"
                     dangerouslySetInnerHTML={{ __html: parseMarkdown(activeMaterial.content) }}
                   />
                   <PA2ToAG1Overview />
                </div>
              ) : (
                <article className="prose prose-slate max-w-none flex-1 flex flex-col">
                  {/* Semester info banner */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 text-slate-400 text-xs font-bold">
                    <Badge variant="slate">
                      {activeMaterial.folderLabel}
                    </Badge>
                    <span className="text-[10px] font-mono select-none opacity-60">
                      {activeMaterial.fileName}
                    </span>
                  </div>

                  {/* Parsed HTML Output */}
                  <div 
                    className="markdown-body flex-1"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(activeMaterial.content) }}
                  />
                </article>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <FileText size={48} className="text-slate-300 mb-4 animate-pulse" />
                <h3 className="text-lg font-black text-slate-800 tracking-tight">Vyberte studijní materiál</h3>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed max-w-xs">
                  Vyberte si předmět nebo dokument v levém menu pro zobrazení studijních informací a odkazů.
                </p>
              </div>
            )}
          </Card>
        </main>
      </div>

      <footer className="border-t border-stone-200 py-6 text-center text-sm mt-auto bg-stone-100">
        <p className="text-stone-500">VSCHT Bioinfo Wiki • Změny obsahu se provádějí jednoduše editací `.md` souborů v adresáři projektu.</p>
        <p className="mt-2 text-stone-500">Kontakt: <a href="mailto:kolarv@vscht.cz" className="text-brand-orange hover:text-brand-orange-text transition-colors">kolarv@vscht.cz</a></p>
      </footer>
    </div>
  );
}
