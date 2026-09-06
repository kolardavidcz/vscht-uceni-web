# Modul 0: Od Biologické Intuice k Jazyku Grafů

> **Cíl modulu:** Vybudovat neotřesitelný základ pro diskrétní matematiku a teorii grafů. Přeložíme vaši přirozenou bioinformatickou a chemickou intuici (molekulární struktury, metabolické reakční sítě, protein-proteinové interakce, fylogenetické stromy a sekvenování DNA) do srozumitelného jazyka grafů $G = (V, E)$, abyste přesně věděli, co je vrchol, hrana, strom a cyklus ještě před první přednáškou z AG1 na FIT ČVUT.

---

## 🗺️ Co je to vlastně graf? (Opravdu, bez vzorců)

Ty grafy, o kterých bude celý tento kurz, **nejsou grafy funkcí** ze střední školy ($y = x^2$ apod.). Jsou to úplně jiná zvířata.

Nejsnazší způsob, jak si graf představit: **mapa metra**.

```
  Muzeum ──────── Náměstí Míru
     │                  │
  Muzeum Nár.      I.P. Pavlova
     │                  │
  Florenc ────── Hlavní nádraží
```

V téhle mapě:
- **Stanice** = vrcholy (uzly) grafu
- **Koleje mezi stanicemi** = hrany grafu

To je vše. Graf = věci + spojení mezi nimi.

Jakmile tohle pochopíš, uvidíš grafy všude:
- **Sociální síť**: lidé = vrcholy, přátelství = hrany
- **Metabolická dráha**: metabolity = vrcholy, enzymatické reakce = hrany  
- **Internet**: routery = vrcholy, kabely = hrany
- **Protein-proteinová interakce**: proteiny = vrcholy, fyzická vazba = hrana

> 💡 **Intuice bez vzorce:** Graf je způsob, jak zakreslit, co je s čím spojeno. Matematický jazyk nám pak umožní o těchto spojeních přesně uvažovat a dokazovat věci.

---

## 1. Předmluva: Proč Bioinformatik Potřebuje Teoretickou Informatiku? V biologii a chemii jste zvyklí nahlížet na složité systémy vizuálně a přírodovědně:
- Vidíte **molekulu glukózy** a chápete její prostorovou konformaci a chemické kovalentní vazby mezi atomy Uhlíku, Kyslíku a Vodíku.
- Vidíte **metabolickou dráhu glykolýzy** a vnímáte ji jako posloupnost enzymatických přeměn jednoho substrátu v druhý.

Jakmile však vstoupíte do kurzu **AG1 (Algoritmy a Grafy 1)** na FIT ČVUT, akademický jazyk se radikálně promění:
- Místo *"chemické molekuly"* pracujete s **neorientovaným grafem** $G = (V, E)$.
- Místo *"enzymatické reakce"* pracujete s **orientovanou hranou** $e = (u, v) \in E$ v **orientovaném acyklickém grafu (DAG)**.

---

### 🧬 Molekula Glukózy jako Neorientovaný Graf

V chemii vnímáme glukózu jako molekulu $C_6H_{12}O_6$. V teoretické informatice je to **neorientovaný graf** $G = (V, E)$:
- **Vrcholy $V$ (Atomy):** Jednotlivé atomy tvoří uzly sítě ($C_1, \dots, C_6, O_{\text{kruh}}, \dots$).
- **Hrany $E$ (Kovalentní vazby):** Sdílený elektronový pár mezi dvěma atomy tvoří neorientovanou hranu $\{u, v\}$. Vazba působí vzájemně — nemá žádný „směr šipky".

<div class="my-6 p-5 rounded-2xl bg-stone-100/90 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-300">⚛️ Schéma Grafu: Molekula α-D-Glukopyranózy</span>
    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">Neorientovaný graf G = (V, E)</span>
  </div>
  <div class="bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col items-center justify-center shadow-2xs">
