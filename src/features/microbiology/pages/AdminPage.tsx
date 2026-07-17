import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit2,
  ExternalLink,
  Hash,
  Lock,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { MicrobiologyData } from "../hooks/useMicrobiologyData";
import type { AdminChange } from "../lib/adminChanges";
import {
  enrichWorksheetData,
  generateHint,
  sortEmojis,
} from "../data/emojis";
import type { EmojiOption, WorksheetItem } from "../types";

const ADMIN_PASSWORD = "bavi_nas_mikrobiologie";
const AUTH_KEY = "microbiology_admin_ok";
const SHOW_TEMP_PASSWORD = true;

type Props = { data: MicrobiologyData };
type AdminTab = "answers" | "emojis";

const typeStyle = (type?: string) => {
  switch (type) {
    case "Kmen":
      return "bg-orange-50 text-orange-700 border-orange-100";
    case "Třída":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "Čeleď":
      return "bg-yellow-50 text-yellow-800 border-yellow-100";
    case "Rod":
      return "bg-orange-50/70 text-orange-800 border-orange-100";
    case "Zástupce":
      return "bg-rose-50 text-rose-700 border-rose-100";
    default:
      return "bg-stone-50 text-stone-600 border-stone-200";
  }
};

const rankBorder = (type?: string) => {
  switch (type) {
    case "Kmen":
      return "border-l-brand-orange";
    case "Třída":
      return "border-l-amber-500";
    case "Čeleď":
      return "border-l-yellow-500";
    case "Rod":
      return "border-l-brand-orange-text";
    case "Zástupce":
      return "border-l-rose-500";
    default:
      return "border-l-stone-300";
  }
};

function flattenItems(
  items: WorksheetItem[],
  level = 0
): { item: WorksheetItem; level: number }[] {
  let result: { item: WorksheetItem; level: number }[] = [];
  for (const item of items) {
    result.push({ item, level });
    if (item.children) {
      result = [...result, ...flattenItems(item.children, level + 1)];
    }
  }
  return result;
}

function findAndMap(
  items: WorksheetItem[],
  id: string,
  action: (item: WorksheetItem) => WorksheetItem
): WorksheetItem[] {
  return items.map((item) => {
    if (item.id === id) return action(item);
    if (item.children) {
      return { ...item, children: findAndMap(item.children, id, action) };
    }
    return item;
  });
}

