# Modul 1: Logický & Důkazový Základ pro Grafové Algoritmy

> **[Relevance: 95%]** · **Tags:** `[EPIC]` `[INSIGHT]` `[PAST U ZKOUŠKY]`
> **Cíl modulu:** Ovládnout přesný formální jazyk matematické logiky, získat 100% jistotu v negování složitých kvantifikovaných výroků ($\forall, \exists, \exists!$), bezchybně rozlišovat nutnou a postačující podmínku a osvojit si 4 základní důkazové šablony pro zápočtové testy a zkoušku z AG1 na FIT ČVUT.

---

## 🌱 Než začneme: Proč se biologové učí logiku?

Představ si, že zkoumáš nový protein. Kolega tvrdí: *„Pokud je tento gen aktivní, pak se protein exprimuje."* Jenže v experimentu vidíš buňky, kde gen aktivní **není** — a protein se tam taky neobjevuje. Potvrzuje to kolegovo tvrzení, nebo ho vyvrací?

Odpověď závisí přesně na tom, **jak přečteme implikaci** „pokud A, pak B". A tady spousta biologů (a i počítačových vědců) dělá chyby — protože přirozený jazyk je nejednoznačný. Věta „Pokud prší, vezmu deštník" **nic neříká o tom, co uděláš, když neprší** — třeba deštník vezmeš stejně, protože je hezký.

Matematická logika je nástroj, který tuto nejednoznačnost odstraňuje. Ve zkouškách z AG1 budeš formulovat tvrzení o grafech a dokazovat je — a každá nejednoznačnost v logickém zápisu = ztráta bodů.

> [!TIP]
> **Příslib tohoto modulu:** Po přečtení budeš umět přečíst jakékoliv matematické tvrzení o grafu, bezchybně ho znegovat a zvolit správnou strategii důkazu. Žádná „vyšší matematika" se nevyžaduje — jen přesné myšlení.

---

## 1. Úvod do Matematické Logiky `[INSIGHT]`

V běžném jazyce bývají biologická a chemická tvrzení často mnohoznačná. V počítačové vědě a teoretické informatice však musíme formulovat myšlenky tak, aby neexistovala žádná pochybnost o jejich pravdivosti.

Matematická logika pracuej s **výroky**:
> **Definice Výroku:** Výrok je oznamovací věta, o níž má smysl prohlásit, zda je **pravdivá (značíme 1, True, T)** nebo **nepravdivá (značíme 0, False, F)**.

### Příklady v Bioinformatice:
- *"Molekula vody obsahuje 2 atomy vodíku."* $\implies$ **Výrok (Pravdivý = 1)**.
- *"Graf $K_5$ má 10 hran."* $\implies$ **Výrok (Pravdivý = 1)**.
- *"Tento kód v C++ je pěkný."* $\implies$ **NENÍ výrok** (subjektivní hodnocení, nelze jednoznačně určit 0 nebo 1).
- *"Kolik prvků má množina $V$?"* $\implies$ **NENÍ výrok** (otázka).

---

## 2. Výrokové Spojky a Pravdivostní Tabulky `[Relevance: 95%]` `[EPIC]`

Složitější výroky stavíme z jednoduchých výrokových proměnných ($A, B, C$) pomocí **výrokových spojek**:

| Spojka | Název | Zápis | Význam v češtině | Pravdivostní pravidlo |
| :--- | :--- | :--- | :--- | :--- |
| $\neg$ | **Negace** | $\neg A$ | *"Není pravda, že A"* | Obrátí pravdivostní hodnotu ($1 \to 0, 0 \to 1$). |
| $\land$ | **Konjunkce** | $A \land B$ | *"A a zároveň B"* | Pravda pouze v případě, že **oba** výroky A i B platí. |
| $\lor$ | **Disjunkce** | $A \lor B$ | *"A nebo B"* | Pravda, pokud platí **alespoň jeden** z výroků A, B. |
| $\Rightarrow$ | **Implikace** | $A \Rightarrow B$ | *"Jestliže A, pak B"* | Nepravda pouze v případě, že **A platí a B neplatí**. |
| $\Leftrightarrow$ | **Ekvivalence** | $A \Leftrightarrow B$ | *"A právě tehdy, když B"* | Pravda, pokud mají A i B **stejnou** pravdivostní hodnotu. |