<svg viewBox="0 0 540 240" class="w-full max-w-[500px] h-auto" xmlns="http://www.w3.org/2000/svg">
<line x1="280" y1="50" x2="355" y2="85" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="355" y1="85" x2="355" y2="155" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="355" y1="155" x2="280" y2="190" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="280" y1="190" x2="205" y2="155" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="205" y1="155" x2="205" y2="85" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="205" y1="85" x2="280" y2="50" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="205" y1="85" x2="135" y2="50" stroke="#475569" stroke-width="4" stroke-linecap="round" />
<line x1="135" y1="50" x2="70" y2="50" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />
<line x1="355" y1="85" x2="425" y2="85" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />
<line x1="355" y1="155" x2="425" y2="175" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />
<line x1="280" y1="190" x2="280" y2="230" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />
<line x1="205" y1="155" x2="135" y2="175" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />
<circle cx="280" cy="50" r="18" fill="#e11d48" />
<text x="280" y="56" fill="#ffffff" font-size="15" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">O</text>
<circle cx="355" cy="85" r="18" fill="#1e293b" />
<text x="355" y="91" fill="#ffffff" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₁</text>
<circle cx="355" cy="155" r="18" fill="#1e293b" />
<text x="355" y="161" fill="#ffffff" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₂</text>
<circle cx="280" cy="190" r="18" fill="#1e293b" />
<text x="280" y="196" fill="#ffffff" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₃</text>
<circle cx="205" cy="155" r="18" fill="#1e293b" />
<text x="205" y="161" fill="#ffffff" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₄</text>
<circle cx="205" cy="85" r="18" fill="#1e293b" />
<text x="205" y="91" fill="#ffffff" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₅</text>
<circle cx="135" cy="50" r="18" fill="#1e293b" />
<text x="135" y="56" fill="#ffffff" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₆</text>
<rect x="425" y="73" width="46" height="24" rx="6" fill="#ea580c" />
<text x="448" y="89" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH</text>
<rect x="425" y="163" width="46" height="24" rx="6" fill="#ea580c" />
<text x="448" y="179" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH</text>
<rect x="257" y="215" width="46" height="22" rx="6" fill="#ea580c" />
<text x="280" y="230" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH</text>
<rect x="89" y="163" width="46" height="24" rx="6" fill="#ea580c" />
<text x="112" y="179" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH</text>
<rect x="24" y="38" width="46" height="24" rx="6" fill="#ea580c" />
<text x="47" y="54" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH</text>
</svg>
  </div>
  <p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed text-center">
    <strong>Formální popis:</strong> Množina vrcholů $V = \{C_1, C_2, C_3, C_4, C_5, C_6, O_{\text{kruh}}, \dots\}$, množina neorientovaných hran $E = \{\{C_1, C_2\}, \{C_1, O\}, \dots\}$.
  </p>
</div>

---

### ⚡ Metabolická Dráha Glykolýzy jako Orientovaný Graf (DAG)

Při odbourávání cukru v buňce probíhá kaskáda enzymatických reakcí. Každá reakce je jednosměrná (spotřebovává energii či uvolňuje teplo):
- **Vrcholy $V$ (Metabolity):** Chemické látky v buňce (Glukóza, Glukóza-6-fosfát, Fruktóza-6-fosfát, Pyruvát).
- **Hrany $E$ (Enzymatické reakce):** Orientované šipky $(u, v) \in V \times V$. Reakce jde z výchozího substrátu $u$ do výsledného produktu $v$.
- **Acykličnost (DAG):** Glykolýza je přímá energetická dráha — metabolity se v ní netočí dokola, ale směřují k pyruvátu.

<div class="my-6 p-5 rounded-2xl bg-stone-100/90 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs font-bold uppercase tracking-wide text-stone-700 dark:text-stone-300">🔄 Schéma Grafu: Začátek Glykolýzy (Enzymatická kaskáda)</span>
    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Orientovaný acyklický graf (DAG)</span>
  </div>
  <div class="bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col items-center justify-center shadow-2xs overflow-x-auto">
<svg viewBox="0 0 740 140" class="w-full min-w-[620px] max-w-[700px] h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="dag-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
</marker>
</defs>
<line x1="120" y1="70" x2="190" y2="70" stroke="#059669" stroke-width="3.5" marker-end="url(#dag-arrow)" />
<text x="155" y="48" fill="#059669" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Hexokináza</text>
<line x1="315" y1="70" x2="380" y2="70" stroke="#059669" stroke-width="3.5" marker-end="url(#dag-arrow)" />
<text x="347" y="48" fill="#059669" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">PGI</text>
<line x1="505" y1="70" x2="570" y2="70" stroke="#059669" stroke-width="3.5" marker-end="url(#dag-arrow)" />
<text x="537" y="48" fill="#059669" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">PFK-1</text>
<line x1="695" y1="70" x2="725" y2="70" stroke="#059669" stroke-width="3.5" stroke-dasharray="4 3" marker-end="url(#dag-arrow)" />
<rect x="15" y="45" width="105" height="50" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="67" y="75" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="13" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Glukóza</text>
<rect x="190" y="45" width="125" height="50" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="252" y="70" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Glukóza-6-P</text>
<text x="252" y="85" fill="#64748b" font-size="10" font-weight="600" font-family="sans-serif" text-anchor="middle">(-1 ATP)</text>
<rect x="380" y="45" width="125" height="50" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="442" y="75" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Fruktóza-6-P</text>
<rect x="570" y="45" width="125" height="50" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="632" y="70" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Fruktóza-1,6-bisP</text>
<text x="632" y="85" fill="#64748b" font-size="10" font-weight="600" font-family="sans-serif" text-anchor="middle">(-1 ATP)</text>
</svg>
  </div>
  <p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed text-center">
    <strong>Orientovaný graf:</strong> Hrany jsou uspořádané dvojice $(u, v)$ – mají jasný směr. V DAGu nelze po šipkách obejít kolečko zpět!
  </p>
