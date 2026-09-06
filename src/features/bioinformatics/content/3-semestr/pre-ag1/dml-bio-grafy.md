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
<svg viewBox="0 0 540 250" class="w-full max-w-[520px] h-auto" xmlns="http://www.w3.org/2000/svg">
<!-- Hrany kruhu a navazující vazby -->
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
<line x1="280" y1="190" x2="280" y2="228" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />
<line x1="205" y1="155" x2="135" y2="175" stroke="#c2410c" stroke-width="3" stroke-dasharray="4 3" stroke-linecap="round" />

<!-- Návěští hran (e₁ .. e₁₂) -->
<rect x="312" y="58" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="321" y="68" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>

<rect x="362" y="114" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="371" y="124" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>

<rect x="312" y="174" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="321" y="184" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>

<rect x="233" y="174" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="242" y="184" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₄</text>

<rect x="194" y="114" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="203" y="124" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₅</text>

<rect x="233" y="58" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="242" y="68" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₆</text>

<rect x="161" y="58" width="18" height="13" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1" class="fill-white dark:fill-[#1e1712] stroke-stone-400 dark:stroke-stone-600" />
<text x="170" y="68" fill="#0f172a" class="fill-stone-800 dark:fill-stone-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₇</text>

<rect x="94" y="42" width="18" height="13" rx="3" fill="#fff7ed" stroke="#ea580c" stroke-width="1" class="dark:fill-[#2a1708] dark:stroke-orange-600" />
<text x="103" y="52" fill="#c2410c" class="dark:fill-orange-300" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₈</text>

<rect x="382" y="77" width="18" height="13" rx="3" fill="#fff7ed" stroke="#ea580c" stroke-width="1" class="dark:fill-[#2a1708] dark:stroke-orange-600" />
<text x="391" y="87" fill="#c2410c" class="dark:fill-orange-300" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₉</text>

<rect x="382" y="167" width="20" height="13" rx="3" fill="#fff7ed" stroke="#ea580c" stroke-width="1" class="dark:fill-[#2a1708] dark:stroke-orange-600" />
<text x="392" y="177" fill="#c2410c" class="dark:fill-orange-300" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁₀</text>

<rect x="286" y="202" width="20" height="13" rx="3" fill="#fff7ed" stroke="#ea580c" stroke-width="1" class="dark:fill-[#2a1708] dark:stroke-orange-600" />
<text x="296" y="212" fill="#c2410c" class="dark:fill-orange-300" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁₁</text>

<rect x="160" y="167" width="20" height="13" rx="3" fill="#fff7ed" stroke="#ea580c" stroke-width="1" class="dark:fill-[#2a1708] dark:stroke-orange-600" />
<text x="170" y="177" fill="#c2410c" class="dark:fill-orange-300" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁₂</text>

<!-- Vrcholy (Atomy v₁ .. v₁₂) -->
<circle cx="280" cy="50" r="19" fill="#e11d48" />
<text x="280" y="48" fill="#ffffff" font-size="12" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">O</text>
<text x="280" y="60" fill="#fecdd3" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₁</text>

<circle cx="355" cy="85" r="19" fill="#1e293b" />
<text x="355" y="83" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₁</text>
<text x="355" y="95" fill="#94a3b8" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₂</text>

<circle cx="355" cy="155" r="19" fill="#1e293b" />
<text x="355" y="153" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₂</text>
<text x="355" y="165" fill="#94a3b8" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₃</text>

<circle cx="280" cy="190" r="19" fill="#1e293b" />
<text x="280" y="188" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₃</text>
<text x="280" y="200" fill="#94a3b8" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₄</text>

<circle cx="205" cy="155" r="19" fill="#1e293b" />
<text x="205" y="153" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₄</text>
<text x="205" y="165" fill="#94a3b8" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₅</text>

<circle cx="205" cy="85" r="19" fill="#1e293b" />
<text x="205" y="83" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₅</text>
<text x="205" y="95" fill="#94a3b8" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₆</text>

<circle cx="135" cy="50" r="19" fill="#1e293b" />
<text x="135" y="48" fill="#ffffff" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">C₆</text>
<text x="135" y="60" fill="#94a3b8" font-size="8.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₇</text>

<!-- OH substituenty (v₈ .. v₁₂) -->
<rect x="425" y="73" width="54" height="24" rx="6" fill="#ea580c" />
<text x="452" y="89" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH (v₈)</text>

<rect x="425" y="163" width="54" height="24" rx="6" fill="#ea580c" />
<text x="452" y="179" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH (v₉)</text>

<rect x="253" y="215" width="54" height="24" rx="6" fill="#ea580c" />
<text x="280" y="231" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH (v₁₀)</text>

<rect x="80" y="163" width="54" height="24" rx="6" fill="#ea580c" />
<text x="107" y="179" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH (v₁₁)</text>

<rect x="18" y="38" width="54" height="24" rx="6" fill="#ea580c" />
<text x="45" y="54" fill="#ffffff" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OH (v₁₂)</text>
</svg>
  </div>
  <p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed text-center">
    <strong>Formální popis:</strong> Množina vrcholů <strong>V = {v₁, v₂, …, v₁₂}</strong> (atomy O, C₁–C₆ a OH), množina neorientovaných hran <strong>E = {e₁, e₂, …, e₁₂}</strong> (kovalentní vazby: e₁ = {v₁, v₂}, e₂ = {v₂, v₃}, …).</p>
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
<svg viewBox="0 0 740 145" class="w-full min-w-[620px] max-w-[700px] h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="dag-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#059669" />
</marker>
</defs>
<!-- Šipky a návěští hran e₁, e₂, e₃ -->
<line x1="120" y1="72" x2="190" y2="72" stroke="#059669" stroke-width="3.5" marker-end="url(#dag-arrow)" />
<rect x="145" y="24" width="20" height="14" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="155" y="34.5" fill="#047857" class="dark:fill-emerald-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>
<text x="155" y="52" fill="#059669" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Hexokináza</text>

<line x1="315" y1="72" x2="380" y2="72" stroke="#059669" stroke-width="3.5" marker-end="url(#dag-arrow)" />
<rect x="337" y="24" width="20" height="14" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="347" y="34.5" fill="#047857" class="dark:fill-emerald-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>
<text x="347" y="52" fill="#059669" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">PGI</text>

<line x1="505" y1="72" x2="570" y2="72" stroke="#059669" stroke-width="3.5" marker-end="url(#dag-arrow)" />
<rect x="527" y="24" width="20" height="14" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1.2" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="537" y="34.5" fill="#047857" class="dark:fill-emerald-200" font-size="9" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>
<text x="537" y="52" fill="#059669" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">PFK-1</text>

<line x1="695" y1="72" x2="725" y2="72" stroke="#059669" stroke-width="3.5" stroke-dasharray="4 3" marker-end="url(#dag-arrow)" />

<!-- Vrcholy v₁ až v₄ -->
<rect x="15" y="45" width="105" height="54" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="67" y="68" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="12.5" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Glukóza</text>
<text x="67" y="85" fill="#059669" class="dark:fill-emerald-400" font-size="10" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">vrchol v₁</text>

<rect x="190" y="45" width="125" height="54" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="252" y="65" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Glukóza-6-P</text>
<text x="252" y="78" fill="#64748b" font-size="9" font-weight="600" font-family="sans-serif" text-anchor="middle">(-1 ATP)</text>
<text x="252" y="90" fill="#059669" class="dark:fill-emerald-400" font-size="9.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">vrchol v₂</text>

<rect x="380" y="45" width="125" height="54" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="442" y="68" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="12" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Fruktóza-6-P</text>
<text x="442" y="85" fill="#059669" class="dark:fill-emerald-400" font-size="10" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">vrchol v₃</text>

<rect x="570" y="45" width="125" height="54" rx="12" fill="#f8fafc" stroke="#334155" stroke-width="2" class="fill-white dark:fill-[#1e1712] stroke-stone-700 dark:stroke-stone-400" />
<text x="632" y="65" fill="#1e293b" class="fill-stone-900 dark:fill-stone-100" font-size="11" font-weight="800" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Fruktóza-1,6-bisP</text>
<text x="632" y="78" fill="#64748b" font-size="9" font-weight="600" font-family="sans-serif" text-anchor="middle">(-1 ATP)</text>
<text x="632" y="90" fill="#059669" class="dark:fill-emerald-400" font-size="9.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">vrchol v₄</text>
</svg>
  </div>
  <p class="text-xs text-stone-600 dark:text-stone-400 mt-3 mb-0 leading-relaxed text-center">
    <strong>Orientovaný graf (DAG):</strong> Množina vrcholů <strong>V = {v₁, v₂, v₃, v₄}</strong> (metabolity), množina orientovaných hran <strong>E = {e₁, e₂, e₃} = {(v₁, v₂), (v₂, v₃), (v₃, v₄)}</strong> (enzymatické kroky). V DAGu nelze po šipkách obejít kolečko zpět!
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
<svg viewBox="0 0 290 190" class="w-full max-w-[250px] h-auto" xmlns="http://www.w3.org/2000/svg">
<!-- Hrany stromu -->
<line x1="145" y1="32" x2="85" y2="88" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="145" y1="32" x2="205" y2="88" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="85" y1="88" x2="52" y2="150" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="85" y1="88" x2="118" y2="150" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="205" y1="88" x2="172" y2="150" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />
<line x1="205" y1="88" x2="238" y2="150" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" />

<!-- Návěští hran (e₁ .. e₆) -->
<rect x="104" y="50" width="16" height="12" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="112" y="59" fill="#047857" class="dark:fill-emerald-200" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>

<rect x="168" y="50" width="16" height="12" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="176" y="59" fill="#047857" class="dark:fill-emerald-200" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>

<rect x="58" y="112" width="16" height="12" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="66" y="121" fill="#047857" class="dark:fill-emerald-200" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>

<rect x="107" y="112" width="16" height="12" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="115" y="121" fill="#047857" class="dark:fill-emerald-200" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₄</text>

<rect x="180" y="112" width="16" height="12" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="188" y="121" fill="#047857" class="dark:fill-emerald-200" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₅</text>

<rect x="226" y="112" width="16" height="12" rx="3" fill="#d1fae5" stroke="#10b981" stroke-width="1" class="dark:fill-[#064e3b] dark:stroke-emerald-600" />
<text x="234" y="121" fill="#047857" class="dark:fill-emerald-200" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₆</text>

<!-- Vrcholy (v₁ .. v₇) -->
<circle cx="145" cy="32" r="16" fill="#047857" />
<text x="145" y="32" fill="#ffffff" font-size="8" font-weight="900" font-family="'Outfit', sans-serif" text-anchor="middle">LUCA</text>
<text x="145" y="42" fill="#a7f3d0" font-size="7.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₁</text>

<circle cx="85" cy="88" r="11" fill="#10b981" />
<text x="85" y="91.5" fill="#ffffff" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₂</text>

<circle cx="205" cy="88" r="11" fill="#10b981" />
<text x="205" y="91.5" fill="#ffffff" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₃</text>

<circle cx="52" cy="150" r="10" fill="#34d399" />
<text x="52" y="153.5" fill="#064e3b" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₄</text>

<circle cx="118" cy="150" r="10" fill="#34d399" />
<text x="118" y="153.5" fill="#064e3b" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₅</text>

<circle cx="172" cy="150" r="10" fill="#34d399" />
<text x="172" y="153.5" fill="#064e3b" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₆</text>

<circle cx="238" cy="150" r="10" fill="#34d399" />
<text x="238" y="153.5" fill="#064e3b" font-size="8" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">v₇</text>
</svg>
</div>
<ul class="text-xs text-stone-700 dark:text-stone-300 mt-3.5 space-y-1.5 pl-4 list-disc">
<li><strong>Definice:</strong> Souvislý graf, který <strong>neobsahuje žádný cyklus</strong>.</li>
<li><strong>Unikátní vlastnost:</strong> Mezi libovolnými dvěma vrcholy existuje <strong>právě jedna jediná cesta</strong>!</li>
<li><strong>Biologický příklad:</strong> Fylogenetický strom taxonů <strong>V = {v₁, …, v₇}</strong> propojených evolučními větvemi <strong>E = {e₁, …, e₆}</strong> od kořene LUCA (v₁).</li>
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
<svg viewBox="0 0 280 190" class="w-full max-w-[250px] h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<marker id="cycle-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e" />
</marker>
</defs>
<!-- Orientované hrany cyklu -->
<line x1="95" y1="45" x2="182" y2="45" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="205" y1="58" x2="225" y2="112" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="215" y1="130" x2="155" y2="155" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="125" y1="155" x2="68" y2="132" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />
<line x1="55" y1="115" x2="74" y2="60" stroke="#f43f5e" stroke-width="3.5" marker-end="url(#cycle-arrow)" />

<!-- Návěští hran (e₁ .. e₅) -->
<rect x="131" y="27" width="18" height="13" rx="3" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1" class="dark:fill-[#4c0519] dark:stroke-rose-600" />
<text x="140" y="37" fill="#be123c" class="dark:fill-rose-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₁</text>

<rect x="227" y="78" width="18" height="13" rx="3" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1" class="dark:fill-[#4c0519] dark:stroke-rose-600" />
<text x="236" y="88" fill="#be123c" class="dark:fill-rose-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₂</text>

<rect x="187" y="152" width="18" height="13" rx="3" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1" class="dark:fill-[#4c0519] dark:stroke-rose-600" />
<text x="196" y="162" fill="#be123c" class="dark:fill-rose-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₃</text>

<rect x="80" y="152" width="18" height="13" rx="3" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1" class="dark:fill-[#4c0519] dark:stroke-rose-600" />
<text x="89" y="162" fill="#be123c" class="dark:fill-rose-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₄</text>

<rect x="42" y="78" width="18" height="13" rx="3" fill="#ffe4e6" stroke="#f43f5e" stroke-width="1" class="dark:fill-[#4c0519] dark:stroke-rose-600" />
<text x="51" y="88" fill="#be123c" class="dark:fill-rose-200" font-size="8.5" font-weight="800" font-family="'Outfit', sans-serif" text-anchor="middle">e₅</text>

<!-- Vrcholy (v₁ .. v₅) -->
<circle cx="80" cy="45" r="15" fill="#e11d48" />
<text x="80" y="44" fill="#ffffff" font-size="9" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">OAA</text>
<text x="80" y="54" fill="#ffe4e6" font-size="7.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₁</text>

<circle cx="200" cy="45" r="15" fill="#e11d48" />
<text x="200" y="44" fill="#ffffff" font-size="9" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Cit</text>
<text x="200" y="54" fill="#ffe4e6" font-size="7.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₂</text>

<circle cx="230" cy="125" r="15" fill="#e11d48" />
<text x="230" y="124" fill="#ffffff" font-size="9" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">αKG</text>
<text x="230" y="134" fill="#ffe4e6" font-size="7.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₃</text>

<circle cx="140" cy="160" r="15" fill="#e11d48" />
<text x="140" y="159" fill="#ffffff" font-size="9" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Suc</text>
<text x="140" y="169" fill="#ffe4e6" font-size="7.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₄</text>

<circle cx="50" cy="125" r="15" fill="#e11d48" />
<text x="50" y="124" fill="#ffffff" font-size="9" font-weight="900" font-family="'Outfit', system-ui, sans-serif" text-anchor="middle">Mal</text>
<text x="50" y="134" fill="#ffe4e6" font-size="7.5" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">v₅</text>
</svg>
</div>
<ul class="text-xs text-stone-700 dark:text-stone-300 mt-3.5 space-y-1.5 pl-4 list-disc">
<li><strong>Definice:</strong> Uzavřená posloupnost hran, kde z libovolného uzlu vyrazíte a <strong>vrátíte se do něj zpět</strong>.</li>
<li><strong>Důsledek:</strong> Umožňuje opakování, zpětnou vazbu a oscilace. Vede k existenci více různých cest.</li>
<li><strong>Biologický příklad:</strong> Krebsův citrátový cyklus <strong>V = {v₁, …, v₅}</strong> s orientovanými reakcemi <strong>E = {e₁, …, e₅} = {(v₁, v₂), (v₂, v₃), (v₃, v₄), (v₄, v₅), (v₅, v₁)}</strong>.</li>
</ul>
</div>
</div>
</div>