export function AdminPage({ data }: Props) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === "1"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("answers");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localData, setLocalData] = useState(data.worksheetData);
  const [localEmojis, setLocalEmojis] = useState(data.emojiOptions);
  const [localCategories, setLocalCategories] = useState(data.emojiCategories);
  const [pending, setPending] = useState<AdminChange[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [addingEmojiTo, setAddingEmojiTo] = useState<string | null>(null);
  const [newEmoji, setNewEmoji] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [editingEmoji, setEditingEmoji] = useState<string | null>(null);
  const [editEmojiChar, setEditEmojiChar] = useState("");
  const [editLabel, setEditLabel] = useState("");

  useEffect(() => {
    document.title = "Admin — Systematika bakterií";
  }, []);

  useEffect(() => {
    setLocalData(data.worksheetData);
    setLocalEmojis(data.emojiOptions);
    setLocalCategories(data.emojiCategories);
  }, [data.worksheetData, data.emojiOptions, data.emojiCategories]);

  const flatItems = useMemo(() => flattenItems(localData), [localData]);
  const selectedItem = flatItems.find((f) => f.item.id === selectedId)?.item;

  const emojisByCategory = useMemo(() => {
    const map = new Map<string, EmojiOption[]>();
    for (const opt of localEmojis) {
      if (!map.has(opt.category)) map.set(opt.category, []);
      map.get(opt.category)!.push(opt);
    }
    return map;
  }, [localEmojis]);

  const emojiUsageCount = useMemo(() => {
    const counts = new Map<string, number>();
    const walk = (items: WorksheetItem[]) => {
      for (const item of items) {
        for (const e of item.correctEmojis || []) {
          counts.set(e, (counts.get(e) || 0) + 1);
        }
        for (const g of item.groups || []) {
          for (const e of g.correctEmojis || []) {
            counts.set(e, (counts.get(e) || 0) + 1);
          }
        }
        if (item.children) walk(item.children);
      }
    };
    walk(localData);
    return counts;
  }, [localData]);

  const queue = (change: AdminChange) =>
    setPending((prev) => [...prev, change]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setError("");
    } else setError("Nesprávné heslo.");
  };

  const toggleEmoji = (id: string, emoji: string) => {
    const item = flatItems.find((f) => f.item.id === id)?.item;
    if (!item) return;
    const current = item.correctEmojis || [];
    const updatedRaw = current.includes(emoji)
      ? current.filter((e) => e !== emoji)
      : [...current, emoji];
    const updated = sortEmojis(updatedRaw, localEmojis);
    const dummy = { ...item, correctEmojis: updated };
    const nextHint = generateHint(dummy, localEmojis);

    setLocalData((prev) =>
      findAndMap(prev, id, (i) => ({
        ...i,
        correctEmojis: updated,
        hint: nextHint,
      }))
    );
    queue({
      type: "UPDATE_ITEM",
      id,
      fields: { correctEmojis: updated, hint: nextHint },
    });
  };

  const clearEmojis = (id: string) => {
    setLocalData((prev) =>
      findAndMap(prev, id, (i) => ({ ...i, correctEmojis: [], hint: "" }))
    );
    queue({
      type: "UPDATE_ITEM",
      id,
      fields: { correctEmojis: [], hint: "" },
    });
  };

  const toggleChecked = (id: string) => {
    const item = flatItems.find((f) => f.item.id === id)?.item;
    if (!item) return;
    const next = !item.checked;
    setLocalData((prev) =>
      findAndMap(prev, id, (i) => ({ ...i, checked: next }))
    );
    queue({ type: "UPDATE_ITEM", id, fields: { checked: next } });
  };

  const deleteItem = (id: string) => {
    if (!confirm("Smazat taxon a všechny pod-taxony?")) return;
    const remove = (items: WorksheetItem[]): WorksheetItem[] =>
      items
        .filter((i) => i.id !== id)
        .map((i) =>
          i.children ? { ...i, children: remove(i.children) } : i
        );
    setLocalData((prev) => remove(prev));
    queue({ type: "DELETE_ITEM", id });
    if (selectedId === id) setSelectedId(null);
  };

  const moveItem = (id: string, direction: "up" | "down") => {
    const move = (items: WorksheetItem[]): WorksheetItem[] => {
      const index = items.findIndex((i) => i.id === id);
      if (index !== -1) {
        const target = direction === "up" ? index - 1 : index + 1;
        if (target < 0 || target >= items.length) return items;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      }
      return items.map((i) =>
        i.children ? { ...i, children: move(i.children) } : i
      );
    };
    setLocalData((prev) => move(prev));
    queue({ type: "MOVE_ITEM", id, direction });
  };

  const addNewItem = (parentId?: string) => {
    const name = prompt("Název nového taxonu:");
    if (!name) return;
    const newItem: WorksheetItem = {
      id: "item-" + Math.random().toString(36).slice(2, 11),
      name,
      type: "Rod",
      correctEmojis: [],
      children: [],
    };
    if (!parentId) {
      setLocalData((prev) => [...prev, newItem]);
    } else {
      setLocalData((prev) =>
        findAndMap(prev, parentId, (item) => ({
          ...item,
          children: [...(item.children || []), newItem],
        }))
      );
    }
    queue({
      type: "ADD_ITEM",
      parentId: parentId || null,
      item: newItem as unknown as Record<string, unknown>,
    });
    setSelectedId(newItem.id);
  };

  const addCategory = () => {
    const name = prompt("Název nové kategorie:");
    if (!name) return;
    const key = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
    const category = { key, label: name };
    setLocalCategories((c) => [...c, category]);
    queue({ type: "ADD_CATEGORY", category });
  };

  const removeCategory = (key: string) => {
    if (!confirm(`Smazat kategorii "${key}"?`)) return;
    setLocalCategories((c) => c.filter((x) => x.key !== key));
    queue({ type: "DELETE_CATEGORY", key });
  };

  const moveCategory = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= localCategories.length) return;
    const next = [...localCategories];
    [next[index], next[target]] = [next[target], next[index]];
    setLocalCategories(next);
    queue({ type: "MOVE_CATEGORY", index, direction });
  };

  const saveNewEmoji = (categoryKey: string) => {
    if (!newEmoji || !newLabel) return;
    const emojiOpt = {
      emoji: newEmoji,
      label: newLabel,
      category: categoryKey,
    };
    setLocalEmojis((e) => [...e, emojiOpt]);
    queue({ type: "ADD_EMOJI", emoji: emojiOpt });
    setNewEmoji("");
    setNewLabel("");
    setAddingEmojiTo(null);
  };

  const handleUpdateEmoji = (oldEmoji: string) => {
    if (!editEmojiChar || !editLabel) return;
    const nextEmojis = localEmojis.map((e) =>
      e.emoji === oldEmoji
        ? { ...e, emoji: editEmojiChar, label: editLabel }
        : e
    );
    setLocalEmojis(nextEmojis);
    const rewrite = (items: WorksheetItem[]): WorksheetItem[] =>
      items.map((item) => ({
        ...item,
        correctEmojis: (item.correctEmojis || []).map((e) =>
          e === oldEmoji ? editEmojiChar : e
        ),
        groups: item.groups?.map((g) => ({
          ...g,
          correctEmojis: g.correctEmojis.map((e) =>
            e === oldEmoji ? editEmojiChar : e
          ),
        })),
        children: item.children ? rewrite(item.children) : undefined,
      }));
    setLocalData((prev) => enrichWorksheetData(rewrite(prev), nextEmojis));
    queue({
      type: "UPDATE_EMOJI",
      oldEmoji,
      emoji: editEmojiChar,
      label: editLabel,
    });
    setEditingEmoji(null);
  };

  const removeEmojiOpt = (emoji: string) => {
    if (!confirm(`Smazat emoji ${emoji}?`)) return;
    setLocalEmojis((e) => e.filter((x) => x.emoji !== emoji));
    queue({ type: "DELETE_EMOJI", emoji });
  };

  const handleSave = async () => {
    if (pending.length === 0) {
      setMsg("Žádné změny k uložení.");
      return;
    }
    setSaving(true);
    const result = await data.saveChanges(pending, password || ADMIN_PASSWORD, {
      worksheetData: localData,
      emojiOptions: localEmojis,
      emojiCategories: localCategories,
    });
    setMsg(result.message);
    if (result.ok) setPending([]);
    setSaving(false);
    setTimeout(() => setMsg(""), 4500);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-espresso flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full max-w-md relative z-10 rounded-3xl border border-white/10 bg-gradient-to-br from-brand-espresso via-brand-mocha/40 to-brand-espresso p-8 text-slate-100 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-brand-orange/10 rounded-2xl mb-4 border border-brand-orange/20">
              <Lock className="text-brand-orange" size={32} />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-orange-200 to-amber-100">
              Admin Panel
            </h1>
            <p className="text-slate-400 text-center text-xs mt-2 leading-relaxed">
              Úprava správných odpovědí a emoji katalogu.
              {SHOW_TEMP_PASSWORD && (
                <span className="block mt-2 text-brand-orange font-mono text-xs bg-black/30 border border-brand-orange/20 px-2.5 py-1 rounded-md select-all">
                  {ADMIN_PASSWORD}
                </span>
              )}
            </p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Heslo…"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-brand-orange outline-none text-sm"
              autoFocus
            />
            {error && (
              <p className="text-rose-400 text-xs font-semibold">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Vstoupit
            </Button>
            <Link
              to="/mikrobiologie"
              className="block text-center text-xs text-slate-400 hover:text-white"
            >
              Zpět na kvíz
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-50 flex flex-col overflow-hidden text-stone-800">
      <header className="page-header px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            to="/mikrobiologie"
            className="p-2 rounded-xl border border-white/15 text-white/90 hover:bg-white/10"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-r from-brand-orange to-orange-500 rounded-xl">
              <Settings className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white leading-none">
                Administrace
              </h1>
              <p className="text-[9px] text-brand-peach font-bold uppercase tracking-widest mt-1">
                Vectoral save · {data.storageLabel}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex items-center bg-white/5 border border-white/10 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("answers")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer",
              activeTab === "answers"
                ? "bg-brand-orange text-white"
                : "text-stone-300 hover:text-white"
            )}
          >
            <Check size={14} /> Odpovědi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("emojis")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer",
              activeTab === "emojis"
                ? "bg-brand-orange text-white"
                : "text-stone-300 hover:text-white"
            )}
          >
            <Hash size={14} /> Emoji & Kategorie
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || pending.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-orange to-orange-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-brand-orange/20 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Ukládám…" : `ULOŽIT ZMĚNY (${pending.length})`}
          </button>
        </div>
      </header>

      {msg && (
        <div className="px-4 py-2 bg-orange-50 border-b border-orange-100 text-xs font-bold text-brand-orange-text text-center">
          {msg}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden min-h-0">
        {activeTab === "answers" && (
          <>
            {/* Left taxon list */}
            <div className="w-full sm:w-2/5 lg:w-1/3 border-r border-stone-200 bg-white flex flex-col min-h-0">
              <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Taxony ({flatItems.length})
                </h2>
                <button
                  type="button"
                  onClick={() => addNewItem()}
                  className="p-1.5 bg-brand-orange text-white rounded-lg cursor-pointer"
                  title="Přidat hlavní taxon"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
                {flatItems.map(({ item, level }) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "group relative flex items-stretch border-l-4 transition-all",
                        rankBorder(item.type),
                        isSelected ? "bg-brand-orange/10" : "hover:bg-orange-50/40",
                        item.checked && "opacity-40"
                      )}
                    >
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 bg-white/95 border-r border-stone-200 z-10 px-0.5">
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "up")}
                          className="p-1 text-stone-400 hover:text-brand-orange cursor-pointer"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "down")}
                          className="p-1 text-stone-400 hover:text-brand-orange cursor-pointer"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className="flex-1 text-left px-3 py-3 flex items-start gap-2 min-w-0 cursor-pointer"
                        style={{
                          paddingLeft: `${Math.max(0.75, level * 1.25 + 0.75)}rem`,
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "font-bold text-sm truncate",
                              isSelected
                                ? "text-brand-orange-text"
                                : "text-stone-700"
                            )}
                          >
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {item.type && (
                              <span
                                className={cn(
                                  "text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border uppercase",
                                  typeStyle(item.type)
                                )}
                              >
                                {item.type}
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400 font-bold">
                              {item.correctEmojis?.length || 0} vlastností
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0 grid grid-cols-4 gap-0.5 bg-stone-50 p-1 rounded-lg border border-stone-100">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 flex items-center justify-center text-xs"
                            >
                              {item.correctEmojis?.[i] || ""}
                            </div>
                          ))}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleChecked(item.id)}
                        className={cn(
                          "w-9 flex items-center justify-center cursor-pointer",
                          item.checked
                            ? "text-emerald-500"
                            : "text-stone-300 hover:text-stone-500"
                        )}
                        title="Zkontrolováno"
                      >
                        <CheckCircle
                          size={18}
                          fill={item.checked ? "currentColor" : "none"}
                        />
                      </button>
                      <div className="flex flex-col justify-center gap-1 px-1.5 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => addNewItem(item.id)}
                          className="p-1 text-brand-orange hover:bg-orange-50 rounded cursor-pointer"
                          title="Pod-taxon"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-stone-300 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right editor */}
            <div className="hidden sm:block flex-1 overflow-y-auto p-6 bg-stone-50/50">
              {selectedItem ? (
                <div className="max-w-3xl mx-auto space-y-5">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="flex flex-wrap gap-3 justify-between items-start mb-4 pb-3 border-b border-stone-100">
                      <div>
                        <h2 className="text-xl font-bold text-stone-900">
                          {selectedItem.name}
                        </h2>
                        {selectedItem.type && (
                          <span
                            className={cn(
                              "inline-block mt-1.5 px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase border",
                              typeStyle(selectedItem.type)
                            )}
                          >
                            {selectedItem.type}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => clearEmojis(selectedItem.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        <Trash2 size={13} /> Smazat vše
                      </button>
                    </div>
                    <div className="min-h-[72px] p-4 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 flex flex-wrap gap-2 items-center">
                      {(selectedItem.correctEmojis || []).length > 0 ? (
                        selectedItem.correctEmojis!.map((e) => (
                          <button
                            key={e}
                            type="button"
                            onClick={() => toggleEmoji(selectedItem.id, e)}
                            className="group relative bg-white border border-stone-200 px-3 py-2 rounded-xl hover:border-rose-400 cursor-pointer"
                          >
                            <span className="text-2xl">{e}</span>
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center">
                              ×
                            </span>
                          </button>
                        ))
                      ) : (
                        <span className="text-stone-400 text-xs font-semibold">
                          Zatím žádné správné odpovědi…
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-5">
                      Paleta vlastností
                    </h3>
                    <div className="space-y-7">
                      {localCategories.map((cat) => {
                        const options = emojisByCategory.get(cat.key) || [];
                        return (
                          <div key={cat.key}>
                            <h4 className="text-xs font-bold text-brand-orange-text uppercase mb-2.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                              {cat.label}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {options.map((opt) => {
                                const on = selectedItem.correctEmojis?.includes(
                                  opt.emoji
                                );
                                return (
                                  <button
                                    key={opt.emoji + opt.label}
                                    type="button"
                                    onClick={() =>
                                      toggleEmoji(selectedItem.id, opt.emoji)
                                    }
                                    className={cn(
                                      "flex items-center gap-2 p-2.5 rounded-xl border-2 text-left cursor-pointer",
                                      on
                                        ? "bg-orange-50 border-brand-orange/50"
                                        : "bg-white border-stone-100 hover:border-brand-orange/30"
                                    )}
                                  >
                                    <span className="text-xl shrink-0">
                                      {opt.emoji}
                                    </span>
                                    <span
                                      className={cn(
                                        "text-[11px] font-bold flex-1",
                                        on
                                          ? "text-brand-orange-text"
                                          : "text-stone-600"
                                      )}
                                    >
                                      {opt.label}
                                    </span>
                                    {on && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                                    )}
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
                <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-3">
                  <Settings size={40} className="text-stone-300" />
                  <p className="font-bold text-xs uppercase tracking-widest">
                    Vyberte taxon vlevo
                  </p>
                  <p className="text-[11px] text-center max-w-xs">
                    Ukládání posílá jen frontu změn (ne celý strom) — dva admini
                    si nepřepisují nesouvisející úpravy.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "emojis" && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-stone-50/40">
            <div className="max-w-4xl mx-auto space-y-5">
              <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-stone-900">
                    Emoji a kategorie
                  </h2>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                    Katalog vlastností v paletě kvízu
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addCategory}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange hover:bg-brand-orange-text text-white rounded-xl font-bold text-xs uppercase tracking-wide cursor-pointer shadow-sm shadow-brand-orange/15"
                >
                  <Plus size={14} /> Přidat kategorii
                </button>
              </div>

              {localCategories.map((cat, catIndex) => {
                const options = localEmojis.filter(
                  (e) => e.category === cat.key
                );
                const isAdding = addingEmojiTo === cat.key;
                return (
                  <div
                    key={cat.key}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex flex-col shrink-0">
                          <button
                            type="button"
                            onClick={() => moveCategory(catIndex, "up")}
                            disabled={catIndex === 0}
                            className="p-0.5 text-stone-400 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveCategory(catIndex, "down")}
                            disabled={catIndex === localCategories.length - 1}
                            className="p-0.5 text-stone-400 hover:text-brand-orange disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-stone-800 flex items-center gap-2 min-w-0">
                          <span className="truncate">{cat.label}</span>
                          <span className="shrink-0 text-[9px] bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-full text-stone-400 font-black uppercase">
                            {options.length} položek
                          </span>
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setAddingEmojiTo(isAdding ? null : cat.key)
                          }
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wide border cursor-pointer transition-all",
                            isAdding
                              ? "bg-rose-50 border-rose-100 text-rose-500"
                              : "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200/60"
                          )}
                        >
                          {isAdding ? (
                            <>
                              <X size={12} /> Zrušit
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Přidat emoji
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeCategory(cat.key)}
                          className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Smazat kategorii"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {isAdding && (
                      <div className="bg-orange-50/40 p-4 rounded-2xl border-2 border-brand-orange/30 grid sm:grid-cols-[auto_1fr] gap-4">
                        <div>
                          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex justify-between gap-2 mb-1.5">
                            <span>Emoji</span>
                            <a
                              href="https://emojipedia.org"
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-orange hover:underline flex items-center gap-1 normal-case tracking-normal"
                            >
                              Emojipedia <ExternalLink size={10} />
                            </a>
                          </label>
                          <input
                            value={newEmoji}
                            onChange={(e) => setNewEmoji(e.target.value)}
                            placeholder="🔍"
                            className="w-12 h-12 text-xl text-center bg-white border-2 border-dashed border-stone-300 rounded-2xl focus:border-brand-orange outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                            Popis
                          </label>
                          <input
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange outline-none text-sm"
                            placeholder="Název vlastnosti…"
                          />
                          <button
                            type="button"
                            onClick={() => saveNewEmoji(cat.key)}
                            disabled={!newEmoji || !newLabel}
                            className="self-start px-4 py-2 bg-brand-orange hover:bg-brand-orange-text text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                          >
                            <Check size={14} /> Uložit do kategorie
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {options.map((opt) => {
                        const isEditing = editingEmoji === opt.emoji;
                        const count = emojiUsageCount.get(opt.emoji) || 0;
                        return (
                          <div
                            key={opt.emoji + opt.label}
                            className="flex items-center gap-3 p-3 bg-stone-50/40 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors group"
                          >
                            {isEditing ? (
                              <input
                                value={editEmojiChar}
                                onChange={(e) =>
                                  setEditEmojiChar(e.target.value)
                                }
                                className="w-12 h-10 text-xl text-center border border-orange-200 rounded-xl bg-orange-50 shrink-0"
                              />
                            ) : (
                              <span className="text-xl w-9 text-center shrink-0 select-none leading-none">
                                {opt.emoji}
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    value={editLabel}
                                    onChange={(e) =>
                                      setEditLabel(e.target.value)
                                    }
                                    className="flex-1 px-2 py-1.5 text-xs border border-orange-200 rounded-lg bg-orange-50"
                                    onKeyDown={(e) =>
                                      e.key === "Enter" &&
                                      handleUpdateEmoji(opt.emoji)
                                    }
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateEmoji(opt.emoji)}
                                    className="text-emerald-500 cursor-pointer"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingEmoji(null)}
                                    className="text-stone-400 cursor-pointer"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <p className="font-bold text-xs text-stone-700 leading-snug">
                                      {opt.label}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingEmoji(opt.emoji);
                                        setEditEmojiChar(opt.emoji);
                                        setEditLabel(opt.label);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-brand-orange transition-all bg-white rounded border border-stone-100 cursor-pointer"
                                    >
                                      <Edit2 size={10} />
                                    </button>
                                  </div>
                                  <span
                                    className={cn(
                                      "inline-block mt-1 text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                      count > 0
                                        ? "bg-orange-50 border border-orange-100 text-orange-700"
                                        : "bg-stone-100 border border-stone-200 text-stone-400"
                                    )}
                                  >
                                    Použito: {count}×
                                  </span>
                                </>
                              )}
                            </div>
                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() => removeEmojiOpt(opt.emoji)}
                                className="p-1.5 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {options.length === 0 && (
                        <p className="text-xs text-stone-400 italic col-span-full py-2">
                          Prázdná kategorie — přidejte emoji tlačítkem výše.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
