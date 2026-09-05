# Modul 1: Logický & Důkazový Základ pro Grafové Algoritmy

> **[Relevance: 95%]** · **Tags:** `[EPIC]` `[INSIGHT]` `[PAST U ZKOUŠKY]`
> **Cíl modulu:** Ovládnout přesný formální jazyk matematické logiky, získat 100% jistotu v negování složitých kvantifikovaných výroků ($\forall, \exists, \exists!$), bezchybně rozlišovat nutnou a postačující podmínku a osvojit si 4 základní důkazové šablony pro zápočtové testy a zkoušku z AG1 na FIT ČVUT.

---

## 🌱 Než začneme: Proč se biologové učí logiku?

Představ si, že zkoumáš nový protein. Kolega tvrdí: *„Pokud je tento gen aktivní, pak se protein exprimuje."* Jenže v experimentu vidíš buňky, kde gen aktivní **není** — a protein se tam taky neobjevuje. Potvrzuje to kolegovo tvrzení, nebo ho vyvrací?

Odpověď závisí přesně na tom, **jak přečteme implikaci** „pokud A, pak B". A tady spousta biologů (a i počítačových vědců) dělá chyby — protože přirozený jazyk je nejednoznačný. Věta „Pokud prší, vezmu deštník" **nic neříká o tom, co uděláš, když neprší** — třeba deštník vezmeš stejně, protože je hezký.

Matematická logika je nástroj, který tuto nejednoznačnost odstraňuje. Ve zkouškách z AG1 budeš formulovat tvrzení o grafech a dokazovat je — a každá nejednoznačnost v logickém zápisu = ztráta bodů.

> 💡 **Příslib tohoto modulu:** Po přečtení budeš umět přesně přečíst jakékoliv formální tvrzení, bezchybně ho znegovat a zvolit správnou strategii důkazu. Všechny principy stavíme na situacích ze skutečného studentského života, chemické praxe a programování v C — žádná teorie grafů není předem potřeba!

---

## 1. Úvod do Matematické Logiky `[INSIGHT]`

V běžném jazyce bývají biologická a chemická tvrzení často mnohoznačná. V počítačové vědě a teoretické informatice však musíme formulovat myšlenky tak, aby neexistovala žádná pochybnost o jejich pravdivosti.

Matematická logika pracuje s **výroky**:
> **Definice Výroku:** Výrok je oznamovací věta, o níž má smysl prohlásit, zda je **pravdivá (značíme 1, True, T)** nebo **nepravdivá (značíme 0, False, F)**.

### Příklady v Bioinformatice & Matematice:
- *"Molekula vody obsahuje 2 atomy vodíku."* $\implies$ **Výrok (Pravdivý = 1)**.
- *"Kofein má sumární chemický vzorec $C_8H_{10}N_4O_2$."* $\implies$ **Výrok (Pravdivý = 1)**.
- *"Číslo 17 je prvočíslo."* $\implies$ **Výrok (Pravdivý = 1)**.
- *"Tento kód v C++ je pěkný."* $\implies$ **NENÍ výrok** (subjektivní hodnocení, nelze jednoznačně určit 0 nebo 1).
- *"Kolik prvků má množina $V$?"* $\implies$ **NENÍ výrok** (otázka).

---

## 2. Výrokové Spojky a Pravdivostní Tabulky `[Relevance: 95%]` `[EPIC]`

Složitější výroky stavíme z jednoduchých výrokových proměnných ($A, B, C$) pomocí **výrokových spojek**:

