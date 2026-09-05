export interface ProofStep {
  title: string;
  desc: string;
  detail?: string;
}

export interface SlideItem {
  id: number;
  module: number;
  moduleName: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  tags: string[];
  keyFormula?: string;
  examTip?: string;
  proofSteps?: ProofStep[];
  contentHtml: string;
}

export interface ModuleInfo {
  id: number;
  name: string;
  short: string;
  color: string;
  text: string;
}

export const PRE_AG1_MODULES: ModuleInfo[] = [
  { id: 0, name: "Modul 0: Bio-Intuice & Jazyk Grafů", short: "M0: Bio-Grafy", color: "from-teal-500 to-emerald-600", text: "text-emerald-400" },
  { id: 1, name: "Modul 1: Logický & Důkazový základ", short: "M1: Logika", color: "from-blue-500 to-indigo-600", text: "text-indigo-400" },
  { id: 2, name: "Modul 2: Indukce na Grafech & Redukční Past", short: "M2: Indukce", color: "from-rose-500 to-red-600", text: "text-rose-400" },
  { id: 3, name: "Modul 3: Důkazy Sporem & Extremální Princip", short: "M3: Spor & Extrém", color: "from-amber-500 to-orange-600", text: "text-amber-400" },
  { id: 4, name: "Modul 4: Invarianty Cyklů (BFS & Dijkstra)", short: "M4: Invarianty", color: "from-cyan-500 to-blue-600", text: "text-cyan-400" },
  { id: 5, name: "Modul 5: Konstruktivní Důkazy & Bio-Algoritmy", short: "M5: Bio-Algoritmy", color: "from-purple-500 to-fuchsia-600", text: "text-purple-400" },
  { id: 6, name: "Modul 6: Zkouškový Workshop & Šablony", short: "M6: Workshop", color: "from-yellow-400 to-amber-500", text: "text-yellow-400" },
];

