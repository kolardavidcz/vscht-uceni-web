import { useState, useMemo } from 'react';
import { worksheetData as defaultWorksheetData, emojiOptions as defaultEmojiOptions, emojiCategories as defaultEmojiCategories, sortEmojis, generateHint, enrichWorksheetData } from '../data/data';
import { WorksheetItem, EmojiOption } from '../../../types';
import { Lock, Settings, ArrowLeft, Save, Check, Trash2, Plus, ChevronUp, ChevronDown, Edit2, List, Hash, X, CheckCircle, ExternalLink, Database, UploadCloud } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';

const SHOW_TEMP_PASSWORD = true; 

interface AdminPanelProps {
  onBack: () => void;
  onUpdateData: (newData: WorksheetItem[], newEmojis?: EmojiOption[], newCategories?: {key: string, label: string}[]) => void;
  currentData: WorksheetItem[];
  currentEmojiOptions: EmojiOption[];
  currentEmojiCategories: { key: string; label: string }[];
}

type AdminTab = 'answers' | 'emojis';

const getTypeStyle = (type?: string) => {
  switch (type) {
    case 'Kmen':    return 'bg-orange-50 text-orange-700 border-orange-100/50';
    case 'Třída':  return 'bg-amber-50 text-amber-700 border-amber-100/50';
    case 'Čeleď':  return 'bg-yellow-50 text-yellow-700 border-yellow-100/50';
    case 'Rod':    return 'bg-orange-50/60 text-orange-800 border-orange-100/50';
    case 'Zástupce': return 'bg-rose-50 text-rose-700 border-rose-100/50';
    default: return 'bg-slate-50 text-slate-650 border-slate-200/50';
  }
};

const getRankBorderColor = (type?: string) => {
  switch (type) {
    case 'Kmen':    return 'border-l-brand-orange';
    case 'Třída':  return 'border-l-amber-500';
    case 'Čeleď':  return 'border-l-yellow-500';
    case 'Rod':    return 'border-l-brand-orange-text';
    case 'Zástupce': return 'border-l-rose-500';
    default: return 'border-l-slate-350';
  }
};

const getRankBgColor = (type?: string) => {
  switch (type) {
    case 'Kmen':    return 'bg-orange-500/[0.015]';
    case 'Třída':  return 'bg-amber-500/[0.015]';
    case 'Čeleď':  return 'bg-yellow-500/[0.015]';
    case 'Rod':    return 'bg-orange-500/[0.01]';
    case 'Zástupce': return 'bg-rose-500/[0.015]';
    default: return 'bg-slate-500/[0.015]';
  }
};