<div class="my-6 p-4 rounded-xl bg-stone-100/60 dark:bg-[#1a120c]/60 border border-stone-200/60 dark:border-stone-800/60 opacity-60 hover:opacity-100 transition-opacity duration-300">
<div class="flex items-center justify-between mb-2">
<span class="text-xs text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wide">📐 Rozšířený přehled matematického značení a logických symbolů (BI-DML reference)</span>
<span class="text-[11px] text-stone-600 dark:text-stone-400 italic">Doplňkový přehled z přednášek</span>
</div>
<table class="w-full text-left text-xs border-collapse">
<thead>
<tr class="border-b border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
<th class="py-2 px-2.5 font-semibold">Zavedený symbol</th>
<th class="py-2 px-2.5 font-semibold">Význam zavedeného symbolu (BI-DML)</th>
<th class="py-2 px-2.5 font-semibold">Formální popis & Příklad</th>
</tr>
</thead>
<tbody class="divide-y divide-stone-200/50 dark:divide-stone-800/50 text-stone-600 dark:text-stone-400">
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$:=$ (nebo $\coloneqq$)</td>
<td class="py-1.5 px-2.5 font-medium"><strong>definice</strong>, symbol na levé straně je definován výrazem na straně pravé</td>
<td class="py-1.5 px-2.5">Označuje zavedení nového objektu či zkratky, např. $f(x) := x^2 + 1$ nebo $V := \{v_1, \dots, v_n\}$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\neg A$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>negace formule</strong> $A$</td>
<td class="py-1.5 px-2.5">Obrací pravdivostní hodnotu: výrok je pravdivý právě tehdy, když formule $A$ je nepravdivá ($\neg 1 = 0$, $\neg 0 = 1$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\forall$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>obecný (univerzální, velký) kvantifikátor</strong></td>
<td class="py-1.5 px-2.5">$\forall x \in V : P(x)$ znamená „pro každý (všechny) prvek $x$ z množiny $V$ platí vlastnost $P(x)$“</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\exists$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>existenční (malý) kvantifikátor</strong></td>
<td class="py-1.5 px-2.5">$\exists x \in V : P(x)$ znamená „existuje alespoň jeden prvek $x$ z množiny $V$, pro který platí vlastnost $P(x)$“</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\exists!$ (nebo $\exists_{1}$)</td>
<td class="py-1.5 px-2.5 font-medium"><strong>kvantifikátor jednoznačné existence</strong></td>
<td class="py-1.5 px-2.5">$\exists! x \in V : P(x)$ znamená „existuje právě jeden (jediný) prvek $x$ z množiny $V$, pro který platí $P(x)$“</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \Rightarrow B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>implikace mezi formulemi</strong> $A$ a $B$</td>
<td class="py-1.5 px-2.5">Čteme „z $A$ plyne $B$“ ($A \implies B$); neplatí pouze v případě, kdy předpoklad $A$ platí a závěr $B$ neplatí ($1 \Rightarrow 0$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \Leftrightarrow B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>ekvivalence mezi formulemi</strong> $A$ a $B$</td>
<td class="py-1.5 px-2.5">Čteme „$A$ právě tehdy, když $B$“ ($A \iff B$); pravdivá právě tehdy, když obě formule mají shodnou pravdivostní hodnotu</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \land B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>konjunkce formulí</strong> $A$ a $B$</td>
<td class="py-1.5 px-2.5">Logické „A ZÁROVEŇ“; pravdivá pouze tehdy, když platí obě formule $A$ i $B$ současně</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \lor B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>disjunkce formulí</strong> $A$ a $B$</td>
<td class="py-1.5 px-2.5">Logické „NEBO“; pravdivá, pokud platí alespoň jedna z formulí $A$ nebo $B$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \oplus B$ (nebo $A \veebar B$)</td>
<td class="py-1.5 px-2.5 font-medium"><strong>exkluzivní disjunkce (XOR)</strong></td>
<td class="py-1.5 px-2.5">„Buď $A$, nebo $B$ (ale ne obojí současně)“; pravdivá právě tehdy, když mají formule $A$ a $B$ různou pravdivostní hodnotu</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \uparrow B$ (nebo $A \mid B$)</td>
<td class="py-1.5 px-2.5 font-medium"><strong>Shefferův operátor (NAND)</strong></td>
<td class="py-1.5 px-2.5">Negace konjunkce $\neg(A \land B)$; tvoří funkcionálně úplný systém jediné spojky (vše lze vyjádřit jen pomocí NAND)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \downarrow B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>Peirceův operátor (NOR)</strong></td>
<td class="py-1.5 px-2.5">Negace disjunkce $\neg(A \lor B)$; rovněž tvoří funkcionálně úplný systém jediné spojky</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\top$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>tautologie</strong></td>
<td class="py-1.5 px-2.5">Výroková formule, která je vždy pravdivá (hodnota 1) při libovolném pravdivostním ohodnocení (např. $A \lor \neg A$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\bot$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>kontradikce</strong></td>
<td class="py-1.5 px-2.5">Výroková formule, která je vždy nepravdivá (hodnota 0) při libovolném pravdivostním ohodnocení (např. $A \land \neg A$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$E \models F$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>logický důsledek mezi formulemi</strong> $E$ a $F$</td>
<td class="py-1.5 px-2.5">Formule $F$ je sémantickým důsledkem $E$ (v BI-DML značeno též $E \mathrel{\vert{=}} F$); každý model formule $E$ je i modelem $F$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$E \mathrel{\vert{=}\vert} F$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>logická ekvivalence mezi formulemi</strong> $E$ a $F$</td>
<td class="py-1.5 px-2.5">Formule $E$ a $F$ jsou sémanticky ekvivalentní (též $E \equiv F$); mají shodné pravdivostní ohodnocení ve všech modelech</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$E \vdash F$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>syntaktická odvoditelnost (dokazatelnost)</strong></td>
<td class="py-1.5 px-2.5">Formule $F$ je formálně dokazatelná z předpokladů $E$ dedukčními pravidly (např. rezoluční metodou či Hilbertovským kalkulem)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\sum_{k=d}^h a(k)$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>suma (součet) výrazů</strong> $a(d) + \dots + a(h)$</td>
<td class="py-1.5 px-2.5">Součet konečné řady výrazů se sčítacím indexem $k$ od $d$ do $h$ (např. součet stupňů vrcholů $\sum_{v \in V} \deg(v) = 2|E|$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\prod_{k=d}^h a(k)$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>produkt (součin) výrazů</strong> $a(d) \cdot \dots \cdot a(h)$</td>
<td class="py-1.5 px-2.5">Součin posloupnosti činitelů se součinovým indexem $k$ od $d$ do $h$ (např. faktoriál $n! = \prod_{k=1}^n k$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$x \in M$, $x \notin M$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>náležení / nenáležení prvku do množiny</strong></td>
<td class="py-1.5 px-2.5">$x \in M$ znamená, že prvek $x$ je prvkem množiny $M$; $x \notin M \iff \neg(x \in M)$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \subseteq B$, $A \subsetneq B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>podmnožina a vlastní podmnožina</strong></td>
<td class="py-1.5 px-2.5">$A \subseteq B \iff (\forall x: x \in A \implies x \in B)$; vlastní podmnožina navíc vyžaduje $A \neq B$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \cup B$, $A \cap B$, $A \setminus B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>sjednocení, průnik a rozdíl množin</strong></td>
<td class="py-1.5 px-2.5">$A \cup B = \{x \mid x \in A \lor x \in B\}$, $A \cap B = \{x \mid x \in A \land x \in B\}$, $A \setminus B = \{x \mid x \in A \land x \notin B\}$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$A \times B$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>kartézský součin množin</strong></td>
<td class="py-1.5 px-2.5">Množina všech uspořádaných dvojic $\{(a, b) \mid a \in A \land b \in B\}$; velikost $|A \times B| = |A| \cdot |B|$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\mathcal{P}(A)$ (nebo $2^A$)</td>
<td class="py-1.5 px-2.5 font-medium"><strong>potenční množina</strong></td>
<td class="py-1.5 px-2.5">Množina všech podmnožin množiny $A$: $\mathcal{P}(A) = \{X \mid X \subseteq A\}$; mohutnost je $|\mathcal{P}(A)| = 2^{|A|}$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\emptyset$ (nebo $\{\}$)</td>
<td class="py-1.5 px-2.5 font-medium"><strong>prázdná množina</strong></td>
<td class="py-1.5 px-2.5">Množina neobsahující žádný prvek; $|\emptyset| = 0$, je podmnožinou každé množiny ($\emptyset \subseteq A$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>standardní číselné obory</strong></td>
<td class="py-1.5 px-2.5">Přirozená čísla ($\mathbb{N}$), celá čísla ($\mathbb{Z}$), racionální čísla ($\mathbb{Q}$) a reálná čísla ($\mathbb{R}$)</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$\binom{n}{k}$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>kombinační číslo</strong> („$n$ nad $k$“)</td>
<td class="py-1.5 px-2.5">Počet všech $k$-prvkových podmnožin $n$-prvkové množiny: $\binom{n}{k} = \frac{n!}{k!(n-k)!}$</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$a \mid b$, $a \nmid b$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>relace dělitelnosti</strong></td>
<td class="py-1.5 px-2.5">$a \mid b \iff (\exists k \in \mathbb{Z}: b = k \cdot a)$ („$a$ dělí $b$“); $a \nmid b$ značí negaci</td>
</tr>
<tr>
<td class="py-1.5 px-2.5 font-mono font-medium">$a \equiv b \pmod m$</td>
<td class="py-1.5 px-2.5 font-medium"><strong>kongruence modulo $m$</strong></td>
<td class="py-1.5 px-2.5">Čísla $a$ a $b$ dávají po dělení číslem $m$ stejný zbytek $\iff m \mid (a - b)$</td>
</tr>
</tbody>
</table>
</div>

---

### 2.1 Mnemotechnika Implikace ($A \Rightarrow B$) & Slib Zkoušejícího `[PAST U ZKOUŠKY]`

Studenti VŠCHT nejčastěji chybují v pravdivosti **implikace** $A \Rightarrow B$, pokud je předpoklad $A$ nepravdivý.
- **$A$** = předpoklad (antecedent),
- **$B$** = závěr (konsekvent).

Proč je implikace $0 \Rightarrow 0$ pravdivá (1) a $0 \Rightarrow 1$ je také pravdivá (1)?

Představme si oficiální slib cvičícího v kurzu AG1:
> *"Slib vyučujícího: Pokud student správně vyřeší dekonstrukční indukci ($A=1$), pak dostane zápočet z AG1 ($B=1$)."*

<div class="overflow-x-auto my-6 border border-slate-200/80 rounded-xl shadow-xs">
<table class="w-full text-left text-xs sm:text-sm border-collapse">
<thead>
<tr class="bg-slate-100/70 border-b border-slate-200">
<th class="px-4 py-3 text-slate-700 font-semibold">Předpoklad A (Student napsal indukci)</th>
<th class="px-4 py-3 text-slate-700 font-semibold">Závěr B (Student dostal zápočet)</th>
<th class="px-4 py-3 text-slate-700 font-semibold">A =&gt; B</th>
<th class="px-4 py-3 text-slate-700 font-semibold">Didaktické zhodnocení situace</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3 font-mono">0 (Nenapsal)</td>
<td class="px-4 py-3 font-mono">0 (Nedostal)</td>
<td class="px-4 py-3 font-bold text-emerald-600">1 (Pravda)</td>
<td class="px-4 py-3">Student důkaz nepsal a zápočet nedostal. Vyučující svůj slib NEPORUŠIL (Férová situace / OK).</td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3 font-mono">0 (Nenapsal)</td>
<td class="px-4 py-3 font-mono">1 (Dostal)</td>
<td class="px-4 py-3 font-bold text-emerald-600">1 (Pravda)</td>
<td class="px-4 py-3">Student důkaz nepsal, ale dostal zápočet za jiné aktivity. Vyučující slib NEPORUŠIL (OK).</td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3 font-mono">1 (Napsal)</td>
<td class="px-4 py-3 font-mono">0 (Nedostal)</td>
<td class="px-4 py-3 font-bold text-rose-600 font-bold">0 (NEPRAVDA)</td>
<td class="px-4 py-3 text-rose-600 font-medium">Student bezchybně vyřešil indukci, ale zápočet NEDOSTAL! Slib byl porušen. (JEDINÝ PŘÍPAD NEPRAVDY!)</td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-4 py-3 font-mono">1 (Napsal)</td>
<td class="px-4 py-3 font-mono">1 (Dostal)</td>
<td class="px-4 py-3 font-bold text-emerald-600">1 (Pravda)</td>
<td class="px-4 py-3">Student důkaz vyřešil a zápočet dostal. Vše proběhlo přesně podle slibu (OK).</td>
</tr>
</tbody>
</table>
</div>

> [!IMPORTANT]
> **Triviální Pravdivost (Vacuous Truth):**
> Pokud je předpoklad $A$ **nepravdivý ($A=0$)**, je implikace $A \Rightarrow B$ **VŽDY PRAVDIVÁ**, bez ohledu na to, zda $B$ platí nebo ne!
> *Příklad:* Tvrzení *"Každá molekula s 0 atomy uhlíku je bílkovina"* je matematicky pravdivý výrok, protože předpoklad (molekula s 0 uhlíky tvořící bílkovinu) je prázdný.

---

### 2.2 De Morganovy Zákony a Klíčové Logické Ekvivalence `[Relevance: 95%]` `[EPIC]`

**De Morganovy zákony** tvoří základní pravidlo pro distribuci negace přes logickou konjunkci ($\land$) a disjunkci ($\lor$). 

> **1. De Morganův zákon pro konjunkci:**
> $$\neg (A \land B) \quad \equiv \quad \neg A \lor \neg B$$
> *"Není pravda, že platí A i B zároveň $\iff$ Neplatí A, nebo neplatí B."*
>
> **2. De Morganův zákon pro disjunkci:**
> $$\neg (A \lor B) \quad \equiv \quad \neg A \land \neg B$$
> *"Není pravda, že platí A nebo B $\iff$ Neplatí A a zároveň neplatí B."*

#### 📊 Důkaz De Morganova Zákona $\neg (A \land B) \equiv \neg A \lor \neg B$ Pravdivostní Tabulkou:

<div class="overflow-x-auto my-6 border border-slate-200/80 rounded-xl shadow-xs">
<table class="w-full text-left text-xs sm:text-sm border-collapse">
<thead>
<tr class="bg-slate-100/70 border-b border-slate-200">
<th class="px-3 py-2 text-slate-700 font-semibold">A</th>
<th class="px-3 py-2 text-slate-700 font-semibold">B</th>
<th class="px-3 py-2 text-slate-700 font-semibold">A ∧ B</th>
<th class="px-3 py-2 text-slate-700 font-semibold">¬(A ∧ B)</th>
<th class="px-3 py-2 text-slate-700 font-semibold">¬A</th>
<th class="px-3 py-2 text-slate-700 font-semibold">¬B</th>
<th class="px-3 py-2 text-slate-700 font-semibold font-bold text-emerald-700">¬A ∨ ¬B</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-slate-100 font-mono">
<td class="px-3 py-2">0</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2 font-bold text-emerald-600">1</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2 font-bold text-emerald-600">1</td>
</tr>
<tr class="border-b border-slate-100 font-mono">
<td class="px-3 py-2">0</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2 font-bold text-emerald-600">1</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2 font-bold text-emerald-600">1</td>
</tr>
<tr class="border-b border-slate-100 font-mono">
<td class="px-3 py-2">1</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2 font-bold text-emerald-600">1</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2 font-bold text-emerald-600">1</td>
</tr>
<tr class="border-b border-slate-100 font-mono">
<td class="px-3 py-2">1</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2">1</td>
<td class="px-3 py-2 font-bold text-rose-600">0</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2">0</td>
<td class="px-3 py-2 font-bold text-rose-600">0</td>
</tr>
</tbody>
</table>
</div>

Sloupce $\neg(A \land B)$ a $\neg A \lor \neg B$ mají ve všech řádcích **identickou pravdivostní hodnotu**. Ekvivalence je dokázána! $\blacksquare$

---

#### 🧬 Grafové Aplikace De Morganových Zákonů v Bioinformatice:

1. **Definice Stromu (Souvislý $\land$ Acyklický):**
   - Věta: *"Graf $G$ je strom, pokud je souvislý ($A$) a zároveň acyklický ($B$)."*
   - Negace De Morganovým zákonem: *"Graf $G$ NENÍ strom ($\neg (A \land B)$), právě když $G$ není souvislý ($\neg A$), nebo $G$ obsahuje cyklus ($\neg B$)."*
2. **Kritérium Bipartitnosti Grafu:**
   - Nechť výrok $A$ značí *"Graf lze 2-obarvit"* a $B$ značí *"Graf neobsahuje liché cykly"*.
   - Porušení bipartitnosti znamenající $\neg (A \land B)$ se podle De Morgana rozpadne na vyhledání uzlu porušujícího 2-obarvení nebo existenci lichého cyklu.

---

### 2.3 Převod Implikace a Kontrapozice

Při úpravě logických výroků v algoritmech a důkazech se neobcházíte bez těchto zákonů:

1. **Převod Implikace na Disjunkci:**
   $$(A \Rightarrow B) \quad \equiv \quad (\neg A \lor B)$$
2. **Negace Implikace:**
   $$\neg (A \Rightarrow B) \quad \equiv \quad (A \land \neg B)$$
   *(Implikace neplatí právě tehdy, když platí předpoklad A a zároveň NEPLATÍ závěr B!)*
3. **Obměněná Implikace (Kontrapozice):**
   $$(A \Rightarrow B) \quad \equiv \quad (\neg B \Rightarrow \neg A)$$

---

## 3. Nutná vs. Postačující Podmínka `[Relevance: 95%]` `[INSIGHT]`

V předmětu AG1 musíte bez váhání rozumět slovnímu spojení *"Nutná a postačující podmínka"*:

Uvažujme implikaci $A \Rightarrow B$:
- **$A$ je POSTAČUJÍCÍ podmínka pro $B$:** Platnost $A$ nám **zcela stačí** k tomu, abychom zaručili platnost $B$. (Jakmile nastane A, automaticky platí B).
- **$B$ je NUTNÁ podmínka pro $A$:** Bez platnosti $B$ nemůže $A$ vůbec nastat. Pokud neplatí $B$, je vyloučeno, aby platilo $A$ ($\neg B \implies \neg A$).

### 🧬 Biologicko-Chemické a Grafové Srovnání:

```
┌──────────────────────────────────────┬──────────────────────────────────────┬──────────────────────────────────────┐
│ Vztah A ⇒ B                          │ Postačující podmínka (A)             │ Nutná podmínka (B)                   │
├──────────────────────────────────────┼──────────────────────────────────────┼──────────────────────────────────────┤
│ Glukóza ⇒ Obsahuje Uhlík             │ Být glukózou STAČÍ k obsahu uhlíku.  │ Obsahovat uhlík je NUTNÉ pro glukózu.│
│ Enzymatická kaskáda ⇒ Přítomnost ATP │ Aktivace kaskády STAČÍ pro spotřebu. │ ATP je NUTNÉ pro průběh kaskády.     │
│ Graf je Strom ⇒ Graf je Souvislý     │ Být stromem STAČÍ pro souvislost.    │ Souvislost je NUTNÁ pro strom.       │
│ deg(v) je liché ⇒ Graf má hrany      │ Liché deg(v) STAČÍ pro existenci hrany.│ Existuje hrana je NUTNÉ pro deg > 0. │
└──────────────────────────────────────┴──────────────────────────────────────┴──────────────────────────────────────┘
```

> [!NOTE]
> Pokud platí **ekvivalence $A \Leftrightarrow B$**, říkáme, že $A$ je **nutnou A ZÁROVEŇ postačující podmínkou** pro $B$ (a naopak).
> *Příklad z AG1:* Graf je bipartitní **právě tehdy, když** neobsahuje žádné liché cykly.

---

## 4. Kvantifikátory ($\forall, \exists, \exists!$) a Jejich Negace `[Relevance: 95%]` `[MEGA EPIC]`

V teorii grafů popisujeme vlastnosti celých množin prvků pomocí kvantifikátorů:

- **$\forall$ (Všeobecný kvantifikátor):** *"Pro všechny..."*, *"Pro každý..."*.
- **$\exists$ (Existenční kvantifikátor):** *"Existuje alespoň jeden..."*, *"Lze najít takový..."*.
- **$\exists!$ (Jednoznačný existenční kvantifikátor):** *"Existuje právě jeden..."*, *"Existuje jediný..."*.

---

### 4.1 Pravidlo Negace Kvantifikátorů `[PAST U ZKOUŠKY]`

Při negování výroků s kvantifikátory platí dvě neúprosná pravidla:
1. **Záměna kvantifikátoru:** $\forall \longleftrightarrow \exists$.
2. **Negace vnitřní formule:** Znegujeme tvrzení uvnitř.

$$\neg (\forall x \in M : P(x)) \quad \equiv \quad \exists x \in M : \neg P(x)$$
$$\neg (\exists x \in M : P(x)) \quad \equiv \quad \forall x \in M : \neg P(x)$$

---

### 4.2 Složité Řetězené Negace v Bioinformatice

V reálných testech z AG1 potkáte výroky s více vrstvami kvantifikátorů. Pojďme si je nacvičit:

#### Případ 1: Souvislost Grafu
- **Původní tvrzení $S$ (Graf je souvislý):**
  $$\forall u, v \in V : (u \neq v \implies \exists \text{ cesta } P \text{ z } u \text{ do } v)$$
- **Formální Negace $\neg S$ (Graf je nesouvislý):**
  Aplikujeme pravidlo negace zvenčí dovnitř:
  1. Zaměníme $\forall u, v$ za $\exists u, v$.
  2. Znegujeme implikaci $\neg (A \implies B) \equiv A \land \neg B$.
  3. Zaměníme $\exists P$ za $\forall P$ a znegujeme existenci cesty.
  $$\exists u, v \in V : (u \neq v \land \forall \text{ cestu } P : P \text{ NESPOJUJE } u \text{ a } v)$$
- **Slovní překlad:** *"Existuje dvojice různých vrcholů $u, v$ v grafu taková, že mezi nimi neexistuje žádná cesta."*

#### Případ 2: Slepá Ulička v Reakční Síti (Terminal Metabolite)
- **Původní tvrzení $R$ (Z každého metabolitu vedou reakce dál):**
  $$\forall v \in V \; \exists w \in V : (v, w) \in E$$
- **Formální Negace $\neg R$ (Existuje slepá ulička):**
  $$\exists v \in V \; \forall w \in V : (v, w) \notin E$$
- **Slovní překlad:** *"Existuje metabolit $v$ takový, že z něj nevedou reakce do žádného metabolitu $w$."*

---

## 5. Přehled 4 Základních Důkazových Technik pro AG1 `[MEGA EPIC]`

Abychom dokázali matematické tvrzení $T$, používáme v algoritmické informatice 4 přístupy:

```
                  ┌────────────────────────────────────────┐
                  │   Jak dokázat tvrzení v logice & AG1   │
                  └───────────────────┬────────────────────┘
                                      │
       ┌──────────────────┬───────────┴───────────┬──────────────────┐
       ▼                  ▼                       ▼                  ▼
┌──────────────┐   ┌──────────────┐       ┌──────────────┐   ┌──────────────┐
│  Přímý důkaz │   │ Kontrapozice │       │ Důkaz sporem │   │  Matematická │
│ (A ⇒ ... ⇒ B)│   │(¬B ⇒ ... ⇒¬A)│       │ (A ∧ ¬B ⇒ 💥)│   │   indukce    │
└──────────────┘   └──────────────┘       └──────────────┘   └──────────────┘
```

### 1. Přímý důkaz ($A \Rightarrow B$)
Vyjdeme z předpokladu $A$ a posloupností ekvivalentních úprav a definic přímo odvodíme $B$:
$$A \implies A_1 \implies A_2 \implies \dots \implies B$$

### 2. Důkaz Kontrapozicí ($\neg B \Rightarrow \neg A$)
Místo obtížné implikace $A \Rightarrow B$ dokážeme logicky ekvivalentní obměněnou implikaci $\neg B \Rightarrow \neg A$.
- **Kdy použít:** Když je negovaný závěr $\neg B$ konstrukčně snazší uchopit než předpoklad $A$.

### 3. Důkaz Sporem ($A \land \neg B \Rightarrow \bot$)
Předpokládáme logický opak požadovaného tvrzení (tj. předpokládáme platnost $A$ a zároveň $\neg B$). Odvozováním dojdeme ke sporu ($\bot$) s definicí, předpokladem nebo známou větou.

### 4. Dekonstrukční Matematická Indukce
Pro dokazování tvrzení závislých na velikosti grafu $n = |V|$ nebo $m = |E|$. Dekonstruujeme libovolný graf velikosti $n+1$ na podgraf velikosti $n$, aplikujeme Indukční předpoklad (IP) a navrátíme prvek.

---

## 🧪 Procvičovací Úlohy pro Bioinformatiky

### Úloha 1.1: Bezchybná Negace Složité Formule
Znegujte následující výrok reprezentující vlastnost biologického enzymu $E$:
$$V = \forall x \in \text{Enzymy} \; \exists y \in \text{Substráty} : (\text{Váže}(x, y) \implies \text{Aktivní}(x))$$

<details>
<summary>🔍 Zobrazit detailní řešení</summary>

### ✍️ Řešení:
1. Zaměníme kvantifikátory: $\forall x$ se změní na $\exists x$, a $\exists y$ se změní na $\forall y$.
2. Znegujeme vnitřní implikaci podle pravidla $\neg (A \implies B) \equiv A \land \neg B$:
   $$\neg (\text{Váže}(x, y) \implies \text{Aktivní}(x)) \quad \equiv \quad \text{Váže}(x, y) \land \neg \text{Aktivní}(x)$$
3. Výsledná znegovaná formule $\neg V$:
   $$\neg V = \exists x \in \text{Enzymy} \; \forall y \in \text{Substráty} : (\text{Váže}(x, y) \land \neg \text{Aktivní}(x))$$
4. **Slovní překlad:** *"Existuje enzym $x$ takový, že pro všechny substráty $y$ platí, že se na ně enzym $x$ váže a zároveň není aktivní."* $\blacksquare$
</details>

---

### Úloha 1.2: Důkaz Kontrapozicí
Dokážeme kontrapozicí tvrzení pro konečný graf $G = (V, E)$:
*"Pokud pro každý vrchol $v \in V$ platí $\deg(v) \ge 2$, pak graf $G$ obsahuje alespoň jeden cyklus."*

<details>
<summary>🔍 Zobrazit vzorový důkaz kontrapozicí</summary>

### ✍️ Řešení Kontrapozicí:
- **Tvrzení $A \implies B$:**
  - $A$: $\forall v \in V: \deg(v) \ge 2$
  - $B$: Graf $G$ obsahuje cyklus.
- **Obměněné tvrzení $\neg B \implies \neg A$:**
  - $\neg B$: Graf $G$ **neobsahuje žádný cyklus** (G je les / soubor stromů).
  - $\neg A$: Existuje vrchol $v \in V$ takový, že $\deg(v) < 2$ (tj. $\deg(v) \le 1$).

#### ✍️ Důkaz obměněného tvrzení $\neg B \implies \neg A$:
1. Předpokládejme, že graf $G$ neobsahuje žádné cykly.
2. Pokud $G$ nemá hrany ($m=0$), pak všechny vrcholy mají $\deg(v) = 0 < 2$, tedy $\neg A$ platí.
3. Pokud $G$ obsahuje alespoň jednu hranu, pak každá komponenta $G$ je strom.
4. Pokud $G$ obsahuje alespoň jednu hranu, zvolme nejdelší jednoduchou cestu $P = (v_1, v_2, \dots, v_k)$ v $G$. Protože $G$ neobsahuje cykly, krajní vrchol $v_1$ nemůže mít souseda mimo cestu $P$ (to by cestu prodloužilo) ani souseda $v_j$ s $j \ge 3$ uvnitř $P$ (to by vytvořilo cyklus). Jediným sousedem $v_1$ proto může být $v_2$, tedy $\deg(v_1) = 1 < 2$.
5. Nalezli jsme vrchol $v_1$ s $\deg(v_1) \le 1$, čímž platí $\neg A$.
6. Kontrapozice je dokázána, a tedy původní tvrzení $A \implies B$ platí. $\blacksquare$
</details>

---

> ➡️ **Pokračujte na stěžejní modul AG1:** [2 · Indukce na Grafech & Redukční Past](./dml-indukce-na-grafech)