| Symbol / Spojka | Název | Zápis | Význam v češtině | Pravdivostní pravidlo / Definice |
| :--- | :--- | :--- | :--- | :--- |
| $\neg$ | **Negace** | $\neg A$ | *"Není pravda, že A"* | Obrátí pravdivostní hodnotu ($1 \to 0, 0 \to 1$). |
| $\land$ | **Konjunkce** | $A \land B$ | *"A a zároveň B"* | Pravda pouze v případě, že **oba** výroky A i B platí. |
| $\lor$ | **Disjunkce** | $A \lor B$ | *"A nebo B"* | Pravda, pokud platí **alespoň jeden** z výroků A, B. |
| $\Rightarrow$ | **Implikace** | $A \Rightarrow B$ | *"Jestliže A, pak B"* | Nepravda pouze v případě, že **A platí a B neplatí** ($1 \Rightarrow 0$). |
| $\Leftrightarrow$ | **Ekvivalence** | $A \Leftrightarrow B$ | *"A právě tehdy, když B"* | Pravda, pokud mají A i B **stejnou** pravdivostní hodnotu. |
| $\forall$ | **Všeobecný kvantifikátor** | $\forall x \in M : P(x)$ | *"Pro každý prvek x..."* | Pravda, pokud vlastnost $P(x)$ platí pro **všechny** prvky množiny $M$. |
| $\exists$ | **Existenční kvantifikátor** | $\exists x \in M : P(x)$ | *"Existuje alespoň jedno x..."* | Pravda, pokud vlastnost $P(x)$ platí pro **alespoň jeden** prvek z $M$. |
| $\exists!$ | **Kvantifikátor jednoznačné existence** | $\exists! x \in M : P(x)$ | *"Existuje právě jedno x..."* | Pravda, pokud v $M$ existuje **přesně jeden (jediný)** prvek splňující $P(x)$. |

<div class="my-6 border border-slate-300 rounded-xl overflow-x-auto shadow-xs bg-white">
<div class="py-2.5 px-4 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
<span class="text-xs text-slate-800 font-bold uppercase tracking-wide">📐 Doplňkové symboly (Množiny & Formální logika v BI-DML)</span>
<span class="text-[11px] text-slate-600 font-medium">BI-DML Reference</span>
</div>
<table class="w-full text-left text-xs sm:text-sm border-collapse">
<thead>
<tr class="bg-slate-50 border-b border-slate-300 text-slate-800">
<th class="py-2.5 px-3.5 font-bold">Symbol</th>
<th class="py-2.5 px-3.5 font-bold">Význam symbolu</th>
<th class="py-2.5 px-3.5 font-bold">Formální popis & Definice</th>
</tr>
</thead>
<tbody class="divide-y divide-slate-200 text-slate-800">
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$\top$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>tautologie</strong></td>
<td class="py-2 px-3.5 text-slate-800">Výroková formule, která je vždy pravdivá (hodnota 1) při libovolném ohodnocení (např. $A \lor \neg A$)</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$\bot$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>kontradikce</strong></td>
<td class="py-2 px-3.5 text-slate-800">Výroková formule, která je vždy nepravdivá (hodnota 0) při libovolném ohodnocení (např. $A \land \neg A$)</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$E \models F$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>logický důsledek</strong> mezi formulemi $E$ a $F$</td>
<td class="py-2 px-3.5 text-slate-800">Formule $F$ je sémantickým důsledkem $E$ (v BI-DML též $E \mathrel{\vert{=}} F$); každý model formule $E$ je i modelem $F$</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$E \equiv F$ (nebo $E \mathrel{\vert{=}\vert} F$)</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>logická ekvivalence</strong> formulí $E$ a $F$</td>
<td class="py-2 px-3.5 text-slate-800">Formule $E$ a $F$ jsou sémanticky ekvivalentní; mají shodné pravdivostní ohodnocení ve všech modelech</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$x \in M$, $x \notin M$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>náležení / nenáležení prvku</strong> do množiny</td>
<td class="py-2 px-3.5 text-slate-800">$x \in M$ znamená, že prvek $x$ je prvkem množiny $M$; $x \notin M \iff \neg(x \in M)$</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$A \subseteq B$, $A \subsetneq B$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>podmnožina a vlastní podmnožina</strong></td>
<td class="py-2 px-3.5 text-slate-800">$A \subseteq B \iff (\forall x: x \in A \implies x \in B)$; vlastní podmnožina navíc vyžaduje $A \neq B$</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$A \cup B$, $A \cap B$, $A \setminus B$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>sjednocení, průnik a rozdíl množin</strong></td>
<td class="py-2 px-3.5 text-slate-800">$A \cup B = \{x \mid x \in A \lor x \in B\}$, $A \cap B = \{x \mid x \in A \land x \in B\}$, $A \setminus B = \{x \mid x \in A \land x \notin B\}$</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$A \times B$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>kartézský součin množin</strong></td>
<td class="py-2 px-3.5 text-slate-800">Množina všech uspořádaných dvojic $\{(a, b) \mid a \in A \land b \in B\}$; mohutnost je $|A \times B| = |A| \cdot |B|$</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$\emptyset$ (nebo $\{\}$)</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>prázdná množina</strong></td>
<td class="py-2 px-3.5 text-slate-800">Množina neobsahující žádný prvek; $|\emptyset| = 0$, je podmnožinou každé množiny ($\emptyset \subseteq A$)</td>
</tr>
<tr class="hover:bg-slate-50/70 transition-colors">
<td class="py-2 px-3.5 font-mono font-bold text-slate-900">$\binom{n}{k}$</td>
<td class="py-2 px-3.5 font-medium text-slate-900"><strong>kombinační číslo</strong> („$n$ nad $k$“)</td>
<td class="py-2 px-3.5 text-slate-800">Počet všech $k$-prvkových podmnožin $n$-prvkové množiny: $\binom{n}{k} = \frac{n!}{k!(n-k)!}$</td>
</tr>
</tbody>
</table>
</div>