</div>

---

## 2. Co je to Strom a co je to Cyklus v Grafu? `[KLÍČOVÝ ROZDÍL]`

Dva nejdůležitější grafové pojmy, se kterými budete v AG1 pracovat každý týden, mají přímé biologické protějšky:

<div class="my-6 grid grid-cols-1 md:grid-cols-2 gap-5">
<div class="p-5 rounded-2xl bg-stone-100/90 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-3">
<h3 class="text-base font-bold text-stone-900 dark:text-stone-100 m-0! flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
🌲 Strom (Acyklický souvislý graf)
</h3>
<span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">Žádné smyčky</span>
</div>
<div class="bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex items-center justify-center shadow-2xs">
<svg viewBox="0 0 280 180" class="w-full max-w-[240px] h-auto" xmlns="http://www.w3.org/2000/svg">
<line x1="140" y1="30" x2="80" y2="85" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="140" y1="30" x2="200" y2="85" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="80" y1="85" x2="50" y2="145" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="80" y1="85" x2="110" y2="145" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="200" y1="85" x2="170" y2="145" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="200" y1="85" x2="230" y2="145" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<circle cx="140" cy="30" r="14" fill="#047857" />
<text x="140" y="35" fill="#ffffff" font-size="11" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">LUCA</text>
<circle cx="80" cy="85" r="12" fill="#10b981" />
<circle cx="200" cy="85" r="12" fill="#10b981" />
<circle cx="50" cy="145" r="10" fill="#34d399" />
<circle cx="110" cy="145" r="10" fill="#34d399" />
<circle cx="170" cy="145" r="10" fill="#34d399" />
<circle cx="230" cy="145" r="10" fill="#34d399" />
</svg>
</div>
<ul class="text-xs text-stone-700 dark:text-stone-300 mt-3.5 space-y-1.5 pl-4 list-disc">
<li><strong>Definice:</strong> Souvislý graf, který <strong>neobsahuje žádný cyklus</strong>.</li>
<li><strong>Unikátní vlastnost:</strong> Mezi libovolnými dvěma vrcholy existuje <strong>právě jedna jediná cesta</strong>!</li>
<li><strong>Biologický příklad:</strong> Fylogenetický strom druhů (od společného předka LUCA k žijícím taxonům), větvení krevního řečiště či průdušek v plicích.</li>
</ul>
</div>
</div>
<div class="p-5 rounded-2xl bg-stone-100/90 dark:bg-[#1a120c] border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
<div>
<div class="flex items-center justify-between mb-3">
<h3 class="text-base font-bold text-stone-900 dark:text-stone-100 m-0! flex items-center gap-2">
<span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
🔄 Cyklus (Uzavřený okruh)
</h3>
<span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">Návrat do výchozího bodu</span>
</div>
<div class="bg-white dark:bg-[#0f0906] p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 flex items-center justify-center shadow-2xs">
<svg viewBox="0 0 280 180" class="w-full max-w-[240px] h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="cycle-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
</marker>
</defs>
<line x1="95" y1="45" x2="185" y2="45" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="205" y1="58" x2="225" y2="115" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="215" y1="130" x2="155" y2="155" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="125" y1="155" x2="65" y2="130" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="55" y1="115" x2="75" y2="58" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<circle cx="80" cy="45" r="14" fill="#e11d48" />
<text x="80" y="50" fill="#ffffff" font-size="10" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OAA</text>
<circle cx="200" cy="45" r="14" fill="#e11d48" />
<text x="200" y="50" fill="#ffffff" font-size="10" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Cit</text>
<circle cx="230" cy="125" r="14" fill="#e11d48" />
<text x="230" y="130" fill="#ffffff" font-size="10" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">αKG</text>
<circle cx="140" cy="160" r="14" fill="#e11d48" />
<text x="140" y="165" fill="#ffffff" font-size="10" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Suc</text>
<circle cx="50" cy="125" r="14" fill="#e11d48" />
<text x="50" y="130" fill="#ffffff" font-size="10" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Mal</text>
</svg>
</div>
<ul class="text-xs text-stone-700 dark:text-stone-300 mt-3.5 space-y-1.5 pl-4 list-disc">
<li><strong>Definice:</strong> Uzavřená posloupnost hran, kde z libovolného uzlu vyrazíte a <strong>vrátíte se do něj zpět</strong>.</li>
<li><strong>Důsledek:</strong> Umožňuje opakování, zpětnou vazbu a oscilace. Vede k existenci více různých cest.</li>
<li><strong>Biologický příklad:</strong> Krebsův citrátový cyklus (obnova oxaloacetátu), Calvinův cyklus, negativní zpětnovazebná regulace hormonů.</li>
</ul>
</div>
</div>
</div>

