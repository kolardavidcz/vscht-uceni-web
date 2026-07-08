import { EmojiOption, WorksheetItem } from '../../../types';

export const emojiOptions: EmojiOption[] = [
  // Typ buněčné stěny a morfologie
  { emoji: "🔴", label: "Gram-negativní (G-)", category: "Buněčná stěna" },
  { emoji: "🔵", label: "Gram-pozitivní (G+)", category: "Buněčná stěna" },
  { emoji: "🧱❌", label: "Bez buněčné stěny", category: "Buněčná stěna" },
  { emoji: "🔵🔴", label: "G+ i G- typ", category: "Buněčná stěna" },
  { emoji: "⚪", label: "Kok (kulatý tvar)", category: "Morfologie" },
  { emoji: "🌭", label: "Tyčinka", category: "Morfologie" },
  { emoji: "〰️", label: "Spirála/Helikální", category: "Morfologie" },
  { emoji: "🌿", label: "Vláknitá/Větvící se", category: "Morfologie" },
  { emoji: "🍇", label: "Shluky (hroznovité)", category: "Morfologie" },
  { emoji: "⛓️", label: "Řetízky", category: "Morfologie" },

  // Fyziologie a metabolismus
  { emoji: "💨", label: "Aerobní", category: "Fyziologie" },
  { emoji: "🚫💨", label: "Anaerobní", category: "Fyziologie" },
  { emoji: "☁️", label: "Mikroaerofilní", category: "Fyziologie" },
  { emoji: "🌗", label: "Fakultativně anaerobní", category: "Fyziologie" },
  { emoji: "🔥", label: "Termofilní (teplomilné)", category: "Fyziologie" },
  { emoji: "🥶", label: "Psychrofilní (chladnomilné)", category: "Fyziologie" },
  { emoji: "☀️", label: "Fototrofní", category: "Fyziologie" },
  { emoji: "🧪", label: "Chemotrofní", category: "Fyziologie" },
  { emoji: "🍬", label: "Fermentace (kvašení)", category: "Fyziologie" },
  { emoji: "N", label: "Fixace dusíku", category: "Fyziologie" },
  { emoji: "🪨", label: "Chemolitotrofie", category: "Fyziologie" },
  { emoji: "🪫", label: "Energetický parazitismus", category: "Fyziologie" },
  { emoji: "CH4", label: "Metanotrofie / Methylotrofie", category: "Fyziologie" },
  { emoji: "💡", label: "Bioluminiscence", category: "Fyziologie" },
  { emoji: "🛡️", label: "Tvorba spor/cyst", category: "Fyziologie" },

  // Biologické interakce
  { emoji: "🤝", label: "Symbiont / Mutualista", category: "Interakce" },
  { emoji: "🤷", label: "Komenzál", category: "Interakce" },
  { emoji: "♻️", label: "Saprofyt / Dekompozitor", category: "Interakce" },

  // Pohyblivost a ekologie
  { emoji: "🏃", label: "Pohyblivé (bičíky)", category: "Pohyblivost" },
  { emoji: "🚫🏃", label: "Nepohyblivé", category: "Pohyblivost" },
  { emoji: "💧", label: "Vodní prostředí", category: "Ekologie" },
  { emoji: "🌱", label: "Půda / Rostliny", category: "Ekologie" },
  { emoji: "🐄", label: "Zvířata", category: "Ekologie" },
  { emoji: "🧑", label: "Lidé", category: "Ekologie" },
  { emoji: "☢️", label: "Extrémní prostředí / Radiotolerance", category: "Ekologie" },

  // Patogenita a parazitismus
  { emoji: "🧛", label: "Obligátní/Intracelulární parazit", category: "Patogenita" },
  { emoji: "🦠", label: "Parazit/Patogen", category: "Patogenita" },
  { emoji: "☠️", label: "Produkce toxinu", category: "Patogenita" },
  { emoji: "🤒", label: "Onemocnění / Zánět", category: "Patogenita" },
  { emoji: "🤢", label: "Trávicí potíže", category: "Patogenita" },
  { emoji: "🫁", label: "Respirační potíže", category: "Patogenita" },
  { emoji: "🧠", label: "Nervová soustava", category: "Patogenita" },
  { emoji: "💊", label: "Produkce antibiotik", category: "Patogenita" },
  { emoji: "🕷️", label: "Přenašeč (vektor)", category: "Patogenita" },
  { emoji: "🦈", label: "Predátor jiných bakterií", category: "Patogenita" },
  { emoji: "🧬", label: "Genetické inženýrství / Biotechnologie", category: "Patogenita" },
  { emoji: "🥛", label: "Mlékařství / Potravinářství", category: "Patogenita" },
  { emoji: "🐛", label: "Insekticid / Škůdce hmyzu", category: "Patogenita" },
];

// Categories for display
export const emojiCategories = [
  { key: "Buněčná stěna", label: "🧱 Buněčná stěna a morfologie" },
  { key: "Morfologie", label: "🔬 Morfologie" },
  { key: "Fyziologie", label: "⚡ Fyziologie a metabolismus" },
  { key: "Interakce", label: "🤝 Biologické interakce" },
  { key: "Pohyblivost", label: "🏃 Pohyblivost" },
  { key: "Ekologie", label: "🌍 Ekologie" },
  { key: "Patogenita", label: "⚠️ Patogenita a parazitismus" },
];

// Flatten all emoji options for palette display
export function getEmojisByCategory() {
  const map = new Map<string, EmojiOption[]>();
  for (const option of emojiOptions) {
    if (!map.has(option.category)) {
      map.set(option.category, []);
    }
    map.get(option.category)!.push(option);
  }
  return map;
}

export function sortEmojis(emojis: string[], options: EmojiOption[] = emojiOptions): string[] {
  const orderMap = new Map<string, number>();
  options.forEach((opt, index) => {
    orderMap.set(opt.emoji, index);
  });
  return [...emojis].sort((a, b) => {
    const indexA = orderMap.has(a) ? orderMap.get(a)! : 999;
    const indexB = orderMap.has(b) ? orderMap.get(b)! : 999;
    return indexA - indexB;
  });
}

export function getCleanLabel(emoji: string, options: EmojiOption[] = emojiOptions): string {
  const option = options.find(o => o.emoji === emoji);
  if (!option) return '';
  return option.label.replace(/\s*\(.*?\)/g, '').trim();
}

export function generateHint(item: WorksheetItem, options: EmojiOption[] = emojiOptions): string {
  const emojis = [
    ...(item.correctEmojis || []),
    ...(item.groups?.flatMap(g => g.correctEmojis || []) || [])
  ];
  const sorted = sortEmojis(emojis, options);
  const labels = sorted
    .map(e => getCleanLabel(e, options))
    .filter(Boolean);
  return Array.from(new Set(labels)).join(', ');
}

export function enrichWorksheetData(items: WorksheetItem[], options: EmojiOption[] = emojiOptions): WorksheetItem[] {
  return items.map(item => {
    const sortedCorrect = sortEmojis(item.correctEmojis || [], options);
    
    const enrichedItem: WorksheetItem = {
      ...item,
      correctEmojis: sortedCorrect,
    };

    if (item.groups) {
      enrichedItem.groups = item.groups.map(g => ({
        ...g,
        correctEmojis: sortEmojis(g.correctEmojis || [], options)
      }));
    }

    // Generate dynamic hint
    enrichedItem.hint = generateHint(enrichedItem, options);

    if (item.children) {
      enrichedItem.children = enrichWorksheetData(item.children, options);
    }

    return enrichedItem;
  });
}