---

### 2.1 Mnemotechnika Implikace ($A \Rightarrow B$): Student vs. Učitel `[PAST U ZKOUŠKY]`

Studenti VŠCHT nejčastěji chybují v pravdivosti **implikace**, pokud je předpoklad nepravdivý. Jak si to okamžitě a bezpečně zapamatovat do konce života?

#### Zkoušková mnemotechnika: Kdo z koho (1. Student vs. 2. Učitel)
Představte si ústní zkoušku, kde se střetnou znalosti studenta a zkoušejícího profesora:
- **1. Student** ($S$): $1 = \text{umí}$, $0 = \text{neumí}$
- **2. Učitel** ($U$): $1 = \text{umí}$ (zkouší, vyžaduje, ví všechno), $0 = \text{neumí}$ (nevyzná se / neví, na co se zeptat)

Kdy student zkouškou projde (**GOOD / 1**) a kdy dostane **0**?
- **Jestli umí student a neumí učitel $\implies$ GOOD (1)**: Student látku ovládá, zkoušející ho nedokáže zaskočit. Student s přehledem projde!
- **Jestli neumí student a umí učitel $\implies$ 0 (0)**: Student tápe a zkoušející je kapacita, co ví každý detail. Student okamžitě letí s nulou!

<div class="overflow-x-auto my-6 border border-slate-300 rounded-xl shadow-xs bg-white">
<table class="w-full text-left text-xs sm:text-sm border-collapse">
<thead>
<tr class="bg-slate-100 border-b border-slate-300">
<th class="px-4 py-3 text-slate-800 font-bold">1. Student ($S$)</th>
<th class="px-4 py-3 text-slate-800 font-bold">2. Učitel ($U$)</th>
<th class="px-4 py-3 text-slate-800 font-bold">Výsledek pro studenta</th>
<th class="px-4 py-3 text-slate-800 font-bold">Logická vazba ($U \Rightarrow S$)</th>
<th class="px-4 py-3 text-slate-800 font-bold">Didaktické zhodnocení situace</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
<td class="px-4 py-3 font-mono font-bold text-emerald-700">1 (Umí)</td>
<td class="px-4 py-3 font-mono font-bold text-emerald-700">1 (Umí)</td>
<td class="px-4 py-3 font-bold text-emerald-700">1 (GOOD)</td>
<td class="px-4 py-3 font-mono text-slate-700 font-medium">1 ⇒ 1 = 1</td>
<td class="px-4 py-3 text-slate-800">Student umí, učitel umí. Proběhne férová debata, student látku obhájí a má zkoušku v kapse (OK).</td>
</tr>
<tr class="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
<td class="px-4 py-3 font-mono font-bold text-emerald-700">1 (Umí)</td>
<td class="px-4 py-3 font-mono font-semibold text-slate-500">0 (Neumí)</td>
<td class="px-4 py-3 font-bold text-emerald-700">1 (GOOD)</td>
<td class="px-4 py-3 font-mono text-slate-700 font-medium">0 ⇒ 1 = 1</td>
<td class="px-4 py-3 text-slate-800"><strong>Student umí a učitel neumí</strong> (neví, na co se zeptat). Student situaci s přehledem ovládne a exceluje (GOOD / Prošel).</td>
</tr>
<tr class="border-b border-slate-200 hover:bg-slate-50/70 transition-colors">
<td class="px-4 py-3 font-mono font-semibold text-slate-500">0 (Neumí)</td>
<td class="px-4 py-3 font-mono font-semibold text-slate-500">0 (Neumí)</td>
<td class="px-4 py-3 font-bold text-emerald-700">1 (GOOD)</td>
<td class="px-4 py-3 font-mono text-slate-700 font-medium">0 ⇒ 0 = 1</td>
<td class="px-4 py-3 text-slate-800">Student neumí a učitel látku taky neumí (nebo na to kašle a dá to všem). Nikdo nic neodhalil $\to$ student bez problému projde (GOOD). Triviální pravdivost.</td>
</tr>
<tr class="border-b border-slate-200 hover:bg-rose-100/50 transition-colors bg-rose-50/70">
<td class="px-4 py-3 font-mono font-bold text-rose-700">0 (Neumí)</td>
<td class="px-4 py-3 font-mono font-bold text-emerald-700">1 (Umí)</td>
<td class="px-4 py-3 font-bold text-rose-700">0 (KATASTROFA)</td>
<td class="px-4 py-3 font-mono font-bold text-rose-700">1 ⇒ 0 = 0</td>
<td class="px-4 py-3 text-rose-800 font-medium"><strong>Student neumí a učitel umí.</strong> Zkoušející studenta okamžitě nachytá a vyrazí ho s nulou! <strong>JEDINÝ PŘÍPAD NULY (NEPRAVDY)!</strong></td>
</tr>
</tbody>
</table>
</div>