export function AdminPanel({ onBack, onUpdateData, currentData, currentEmojiOptions, currentEmojiCategories }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('answers');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [localData, setLocalData] = useState<WorksheetItem[]>(currentData);
  const [localEmojis, setLocalEmojis] = useState<EmojiOption[]>(currentEmojiOptions);
  const [localCategories, setLocalCategories] = useState<{key: string, label: string}[]>(currentEmojiCategories);

  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);

  const [addingEmojiTo, setAddingEmojiTo] = useState<string | null>(null);
  const [newEmoji, setNewEmoji] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const emojisByCategory = useMemo(() => {
    const map = new Map<string, EmojiOption[]>();
    for (const option of localEmojis) {
      if (!map.has(option.category)) {
        map.set(option.category, []);
      }
      map.get(option.category)!.push(option);
    }
    return map;
  }, [localEmojis]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'bavi_nas_mikrobiologie') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Nesprávné heslo. Zkuste to znovu.');
    }
  };

  const findItemAndExecute = (items: WorksheetItem[], id: string, action: (item: WorksheetItem) => void): WorksheetItem[] => {
    return items.map(item => {
      if (item.id === id) {
        const newItem = { ...item };
        action(newItem);
        return newItem;
      }
      if (item.children) {
        return { ...item, children: findItemAndExecute(item.children, id, action) };
      }
      return item;
    });
  };

  const toggleChecked = (id: string) => {
    const item = flatItems.find(f => f.item.id === id)?.item;
    if (!item) return;
    const nextChecked = !item.checked;

    setLocalData(prev => findItemAndExecute(prev, id, (item) => {
      item.checked = nextChecked;
    }));
    setPendingChanges(prev => [...prev, { type: 'UPDATE_ITEM', id, fields: { checked: nextChecked } }]);
  };

  const deleteItem = (id: string) => {
    if (!confirm('Opravdu smazat tento taxon a všechny jeho pod-taxony?')) return;
    
    const removeRecursive = (items: WorksheetItem[]): WorksheetItem[] => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = removeRecursive(item.children);
        }
        return true;
      });
    };
    
    setLocalData(prev => removeRecursive([...prev]));
    setPendingChanges(prev => [...prev, { type: 'DELETE_ITEM', id }]);
    if (selectedId === id) setSelectedId(null);
  };

  const moveItem = (id: string, direction: 'up' | 'down') => {
    const moveRecursive = (items: WorksheetItem[]): WorksheetItem[] => {
      const index = items.findIndex(i => i.id === id);
      if (index !== -1) {
        const newItems = [...items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < newItems.length) {
          [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        }
        return newItems;
      }
      return items.map(item => {
        if (item.children) {
          return { ...item, children: moveRecursive(item.children) };
        }
        return item;
      });
    };
    setLocalData(prev => moveRecursive([...prev]));
    setPendingChanges(prev => [...prev, { type: 'MOVE_ITEM', id, direction }]);
  };

  const addNewItem = (parentId?: string) => {
    const name = prompt('Název nového taxonu:');
    if (!name) return;
    
    const newItem: WorksheetItem = {
      id: 'item-' + Math.random().toString(36).substr(2, 9),
      name,
      type: 'Rod',
      correctEmojis: [],
      children: []
    };

    if (!parentId) {
      setLocalData([...localData, newItem]);
    } else {
      setLocalData(prev => findItemAndExecute(prev, parentId, (item) => {
        item.children = [...(item.children || []), newItem];
      }));
    }
    setPendingChanges(prev => [...prev, { type: 'ADD_ITEM', parentId: parentId || null, item: newItem }]);
    setSelectedId(newItem.id);
  };

  const toggleEmoji = (id: string, emoji: string) => {
    const item = flatItems.find(f => f.item.id === id)?.item;
    if (!item) return;
    const current = item.correctEmojis || [];
    const updatedRaw = current.includes(emoji) ? current.filter(e => e !== emoji) : [...current, emoji];
    const updated = sortEmojis(updatedRaw, localEmojis);

    setLocalData(prev => findItemAndExecute(prev, id, (i) => {
      i.correctEmojis = updated;
      i.hint = generateHint(i, localEmojis);
    }));

    const dummyItem = { ...item, correctEmojis: updated };
    const nextHint = generateHint(dummyItem, localEmojis);
    setPendingChanges(prev => [...prev, { 
      type: 'UPDATE_ITEM', 
      id, 
      fields: { 
        correctEmojis: updated, 
        hint: nextHint 
      } 
    }]);
  };

  const clearEmojis = (id: string) => {
    setLocalData(prev => findItemAndExecute(prev, id, (item) => {
      item.correctEmojis = [];
      item.hint = '';
    }));
    setPendingChanges(prev => [...prev, { type: 'UPDATE_ITEM', id, fields: { correctEmojis: [], hint: '' } }]);
  };

  const handleSave = async () => {
    if (pendingChanges.length === 0) {
      alert('Žádné změny k uložení.');
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          changes: pendingChanges,
          password: password,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          const opts = resData.data.emojiOptions;
          const enriched = enrichWorksheetData(resData.data.worksheetData, opts);
          onUpdateData(enriched, opts, resData.data.emojiCategories);
          setLocalData(enriched);
          setLocalEmojis(opts);
          setLocalCategories(resData.data.emojiCategories);
          setPendingChanges([]);
        }
        alert('Změny byly úspěšně uloženy do databáze.');
      } else {
        const err = await response.json();
        alert('Chyba při ukládání: ' + (err.error || 'Neznámá chyba'));
      }
    } catch (e) {
      console.error('Save failed', e);
      alert('Nepodařilo se připojit k serveru.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetFromCode = async () => {
    if (!confirm('Opravdu chcete přepsat všechna data v databázi výchozími daty ze souborů v kódu? Tato akce nevratně přepíše všechny úpravy provedené v administraci.')) {
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            worksheetData: defaultWorksheetData,
            emojiOptions: defaultEmojiOptions,
            emojiCategories: defaultEmojiCategories
          },
          password: password,
        }),
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.success && resData.data) {
          const opts = resData.data.emojiOptions;
          const enriched = enrichWorksheetData(resData.data.worksheetData, opts);
          onUpdateData(enriched, opts, resData.data.emojiCategories);
          setLocalData(enriched);
          setLocalEmojis(opts);
          setLocalCategories(resData.data.emojiCategories);
          setPendingChanges([]);
        }
        alert('Databáze byla úspěšně přepsána výchozími daty z kódu.');
      } else {
        const err = await response.json();
        alert('Chyba při nahrávání: ' + (err.error || 'Neznámá chyba'));
      }
    } catch (e) {
      console.error('Reset failed', e);
      alert('Nepodařilo se připojit k serveru.');
    } finally {
      setIsSaving(false);
    }
  };


  const flattenItems = (items: WorksheetItem[], level = 0): { item: WorksheetItem; level: number }[] => {
    let result: { item: WorksheetItem; level: number }[] = [];
    for (const item of items) {
      result.push({ item, level });
      if (item.children) {
        result = [...result, ...flattenItems(item.children, level + 1)];
      }
    }
    return result;
  };

  const flatItems = flattenItems(localData);
  const selectedItem = flatItems.find(f => f.item.id === selectedId)?.item;

  // Category & Emoji Management
  const addCategory = () => {
    const name = prompt('Název nové kategorie:');
    if (name) {
      const key = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
      const newCat = { key, label: name };
      setLocalCategories([...localCategories, newCat]);
      setPendingChanges(prev => [...prev, { type: 'ADD_CATEGORY', category: newCat }]);
    }
  };

  const removeCategory = (key: string) => {
    if (confirm(`Opravdu smazat kategorii "${key}"? Emojis v této kategorii zůstanou, ale nebudou mít kategorii.`)) {
      setLocalCategories(localCategories.filter(c => c.key !== key));
      setPendingChanges(prev => [...prev, { type: 'DELETE_CATEGORY', key }]);
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCats = [...localCategories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newCats.length) {
      [newCats[index], newCats[targetIndex]] = [newCats[targetIndex], newCats[index]];
      setLocalCategories(newCats);
      setPendingChanges(prev => [...prev, { type: 'MOVE_CATEGORY', index, direction }]);
    }
  };

  const [editingEmoji, setEditingEmoji] = useState<string | null>(null);
  const [editEmojiChar, setEditEmojiChar] = useState('');
  const [editLabel, setEditLabel] = useState('');

  const emojiUsageCount = useMemo(() => {
    const counts = new Map<string, number>();
    const countRecursive = (items: WorksheetItem[]) => {
      for (const item of items) {
        const emojis = item.correctEmojis || [];
        for (const e of emojis) counts.set(e, (counts.get(e) || 0) + 1);
        if (item.groups) {
          for (const g of item.groups) {
            for (const e of g.correctEmojis) counts.set(e, (counts.get(e) || 0) + 1);
          }
        }
        if (item.children) countRecursive(item.children);
      }
    };
    countRecursive(localData);
    return counts;
  }, [localData]);

  const saveNewEmoji = (categoryKey: string) => {
    if (!newEmoji || !newLabel) return;
    const emojiOpt = { emoji: newEmoji, label: newLabel, category: categoryKey };
    setLocalEmojis([...localEmojis, emojiOpt]);
    setPendingChanges(prev => [...prev, { type: 'ADD_EMOJI', emoji: emojiOpt }]);
    setNewEmoji('');
    setNewLabel('');
    setAddingEmojiTo(null);
  };

  const handleUpdateEmoji = (oldEmoji: string) => {
    if (!editEmojiChar || !editLabel) return;

    const nextEmojis = localEmojis.map(e => e.emoji === oldEmoji ? { ...e, emoji: editEmojiChar, label: editLabel } : e);
    setLocalEmojis(nextEmojis);
    
    const updateRecursive = (items: WorksheetItem[]): WorksheetItem[] => {
      return items.map(item => {
        const newItem = { ...item };
        if (newItem.correctEmojis) {
          newItem.correctEmojis = newItem.correctEmojis.map(e => e === oldEmoji ? editEmojiChar : e);
        }
        if (newItem.groups) {
          newItem.groups = newItem.groups.map(g => ({
            ...g,
            correctEmojis: g.correctEmojis.map(e => e === oldEmoji ? editEmojiChar : e)
          }));
        }
        if (newItem.children) {
          newItem.children = updateRecursive(newItem.children);
        }
        return newItem;
      });
    };
    setLocalData(prev => enrichWorksheetData(updateRecursive(prev), nextEmojis));
    setPendingChanges(prev => [...prev, { type: 'UPDATE_EMOJI', oldEmoji, emoji: editEmojiChar, label: editLabel }]);
    
    setEditingEmoji(null);
  };

  const removeEmoji = (emoji: string) => {
    if (confirm(`Smazat emoji ${emoji}?`)) {
      setLocalEmojis(localEmojis.filter(e => e.emoji !== emoji));
      setPendingChanges(prev => [...prev, { type: 'DELETE_EMOJI', emoji }]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-espresso flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-mocha/25 rounded-full blur-3xl pointer-events-none" />

        <div className="glass-panel-dark text-slate-100 shadow-2xl rounded-3xl border border-white/10 p-8 w-full max-w-md animate-scale-in duration-300 relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-brand-orange/10 rounded-2xl mb-4 border border-brand-orange/20 shadow-lg shadow-brand-orange/5 select-none">
              <Lock className="text-brand-orange" size={32} />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-amber-100 tracking-tight">Admin Panel</h1>
            <p className="text-slate-400 text-center text-xs mt-2 leading-relaxed">
              Zadejte heslo pro vstup do sekce administrace
              {SHOW_TEMP_PASSWORD && (
                <span className="block mt-1.5 text-brand-orange font-mono tracking-normal normal-case text-xs bg-brand-espresso/45 border border-brand-orange/15 px-2.5 py-1 rounded-md select-all">
                  bavi_nas_mikrobiologie
                </span>
              )}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Vložte administrátorské heslo..."
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-sm text-slate-100 placeholder-slate-600"
                autoFocus
              />
              {error && <p className="text-rose-400 text-xs mt-2 font-semibold tracking-wide">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-text text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-orange/15 active:scale-[0.98] cursor-pointer text-sm"
            >
              Vstoupit do administrace
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full text-slate-400 py-2 text-xs font-bold hover:text-slate-200 transition-colors cursor-pointer"
            >
              Zpět na vyplňovací stránku
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800 overflow-hidden">
      <header className="page-header px-6 py-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="btn-ghost"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-r from-brand-orange to-orange-500 rounded-xl shadow-lg shadow-brand-orange/20">
              <Settings className="text-white animate-spin-slow" size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-amber-100 leading-none">Administrace</h1>
              <p className="text-[9px] text-brand-peach font-bold uppercase tracking-widest mt-1">
                Kontakt: <a href="mailto:kolarv@vscht.cz" className="text-brand-orange hover:text-brand-orange-text hover:underline transition-colors">kolarv@vscht.cz</a>
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-xs select-none">
          <button
            onClick={() => setActiveTab('answers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'answers' ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20' : 'text-slate-350 hover:text-white hover:bg-white/5'
            }`}
          >
            <Check size={14} /> Odpovědi
          </button>
          <button
            onClick={() => setActiveTab('emojis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'emojis' ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/20' : 'text-slate-350 hover:text-white hover:bg-white/5'
            }`}
          >
            <Hash size={14} /> Emoji & Kategorie
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          {(import.meta.env.DEV || import.meta.env.VITE_ENABLE_DB_RESET === 'true') && (
            <button
              onClick={handleResetFromCode}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl active:scale-95 transition-all font-bold text-[10px] sm:text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Přepíše celou databázi výchozími daty ze souborů v kódu (zastupci.ts, emojis.ts)"
            >
              <Database size={14} />
              <span className="hidden sm:inline">PŘEPSAT DB DATY Z KÓDU</span>
              <span className="sm:hidden">PŘEPSAT Z KÓDU</span>
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving || pendingChanges.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-brand-orange to-orange-600 hover:from-brand-orange-text hover:to-orange-700 text-white rounded-xl active:scale-95 hover:scale-[1.03] transition-all font-bold text-xs shadow-lg shadow-brand-orange/15 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSaving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
            {isSaving ? 'Ukládám...' : `ULOŽIT ZMĚNY (${pendingChanges.length})`}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'answers' && (
          <>
            {/* Left Sidebar: List of Items */}
            <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col shadow-xs relative z-10">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Výběr taxonu ({flatItems.length})</h2>
                <button
                  onClick={() => addNewItem()}
                  className="p-1.5 bg-brand-orange hover:bg-brand-orange-text text-white rounded-lg active:scale-95 transition-all shadow-md shadow-brand-orange/15 cursor-pointer"
                  title="Přidat nový hlavní taxon"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
                {flatItems.map(({ item, level }) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`group relative flex items-stretch border-l-4 transition-all ${getRankBorderColor(item.type)} ${
                        isSelected ? 'bg-brand-orange/10 shadow-inner' : getRankBgColor(item.type)
                      } ${item.checked ? 'opacity-40 grayscale-60 bg-slate-100/40' : ''} hover:bg-brand-orange/[0.03]`}
                    >
                      {/* Visual Tree Lines */}
                      {level > 0 && Array.from({ length: level }).map((_, idx) => (
                        <div 
                          key={idx}
                          className="absolute top-0 bottom-0 border-r border-slate-200 pointer-events-none" 
                          style={{ left: `${(idx + 0.5) * 1.5}rem`, width: '1px' }}
                        />
                      ))}
                      {level > 0 && (
                        <div 
                          className="absolute top-1/2 border-t border-slate-200 pointer-events-none" 
                          style={{ left: `${(level - 0.5) * 1.5}rem`, width: '0.75rem' }}
                        />
                      )}

                      {/* Move controls */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm border-r border-slate-200 z-10 px-0.5 shadow-md">
                        <button onClick={() => moveItem(item.id, 'up')} className="p-1 text-slate-400 hover:text-brand-orange cursor-pointer" title="Posunout nahoru"><ChevronUp size={14} /></button>
                        <button onClick={() => moveItem(item.id, 'down')} className="p-1 text-slate-400 hover:text-brand-orange cursor-pointer" title="Posunout dolů"><ChevronDown size={14} /></button>
                      </div>



                      <button
                        onClick={() => setSelectedId(item.id)}
                        className="flex-1 text-left px-3 py-3.5 flex items-start gap-2.5 min-w-0 cursor-pointer"
                        style={{ paddingLeft: `${Math.max(0.75, level * 1.5 + 0.75)}rem` }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm truncate tracking-tight ${selectedId === item.id ? 'text-brand-orange-text' : 'text-slate-700'}`}>
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {item.type && (
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${getTypeStyle(item.type)}`}>
                                {item.type}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                              {item.correctEmojis?.length || 0} vlastností
                            </span>
                          </div>
                        </div>

                        <div className="flex-shrink-0 grid grid-cols-4 gap-0.5 bg-slate-50 p-1 rounded-xl border border-slate-100 shadow-2xs">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="min-w-[1.25rem] w-auto h-5 px-0.5 flex items-center justify-center text-xs whitespace-nowrap select-none">
                              {item.correctEmojis?.[i] || ""}
                            </div>
                          ))}
                        </div>
                      </button>

                      {/* Checked toggle */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleChecked(item.id); }}
                        className={`flex-shrink-0 w-10 flex items-center justify-center transition-colors cursor-pointer ${
                          item.checked ? 'text-emerald-500' : 'text-slate-350 hover:text-slate-500'
                        }`}
                        title={item.checked ? 'Zkontrolováno' : 'Označit jako zkontrolované'}
                      >
                        <CheckCircle size={18} fill={item.checked ? 'currentColor' : 'none'} />
                      </button>

                      <div className="flex flex-col justify-center gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); addNewItem(item.id); }} 
                          className="p-1 text-brand-orange hover:bg-orange-50 rounded-md transition-all cursor-pointer border border-transparent hover:border-orange-100"
                          title="Přidat pod-taxon"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} 
                          className="p-1 text-slate-350 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
                          title="Smazat"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200">
                <button
                  onClick={() => addNewItem()}
                  className="w-full py-2.5 bg-white border-2 border-dashed border-slate-300 text-slate-500 rounded-xl hover:border-brand-orange hover:text-brand-orange hover:bg-orange-50/20 hover:shadow-xs transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={14} /> Přidat nový hlavní taxon
                </button>
              </div>
            </div>

            {/* Right Content: Editor */}
            <div className="flex-1 bg-slate-50/40 overflow-y-auto p-8 scrollbar-thin">
              {selectedItem ? (
                <div className="max-w-3xl mx-auto space-y-6 animate-scale-in">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex flex-wrap gap-4 justify-between items-start mb-5 pb-3 border-b border-slate-100">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">{selectedItem.name}</h2>
                        {selectedItem.type && (
                          <span className={`inline-block mt-1.5 px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider border ${getTypeStyle(selectedItem.type)}`}>
                            {selectedItem.type}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => clearEmojis(selectedItem.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 size={13} /> Smazat vše
                      </button>
                    </div>

                    <div className="min-h-[72px] p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-wrap gap-2 items-center">
                      {selectedItem.correctEmojis && selectedItem.correctEmojis.length > 0 ? (
                        selectedItem.correctEmojis.map((e, i) => (
                          <button
                            key={i}
                            onClick={() => toggleEmoji(selectedItem.id, e)}
                            className="group relative bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-2xs hover:border-rose-400 hover:bg-rose-50 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
                          >
                            <span className="text-2xl whitespace-nowrap select-none">{e}</span>
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white">×</span>
                          </button>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs font-semibold select-none flex items-center gap-1.5 pl-1"><InfoIcon size={14} /> Zatím nebyly vybrány žádné správné odpovědi...</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Paleta vlastností</h3>
                    <div className="space-y-8">
                      {localCategories.map(cat => {
                        const options = emojisByCategory.get(cat.key) || [];
                        return (
                          <div key={cat.key}>
                            <h4 className="text-xs font-bold text-brand-orange-text uppercase mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              {cat.label}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {options.map(opt => {
                                const isSelected = selectedItem.correctEmojis?.includes(opt.emoji);
                                return (
                                  <button
                                    key={opt.emoji}
                                    onClick={() => toggleEmoji(selectedItem.id, opt.emoji)}
                                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all text-left cursor-pointer ${
                                      isSelected
                                        ? 'bg-linear-to-br from-orange-50/70 to-orange-100/30 border-brand-orange/60 shadow-2xs ring-1 ring-orange-200/20'
                                        : 'bg-white border-slate-100 hover:border-brand-orange/40 hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <span className="text-xl flex-shrink-0 whitespace-nowrap select-none">{opt.emoji}</span>
                                    <span className={`text-[11px] leading-tight font-bold flex-1 whitespace-normal break-words ${isSelected ? 'text-brand-orange-text' : 'text-slate-600'}`}>
                                      {opt.label}
                                    </span>
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange flex-shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 animate-pulse">
                    <Settings size={40} className="text-slate-300" />
                  </div>
                  <p className="font-bold text-xs uppercase tracking-widest text-slate-400 select-none">Vyberte taxon vlevo pro úpravu odpovědí</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'emojis' && (
          <div className="flex-1 bg-slate-50/40 overflow-y-auto p-8 scrollbar-thin">
            <div className="max-w-4xl mx-auto space-y-8 animate-scale-in">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Správa Emoji a kategorií</h2>
                <button
                  onClick={addCategory}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-text text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-orange/15 cursor-pointer"
                >
                  <Plus size={14} /> Přidat kategorii
                </button>
              </div>
              
              <div className="space-y-6">
                {localCategories.map((cat, catIndex) => {
                  const options = localEmojis.filter(e => e.category === cat.key);
                  const isAdding = addingEmojiTo === cat.key;
                  return (
                    <div key={cat.key} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <button 
                              onClick={() => moveCategory(catIndex, 'up')} 
                              disabled={catIndex === 0}
                              className="p-0.5 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button 
                              onClick={() => moveCategory(catIndex, 'down')} 
                              disabled={catIndex === localCategories.length - 1}
                              className="p-0.5 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                          <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                            {cat.label}
                            <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-tighter text-slate-400 font-bold select-none">
                              {options.length} položek
                            </span>
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setAddingEmojiTo(isAdding ? null : cat.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all cursor-pointer border ${
                              isAdding 
                                ? 'bg-rose-50 border-rose-100 text-rose-500' 
                                : 'bg-slate-100 border-slate-200 hover:bg-slate-200/50 text-slate-700'
                            }`}
                          >
                            {isAdding ? <><X size={12} /> Zrušit</> : <><Plus size={12} /> Přidat emoji</>}
                          </button>
                          <button
                            onClick={() => removeCategory(cat.key)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Smazat kategorii"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {isAdding && (
                        <div className="bg-slate-50/50 p-5 rounded-2xl border-2 border-brand-orange shadow-xl mb-4 animate-in zoom-in-95 duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex justify-between items-center">
                                <span>1. Vložit emoji</span>
                                <a href="https://emojipedia.org" target="_blank" rel="noopener noreferrer" className="text-brand-orange hover:underline flex items-center gap-1">
                                  Emojipedia <ExternalLink size={10} />
                                </a>
                              </label>
                              <input
                                type="text"
                                value={newEmoji}
                                onChange={(e) => setNewEmoji(e.target.value)}
                                placeholder="🔍"
                                className="w-16 h-16 text-3xl text-center bg-white border-2 border-dashed border-slate-300 rounded-2xl focus:border-brand-orange outline-none transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">2. Popis</label>
                              <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                placeholder="Název vlastnosti..."
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none transition-all text-sm"
                              />
                              <button
                                onClick={() => saveNewEmoji(cat.key)}
                                disabled={!newEmoji || !newLabel}
                                className="mt-2 w-full py-2.5 bg-brand-orange hover:bg-brand-orange-text text-white rounded-xl font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check size={16} /> Uložit do {cat.label}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {options.map(opt => {
                          const isEditing = editingEmoji === opt.emoji;
                          const count = emojiUsageCount.get(opt.emoji) || 0;
                          return (
                            <div key={opt.emoji} className="flex items-center gap-3 p-3 bg-slate-50/30 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-2xs group relative">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editEmojiChar}
                                  onChange={(e) => setEditEmojiChar(e.target.value)}
                                  className="w-14 h-10 text-xl text-center border border-orange-200 rounded-xl outline-none bg-orange-50 flex-shrink-0"
                                  autoFocus
                                />
                              ) : (
                                <span className="text-3xl drop-shadow-xs w-12 text-center whitespace-nowrap select-none flex-shrink-0">{opt.emoji}</span>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                {isEditing ? (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={editLabel}
                                      onChange={(e) => setEditLabel(e.target.value)}
                                      className="flex-1 px-2 py-1.5 text-xs border border-orange-200 rounded-xl outline-none bg-orange-50"
                                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateEmoji(opt.emoji)}
                                    />
                                    <button onClick={() => handleUpdateEmoji(opt.emoji)} className="text-emerald-500 hover:scale-110 transition-transform cursor-pointer"><Check size={16} /></button>
                                    <button onClick={() => setEditingEmoji(null)} className="text-slate-400 hover:scale-110 transition-transform cursor-pointer"><X size={16} /></button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <p className="font-bold text-xs text-slate-700 whitespace-normal break-words">{opt.label}</p>
                                      <button 
                                        onClick={() => { setEditingEmoji(opt.emoji); setEditEmojiChar(opt.emoji); setEditLabel(opt.label); }}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-orange transition-all bg-white rounded border border-slate-150 cursor-pointer"
                                      >
                                        <Edit2 size={10} />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                        count > 0 ? 'bg-orange-50 border border-orange-100 text-orange-700' : 'bg-slate-100 border-slate-200 text-slate-400'
                                      }`}>
                                        Použito: {count}×
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              {!isEditing && (
                                <button
                                  onClick={() => removeEmoji(opt.emoji)}
                                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoIcon({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