export const PRE_AG1_SLIDES: SlideItem[] = [
  {
    "id": 1,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Úvod & Vize",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Diskrétní Matematika & Logika pro AG1",
    "subtitle": "Most z biologie a chemie do teoretické informatiky na FIT ČVUT",
    "tags": [
      "EPIC",
      "START",
      "BIO-ANALOGIE"
    ],
    "examTip": "U zkoušky z AG1 se netestuje mechanické programování, ale schopnost rigorózně a neprůstřelně dokázat korektnost struktur a algoritmů.",
    "keyFormula": "G = (V, E) \\quad |V| = n, \\quad |E| = m",
    "contentHtml": "\n      <div class=\"space-y-6\">\n        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <div class=\"flex items-center gap-2 text-emerald-400 font-bold\">\n              🧬 Biologická Intuice\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Molekuly, metabolity, DNA fragmenty, proteinové komplexy, fylogenetické stromy. Přirozeně vnímáte strukturu a kauzalitu reakcí.\n            </p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <div class=\"flex items-center gap-2 text-indigo-400 font-bold\">\n              🌿 Jazyk Grafů $G = (V, E)$\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Přísný množinový formalismus: relace, incidence, stupně vrcholů, zachování parit, matice a seznamy sousedů v C++.\n            </p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <div class=\"flex items-center gap-2 text-amber-400 font-bold\">\n              🏆 Zkoušková Jistota\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Zvládnutí dekonstrukční indukce, důkazů sporem, extremálního principu a 3-krokových invariantů BFS a Dijkstry.\n            </p>\n          </div>\n        </div>\n\n        <div class=\"p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3\">\n          <span class=\"text-xl\">✨</span>\n          <div class=\"text-xs text-emerald-100 space-y-1\">\n            <p class=\"font-semibold text-emerald-300\">Proč tato prezentace vznikla?</p>\n            <p>\n              Studenti informatiky FIT prošli 2 semestry matematických struktur (BI-DML). Tento kurz komprimuje 100 % nezbytného matematického aparátu do 7 stravitelných modulů přímo pro studenty Bioinformatiky VŠCHT.\n            </p>\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 2,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Konceptuální Rámec",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Co je to vlastně Graf? Formální Aparát",
    "subtitle": "Z neuspořádaných množin k binárním relacím a topologii",
    "tags": [
      "DEFINICE",
      "MNOŽINY",
      "RELACE"
    ],
    "keyFormula": "G = (V, E), \\quad E \\subseteq \\binom{V}{2} \\text{ (neorientovaný)}, \\quad E \\subseteq V \\times V \\text{ (orientovaný)}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          Graf <strong>není</strong> grafem funkce $y = f(x)$ ze střední školy. Je to diskrétní matematický objekt reprezentující objekty a relace mezi nimi.\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-emerald-400\">Neorientovaný Graf</span>\n            <ul class=\"text-xs text-slate-300 space-y-1.5 list-disc list-inside\">\n              <li>$V$ = konečná neprázdná množina vrcholů (uzlů)</li>\n              <li>$E \\subseteq \\binom{V}{2}$ = množina dvouprvkových podmnožin $\\{u, v\\}$</li>\n              <li>Hrana nemá směr: $\\{u, v\\} = \\{v, u\\}$</li>\n              <li>Antireflexivní &amp; symetrická binární relace bez smyček</li>\n            </ul>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-cyan-400\">Orientovaný Graf (Digraf)</span>\n            <ul class=\"text-xs text-slate-300 space-y-1.5 list-disc list-inside\">\n              <li>$E \\subseteq V \\times V$ = množina uspořádaných dvojic $(u, v)$</li>\n              <li>Hrana má směr od počátku $u$ do cíle $v$: $(u, v) \\ne (v, u)$</li>\n              <li>Vstupní stupeň $\\deg^-(v)$ vs. Výstupní stupeň $\\deg^+(v)$</li>\n              <li>Může obsahovat smyčky $(v, v)$, pokud nejsou zakázány</li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-slate-800/40 border border-slate-700 text-xs text-slate-300 font-mono\">\n          Příklad: $V = \\{A, B, C\\}, E = \\{\\{A, B\\}, \\{B, C\\}\\} \\implies |V| = 3, |E| = 2$. Graf je souvislý, bez cyklů (cesta $P_3$).\n        </div>\n      </div>\n    "
  },
  {
    "id": 3,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Bio-Aplikace I",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Genomová Asemblace & De Bruijn Grafy",
    "subtitle": "Jak poskládat miliony fragmentů DNA do chromozomu v čase O(|E|)",
    "tags": [
      "DNA",
      "DE BRUIJN",
      "K-MERY",
      "EPIC"
    ],
    "keyFormula": "\\text{Reads } \\to \\text{Hrany } (k\\text{-mery}), \\quad \\text{Prefix/Suffix } \\to \\text{Vrcholy } ((k-1)\\text{-mery})",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          Sekvenátory (Illumina) přečtou miliony krátkých úseků délky $k$ (tzv. $k$-merů). Jak z nich složit původní genom?\n        </p>\n        <div class=\"p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 font-mono text-xs space-y-2\">\n          <div class=\"text-emerald-400 font-bold\">Sekvence genomu: ATGGCGTGCA (s k = 3)</div>\n          <div class=\"text-slate-300\">\n            Přečtené 3-mery (hrany): <span class=\"text-amber-300\">ATG, TGG, GGC, GCG, CGT, GTG, TGC, GCA</span>\n          </div>\n          <div class=\"text-slate-300\">\n            2-mery (vrcholy): <span class=\"text-cyan-300\">&#123;AT, TG, GG, GC, CG, GT, CA&#125;</span>\n          </div>\n          <div class=\"p-3 rounded bg-slate-950 border border-slate-800 text-slate-200\">\n            [AT] --(ATG)--> [TG] --(TGG)--> [GG] --(GGC)--> [GC] --(GCG)--> [CG] ...\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200\">\n          <strong>Zásadní průlom:</strong> V grafu překryvů (Overlap Graph) odpovídá rekonstrukce genomu hledání <em>Hamiltonovské cesty</em> (NP-úplný problém!). V De Bruijn grafu odpovídá hledání <em>Eulerovského tahu</em>, který vyřešíme lineárně v čase $O(|E|)$!\n        </div>\n      </div>\n    "
  },
  {
    "id": 4,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Bio-Aplikace II",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "PPI Sítě & Bipartitní Metabolické Sítě",
    "subtitle": "Scale-free topologie, huby a bipartitní enzymatické katalýzy",
    "tags": [
      "PPI",
      "BIPARTITNÍ",
      "METABOLITY"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-emerald-400\">Protein-Protein Interakce (PPI)</span>\n            <p class=\"text-xs text-slate-300\">\n              Uzly = proteiny, hrany = prokázaná fyzikální vazba (Y2H, tandemová afinitní purifikace).\n            </p>\n            <div class=\"p-2.5 rounded bg-slate-800/60 text-xs text-slate-300\">\n              <strong class=\"text-emerald-300\">Scale-Free vlastnost:</strong> Stupně vrcholů sledují mocninné rozdělení $P(k) \\sim k^{-\\gamma}$. Většina má malý stupeň, ale existují tzv. <strong>Huby</strong> ($\\deg(v) > 100$). Odstranění huba způsobí rozpad sítě!\n            </div>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <span class=\"text-xs font-bold uppercase tracking-wider text-cyan-400\">Metabolické Sítě (Bipartitní)</span>\n            <p class=\"text-xs text-slate-300\">\n              $V = V_{\\text{metabolity}} \\cup V_{\\text{reakce}}$, kde $V_1 \\cap V_2 = \\emptyset$.\n            </p>\n            <div class=\"p-2.5 rounded bg-slate-800/60 text-xs text-slate-300\">\n              Hrany vedou <em>výhradně</em> mezi metabolitem a reakcí/enzymem (Glukóza $\\to$ Hexokináza $\\to$ Glukóza-6-P). Žádná hrana nespojuje dva metabolity přímo!\n            </div>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-slate-800/40 border border-slate-700 text-xs text-slate-300\">\n          <strong>Drug Repurposing:</strong> Bipartitní párování (bipartite matching) mezi schválenými léčivy a proteinovými receptory umožňuje objevovat nové indikace známých molekul.\n        </div>\n      </div>\n    "
  },
  {
    "id": 5,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Základní Věta",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Handshaking Lemma & Parita Stupňů",
    "subtitle": "Zákon zachování v teorii grafů a technika dvojího započtení",
    "tags": [
      "HANDSHAKING",
      "PARITA",
      "ZKOUŠKA"
    ],
    "keyFormula": "\\sum_{v \\in V} \\deg(v) = 2|E| \\implies |\\{v \\in V \\mid \\deg(v) \\text{ je liché}\\}| \\text{ je SUDÉ}",
    "examTip": "Na zkoušce AG1 se otázka: 'Může existovat graf s 11 vrcholy, kde každý má stupeň 3?' vyřeší za 5 sekund: 11 * 3 = 33 (liché číslo). 2|E| musí být sudé -> graf NEEXISTUJE!",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-3\">\n          <span class=\"text-xs font-bold uppercase tracking-wider text-emerald-400\">Důkaz Dvojím Započtením (Double Counting)</span>\n          <p class=\"text-xs text-slate-300\">\n            Uvažme množinu incidencí $I = \\{(v, e) \\mid v \\in e\\}$.\n          </p>\n          <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs\">\n            <div class=\"p-3 rounded-lg bg-slate-800/80\">\n              <strong class=\"text-cyan-300\">Pohled přes hrany:</strong> Každá neorientovaná hrana $e = \\{u, v\\}$ má právě 2 konce. Celkový počet incidencí je tedy přesně $2|E|$.\n            </div>\n            <div class=\"p-3 rounded-lg bg-slate-800/80\">\n              <strong class=\"text-amber-300\">Pohled přes vrcholy:</strong> Do každého vrcholu $v$ vchází právě $\\deg(v)$ hran. Součet incidencí je $\\sum_{v \\in V} \\deg(v)$.\n            </div>\n          </div>\n          <p class=\"text-xs text-slate-400 italic\">\n            Protože oběma způsoby počítáme velikost téže množiny $I$, platí: $\\sum_{v \\in V} \\deg(v) = 2|E|$. $\\blacksquare$\n          </p>\n        </div>\n        <div class=\"p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200\">\n          <strong>Orientovaná varianta:</strong> V každém orientovaném grafu platí: $\\sum_{v \\in V} \\deg^-(v) = \\sum_{v \\in V} \\deg^+(v) = |E|$. Každá orientovaná hrana z jednoho uzlu vystoupí a do jiného vstoupí.\n        </div>\n      </div>\n    "
  },
  {
    "id": 6,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Taxonomie Pohybu",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Sled, Tah, Cesta, Kružnice: Přesné Rozdíly",
    "subtitle": "Záměna těchto čtyř pojmů u zkoušky AG1 znamená okamžitou srážku bodů",
    "tags": [
      "TERMINOLOGIE",
      "PAST",
      "HIERARCHIE"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-1\">\n            <div class=\"flex items-center justify-between\">\n              <span class=\"text-xs font-bold text-slate-200\">1. Sled (Walk)</span>\n              <span class=\"text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400\">Nejobecnější</span>\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Střídavá posloupnost vrcholů a hran $v_0, e_1, v_1, \\dots, v_k$. <strong>Vrcholy i hrany se MOHOU opakovat.</strong>\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-1\">\n            <div class=\"flex items-center justify-between\">\n              <span class=\"text-xs font-bold text-amber-300\">2. Tah (Trail)</span>\n              <span class=\"text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40\">Bez duplicit hran</span>\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Sled, kde se <strong>žádná HRANA neopakuje</strong>. Vrcholy se však opakovat mohou! (Základ pro Eulerův tah).\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-1\">\n            <div class=\"flex items-center justify-between\">\n              <span class=\"text-xs font-bold text-emerald-300\">3. Cesta (Path)</span>\n              <span class=\"text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40\">Prostá</span>\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Sled, kde se <strong>žádný VRCHOL neopakuje</strong> (a tudíž ani žádná hrana). Všechny vrcholy jsou vzájemně různé.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-1\">\n            <div class=\"flex items-center justify-between\">\n              <span class=\"text-xs font-bold text-cyan-300\">4. Kružnice / Cyklus (Cycle)</span>\n              <span class=\"text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40\">Uzavřená cesta</span>\n            </div>\n            <p class=\"text-xs text-slate-300\">\n              Uzavřená cesta délky $k \\ge 3$, kde $v_0 = v_k$ a všechny vnitřní vrcholy $v_1, \\dots, v_{k-1}$ jsou různé.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200\">\n          <strong>Pozor na zkouškovou past:</strong> Každá cesta je tahem i sledem. Ale sled NENÍ cesta! Pokud v důkazu napíšete \"zvolme nejkratší sled\", neznamená to automaticky, že nemá cykly, dokud nedokážete prostost!\n        </div>\n      </div>\n    "
  },
  {
    "id": 7,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Implementace C++",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Počítačová Reprezentace Grafů (PA2 $\\to$ AG1)",
    "subtitle": "Matice sousedství vs. Seznam sousedů v paměti a složitost operací",
    "tags": [
      "C++",
      "SLOŽITOST",
      "PAMĚŤ",
      "PROGTEST"
    ],
    "keyFormula": "\\text{Matice: } O(|V|^2) \\text{ paměť, } O(1) \\text{ test hrany} \\quad \\text{vs.} \\quad \\text{Seznam: } O(|V| + |E|) \\text{ paměť, } O(\\deg(u)) \\text{ průchod}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"overflow-x-auto\">\n          <table class=\"w-full text-xs text-left border-collapse border border-slate-700\">\n            <thead>\n              <tr class=\"bg-slate-800 text-slate-200\">\n                <th class=\"p-2.5 border border-slate-700\">Operace</th>\n                <th class=\"p-2.5 border border-slate-700 text-cyan-300\">Matice Sousedství</th>\n                <th class=\"p-2.5 border border-slate-700 text-emerald-300\">Seznam Sousedů (Adjacency List)</th>\n              </tr>\n            </thead>\n            <tbody class=\"text-slate-300\">\n              <tr class=\"border-b border-slate-800\">\n                <td class=\"p-2 font-semibold\">Paměťová náročnost</td>\n                <td class=\"p-2 text-rose-400 font-mono\">O(|V|^2)</td>\n                <td class=\"p-2 text-emerald-400 font-mono\">O(|V| + |E|) (Optimální!)</td>\n              </tr>\n              <tr class=\"border-b border-slate-800\">\n                <td class=\"p-2 font-semibold\">Existuje hrana {u, v}?</td>\n                <td class=\"p-2 text-emerald-400 font-mono\">O(1)</td>\n                <td class=\"p-2 text-amber-400 font-mono\">O(deg(u))</td>\n              </tr>\n              <tr class=\"border-b border-slate-800\">\n                <td class=\"p-2 font-semibold\">Projít všechny sousedy u</td>\n                <td class=\"p-2 text-rose-400 font-mono\">O(|V|)</td>\n                <td class=\"p-2 text-emerald-400 font-mono\">O(deg(u)) (Optimální!)</td>\n              </tr>\n              <tr>\n                <td class=\"p-2 font-semibold\">Kdy použít</td>\n                <td class=\"p-2\">Husté grafy (|E| ≈ |V|^2), malé |V|</td>\n                <td class=\"p-2\">Řídké grafy (|E| ≪ |V|^2), biologické sítě</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class=\"p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs font-mono text-slate-300 space-y-1\">\n          <div class=\"text-slate-500\">// Typická deklarace pro AG1 v C++:</div>\n          <div><span class=\"text-indigo-400\">using</span> Graph = std::vector&lt;std::vector&lt;<span class=\"text-indigo-400\">int</span>&gt;&gt;;</div>\n          <div><span class=\"text-indigo-400\">using</span> WeightedGraph = std::vector&lt;std::vector&lt;std::pair&lt;<span class=\"text-indigo-400\">int</span>, <span class=\"text-indigo-400\">int</span>&gt;&gt;&gt;;</div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 8,
    "module": 0,
    "moduleName": "Modul 0: Bio-Intuice & Jazyk Grafů",
    "badge": "Shrnutí Modulu 0",
    "badgeColor": "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
    "title": "Shrnutí Modulu 0: Co si odnést do AG1",
    "subtitle": "Kontrolní checklist konceptů před přechodem k formální logice",
    "tags": [
      "CHECKLIST",
      "M0-DONE"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3\">\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-start gap-2.5\">\n            <span class=\"text-emerald-400 font-bold\">✓</span>\n            <div class=\"text-xs\">\n              <div class=\"font-bold text-emerald-300\">Definice G = (V, E)</div>\n              <div class=\"text-slate-300\">Rozlišení neorientovaného a orientovaného grafu, vztah k binárním relacím.</div>\n            </div>\n          </div>\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-start gap-2.5\">\n            <span class=\"text-emerald-400 font-bold\">✓</span>\n            <div class=\"text-xs\">\n              <div class=\"font-bold text-emerald-300\">Bio-Informatické Ekvivalenty</div>\n              <div class=\"text-slate-300\">De Bruijn grafy pro DNA, PPI pro proteiny, bipartitní pro metabolity a enzymy.</div>\n            </div>\n          </div>\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-start gap-2.5\">\n            <span class=\"text-emerald-400 font-bold\">✓</span>\n            <div class=\"text-xs\">\n              <div class=\"font-bold text-emerald-300\">Handshaking Lemma</div>\n              <div class=\"text-slate-300\">Součet stupňů je 2|E|. Počet vrcholů lichého stupně je vždy sudý.</div>\n            </div>\n          </div>\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 flex items-start gap-2.5\">\n            <span class=\"text-emerald-400 font-bold\">✓</span>\n            <div class=\"text-xs\">\n              <div class=\"font-bold text-emerald-300\">Sled vs. Tah vs. Cesta</div>\n              <div class=\"text-slate-300\">Cesta nemá opakované vrcholy. Tah nemá opakované hrany. Sled je obecný.</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/40 flex items-center justify-between\">\n          <div>\n            <div class=\"text-xs font-bold text-emerald-300\">Přechod na Modul 1</div>\n            <div class=\"text-[11px] text-slate-300\">Nyní máme slovník. V Modulu 1 se naučíme gramatiku — matematickou logiku a důkazové formy.</div>\n          </div>\n          <span class=\"text-emerald-400 text-lg\">➔</span>\n        </div>\n      </div>\n    "
  },
  {
    "id": 9,
    "module": 1,
    "moduleName": "Modul 1: Logický & Důkazový základ",
    "badge": "Logika Výroků",
    "badgeColor": "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    "title": "Výroková Logika & Kvantifikátory ($\\forall, \\exists$)",
    "subtitle": "Základní stavební kameny všech matematických vět na FIT AG1",
    "tags": [
      "LOGIKA",
      "VÝROKY",
      "KVANTIFIKÁTORY"
    ],
    "keyFormula": "\\forall x \\in V: P(x) \\quad \\text{vs.} \\quad \\exists x \\in V: P(x) \\quad \\text{vs.} \\quad \\exists! x \\in V: P(x)",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          V přírodních vědách se často hovoří v aproximacích. V teoretické informatice je každé tvrzení buď striktně <strong>Pravda (1)</strong>, nebo <strong>Nepravda (0)</strong>.\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <span class=\"text-xs font-bold text-indigo-400 uppercase tracking-wider\">Všeobecný kvantifikátor $\\forall$</span>\n            <p class=\"text-xs text-slate-300\">\n              <em>„Pro všechna x platí...\"</em>. K vyvrácení stačí <strong>jediný protipříklad</strong>!\n            </p>\n            <div class=\"p-2 rounded bg-slate-800 text-[11px] font-mono text-slate-200\">\n              $\\forall v \\in V: \\deg(v) \\ge 2$\n            </div>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-2\">\n            <span class=\"text-xs font-bold text-cyan-400 uppercase tracking-wider\">Existenční kvantifikátor $\\exists$</span>\n            <p class=\"text-xs text-slate-300\">\n              <em>„Existuje alespoň jedno x takové, že...\"</em>. K důkazu stačí předložit <strong>jeden konkrétní objekt</strong> (konstruktivní přístup).\n            </p>\n            <div class=\"p-2 rounded bg-slate-800 text-[11px] font-mono text-slate-200\">\n              $\\exists v \\in V: \\deg(v) = 0$\n            </div>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200\">\n          <strong>Symbol $\\exists!$:</strong> Značí jednoznačnou existenci — existuje <em>právě jeden</em> prvek. V grafech např.: Ve stromu existuje mezi každou dvojicí vrcholů <em>právě jedna</em> prostá cesta.\n        </div>\n      </div>\n    "
  },
  {
    "id": 10,
    "module": 1,
    "moduleName": "Modul 1: Logický & Důkazový základ",
    "badge": "Zkouškový Zákon",
    "badgeColor": "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    "title": "Negace Složených Výroků & De Morganovy Zákony",
    "subtitle": "Jak spolehlivě znegovat libovolný výrok bez rizika ztráty bodů",
    "tags": [
      "NEGACE",
      "DE MORGAN",
      "PAST"
    ],
    "keyFormula": "\\neg (\\forall x: P(x)) \\equiv \\exists x: \\neg P(x) \\qquad \\neg (\\exists x: P(x)) \\equiv \\forall x: \\neg P(x)",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1\">\n            <span class=\"text-xs font-bold text-indigo-300\">Negace konjunkce ($\\land$)</span>\n            <div class=\"font-mono text-xs text-amber-300\">$\\neg (A \\land B) \\equiv \\neg A \\lor \\neg B$</div>\n            <p class=\"text-[11px] text-slate-400\">„Není pravda, že platí A i B\" = alespoň jedno neplatí.</p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1\">\n            <span class=\"text-xs font-bold text-indigo-300\">Negace disjunkce ($\\lor$)</span>\n            <div class=\"font-mono text-xs text-amber-300\">$\\neg (A \\lor B) \\equiv \\neg A \\land \\neg B$</div>\n            <p class=\"text-[11px] text-slate-400\">„Není pravda, že platí A nebo B\" = neplatí ani jedno.</p>\n          </div>\n        </div>\n        <div class=\"p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2\">\n          <div class=\"text-xs font-bold text-rose-300 uppercase tracking-wide flex items-center gap-1.5\">\n            ⚠️ NEJKRITIČTĚJŠÍ VZOREC: Negace Implikace\n          </div>\n          <div class=\"font-mono text-sm text-yellow-300 bg-black/40 p-2.5 rounded-lg border border-yellow-500/30\">\n            $\\neg (A \\implies B) \\quad \\equiv \\quad A \\land \\neg B$\n          </div>\n          <p class=\"text-xs text-rose-100\">\n            Negace implikace <strong>NENÍ</strong> $A \\implies \\neg B$ ani $\\neg A \\implies \\neg B$! Implikace je porušena <em>právě tehdy</em>, když předpoklad platí a slíbený závěr přesto nenastane!\n          </p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 11,
    "module": 1,
    "moduleName": "Modul 1: Logický & Důkazový základ",
    "badge": "Pravdivostní Analýza",
    "badgeColor": "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    "title": "Anatomie Implikace: Slib Zkoušejícího",
    "subtitle": "Proč nepravdivý předpoklad implikuje cokoliv (Ex falso quodlibet)",
    "tags": [
      "IMPLIKACE",
      "KONTRAKAT",
      "PRAVDA"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-xs text-slate-300\">\n          Uvažme slib: <em>„Pokud student vyřeší dekonstrukční indukci (A), dostane zápočet (B).\"</em>\n        </p>\n        <div class=\"overflow-x-auto\">\n          <table class=\"w-full text-xs text-left border-collapse border border-slate-700\">\n            <thead>\n              <tr class=\"bg-slate-800 text-slate-200\">\n                <th class=\"p-2 border border-slate-700\">A (Indukce)</th>\n                <th class=\"p-2 border border-slate-700\">B (Zápočet)</th>\n                <th class=\"p-2 border border-slate-700 text-indigo-300 font-mono\">A $\\implies$ B</th>\n                <th class=\"p-2 border border-slate-700\">Výklad reality</th>\n              </tr>\n            </thead>\n            <tbody class=\"text-slate-300\">\n              <tr class=\"border-b border-slate-800\">\n                <td class=\"p-2 font-mono\">0 (Nenapsal)</td>\n                <td class=\"p-2 font-mono\">0 (Nedostal)</td>\n                <td class=\"p-2 text-emerald-400 font-bold font-mono\">1 (Pravda)</td>\n                <td class=\"p-2 text-slate-400\">Férová situace, slib nebyl porušen.</td>\n              </tr>\n              <tr class=\"border-b border-slate-800\">\n                <td class=\"p-2 font-mono\">0 (Nenapsal)</td>\n                <td class=\"p-2 font-mono\">1 (Dostal)</td>\n                <td class=\"p-2 text-emerald-400 font-bold font-mono\">1 (Pravda)</td>\n                <td class=\"p-2 text-slate-400\">Dostal zápočet za jiný bonus. Slib neporušen!</td>\n              </tr>\n              <tr class=\"border-b border-slate-800 bg-rose-950/30\">\n                <td class=\"p-2 font-mono text-rose-300 font-bold\">1 (Napsal)</td>\n                <td class=\"p-2 font-mono text-rose-300 font-bold\">0 (Nedostal)</td>\n                <td class=\"p-2 text-rose-400 font-bold font-mono\">0 (NEPRAVDA)</td>\n                <td class=\"p-2 text-rose-200 font-semibold\">Jediný případ, kdy byl slib zjevně porušen!</td>\n              </tr>\n              <tr>\n                <td class=\"p-2 font-mono\">1 (Napsal)</td>\n                <td class=\"p-2 font-mono\">1 (Dostal)</td>\n                <td class=\"p-2 text-emerald-400 font-bold font-mono\">1 (Pravda)</td>\n                <td class=\"p-2 text-slate-400\">Vše proběhlo podle plánu.</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs\">\n          <div class=\"p-3 rounded-lg bg-slate-900/80 border border-slate-700\">\n            <strong class=\"text-indigo-300\">Kontrapozice (Obměna):</strong> $\\neg B \\implies \\neg A$ má <em>stejnou</em> pravdivostní hodnotu jako $A \\implies B$. (Lze tím přímo dokazovat!).\n          </div>\n          <div class=\"p-3 rounded-lg bg-slate-900/80 border border-rose-800/60 text-rose-200\">\n            <strong class=\"text-rose-300\">Obrácená implikace:</strong> $B \\implies A$ <em>NENÍ</em> ekvivalentní! Důkaz $B \\implies A$ nedokazuje $A \\implies B$!\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 12,
    "module": 1,
    "moduleName": "Modul 1: Logický & Důkazový základ",
    "badge": "Klíčové Rozlišení",
    "badgeColor": "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    "title": "Nutná vs. Postačující Podmínka v Grafech",
    "subtitle": "Jak nezaměňovat směr implikace v definicích a větách",
    "tags": [
      "PODMÍNKY",
      "NUTNÁ",
      "POSTAČUJÍCÍ"
    ],
    "keyFormula": "A \\implies B: \\quad A \\text{ je POSTAČUJÍCÍ pro } B \\qquad B \\text{ je NUTNÁ pro } A",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/70 border border-indigo-500/40 space-y-2\">\n            <span class=\"text-xs font-bold text-indigo-400 uppercase\">Postačující podmínka (A je dost na to, aby B)</span>\n            <p class=\"text-xs text-slate-300\">\n              Pokud platí $A$, pak $B$ <strong>určitě</strong> nastane. Nemusí to však být jediná možnost.\n            </p>\n            <div class=\"p-2.5 rounded bg-slate-950 text-xs text-indigo-200 font-mono\">\n              „Graf je strom\" $\\implies$ „Graf je souvislý\".\n            </div>\n            <p class=\"text-[11px] text-slate-400\">\n              Být stromem bohatě <em>stačí</em> k souvislosti, ale není to nutné (cyklus $C_4$ je také souvislý).\n            </p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/70 border border-amber-500/40 space-y-2\">\n            <span class=\"text-xs font-bold text-amber-400 uppercase\">Nutná podmínka (Bez B nemůže být A)</span>\n            <p class=\"text-xs text-slate-300\">\n              Bez splnění $B$ nemá $A$ šanci platit. Samotné $B$ však k zaručení $A$ nestačí.\n            </p>\n            <div class=\"p-2.5 rounded bg-slate-950 text-xs text-amber-200 font-mono\">\n              „Graf je strom\" $\\impliedby$ „Graf je souvislý\" (NEPLATÍ!).\n            </div>\n            <p class=\"text-[11px] text-slate-400\">\n              Souvislost je pro strom <em>nutná</em>, ale ne postačující (musí navíc být acyklický!).\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200\">\n          <strong>Ekvivalence ($A \\iff B$):</strong> Podmínka je <em>nutná a zároveň postačující</em>. U zkoušky AG1 musíte v takovém případě VŽDY dokázat OBA směry zvlášť: $\\implies$ i $\\impliedby$!\n        </div>\n      </div>\n    "
  },
  {
    "id": 13,
    "module": 1,
    "moduleName": "Modul 1: Logický & Důkazový základ",
    "badge": "Důkazové Techniky",
    "badgeColor": "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    "title": "Čtyři Pilíře Důkazových Technik v AG1",
    "subtitle": "Přehled strategií: Přímý, Obměnou, Sporem, Indukcí",
    "tags": [
      "STRATEGIE",
      "PŘÍMÝ",
      "SPOR",
      "INDUKCE"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1\">\n            <span class=\"text-xs font-bold text-slate-200\">1. Přímý důkaz ($A \\implies B$)</span>\n            <p class=\"text-xs text-slate-300\">\n              Předpokládáme $A$. Použitím definic, axiomů a známých vět odvodíme krok za krokem $B$.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1\">\n            <span class=\"text-xs font-bold text-indigo-300\">2. Důkaz obměnou ($\\neg B \\implies \\neg A$)</span>\n            <p class=\"text-xs text-slate-300\">\n              Předpokládáme negaci závěru $\\neg B$. Dokážeme, že z toho nutně plyne negace předpokladu $\\neg A$.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-amber-500/40 space-y-1\">\n            <span class=\"text-xs font-bold text-amber-300\">3. Důkaz sporem ($A \\land \\neg B \\implies \\bot$)</span>\n            <p class=\"text-xs text-slate-300\">\n              Předpokládáme, že $A$ platí a $B$ neplatí. Logickými kroky dojdeme ke sporu s realitou.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/40 space-y-1\">\n            <span class=\"text-xs font-bold text-rose-300\">4. Matematická indukce</span>\n            <p class=\"text-xs text-slate-300\">\n              Dokážeme bázi pro nejmenší graf a redukční krok z $n+1$ na $n$ vrcholů.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-slate-800/40 border border-slate-700 text-xs text-slate-300\">\n          💡 <strong>Doporučení ke zkoušce:</strong> Pokud v zadání vidíte tvrzení typu <em>„každý graf má vlastnost X\"</em>, volte indukci. Pokud vidíte <em>„neexistuje graf takový, že...\"</em>, volte důkaz sporem!\n        </div>\n      </div>\n    "
  },
  {
    "id": 14,
    "module": 1,
    "moduleName": "Modul 1: Logický & Důkazový základ",
    "badge": "Workshop",
    "badgeColor": "bg-indigo-950/80 text-indigo-300 border-indigo-500/40",
    "title": "Workshop: Negace Zkouškových Výroků",
    "subtitle": "3 reálné zkouškové výroky z FIT AG1 a jejich precizní negace",
    "tags": [
      "WORKSHOP",
      "ZKOUŠKA",
      "PŘÍKLADY"
    ],
    "contentHtml": "\n      <div class=\"space-y-3\">\n        <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1.5 text-xs\">\n          <div class=\"font-bold text-slate-200\">Výrok 1: „V každém souvislém grafu existuje vrchol stupně $\\le 2$.\"</div>\n          <div class=\"font-mono text-slate-400\">$\\forall G \\text{ (souvislý)}: \\exists v \\in V(G): \\deg(v) \\le 2$</div>\n          <div class=\"font-bold text-emerald-400\">Negace: „Existuje souvislý graf, ve kterém mají VŠECHNY vrcholy stupeň > 2.\"</div>\n          <div class=\"text-[11px] text-slate-400 font-mono\">$\\exists G \\text{ (souvislý)}: \\forall v \\in V(G): \\deg(v) > 2$ (Např. $K_4$).</div>\n        </div>\n\n        <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1.5 text-xs\">\n          <div class=\"font-bold text-slate-200\">Výrok 2: „Pokud je graf bipartitní, pak neobsahuje lichý cyklus.\"</div>\n          <div class=\"font-mono text-slate-400\">$\\text{Bipartitní}(G) \\implies \\neg \\exists C \\subseteq G: \\text{Lichý}(C)$</div>\n          <div class=\"font-bold text-emerald-400\">Negace: „Graf je bipartitní a ZÁROVEŇ obsahuje lichý cyklus.\"</div>\n          <div class=\"text-[11px] text-slate-400 font-mono\">$\\text{Bipartitní}(G) \\land \\exists C \\subseteq G: \\text{Lichý}(C)$ (Toto je předpoklad pro důkaz sporem!).</div>\n        </div>\n\n        <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1.5 text-xs\">\n          <div class=\"font-bold text-slate-200\">Výrok 3: „Pro všechny hrany e platí, že jejich relaxace zkrátí vzdálenost.\"</div>\n          <div class=\"font-bold text-emerald-400\">Negace: „Existuje alespoň jedna hrana e, jejíž relaxace vzdálenost NEZKRÁTÍ.\"</div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 15,
    "module": 2,
    "moduleName": "Modul 2: Indukce na Grafech & Redukční Past",
    "badge": "Základní Pilíř",
    "badgeColor": "bg-rose-950/80 text-rose-300 border-rose-500/40",
    "title": "Princip Matematické Indukce na Grafech",
    "subtitle": "Indukce podle počtu vrcholů n = |V| nebo počtu hran m = |E|",
    "tags": [
      "INDUKCE",
      "PEANO",
      "BÁZE",
      "KROK"
    ],
    "keyFormula": "P(n_0) \\land (\\forall k \\ge n_0: P(k) \\implies P(k+1)) \\implies \\forall n \\ge n_0: P(n)",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          V algebře dokazujeme pro čísla $n$. Na grafech dokazujeme tvrzení $P(G)$ pro <strong>všechny grafy dané velikosti</strong>.\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-3 gap-3\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1 text-xs\">\n            <span class=\"font-bold text-emerald-400\">1. Báze indukce ($n = n_0$)</span>\n            <p class=\"text-slate-300\">\n              Ověříme nejmenší přípustný případ (typicky $n=1$ u stromů, nebo $n=3$ u grafů s cykly). Nesmí se vynechat!\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1 text-xs\">\n            <span class=\"font-bold text-indigo-400\">2. Indukční předpoklad (IP)</span>\n            <p class=\"text-slate-300\">\n              Předpokládáme, že tvrzení platí pro <strong>všechny</strong> grafy dané třídy o velikosti $n$ (nebo $\\le n$).\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1 text-xs\">\n            <span class=\"font-bold text-rose-400\">3. Indukční krok ($n \\to n+1$)</span>\n            <p class=\"text-slate-300\">\n              Dokážeme, že platnost se nutně přenáší na libovolný graf o velikosti $n+1$.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200\">\n          🚨 <strong>POZOR:</strong> Na grafech se krok $n \\to n+1$ NIKDY nedělá přidáváním vrcholu! To je pověstná redukční past.\n        </div>\n      </div>\n    "
  },
  {
    "id": 16,
    "module": 2,
    "moduleName": "Modul 2: Indukce na Grafech & Redukční Past",
    "badge": "CRITICAL TRAP",
    "badgeColor": "bg-red-950 text-red-300 border-red-500",
    "title": "🚨 REDUKČNÍ PAST (Build-up Error)",
    "subtitle": "Nejčastější důvod pro udělení 0 bodů ze zkouškového příkladu na FIT ČVUT",
    "tags": [
      "PAST",
      "CRITICAL",
      "0 BODŮ",
      "BUILD-UP"
    ],
    "examTip": "Jakmile opravující vyučující uvidí větu: 'Vezměme strom o n vrcholech a přidejme k němu vrchol v...', okamžitě škrtá celou úlohu červenou propiskou. Ztráta 100 % bodů!",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-red-950/40 border border-red-500/50 space-y-2\">\n          <div class=\"flex items-center gap-2 text-red-400 font-bold text-xs\">\n            ❌ ŠPATNÝ POSTUP (Konstrukční indukce / Build-up):\n          </div>\n          <p class=\"text-xs text-slate-200 italic\">\n            „Předpokládejme, že věta platí pro graf $G_n$ s $n$ vrcholy. Nyní sestrojme graf $G_{n+1}$ tak, že k $G_n$ přidáme nový vrchol $v$ a napojíme ho hranami...\"\n          </p>\n          <div class=\"p-3 rounded bg-black/40 border border-red-500/30 text-xs text-red-200 space-y-1\">\n            <strong>Proč je to fatální chyba?</strong>\n            <p>\n              Tímto způsobem jste dokázali tvrzení <em>pouze pro grafy, které lze vytvořit tímto konkrétním napojením</em>! Neověřili jste, zda KAŽDÝ možný graf velikosti $n+1$ vznikl tímto způsobem. Mohli jste vynechat obrovskou část grafů!\n            </p>\n          </div>\n        </div>\n\n        <div class=\"p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2\">\n          <div class=\"flex items-center gap-2 text-emerald-400 font-bold text-xs\">\n            ✅ SPRÁVNÝ POSTUP (Dekonstrukční indukce / Redukce):\n          </div>\n          <p class=\"text-xs text-slate-200\">\n            „Nechť $G$ je <strong>LIBOVOLNÝ</strong> graf o $n+1$ vrcholech. Najdeme v něm vhodný vrchol $v$, odebereme ho ($G' = G \\setminus \\{v\\}$), aplikujeme IP na $G'$ s $n$ vrcholy a prvek vrátíme!\"\n          </p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 17,
    "module": 2,
    "moduleName": "Modul 2: Indukce na Grafech & Redukční Past",
    "badge": "Metodika",
    "badgeColor": "bg-rose-950/80 text-rose-300 border-rose-500/40",
    "title": "Správný Redukční Postup Krok za Krokem",
    "subtitle": "Univerzální 5krokový algoritmus pro induktivní důkaz na grafech",
    "tags": [
      "METODIKA",
      "ALGORITMUS",
      "ZKOUŠKA"
    ],
    "proofSteps": [
      {
        "title": "Krok 1: Výběr libovolného G(n+1)",
        "desc": "Začni: 'Nechť G = (V, E) je LIBOVOLNÝ graf o n+1 vrcholech splňující předpoklady věty.'"
      },
      {
        "title": "Krok 2: Nalezení redukovatelného prvku",
        "desc": "Najdi vrchol v (např. list s deg(v)=1 nebo vrchol minimálního stupně)."
      },
      {
        "title": "Krok 3: Odebrání prvku -> G'",
        "desc": "Vytvoř podgraf G' = G \\ {v}. Ověř, že G' má n vrcholů a STÁLE SPLŇUJE předpoklady věty!"
      },
      {
        "title": "Krok 4: Aplikace IP",
        "desc": "Protože G' má n vrcholů, dle indukčního předpokladu pro něj tvrzení platí."
      },
      {
        "title": "Krok 5: Návrat prvku a závěr",
        "desc": "Vrať vrchol v zpět do grafu a dokaž, že vlastnost platí i pro původní graf G."
      }
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-xs text-slate-300\">\n          Klikněte na jednotlivé fáze dekonstrukční indukce a sledujte myšlenkový tok:\n        </p>\n        <div class=\"p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-3\">\n          <div class=\"text-xs font-bold text-rose-300 uppercase\">Fáze Dekonstrukce</div>\n          <div class=\"text-xs text-slate-200\">\n            Při dekonstrukci se pohybujeme směrem <strong>shora dolů</strong>: od neznámého velkého grafu $G_{n+1}$ k menšímu $G_n$, pro který už máme zaručenou platnost indukcí!\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 18,
    "module": 2,
    "moduleName": "Modul 2: Indukce na Grafech & Redukční Past",
    "badge": "Vzorový Důkaz I",
    "badgeColor": "bg-rose-950/80 text-rose-300 border-rose-500/40",
    "title": "Vzorový Důkaz: Každý Strom má $\\ge 2$ Listy",
    "subtitle": "Důkaz existence listu (vrcholu stupně 1) ve stromu s n >= 2 vrcholy",
    "tags": [
      "STROM",
      "LISTY",
      "VZOROVÝ DŮKAZ"
    ],
    "keyFormula": "\\forall T = (V, E) \\text{ strom}, |V| \\ge 2 \\implies |\\{v \\in V \\mid \\deg(v) = 1\\}| \\ge 2",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2 text-xs text-slate-300\">\n          <div class=\"text-rose-400 font-bold uppercase tracking-wide\">Důkaz Extremálním Principem &amp; Handshakingem:</div>\n          <ol class=\"list-decimal list-inside space-y-1.5\">\n            <li>Strom $T$ je souvislý a acyklický graf. Počet hran ve stromu je $|E| = |V| - 1$.</li>\n            <li>Dle Handshaking Lemma: $\\sum_{v \\in V} \\deg(v) = 2|E| = 2(|V| - 1) = 2|V| - 2$.</li>\n            <li>Protože $T$ je souvislý a má $|V| \\ge 2$, nemůže mít žádný vrchol stupeň $0$ (všechny mají $\\deg(v) \\ge 1$).</li>\n            <li>\n              Předpokládejme pro spor, že strom má <strong>nejvýše 1 list</strong> (tedy nanejvýš jeden vrchol má stupeň 1, ostatní $|V|-1$ vrcholů mají $\\deg(v) \\ge 2$).\n            </li>\n            <li>\n              Pak je součet stupňů:\n              $$\\sum_{v \\in V} \\deg(v) \\ge 1 + 2(|V| - 1) = 1 + 2|V| - 2 = 2|V| - 1$$\n            </li>\n            <li class=\"text-amber-300 font-semibold\">\n              💥 SPOR! $2|V| - 1 > 2|V| - 2$. Součet stupňů nemůže být současně roven $2|V|-2$ a zároveň být $\\ge 2|V|-1$!\n            </li>\n            <li class=\"text-emerald-300\">\n              Závěr: Strom musí mít alespoň dva vrcholy stupně 1 (listy). $\\blacksquare$\n            </li>\n          </ol>\n        </div>\n      </div>\n    "
  },
  {
    "id": 19,
    "module": 2,
    "moduleName": "Modul 2: Indukce na Grafech & Redukční Past",
    "badge": "Vzorový Důkaz II",
    "badgeColor": "bg-rose-950/80 text-rose-300 border-rose-500/40",
    "title": "Vzorový Důkaz: Počet Hran ve Stromu je $|V| - 1$",
    "subtitle": "Správně provedená dekonstrukční indukce na 100 % bodů u zkoušky AG1",
    "tags": [
      "INDUKCE",
      "DŮKAZ",
      "|V|-1",
      "ZKOUŠKA"
    ],
    "keyFormula": "\\forall T = (V, E) \\text{ strom}: |E| = |V| - 1",
    "contentHtml": "\n      <div class=\"space-y-3 text-xs text-slate-300\">\n        <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-emerald-400\">1. Báze indukce ($n = 1$):</span>\n          <p>Jediný vrchol, žádná hrana: $|V| = 1, |E| = 0$. Vzorec dává $|E| = 1 - 1 = 0$. Báze platí. ✓</p>\n        </div>\n\n        <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-indigo-400\">2. Indukční předpoklad (IP):</span>\n          <p>Předpokládejme, že pro KAŽDÝ strom $T'$ o $n$ vrcholech platí $|E(T')| = n - 1$.</p>\n        </div>\n\n        <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-rose-500/40 space-y-2\">\n          <span class=\"font-bold text-rose-400\">3. Indukční krok ($n \\to n+1$ bez chyby!):</span>\n          <p>Nechť $T = (V, E)$ je <strong>LIBOVOLNÝ</strong> strom o $n+1$ vrcholech ($n+1 \\ge 2$).</p>\n          <ul class=\"list-disc list-inside space-y-1 text-[11px] text-slate-300\">\n            <li>Z předchozí věty víme, že $T$ má alespoň 2 listy. Zvolme libovolný list $v$ ($deg(v) = 1$).</li>\n            <li>Nechť $e = \\{v, u\\}$ je jediná hrana vycházející z $v$.</li>\n            <li>Vytvořme $T' = T \\setminus \\{v\\}$. Graf $T'$ má $(n+1) - 1 = n$ vrcholů.</li>\n            <li>Ověření předpokladů: Odebráním listu nemůže vzniknout cyklus (v $T$ žádný nebyl) ani se neporuší souvislost zbylých vrcholů $\\implies T'$ je strom o $n$ vrcholech!</li>\n            <li>Dle IP má $T'$ přesně $|E(T')| = n - 1$ hran.</li>\n            <li>Vrátíme $v$ a hranu $e$: $|E(T)| = |E(T')| + 1 = (n - 1) + 1 = n = (n + 1) - 1$.</li>\n          </ul>\n          <div class=\"text-emerald-400 font-bold\">Tím je věta dokázána pro libovolný strom o $n+1$ vrcholech! $\\blacksquare$</div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 20,
    "module": 2,
    "moduleName": "Modul 2: Indukce na Grafech & Redukční Past",
    "badge": "Vzorový Důkaz III",
    "badgeColor": "bg-rose-950/80 text-rose-300 border-rose-500/40",
    "title": "Každý Souvislý Graf Má Kostru (Spanning Tree)",
    "subtitle": "Indukce podle počtu cyklů nebo počtu přebytečných hran",
    "tags": [
      "KOSTRA",
      "SPANNING TREE",
      "CYKLY"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          <strong>Definice kostry:</strong> Kostra grafu $G = (V, E)$ je podgraf $T = (V, E_T)$, který obsahuje všechny vrcholy $V$, je souvislý a neobsahuje žádné cykly (je stromem).\n        </p>\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2 text-xs text-slate-300\">\n          <span class=\"font-bold text-amber-300 uppercase\">Konstruktivní redukční důkaz:</span>\n          <p>\n            Nechť $G$ je souvislý graf. Pokud $G$ neobsahuje žádný cyklus, je sám o sobě stromem a kostrou je $T = G$.\n          </p>\n          <p>\n            Pokud $G$ obsahuje cyklus $C = (v_1, \\dots, v_k, v_1)$, zvolme libovolnou hranu $e = \\{v_1, v_2\\} \\in C$.\n          </p>\n          <div class=\"p-2.5 rounded bg-slate-950 text-slate-200 border border-slate-800\">\n            <strong>Klíčový fakt:</strong> Odebráním hrany $e$ z cyklu se <em>neporuší souvislost grafu</em>! Jakákoliv cesta, která dříve používala hranu $\\{v_1, v_2\\}$, může místo toho projít zbytkem cyklu $(v_1, v_k, v_{k-1}, \\dots, v_2)$.\n          </div>\n          <p>\n            Graf $G' = G \\setminus \\{e\\}$ je stále souvislý a má o 1 hranu méně. Tento proces odebírání hran z cyklů opakujeme, dokud v grafu nezbude žádný cyklus. Výsledkem je souvislý acyklický graf na všech vrcholech $V$ = <strong>kostra grafu</strong>. $\\blacksquare$\n          </p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 21,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Princip Sporem",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Logika Důkazu Sporem v Teorii Grafů",
    "subtitle": "Když vyloučíte nemožné, to co zbude, musí být pravda",
    "tags": [
      "SPOR",
      "LOGIKA",
      "CONTRADICTION"
    ],
    "keyFormula": "A \\implies B \\iff \\neg (A \\land \\neg B) \\implies \\bot",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          V diskrétní matematice je důkaz sporem jednou z nejsilnějších technik. Proč? Protože předpoklad, že objekt <em>neexistuje</em> nebo vlastnost <em>neplatí</em>, dává obrovská strukturální omezení!\n        </p>\n        <div class=\"p-4 rounded-xl bg-slate-900/60 border border-amber-500/40 space-y-2\">\n          <span class=\"text-xs font-bold text-amber-400 uppercase\">Standardní 4kroková šablona u zkoušky AG1:</span>\n          <ol class=\"list-decimal list-inside text-xs text-slate-300 space-y-1.5\">\n            <li><strong>Předpoklad pro spor:</strong> „Předpokládejme pro spor, že platí předpoklad $A$ a zároveň NEPLATÍ závěr $B$ (platí $\\neg B$).\"</li>\n            <li><strong>Odvození vlastností:</strong> Z platnosti $\\neg B$ logicky plyne chování objektů...</li>\n            <li><strong>Dosažení rozporu (💥 SPOR):</strong> Ukážeme rozpor s definicí, předpokladem nebo známou větou.</li>\n            <li><strong>Závěr:</strong> Předpoklad pro spor nemohl platit $\\implies$ původní tvrzení $A \\implies B$ platí. Q.E.D.</li>\n          </ol>\n        </div>\n      </div>\n    "
  },
  {
    "id": 22,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Mocná Zbraň",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Extremální Princip: Tajná Zbraň Diskrétní Matematiky",
    "subtitle": "Výběr minimálního nebo maximálního prvku v konečných strukturách",
    "tags": [
      "EXTREMAL",
      "MAXIMUM",
      "MINIMUM",
      "EPIC"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-xs text-slate-300\">\n          V každé konečné neprázdné množině čísel existuje <strong>nejmenší</strong> a <strong>největší</strong> prvek. Na grafech to znamená:\n        </p>\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"text-xs font-bold text-amber-300\">Nejdelší prostá cesta $P$</span>\n            <p class=\"text-[11px] text-slate-300\">\n              Zvolme v $G$ cestu $P = (v_0, v_1, \\dots, v_k)$ maximální možné délky. Její konce $v_0, v_k$ už nemohou mít sousedy mimo $P$!\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"text-xs font-bold text-amber-300\">Nejkratší cyklus $C$ (Girth / Obvod)</span>\n            <p class=\"text-[11px] text-slate-300\">\n              Pokud graf má cykly, vezměme ten s nejmenším počtem hran. Mezi jeho vrcholy nemůže vést žádná tětiva, jinak by byl ještě kratší!\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"text-xs font-bold text-amber-300\">Vrchol s extremálním stupněm</span>\n            <p class=\"text-[11px] text-slate-300\">\n              Vrchol s minimálním stupněm $\\delta(G)$ nebo maximálním stupněm $\\Delta(G)$.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"text-xs font-bold text-amber-300\">Minimální protipříklad</span>\n            <p class=\"text-[11px] text-slate-300\">\n              Předpokládejme, že věta neplatí. Pak musí existovat protipříklad s <em>minimálním</em> počtem vrcholů $n$.\n            </p>\n          </div>\n        </div>\n      </div>\n    "
  },
  {
    "id": 23,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Klasický Důkaz",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Věta o Existenci Cyklu: Pokud $\\delta(G) \\ge 2$",
    "subtitle": "Formální důkaz extremálním principem přes nejdelší prostou cestu",
    "tags": [
      "CYKLUS",
      "STUPEŇ>=2",
      "EXTRÉM"
    ],
    "keyFormula": "\\forall G = (V, E): (\\forall v \\in V: \\deg(v) \\ge 2) \\implies G \\text{ obsahuje cyklus}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-amber-500/40 space-y-2 text-xs text-slate-300\">\n          <span class=\"font-bold text-amber-300 uppercase\">Důkaz krok za krokem:</span>\n          <ol class=\"list-decimal list-inside space-y-2\">\n            <li>Nechť $G$ je konečný graf s $\\deg(v) \\ge 2$ pro všechny $v \\in V$.</li>\n            <li>Protože graf je konečný, existuje v něm <strong>nejdelší prostá cesta</strong> $P = (v_0, v_1, v_2, \\dots, v_k)$.</li>\n            <li>Uvažme koncový vrchol cesty $v_k$. Podle předpokladu má $\\deg(v_k) \\ge 2$, tedy má alespoň 2 sousedy v grafu.</li>\n            <li>Jeden jeho soused je předchůdce na cestě $v_{k-1}$. Kde leží další soused $u$?</li>\n          </ol>\n        </div>\n        <div class=\"p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200\">\n          Otázka k zamyšlení: Může tento další soused $u$ ležet <em>mimo</em> cestu $P$?\n        </div>\n      </div>\n    "
  },
  {
    "id": 24,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Závěr Důkazu",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Dokončení Důkazu: Spor s Maximalitou Cesty",
    "subtitle": "Jak extremální volba uzavře kruh a vytvoří cyklus",
    "tags": [
      "SPOR",
      "MAXIMALITA",
      "DŮKAZ-HOTOV"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-3 text-xs text-slate-300\">\n          <div class=\"p-3 rounded bg-red-950/40 border border-red-500/30 text-red-200\">\n            <strong>Hypotéza:</strong> Předpokládejme, že soused $u$ leží MIMO cestu ($u \\notin P$).\n            <p class=\"mt-1\">\n              Pak bychom mohli cestu $P$ prodloužit o hranu $\\{v_k, u\\}$ na novou cestu $P' = (v_0, \\dots, v_k, u)$ délky $k+1$. To je však <strong>SPOR s předpokladem, že $P$ byla nejdelší možná cesta</strong>!\n            </p>\n          </div>\n          <div class=\"p-3 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-200\">\n            <strong>Jediná možnost:</strong> Všichni sousedé $v_k$ MUSÍ ležet přímo na cestě $P$!\n            <p class=\"mt-1\">\n              Protože $\\deg(v_k) \\ge 2$, má $v_k$ souseda $v_i \\in P$, kde $i < k - 1$.\n              Úsek cesty od $v_i$ do $v_k$ spolu s hranou $\\{v_k, v_i\\}$ tvoří uzavřenou posloupnost různých vrcholů = <strong>jednoduchý CYKLUS délky $(k - i + 1) \\ge 3$</strong>!\n            </p>\n          </div>\n          <p class=\"text-emerald-400 font-bold text-center\">\n            Tím jsme bezpečně dokázali, že graf obsahuje cyklus. $\\blacksquare$\n          </p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 25,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Charakterizační Věta",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Bipartitní Grafy & Liché Cykly",
    "subtitle": "Základní ekvivalence: Graf je 2-obarvitelný právě tehdy, když nemá lichý cyklus",
    "tags": [
      "BIPARTITNÍ",
      "LICHÝ CYKLUS",
      "EKVIVALENCE"
    ],
    "keyFormula": "G \\text{ je bipartitní } \\iff G \\text{ neobsahuje žádný cyklus liché délky}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          Bipartitní graf má vrcholy rozdělené na $V_1, V_2$ a žádná hrana nevede uvnitř $V_1$ ani uvnitř $V_2$.\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2\">\n            <span class=\"text-xs font-bold text-emerald-400 uppercase\">Důkaz směru $\\implies$ (Snadný)</span>\n            <p class=\"text-xs text-slate-300\">\n              Každá hrana v cyklu musí přecházet mezi $V_1$ a $V_2$. Abychom se vrátili do startovního vrcholu, musíme udělat stejný počet kroků tam i zpět $\\implies$ délka cyklu musí být sudá!\n            </p>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2\">\n            <span class=\"text-xs font-bold text-cyan-400 uppercase\">Důkaz směru $\\impliedby$ (Konstruktivní přes BFS)</span>\n            <p class=\"text-xs text-slate-300\">\n              Pokud graf nemá lichý cyklus, pustíme BFS ze startovního vrcholu $s$. Rozdělíme vrcholy do hladin podle vzdálenosti $d(s, v)$.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200\">\n          Položíme $V_1 = \\{v \\mid d(s, v) \\text{ je sudé}\\}$ a $V_2 = \\{v \\mid d(s, v) \\text{ je liché}\\}$. Kdyby existovala hrana uvnitř stejné hladiny, vytvořila by s cestami do kořene lichý cyklus — spor!\n        </div>\n      </div>\n    "
  },
  {
    "id": 26,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Formální Důkaz Sporem",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Formální Důkaz: Bipartitní $\\implies$ Bez Lichých Cyklů",
    "subtitle": "Přesný zápis pro písemku: Parita indexů vrcholů na cyklu",
    "tags": [
      "FORMÁLNÍ",
      "PARITA",
      "ZKOUŠKA"
    ],
    "contentHtml": "\n      <div class=\"space-y-4 text-xs text-slate-300\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2\">\n          <ol class=\"list-decimal list-inside space-y-1.5\">\n            <li>\n              <strong>Předpoklad pro spor:</strong> Nechť $G$ je bipartitní s rozkladem $V = V_1 \\cup V_2$ a ZÁROVEŇ obsahuje lichý cyklus $C = (v_1, v_2, \\dots, v_{2k+1}, v_1)$ o délce $2k+1$.\n            </li>\n            <li>\n              Bez újmy na obecnosti zařaďme první vrchol cyklu $v_1 \\in V_1$.\n            </li>\n            <li>\n              Protože hrana $\\{v_1, v_2\\} \\in E$ vede mezi partitami, musí $v_2 \\in V_2$. Dále $\\{v_2, v_3\\} \\implies v_3 \\in V_1$.\n            </li>\n            <li>\n              Obecně: $v_i \\in V_1$ pro všechna lichá $i$, a $v_i \\in V_2$ pro všechna sudá $i$.\n            </li>\n            <li>\n              Poslední vrchol cyklu je $v_{2k+1}$. Protože jeho index $2k+1$ je <strong>liché číslo</strong>, platí $v_{2k+1} \\in V_1$.\n            </li>\n            <li class=\"text-rose-300 font-bold\">\n              💥 SPOR! Cyklus je uzavřen hranou $\\{v_{2k+1}, v_1\\}$. Oba koncové body této hrany leží v téže partitě $V_1$!\n            </li>\n            <li class=\"text-emerald-300\">\n              To odporuje definici bipartitního grafu. Bipartitní graf tedy nemůže obsahovat lichý cyklus. $\\blacksquare$\n            </li>\n          </ol>\n        </div>\n      </div>\n    "
  },
  {
    "id": 27,
    "module": 3,
    "moduleName": "Modul 3: Důkazy Sporem & Extremální Princip",
    "badge": "Shrnutí M3",
    "badgeColor": "bg-amber-950/80 text-amber-300 border-amber-500/40",
    "title": "Extremální Princip v Bioinformatice",
    "subtitle": "Detekce mutací, 'Bubble Popping' a minimální sestřihové varianty",
    "tags": [
      "BIO",
      "BUBBLES",
      "M3-DONE"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1\">\n            <span class=\"font-bold text-amber-300\">Bubliny v De Bruijn grafech:</span>\n            <p>\n              Chyba v sekvenování (SNP - jednonukleotidový polymorfismus) vytvoří dvě paralelní cesty mezi dvěma uzly. Extremální volba: Algoritmus vybere cestu s <em>maximálním pokrytím čtení</em> a druhou odstraní („Bubble Popping\").\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/60 border border-slate-700 space-y-1\">\n            <span class=\"font-bold text-emerald-300\">Nejdelší cesta v zarovnání (Alignment):</span>\n            <p>\n              Needleman-Wunsch i Smith-Waterman algoritmy hledají cestu s <em>maximálním skóre</em> v acyklické mřížce — aplikace extremálního principu a dynamického programování.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200\">\n          ✅ <strong>Polovina kurzu za námi!</strong> Umíme jazyk grafů, logiku výroků, indukci i důkazy sporem. V Modulu 4 přejdeme k samotným algoritmům: Invariantům smyček v BFS a Dijkstrovi.\n        </div>\n      </div>\n    "
  },
  {
    "id": 28,
    "module": 4,
    "moduleName": "Modul 4: Invarianty Cyklů (BFS & Dijkstra)",
    "badge": "Korektnost Algoritmů",
    "badgeColor": "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    "title": "Co je to Invariant Cyklu? (Loop Invariant)",
    "subtitle": "Proč kód 'fungující na 5 vstupech' na FIT ČVUT nestačí",
    "tags": [
      "INVARIANT",
      "CYKLUS",
      "KOREKTNOST"
    ],
    "keyFormula": "\\text{Invariant } I \\text{ platí: } \\quad \\text{Před cyklem } \\land \\text{ Během cyklu } \\land \\text{ Po skončení cyklu}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-sm text-slate-300\">\n          V komerčním vývoji stačí unit testy. V teoretické informatice musíte <strong>dokázat</strong>, že algoritmus vrátí optimální výsledek pro <em>každý z nekonečně mnoha vstupních grafů</em>.\n        </p>\n        <div class=\"p-4 rounded-xl bg-slate-900/60 border border-cyan-500/40 space-y-2\">\n          <span class=\"text-xs font-bold text-cyan-400 uppercase\">Analogie s pilotním check-listem:</span>\n          <p class=\"text-xs text-slate-300\">\n            Pilot v letadle kontroluje stav paliva: před vzletem má dost paliva na dolet, po každé letové hodině má stále bezpečnou rezervu, po přistání bezpečně dosáhl cíle. Invariant je tvrzení o proměnných, které zůstává pravdivé napříč všemi iteracemi.\n          </p>\n        </div>\n        <div class=\"p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200\">\n          Invariant cyklu je vlastně <strong>matematická indukce aplikovaná na počet iterací smyčky</strong>: Inicializace = Báze, Udržení = Indukční krok, Ukončení = Důsledek!\n        </div>\n      </div>\n    "
  },
  {
    "id": 29,
    "module": 4,
    "moduleName": "Modul 4: Invarianty Cyklů (BFS & Dijkstra)",
    "badge": "3 Pilíře",
    "badgeColor": "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    "title": "Tři Fáze Důkazu Invariantem u Zkoušky",
    "subtitle": "Chybějící fáze znamená okamžitou srážku bodů z teoretické části testu",
    "tags": [
      "3-FÁZE",
      "INICIALIZACE",
      "UDRŽENÍ",
      "UKONČENÍ"
    ],
    "contentHtml": "\n      <div class=\"grid grid-cols-1 md:grid-cols-3 gap-3\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-emerald-500/40 space-y-2 text-xs\">\n          <span class=\"font-bold text-emerald-400 uppercase tracking-wide\">1. Inicializace</span>\n          <p class=\"text-slate-300\">\n            Ověříme, že invariant $I$ platí <strong>před první iterací</strong> cyklu (v kroku 0).\n          </p>\n          <div class=\"p-2 rounded bg-slate-950 text-[11px] text-slate-400 font-mono\">\n            Např. fronta obsahuje pouze startovní uzel s d[s] = 0.\n          </div>\n        </div>\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-cyan-500/40 space-y-2 text-xs\">\n          <span class=\"font-bold text-cyan-400 uppercase tracking-wide\">2. Udržování (Maintenance)</span>\n          <p class=\"text-slate-300\">\n            Dokážeme, že pokud $I$ platil před začátkem iterace, provedení těla cyklu jeho platnost <strong>zachová i pro další iteraci</strong>.\n          </p>\n          <div class=\"p-2 rounded bg-slate-950 text-[11px] text-slate-400 font-mono\">\n            Relaxace hrany zachová monotonicitu fronty.\n          </div>\n        </div>\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-indigo-500/40 space-y-2 text-xs\">\n          <span class=\"font-bold text-indigo-400 uppercase tracking-wide\">3. Ukončení (Termination)</span>\n          <p class=\"text-slate-300\">\n            Cyklus se zastaví (fronta je prázdná). Spojení platnosti invariantu a podmínky zastavení <strong>přímo dokazuje korektnost výstupu</strong>!\n          </p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 30,
    "module": 4,
    "moduleName": "Modul 4: Invarianty Cyklů (BFS & Dijkstra)",
    "badge": "BFS Invariant",
    "badgeColor": "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    "title": "Klíčový Invariant Fronty BFS",
    "subtitle": "Monotonie vzdáleností a vlastnost sousedních hladin (d <= d + 1)",
    "tags": [
      "BFS",
      "FRONTA",
      "HLADINY",
      "EPIC"
    ],
    "keyFormula": "Q = [v_1, v_2, \\dots, v_m]: \\quad d[v_1] \\le d[v_2] \\le \\dots \\le d[v_m] \\quad \\land \\quad d[v_m] \\le d[v_1] + 1",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-xs text-slate-300\">\n          FIFO fronta v algoritmu BFS není jen obyčejný kontejner. V každém okamžiku splňuje dvě matematické vlastnosti:\n        </p>\n        <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"font-bold text-cyan-300\">1. Neklesající uspořádání:</span>\n            <p class=\"text-slate-300\">\n              Prvky ve frontě jsou seřazeny podle vzdálenosti: $d[v_1] \\le d[v_2] \\le \\dots \\le d[v_m]$.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"font-bold text-cyan-300\">2. Rozdíl nejvýše 1:</span>\n            <p class=\"text-slate-300\">\n              Poslední prvek fronty má vzdálenost nanejvýš o 1 větší než první prvek: $d[v_m] \\le d[v_1] + 1$.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-slate-900/80 border border-slate-700 font-mono text-xs text-slate-300\">\n          Fronta v reálném běhu: [d=2, d=2, d=2, d=3, d=3]. Nikdy se nestane, že by ve frontě byl prvek s d=2 a zároveň prvek s d=4!\n        </div>\n      </div>\n    "
  },
  {
    "id": 31,
    "module": 4,
    "moduleName": "Modul 4: Invarianty Cyklů (BFS & Dijkstra)",
    "badge": "BFS Důkaz",
    "badgeColor": "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    "title": "Důkaz Korektnosti BFS: Nejkratší Cesta",
    "subtitle": "Proč BFS v neohodnoceném grafu zaručeně najde nejkratší vzdálenost",
    "tags": [
      "BFS",
      "KOREKTNOST",
      "DŮKAZ SPOREM"
    ],
    "contentHtml": "\n      <div class=\"space-y-4 text-xs text-slate-300\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2\">\n          <span class=\"font-bold text-cyan-300 uppercase\">Důkaz sporem podle vzdálenosti:</span>\n          <ol class=\"list-decimal list-inside space-y-1.5\">\n            <li>Předpokládejme pro spor, že pro nějaký vrchol $v$ algoritmus nespočítá správnou vzdálenost ($d[v] \\ne \\operatorname{dist}(s, v)$).</li>\n            <li>Zvolme takový vrchol $v$, který má <strong>minimální skutečnou vzdálenost</strong> $\\operatorname{dist}(s, v)$.</li>\n            <li>Uvažme předchůdce $u$ vrcholu $v$ na skutečné nejkratší cestě z $s$. Platí $\\operatorname{dist}(s, v) = \\operatorname{dist}(s, u) + 1$.</li>\n            <li>Protože $\\operatorname{dist}(s, u) < \\operatorname{dist}(s, v)$, pro vrchol $u$ algoritmus BFS spočítal vzdálenost správně: $d[u] = \\operatorname{dist}(s, u)$.</li>\n            <li>V okamžiku, kdy BFS expandoval vrchol $u$, prozkoumal jeho hranu $\\{u, v\\}$. Pokud byl $v$ ještě nenavštívený, nastavil $d[v] = d[u] + 1 = \\operatorname{dist}(s, v)$, což je SPOR!</li>\n            <li class=\"text-emerald-300\">Závěr: BFS pro každý dosažitelný uzel spočítá přesnou nejkratší vzdálenost. $\\blacksquare$</li>\n          </ol>\n        </div>\n      </div>\n    "
  },
  {
    "id": 32,
    "module": 4,
    "moduleName": "Modul 4: Invarianty Cyklů (BFS & Dijkstra)",
    "badge": "Dijkstra Invariant",
    "badgeColor": "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    "title": "Dijkstrův Algoritmus: Množina Uzavřených Vrcholů S",
    "subtitle": "Greedy volba minimálního prvku a invariant optimálních vzdáleností",
    "tags": [
      "DIJKSTRA",
      "MNOŽINA S",
      "GREEDY",
      "EPIC"
    ],
    "keyFormula": "\\forall u \\in S: d[u] = \\operatorname{dist}(s, u) \\qquad \\forall v \\notin S: d[v] = \\min_{u \\in S} (d[u] + w(u, v))",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-xs text-slate-300\">\n          Dijkstrův algoritmus řeší nejkratší cesty v grafu s <strong>nezápornými vahami hran ($w(e) \\ge 0$)</strong>.\n        </p>\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-slate-700 space-y-2 text-xs text-slate-300\">\n          <span class=\"font-bold text-cyan-400 uppercase\">Dijkstrův invariant:</span>\n          <ul class=\"list-disc list-inside space-y-1.5\">\n            <li><strong>Množina S (Closed set):</strong> Pro všechny vrcholy $u \\in S$ je hodnota $d[u]$ finální a rovná se skutečné nejkratší vzdálenosti $\\operatorname{dist}(s, u)$.</li>\n            <li><strong>Množina V \\ S (Open set):</strong> Pro každý vrchol $v \\notin S$ je hodnota $d[v]$ délkou nejkratší cesty, jejíž všechny vnitřní vrcholy leží výhradně v $S$.</li>\n            <li><strong>Greedy krok:</strong> V každé iteraci vybereme vrchol $u^* = \\arg\\min_{v \\notin S} d[v]$ a přidáme ho do $S$.</li>\n          </ul>\n        </div>\n      </div>\n    "
  },
  {
    "id": 33,
    "module": 4,
    "moduleName": "Modul 4: Invarianty Cyklů (BFS & Dijkstra)",
    "badge": "Zkoušková Otázka",
    "badgeColor": "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    "title": "Proč Dijkstra Selhává na Záporných Hranách?",
    "subtitle": "Jak záporná hrana rozbije invariant a greedy předpoklad",
    "tags": [
      "ZÁPORNÉ HRANY",
      "KOLAPS",
      "BELLMAN-FORD"
    ],
    "examTip": "Typická otázka AG1: 'Funguje Dijkstra, pokud ke všem hranám přičteme konstantu C tak, aby byly kladné?' ODPOVĚĎ: NE! Přičtení konstanty zvýhodní cesty s menším počtem hran oproti cestám s více hranami! Nejkratší cesta se může změnit!",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2 text-xs text-slate-200\">\n          <div class=\"font-bold text-rose-300\">Kolaps greedy předpokladu:</div>\n          <p>\n            Dijkstra předpokládá, že jakmile uzel přidáme do $S$ s minimálním $d[u^*]$, žádná jiná cesta ho nemůže zkrátit, protože každé další prodloužení cesty o kladnou hranu by hodnotu jen <em>zvýšilo</em>.\n          </p>\n          <div class=\"p-3 rounded bg-black/40 border border-rose-500/30 text-rose-100 font-mono space-y-1\">\n            <div>Start (s) --(10)--> (A)</div>\n            <div>Start (s) --(20)--> (B) --(-15)--> (A)</div>\n          </div>\n          <p class=\"text-[11px] text-slate-300\">\n            Dijkstra nejprve uzavře $A$ s $d[A] = 10$. Teprve později prozkoumá $B$ ($d[B]=20$), odkud vede hrana s vahou $-15$. Skutečná vzdálenost do $A$ je $20 - 15 = 5 < 10$! Dijkstra už ale $A$ nikdy neaktualizuje! Invariant byl porušen.\n          </p>\n        </div>\n        <div class=\"p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300\">\n          <strong>Řešení:</strong> Pro grafy se zápornými hranami (ale bez záporných cyklů) musíme použít <strong>Bellman-Fordův algoritmus</strong> s časovou složitostí $O(|V| \\cdot |E|)$.\n        </div>\n      </div>\n    "
  },
  {
    "id": 34,
    "module": 5,
    "moduleName": "Modul 5: Konstruktivní Důkazy & Bio-Algoritmy",
    "badge": "Konstruktivnost",
    "badgeColor": "bg-purple-950/80 text-purple-300 border-purple-500/40",
    "title": "Konstruktivní Důkazy: Algoritmus jako Důkaz Existence",
    "subtitle": "Jak dokázat existenci objektu tím, že ho přímo zkonstruujeme",
    "tags": [
      "KONSTRUKTIVNÍ",
      "EXISTENCE",
      "ALGORITMUS"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-slate-700 space-y-2 text-xs\">\n            <span class=\"font-bold text-slate-400 uppercase\">Nekonstruktivní důkaz:</span>\n            <p class=\"text-slate-300\">\n              Dokáže, že objekt musí existovat (např. sporem vyvrátí jeho neexistenci), ale nedá žádný návod, jak ho v rozumném čase najít.\n            </p>\n            <div class=\"p-2 rounded bg-slate-950 text-[11px] text-slate-400\">\n              „V grafu existuje kostra, protože množina všech koster je neprázdná.\"\n            </div>\n          </div>\n          <div class=\"p-4 rounded-xl bg-slate-900/60 border border-purple-500/40 space-y-2 text-xs\">\n            <span class=\"font-bold text-purple-400 uppercase\">Konstruktivní důkaz (Informatika):</span>\n            <p class=\"text-slate-300\">\n              Dokáže existenci předložením <strong>konkrétního deterministického algoritmu</strong>, který objekt zaručeně sestrojí v polynomiálním čase!\n            </p>\n            <div class=\"p-2 rounded bg-slate-950 text-[11px] text-purple-200\">\n              „Kruskalův algoritmus najde minimální kostru v čase $O(|E| \\log |E|)$.\"\n            </div>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200\">\n          Konstruktivní důkaz je srdcem bioinformatiky. Když tvrdíme, že lze sestavit lidský chromozom z 3 miliard bází, musíme dodat algoritmus, který to reálně zvládne.\n        </div>\n      </div>\n    "
  },
  {
    "id": 35,
    "module": 5,
    "moduleName": "Modul 5: Konstruktivní Důkazy & Bio-Algoritmy",
    "badge": "Euler vs Hamilton",
    "badgeColor": "bg-purple-950/80 text-purple-300 border-purple-500/40",
    "title": "Asemblace Genomu: Eulerův Tah vs. Hamiltonova Cesta",
    "subtitle": "Proč jedna formulace vede k P a druhá k NP-úplnosti",
    "tags": [
      "EULER",
      "HAMILTON",
      "NP-ÚPLNOST",
      "DNA"
    ],
    "keyFormula": "\\text{Euler: Každá HRANA } \\implies O(|E|) \\qquad \\text{Hamilton: Každý VRCHOL } \\implies \\text{NP-těžký}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"overflow-x-auto\">\n          <table class=\"w-full text-xs text-left border-collapse border border-slate-700\">\n            <thead>\n              <tr class=\"bg-slate-800 text-slate-200\">\n                <th class=\"p-2 border border-slate-700\">Přístup</th>\n                <th class=\"p-2 border border-slate-700\">Model grafu</th>\n                <th class=\"p-2 border border-slate-700\">Matematický cíl</th>\n                <th class=\"p-2 border border-slate-700\">Složitost</th>\n              </tr>\n            </thead>\n            <tbody class=\"text-slate-300\">\n              <tr class=\"border-b border-slate-800 bg-rose-950/20\">\n                <td class=\"p-2 font-bold text-rose-300\">OLC (Overlap-Layout-Consensus)</td>\n                <td class=\"p-2\">Read = Vrchol, Překryv = Hrana</td>\n                <td class=\"p-2\">Hamiltonovská cesta</td>\n                <td class=\"p-2 text-rose-400 font-bold\">NP-úplný! (Nepoužitelné pro 10^8 readů)</td>\n              </tr>\n              <tr class=\"bg-emerald-950/20\">\n                <td class=\"p-2 font-bold text-emerald-300\">SBH (De Bruijn graf)</td>\n                <td class=\"p-2\">Prefix/Suffix = Vrchol, Read = Hrana</td>\n                <td class=\"p-2\">Eulerovský tah</td>\n                <td class=\"p-2 text-emerald-400 font-bold\">O(|E|) Lineární! (Běží v sekundách)</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <p class=\"text-xs text-slate-300\">\n          Přeformulování biologického problému ze „všechny vrcholy\" na „všechny hrany\" proměnilo neřešitelný výpočetní problém v elegantní lineární algoritmus!\n        </p>\n      </div>\n    "
  },
  {
    "id": 36,
    "module": 5,
    "moduleName": "Modul 5: Konstruktivní Důkazy & Bio-Algoritmy",
    "badge": "Eulerova Věta",
    "badgeColor": "bg-purple-950/80 text-purple-300 border-purple-500/40",
    "title": "Věta o Existenci Eulerova Tahu",
    "subtitle": "Nutná a postačující podmínka: Rovnováha stupňů ve všech vrcholech",
    "tags": [
      "EULER",
      "ROVNOVÁHA",
      "STUPNĚ"
    ],
    "keyFormula": "\\text{Uzavřený Eulerův tah existuje } \\iff \\forall v \\in V: \\deg^-(v) = \\deg^+(v) \\text{ a graf je slabě souvislý}",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1.5\">\n            <span class=\"font-bold text-indigo-300\">Neorientovaný graf:</span>\n            <p>\n              Souvislý graf má uzavřený Eulerův tah $\\iff$ každý vrchol má <strong>sudý stupeň</strong> ($deg(v) \\equiv 0 \\pmod 2$).\n            </p>\n            <p class=\"text-slate-400\">\n              Má otevřený Eulerův tah (se startem $s \\ne t$) $\\iff$ právě 2 vrcholy mají lichý stupeň (konce tahu).\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1.5\">\n            <span class=\"font-bold text-purple-300\">Orientovaný graf (De Bruijn):</span>\n            <p>\n              Uzavřený tah $\\iff \\forall v \\in V: \\deg^-(v) = \\deg^+(v)$.\n            </p>\n            <p class=\"text-slate-400\">\n              Otevřený tah z $s$ do $t$ $\\iff \\deg^+(s) - \\deg^-(s) = 1$, $\\deg^-(t) - \\deg^+(t) = 1$ a pro všechny ostatní uzly $\\deg^-(v) = \\deg^+(v)$.\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300\">\n          <strong>Intuice:</strong> Kdykoliv tah projde vrcholem $v$, spotřebuje jednu příchozí a jednu odchozí hranu. Pokud tah projde všemi hranami a skončí na začátku, musí být počet vstupů a výstupů v každém uzlu dokonale vyrovnán!\n        </div>\n      </div>\n    "
  },
  {
    "id": 37,
    "module": 5,
    "moduleName": "Modul 5: Konstruktivní Důkazy & Bio-Algoritmy",
    "badge": "Algoritmus",
    "badgeColor": "bg-purple-950/80 text-purple-300 border-purple-500/40",
    "title": "Hierholzerův Algoritmus v Čase O(|E|)",
    "subtitle": "Konstruktivní hledání Eulerova tahu spojováním nalezených cyklů",
    "tags": [
      "HIERHOLZER",
      "O(|E|)",
      "ALGORITMUS"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-purple-500/40 space-y-2 text-xs text-slate-300\">\n          <span class=\"font-bold text-purple-300 uppercase\">Hierholzerův postup (1873):</span>\n          <ol class=\"list-decimal list-inside space-y-1.5\">\n            <li>Zvol startovní vrchol $v_0$. Kráčej po dosud nepoužitých hranách, dokud se nezasekneš.</li>\n            <li>Díky rovnováze stupňů se zaručeně zasekneš <strong>v počátečním vrcholu $v_0$</strong>! Našel jsi jednoduchý cyklus $C_1$.</li>\n            <li>Pokud v grafu ještě zbývají nepoužité hrany, najdi vrchol $u \\in C_1$, který má incidentní nepoužitou hranu.</li>\n            <li>Z vrcholu $u$ vystartuj nový cyklus $C_2$ na zbylých hranách.</li>\n            <li>Vlep cyklus $C_2$ do cyklu $C_1$ v místě vrcholu $u$.</li>\n            <li>Opakuj, dokud nejsou spotřebovány všechny hrany $E$.</li>\n          </ol>\n        </div>\n        <div class=\"p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200\">\n          Při použití spojového seznamu pro ukládání trasy a pole ukazatelů na nepoužité hrany proběhne celý algoritmus v čase <strong>$O(|V| + |E|)$</strong>.\n        </div>\n      </div>\n    "
  },
  {
    "id": 38,
    "module": 5,
    "moduleName": "Modul 5: Konstruktivní Důkazy & Bio-Algoritmy",
    "badge": "Topologie DAGu",
    "badgeColor": "bg-purple-950/80 text-purple-300 border-purple-500/40",
    "title": "Topologické Uspořádání DAGu (Kahn vs. DFS)",
    "subtitle": "Acyklické orientované grafy v biologických signálních drahách a kompilátorech",
    "tags": [
      "DAG",
      "TOPOLOGICKÉ",
      "KAHN",
      "DFS"
    ],
    "keyFormula": "(u, v) \\in E \\implies \\operatorname{order}(u) < \\operatorname{order}(v)",
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <p class=\"text-xs text-slate-300\">\n          DAG = Directed Acyclic Graph (orientovaný acyklický graf). Topologické uspořádání seřadí vrcholy do řady tak, že všechny hrany směřují výhradně zleva doprava.\n        </p>\n        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs\">\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"font-bold text-cyan-300\">Kahnův Algoritmus (Odebírání zdrojů):</span>\n            <p class=\"text-slate-300\">\n              1. Spočítej vstupní stupně $\\deg^-(v)$ pro všechny uzly.<br/>\n              2. Vlož všechny zdroje ($deg^-(v) = 0$) do fronty.<br/>\n              3. Vyjímej uzly z fronty, zařazuj do výstupu a snižuj stupně sousedů.\n            </p>\n          </div>\n          <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n            <span class=\"font-bold text-purple-300\">DFS Reverzní Post-Order:</span>\n            <p class=\"text-slate-300\">\n              Pusť DFS na graf. Kdykoliv uzel dokončí prohledávání všech svých potomků (čas opuštění / post-order), vlož ho na vrchol zásobníku. Reverzní pořadí je topologické!\n            </p>\n          </div>\n        </div>\n        <div class=\"p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200\">\n          <strong>Věta:</strong> Orientovaný graf má topologické uspořádání $\\iff$ je acyklický (neobsahuje žádný orientovaný cyklus).\n        </div>\n      </div>\n    "
  },
  {
    "id": 39,
    "module": 6,
    "moduleName": "Modul 6: Zkouškový Workshop & Šablony",
    "badge": "Šablony Důkazů",
    "badgeColor": "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
    "title": "4 Univerzální Šablony Důkazů pro Zkoušku AG1",
    "subtitle": "Formální kostry, které zaručí plné bodové ohodnocení od cvičících",
    "tags": [
      "ŠABLONY",
      "ZKOUŠKA",
      "100%",
      "FIT ČVUT"
    ],
    "contentHtml": "\n      <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300\">\n        <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-yellow-300\">Šablona 1: Ekvivalence $A \\iff B$</span>\n          <p>\n            Vždy rozděl na dva oddělené odstavce s podnadpisy: <strong>1. Směr $\\implies$</strong> a <strong>2. Směr $\\impliedby$</strong>. Nikdy se nesnaž dokazovat oba směry najednou v jedné větě!\n          </p>\n        </div>\n        <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-yellow-300\">Šablona 2: Dekonstrukční indukce</span>\n          <p>\n            Báze $n=n_0 \\to$ IP pro $\\le n \\to$ Zvol LIBOVOLNÝ $G_{n+1} \\to$ Odeber list $v \\to$ Použij IP na $G_n \\to$ Vrať $v$ a algebraicky spoj.\n          </p>\n        </div>\n        <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-yellow-300\">Šablona 3: Důkaz sporem s extrémem</span>\n          <p>\n            Předpoklad $A \\land \\neg B \\to$ Zvol nejdelší cestu $P$ (nebo nejkratší cyklus) $\\to$ Analyzuj krajní bod $\\to$ Dojdi ke sporu s maximalitou $\\to$ Q.E.D.\n          </p>\n        </div>\n        <div class=\"p-3.5 rounded-xl bg-slate-900/70 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-yellow-300\">Šablona 4: Invariant cyklu</span>\n          <p>\n            Formuluj invariant $I \\to$ 1. Inicializace (před smyčkou) $\\to$ 2. Udržení (během iterace) $\\to$ 3. Ukončení + $I \\implies$ Korektnost algoritmu.\n          </p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 40,
    "module": 6,
    "moduleName": "Modul 6: Zkouškový Workshop & Šablony",
    "badge": "Exchange Argument",
    "badgeColor": "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
    "title": "Šablona 'Exchange Argument' (Greedy Algoritmy)",
    "subtitle": "Jak dokázat optimalitu Kruskalova a Primova algoritmu pro minimální kostru",
    "tags": [
      "EXCHANGE ARGUMENT",
      "GREEDY",
      "KRUSKAL",
      "PRIM"
    ],
    "contentHtml": "\n      <div class=\"space-y-4 text-xs text-slate-300\">\n        <div class=\"p-4 rounded-xl bg-slate-900/70 border border-yellow-500/40 space-y-2\">\n          <span class=\"font-bold text-yellow-300 uppercase\">Myšlenka argumentu záměnou:</span>\n          <ol class=\"list-decimal list-inside space-y-1.5\">\n            <li>Nechť $T_{\\text{greedy}}$ je řešení nalezené greedy algoritmem a $T_{\\text{opt}}$ je hypotetické optimální řešení.</li>\n            <li>Pokud $T_{\\text{greedy}} = T_{\\text{opt}}$, jsme hotovi — algoritmus našel optimum.</li>\n            <li>Pokud ne, vezměme první hranu $e \\in T_{\\text{greedy}}$, která v $T_{\\text{opt}}$ chybí ($e \\notin T_{\\text{opt}}$).</li>\n            <li>Přidáním $e$ do $T_{\\text{opt}}$ vznikne cyklus $C$. V cyklu $C$ musí existovat jiná hrana $e'$, která nepatří do $T_{\\text{greedy}}$.</li>\n            <li>Vyměníme hrany: $T' = T_{\\text{opt}} \\cup \\{e\\} \\setminus \\{e'\\}$. Graf $T'$ je stále kostrou!</li>\n            <li>Protože greedy algoritmus vybral $e$ místo $e'$, muselo platit $w(e) \\le w(e')$. Tedy váha $w(T') \\le w(T_{\\text{opt}})$.</li>\n            <li class=\"text-emerald-300\">Tedy $T'$ je také optimální, ale má o 1 hranu větší shodu s $T_{\\text{greedy}}$! Indukcí dokážeme, že greedy řešení je optimální. $\\blacksquare$</li>\n          </ol>\n        </div>\n      </div>\n    "
  },
  {
    "id": 41,
    "module": 6,
    "moduleName": "Modul 6: Zkouškový Workshop & Šablony",
    "badge": "7 Hříchů",
    "badgeColor": "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
    "title": "7 Smrtelných Hříchů Studenta u Písemky AG1",
    "subtitle": "Vyhněte se těmto chybám a ušetříte desítky zbytečně ztracených bodů",
    "tags": [
      "CHYBY",
      "PASTI",
      "ZKOUŠKA"
    ],
    "contentHtml": "\n      <div class=\"space-y-2.5 text-xs\">\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">1. ☠️ Redukční past u indukce</span>\n          <span class=\"text-slate-300\">Stavění grafu od nuly přidáváním vrcholu místo rozebírání libovolného zadaného $G_{n+1}$.</span>\n        </div>\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">2. ☠️ Implicitní předpoklad souvislosti</span>\n          <span class=\"text-slate-300\">Zapomenutí, že graf může mít více komponent souvislosti (např. les místo stromu).</span>\n        </div>\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">3. ☠️ Kruhový důkaz (Petitio Principii)</span>\n          <span class=\"text-slate-300\">Použití dokazovaného tvrzení (nebo jeho přímého důsledku) uvnitř argumentu.</span>\n        </div>\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">4. ☠️ Důkaz na jednom příkladu</span>\n          <span class=\"text-slate-300\">'Ukážeme to na grafu $K_4$...' Příklad NENÍ obecný důkaz!</span>\n        </div>\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">5. ☠️ Záměna nutné a postačující podmínky</span>\n          <span class=\"text-slate-300\">Dokázání pouze jedné strany implikace při požadavku na ekvivalenci.</span>\n        </div>\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">6. ☠️ Špatná negace kvantifikátorů</span>\n          <span class=\"text-slate-300\">Zapomenutí obrátit kvantifikátor (∀ na ∃ a naopak) nebo špatná negace implikace.</span>\n        </div>\n        <div class=\"p-2.5 rounded-lg bg-slate-900/80 border border-red-500/30 flex items-start gap-2.5\">\n          <span class=\"text-red-400 font-bold shrink-0\">7. ☠️ Vynechání báze indukce</span>\n          <span class=\"text-slate-300\">Neověření nejmenšího možného grafu ($n=1$ nebo $n=2$).</span>\n        </div>\n      </div>\n    "
  },
  {
    "id": 42,
    "module": 6,
    "moduleName": "Modul 6: Zkouškový Workshop & Šablony",
    "badge": "Master Cheat-Sheet",
    "badgeColor": "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
    "title": "Master Cheat-Sheet Vzorců a Vět",
    "subtitle": "Všechny klíčové matematické identity na jediném přehledném slidu",
    "tags": [
      "CHEAT-SHEET",
      "VZORCE",
      "SUMMARY"
    ],
    "contentHtml": "\n      <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs\">\n        <div class=\"p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-emerald-400\">Handshaking Lemma</span>\n          <div class=\"font-mono text-slate-200\">$\\sum_{v \\in V} \\deg(v) = 2|E|$</div>\n          <p class=\"text-[11px] text-slate-400\">Počet vrcholů lichého stupně je vždy sudý.</p>\n        </div>\n        <div class=\"p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-cyan-400\">Vlastnosti Stromu (Ekvivalence)</span>\n          <div class=\"font-mono text-slate-200\">Souvislý $\\land$ Acyklický $\\iff |E| = |V| - 1$</div>\n          <p class=\"text-[11px] text-slate-400\">Libovolné dvě vlastnosti implikují třetí.</p>\n        </div>\n        <div class=\"p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-indigo-400\">Bipartitnost &amp; 2-obarvitelnost</span>\n          <div class=\"font-mono text-slate-200\">$G$ je bipartitní $\\iff$ nemá lichý cyklus</div>\n          <p class=\"text-[11px] text-slate-400\">Lze otestovat pomocí BFS v čase $O(|V| + |E|)$.</p>\n        </div>\n        <div class=\"p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-purple-400\">Eulerovský tah</span>\n          <div class=\"font-mono text-slate-200\">$\\forall v: \\deg(v) \\equiv 0 \\pmod 2 \\quad (\\deg^- = \\deg^+)$</div>\n          <p class=\"text-[11px] text-slate-400\">Vyřešitelné Hierholzerem v lineárním čase $O(|E|)$.</p>\n        </div>\n        <div class=\"p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-rose-400\">Eulerova Formule (Planární grafy)</span>\n          <div class=\"font-mono text-slate-200\">$|V| - |E| + |F| = 2$ (pro souvislý rovinný graf)</div>\n          <p class=\"text-[11px] text-slate-400\">Max. počet hran v planárním grafu bez trojúhelníků: $|E| \\le 2|V| - 4$.</p>\n        </div>\n        <div class=\"p-3 rounded-xl bg-slate-900/80 border border-slate-700 space-y-1\">\n          <span class=\"font-bold text-amber-400\">Algoritmické složitosti</span>\n          <div class=\"font-mono text-slate-200\">BFS/DFS: $O(V+E)$, Dijkstra: $O((V+E)\\log V)$</div>\n          <p class=\"text-[11px] text-slate-400\">Kruskal: $O(E \\log E)$, Kahn: $O(V+E)$.</p>\n        </div>\n      </div>\n    "
  },
  {
    "id": 43,
    "module": 6,
    "moduleName": "Modul 6: Zkouškový Workshop & Šablony",
    "badge": "Závěr & Úspěch",
    "badgeColor": "bg-yellow-950/80 text-yellow-300 border-yellow-500/40",
    "title": "Závěr & Zkoušková Strategie: Jste Připraveni!",
    "subtitle": "Most z biologie do teoretické informatiky je úspěšně postaven",
    "tags": [
      "GRATULACE",
      "FINÁLE",
      "AG1-READY"
    ],
    "contentHtml": "\n      <div class=\"space-y-4\">\n        <div class=\"p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-yellow-500/40 text-center space-y-3\">\n          <div class=\"inline-flex p-3 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-2xl\">\n            🏆\n          </div>\n          <h3 class=\"text-lg font-bold text-slate-100\">\n            Zvládli jste všech 7 modulů matematické přípravy na AG1!\n          </h3>\n          <p class=\"text-xs text-slate-300 max-w-xl mx-auto\">\n            Máte v rukou formální jazyk grafů, schopnost správně negovat kvantifikované výroky, umíte dekonstrukční indukci bez build-up pasti, ovládáte extremální princip a víte, jak zapsat 3-fázový invariant.\n          </p>\n        </div>\n\n        <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs\">\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1\">\n            <div class=\"font-bold text-emerald-400\">1. Čtěte zadání dvakrát</div>\n            <div class=\"text-[11px] text-slate-400\">Identifikujte typ úlohy a ověřte, zda graf musí být souvislý.</div>\n          </div>\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1\">\n            <div class=\"font-bold text-cyan-400\">2. Kreslete protipříklady</div>\n            <div class=\"text-[11px] text-slate-400\">Malý protipříklad na papíře vám okamžitě ukáže, kudy vést spor.</div>\n          </div>\n          <div class=\"p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1\">\n            <div class=\"font-bold text-yellow-400\">3. Držte se šablon</div>\n            <div class=\"text-[11px] text-slate-400\">Přehledný strukturovaný zápis vám získá sympatie opravujícího.</div>\n          </div>\n        </div>\n\n        <div class=\"p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200\">\n          <span>Materiály můžete kdykoliv znovu studovat v jednotlivých modulech wiki.</span>\n          <a\n            href=\"/obor-bioinformatika/3-semestr/pre-ag1/dml\"\n            class=\"px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors\"\n          >\n            Návrat na Hub 🚀\n          </a>\n        </div>\n      </div>\n    "
  }
];