> ⚠️ **Past u zkoušky z DML: Pozor na směr implikace ($A \Rightarrow B$ vs. $B \Rightarrow A$)!**  
> Implikace **NENÍ komutativní**:
> $$A \Rightarrow B \quad \not\equiv \quad B \Rightarrow A$$
> Ve formální logice je implikace $A \Rightarrow B$ **nepravdivá (0) POUZE v případě $1 \Rightarrow 0$** (předpoklad platí, ale závěr nenastal).
> - Pokud je předpoklad $A = 0$ (nepravdivý), je celá implikace **VŽDY PRAVDIVÁ (1)**, bez ohledu na to, zda závěr $B$ platí či ne (**triviální pravdivost / vacuous truth**).
> - V naší zkouškové mnemotechnice klade požadavky zkoušející učitel ($U \Rightarrow S$): jediná nula nastane, když učitel látku vyžaduje ($U=1$), ale student ji neumí ($S=0$).

> 💡 **Triviální Pravdivost (Vacuous Truth):**  
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

#### 💻 De Morganovy Zákony v Jazyce C (Podmínky `if`)

V programování (BI-PA1) v různých situacích dává smysl použít obě formy zápisu:

```c
// 1. Negace konjunkce: !(A && B)  ===>  (!A || !B)
// Kontrola rozsahu: hodnota nesmí být mimo povolený interval 0 až 100
if (!(score >= 0 && score <= 100))     // Intuitivní: „když NENÍ uvnitř platného intervalu"
if (score < 0 || score > 100)          // De Morgan: „když je menší než min NEBO větší než max"

// 2. Negace disjunkce: !(A || B)  ===>  (!A && !B)
// Kontrola volby: uživatel nepotvrdil pokračování volbou 'a' ani 'y'
if (!(ans == 'a' || ans == 'y'))       // Intuitivní: „když nezvolil ani jednu z povolených možností"
if (ans != 'a' && ans != 'y')          // De Morgan: „když nezadal 'a' A ZÁROVEŇ nezadal 'y'"

// 3. Kontrola rozměrů: obrazec musí mít kladnou šířku i výšku
if (!(width > 0 && height > 0))        // Intuitivní: „když neplatí, že jsou oba rozměry kladné"
if (width <= 0 || height <= 0)         // De Morgan: „když je neplatná šířka NEBO neplatná výška"
```

