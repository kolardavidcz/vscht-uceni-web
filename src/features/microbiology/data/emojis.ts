import { EmojiOption, WorksheetItem } from '../types';

export const emojiOptions: EmojiOption[] = [
  // Typ buněčné stěny a morfologie
  { emoji: "\u{1F534}", label: "Gram-negativní (G-)", category: "Buněčná stěna" },
  { emoji: "\u{1F535}", label: "Gram-pozitivní (G+)", category: "Buněčná stěna" },
  { emoji: "\u{1F9F1}\u274C", label: "Bez buněčné stěny", category: "Buněčná stěna" },
  { emoji: "\u{1F535}\u{1F534}", label: "G+ i G- typ", category: "Buněčná stěna" },
  { emoji: "\u26AA", label: "Kok (kulatý tvar)", category: "Morfologie" },
  { emoji: "\u{1F32D}", label: "Tyčinka", category: "Morfologie" },
  { emoji: "\u3030\uFE0F", label: "Spirála/Helikální", category: "Morfologie" },
  { emoji: "\u{1F33F}", label: "Vláknitá/Větvící se", category: "Morfologie" },
  { emoji: "\u{1F347}", label: "Shluky (hroznovité)", category: "Morfologie" },
  { emoji: "\u26D3\uFE0F", label: "Řetízky", category: "Morfologie" },

  // Fyziologie a metabolismus
  { emoji: "\u{1F4A8}", label: "Aerobní", category: "Fyziologie" },
  { emoji: "\u{1F6AB}\u{1F4A8}", label: "Anaerobní", category: "Fyziologie" },
  { emoji: "\u2601\uFE0F", label: "Mikroaerofilní", category: "Fyziologie" },
  { emoji: "\u{1F317}", label: "Fakultativně anaerobní", category: "Fyziologie" },
  { emoji: "\u{1F525}", label: "Termofilní (teplomilné)", category: "Fyziologie" },
  { emoji: "\u{1F976}", label: "Psychrofilní (chladnomilné)", category: "Fyziologie" },
  { emoji: "\u2600\uFE0F", label: "Fototrofní", category: "Fyziologie" },
  { emoji: "\u{1F9EA}", label: "Chemotrofní", category: "Fyziologie" },
  { emoji: "\u{1F36C}", label: "Fermentace (kvašení)", category: "Fyziologie" },
  { emoji: "N", label: "Fixace dusíku", category: "Fyziologie" },
  { emoji: "\u{1FAA8}", label: "Chemolitotrofie", category: "Fyziologie" },
  { emoji: "\u{1FAAB}", label: "Energetický parazitismus", category: "Fyziologie" },
  { emoji: "CH4", label: "Metanotrofie / Methylotrofie", category: "Fyziologie" },
  { emoji: "\u{1F4A1}", label: "Bioluminiscence", category: "Fyziologie" },
  { emoji: "\u{1F6E1}\uFE0F", label: "Tvorba spor/cyst", category: "Fyziologie" },

  // Biologické interakce
  { emoji: "\u{1F91D}", label: "Symbiont / Mutualista", category: "Interakce" },
  { emoji: "\u{1F937}", label: "Komenzál", category: "Interakce" },
  { emoji: "\u267B\uFE0F", label: "Saprofyt / Dekompozitor", category: "Interakce" },

  // Pohyblivost a ekologie
  { emoji: "\u{1F3C3}", label: "Pohyblivé (bičíky)", category: "Pohyblivost" },
  { emoji: "\u{1F6AB}\u{1F3C3}", label: "Nepohyblivé", category: "Pohyblivost" },
  { emoji: "\u{1F4A7}", label: "Vodní prostředí", category: "Ekologie" },
  { emoji: "\u{1F331}", label: "Půda / Rostliny", category: "Ekologie" },
  { emoji: "\u{1F404}", label: "Zvířata", category: "Ekologie" },
  { emoji: "\u{1F9D1}", label: "Lidé", category: "Ekologie" },
  { emoji: "\u2622\uFE0F", label: "Extrémní prostředí / Radiotolerance", category: "Ekologie" },

  // Patogenita a parazitismus
  { emoji: "\u{1F9DB}", label: "Obligátní/Intracelulární parazit", category: "Patogenita" },
  { emoji: "\u{1F9A0}", label: "Parazit/Patogen", category: "Patogenita" },
  { emoji: "\u2620\uFE0F", label: "Produkce toxinu", category: "Patogenita" },
  { emoji: "\u{1F912}", label: "Onemocnění / Zánět", category: "Patogenita" },
  { emoji: "\u{1F922}", label: "Trávicí potíže", category: "Patogenita" },
  { emoji: "\u{1FAC1}", label: "Respirační potíže", category: "Patogenita" },
  { emoji: "\u{1F9E0}", label: "Nervová soustava", category: "Patogenita" },
  { emoji: "\u{1F48A}", label: "Produkce antibiotik", category: "Patogenita" },
  { emoji: "\u{1F577}\uFE0F", label: "Přenašeč (vektor)", category: "Patogenita" },
  { emoji: "\u{1F988}", label: "Predátor jiných bakterií", category: "Patogenita" },
  { emoji: "\u{1F9EC}", label: "Genetické inženýrství / Biotechnologie", category: "Patogenita" },
  { emoji: "\u{1F95B}", label: "Mlékařství / Potravinářství", category: "Patogenita" },
  { emoji: "\u{1F41B}", label: "Insekticid / Škůdce hmyzu", category: "Patogenita" },
];

// Categories for display
export const emojiCategories = [
  { key: "Buněčná stěna", label: "\u{1F9F1} Buněčná stěna a morfologie" },
  { key: "Morfologie", label: "\u{1F52C} Morfologie" },
  { key: "Fyziologie", label: "\u26A1 Fyziologie a metabolismus" },
  { key: "Interakce", label: "\u{1F91D} Biologické interakce" },
  { key: "Pohyblivost", label: "\u{1F3C3} Pohyblivost" },
  { key: "Ekologie", label: "\u{1F30D} Ekologie" },
  { key: "Patogenita", label: "\u26A0\uFE0F Patogenita a parazitismus" },
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