---

<details class="wiki-spoiler-box">
<summary class="wiki-spoiler-summary">
  <span>💡 Příklady z Reálného Života: Vstup do Laborky na VŠCHT & Studentská Sleva (Rozbalit)</span>
</summary>

#### 🧪 Příklad z Reálného Života: Vstup do Laboratoře na VŠCHT (1. Zákon: Negace Konjunkce)

Představte si pravidla pro práci v biochemické laboratoři na VŠCHT. Student smí vstoupit do laboratoře a pracovat pouze tehdy, když splňuje dvě podmínky současně:
1. **Má ochranné pomůcky ($A$):** Má oblečený laboratorní plášť a nasazené ochranné brýle.
2. **Má bezpečnostní test ($B$):** Má podepsané školení a úspěšně splněný vstupní test bezpečnosti.

Vstup do laboratoře je povolen právě tehdy, když platí obě podmínky:
$$A \land B$$

Co to znamená podle 1. De Morganova zákona, když vás cvičící **do laboratoře NEPUSTÍ** ($\neg(A \land B)$)?
$$\neg (A \land B) \quad \equiv \quad \neg A \lor \neg B$$

> 💡 **Didaktický aha-moment z reálného života:**  
> K tomu, aby vás vyučující poslal pryč ode dveří, **nemusíte porušit obě podmínky najednou**!  
> Podle De Morgana vám **stačí udělat jedinou chybu**:
> - Buď jste si doma zapomněli plášť či brýle ($\neg A$),
> - **NEBO** jste nenapsali test bezpečnosti ($\neg B$).  
> Jakmile nastane alespoň jedno z toho (stačí zapomenout brýle, i když test máte na 100 bodů), do laborky nesmíte!

#### 🚆 Příklad z Běžného Života: Studentská Sleva na Jízdenku (2. Zákon: Negace Disjunkce)

Druhý De Morganův zákon ($\neg(A \lor B) \equiv \neg A \land \neg B$) si představte na studentské slevě na vlak či autobus. Nárok na slevu máte, pokud:
- Je vám méně než 18 let ($A$), **NEBO** předložíte platný průkaz ISIC ($B$).

Nárok na slevu platí právě tehdy, když:
$$A \lor B$$

Kdy na slevu **NEMÁTE nárok** a musíte zaplatit plné jízdné ($\neg(A \lor B)$)?
$$\neg (A \lor B) \quad \equiv \quad \neg A \land \neg B$$
- Plnou cenu platíte právě tehdy, když **je vám 18 a více ($\neg A$) A ZÁROVEŇ u sebe nemáte platný ISIC ($\neg B$)**.  
  Pokud by platila alespoň jedna z výhod (např. je vám 21 let, ale máte ISIC), slevu bez potíží dostanete. O slevu přijdete pouze při selhání obou podmínek naráz!

</details>

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

### 🧬 Příklady ze Života, Chemie a Univerzity:

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────┬──────────────────────────────────────────┐
│ Vztah A ⇒ B                                  │ Postačující podmínka (A)                 │ Nutná podmínka (B)                       │
├──────────────────────────────────────────────┼──────────────────────────────────────────┼──────────────────────────────────────────┤
│ Glukóza ⇒ Obsahuje Uhlík                     │ Být glukózou STAČÍ k obsahu uhlíku.      │ Obsahovat uhlík je NUTNÉ pro glukózu.    │
│ Student VŠCHT ⇒ Vysokoškolák                 │ Studovat na VŠCHT STAČÍ být vysokoškolák.│ Být vysokoškolákem je NUTNÉ pro VŠCHT.   │
│ Řízení auta na silnici ⇒ Věk alespoň 18 let  │ Být legálním řidičem STAČÍ k věku ≥ 18.  │ Věk ≥ 18 je NUTNÝ pro řízení auta.       │
│ Získat červený diplom ⇒ Složit státnice      │ Červený diplom STAČÍ k úspěšným státnicím│ Složit státnice je NUTNÉ pro diplom.     │
└──────────────────────────────────────────────┴──────────────────────────────────────────┴──────────────────────────────────────────┘
```

> 💡 **Ekvivalence ($A \Leftrightarrow B$):**  
> Pokud platí **ekvivalence $A \Leftrightarrow B$**, říkáme, že $A$ je **nutnou A ZÁROVEŇ postačující podmínkou** pro $B$ (a naopak).  
> *Příklad z chemie:* Voda v otevřené kádince za normálního atmosférického tlaku vře ($A$) **právě tehdy, když** její teplota dosáhla 100 °C ($B$).  
> *Příklad z univerzity:* Student získá zápočet z tělocviku ($A$) **právě tehdy, když** má splněno alespoň 10 docházek ($B$).

---

## 4. Kvantifikátory ($\forall, \exists, \exists!$) a Jejich Negace `[Relevance: 95%]` `[MEGA EPIC]`

V matematice, bioinformatice i algoritmických sítích popisujeme vlastnosti celých množin prvků pomocí kvantifikátorů:

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

#### 🧠 Mnemotechnika z univerzitního života (Studenti & Chytrost):

1. **Negace obecného kvantifikátoru ($\forall \longrightarrow \exists$):**
   - **Původní tvrzení:** *„Každý student je chytrý."* ($\forall x \in \text{Studenti} : P(x)$)
   - **Negace tvrzení:** *„Není pravda, že (každý student je chytrý)."*
   - **Logicky ekvivalentní tvar:** $\iff$ *„Existuje alespoň 1 student, který **není chytrý**."* ($\exists x \in \text{Studenti} : \neg P(x)$)
   - 💡 *K vyvrácení tvrzení, že jsou všichni chytří, nepotřebujete, aby byli všichni hloupí — stačí vám najít jediného studenta, který chytrý není!*

2. **Negace existenčního kvantifikátoru ($\exists \longrightarrow \forall$):**
   - **Původní tvrzení:** *„Existuje chytrý student."* ($\exists x \in \text{Studenti} : P(x)$)
   - **Negace tvrzení:** *„Není pravda, že (existuje chytrý student)."*
   - **Logicky ekvivalentní tvar:** $\iff$ *„Každý student je ne-chytrý (všichni jsou blbí)."* ($\forall x \in \text{Studenti} : \neg P(x)$)
   - 💡 *Pokud není pravda, že by existoval byť jediný chytrý student, pak nutně všichni do jednoho chytří nejsou.*

---

### 4.2 Složité Řetězené Negace v Bioinformatice

V reálných testech z AG1 potkáte výroky s více vrstvami kvantifikátorů. Pojďme si je nacvičit:

#### Případ 1: Souvislost Sítě (Grafu)
Představme si síť uzlů $V$ (např. biochemické metabolity propojené enzymovými reakcemi nebo servery na internetu):
- **Původní tvrzení $S$ (Síť je souvislá — ze všeho se lze dostat všude):**
  $$\forall u, v \in V : (u \neq v \implies \exists \text{ cesta } P \text{ z } u \text{ do } v)$$
- **Formální Negace $\neg S$ (Síť je nesouvislá — rozpadlá na oddělené části):**
  Aplikujeme pravidlo negace zvenčí dovnitř:
  1. Zaměníme $\forall u, v$ za $\exists u, v$.
  2. Znegujeme implikaci $\neg (A \implies B) \equiv A \land \neg B$.
  3. Zaměníme $\exists P$ za $\forall P$ a znegujeme existenci cesty.
  $$\exists u, v \in V : (u \neq v \land \forall \text{ cestu } P : P \text{ NESPOJUJE } u \text{ a } v)$$
- **Slovní překlad:** *"Existuje dvojice různých uzlů $u, v$ v síti taková, že mezi nimi neexistuje žádná spojující cesta (síť je rozpojená)."*

#### Případ 2: Slepá Ulička v Reakční Síti (Terminal Metabolite)
Nechť $V$ je množina molekul a $(v, w) \in E$ značí existenci chemické reakce přeměňující molekulu $v$ na molekulu $w$:
- **Původní tvrzení $R$ (Z každého metabolitu vedou reakce dál):**
  $$\forall v \in V \; \exists w \in V : (v, w) \in E$$
- **Formální Negace $\neg R$ (Existuje slepá ulička syntézy):**
  $$\exists v \in V \; \forall w \in V : (v, w) \notin E$$
- **Slovní překlad:** *"Existuje metabolit $v$ takový, že z něj nevede biochemická reakce do žádné jiné molekuly $w$."*

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

### Úloha 1.2: Důkaz Kontrapozicí v Sítích
Dokážeme kontrapozicí tvrzení pro libovolnou konečnou síť (graf) $G = (V, E)$, kde $V$ jsou uzly a $E$ jsou spojnice mezi nimi (přičemž $\deg(v)$ značí stupeň uzlu = počet spojnic vycházejících z uzlu $v$):  
*"Pokud z každého uzlu $v \in V$ vycházejí alespoň 2 spojnice ($\deg(v) \ge 2$), pak síť $G$ nutně obsahuje alespoň jednu uzavřenou smyčku (cyklus)."*

> 💡 **Intuitivní představa před formálním důkazem:**  
> Představte si chodby v bludišti. Pokud z každé místnosti vedou alespoň 2 dveře ($\deg(v) \ge 2$), nikdy nemůžete uvíznout ve slepé uličce. Když budete bludištěm procházet stále kupředu a nikdy se nevrátíte stejnými dveřmi zpět, v konečném počtu místností musíte dříve či později narazit do místnosti, kde už jste jednou byli — a tím jste uzavřeli kruh (cyklus)!

<details>
<summary>🔍 Zobrazit vzorový důkaz kontrapozicí</summary>

### ✍️ Řešení Kontrapozicí:
- **Původní tvrzení $A \implies B$:**
  - $A$: Každý uzel má alespoň 2 sousedy ($\forall v \in V: \deg(v) \ge 2$).
  - $B$: Síť obsahuje uzavřenou smyčku (cyklus).
- **Obměněné tvrzení $\neg B \implies \neg A$:**
  - $\neg B$: Síť **neobsahuje žádnou uzavřenou smyčku** (je to strom nebo soubor stromů).
  - $\neg A$: Existuje uzel $v \in V$, ze kterého vychází méně než 2 spojnice ($\deg(v) < 2$, tj. $\deg(v) \le 1$).

#### ✍️ Důkaz obměněného tvrzení $\neg B \implies \neg A$:
1. Předpokládejme, že síť neobsahuje žádné uzavřené smyčky ($\neg B$).
2. Pokud síť nemá vůbec žádné spojnice ($m=0$), pak všechny uzly mají $\deg(v) = 0 < 2$, tedy $\neg A$ triviálně platí.
3. Pokud síť obsahuje alespoň jednu spojnici, zvolme v ní nejdelší možnou trasu bez opakování $P = (v_1, v_2, \dots, v_k)$.
4. Protože v síti nejsou žádné smyčky, krajní uzel trasy $v_1$ nemůže mít žádného souseda mimo trasu $P$ (to by se trasa dala ještě prodloužit a $P$ by nebyla nejdelší), ani žádného souseda $v_j$ (pro $j \ge 3$) uvnitř trasy (to by vytvořilo uzavřenou smyčku).
5. Jediným sousedem koncového uzlu $v_1$ proto může být pouze sousední uzel $v_2$ na trase. Z uzlu $v_1$ tedy vychází přesně 1 spojnice ($\deg(v_1) = 1 < 2$).
6. Nalezli jsme uzel s $\deg(v) \le 1$, čímž jsme dokázali $\neg A$.
7. Podle principu kontrapozice ($\neg B \implies \neg A$) tím bezpečně platí i původní tvrzení $A \implies B$. $\blacksquare$
</details>

---

> ➡️ **Pokračujte na stěžejní modul AG1:** [2 · Indukce na Grafech & Redukční Past](./dml-indukce-na-grafech)
