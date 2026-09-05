# Modul 2: Indukce na Grafech & Redukční Past

> **[Relevance: 100%]** · **Tags:** `[MEGA EPIC]` `[PAST U ZKOUŠKY]` `[INSIGHT]`
> **Cíl modulu:** Pochopit, jak se v matematice dokazuje tvrzení pro všechny grafy najednou — a vyhnout se pasti, do které padne polovina studentů u zkoušky.

---

## 🎯 Dominová analogie (vážně, takhle to funguje)

Znáš dominový efekt? Postavíš řadu kostek a první padne na druhou, druhá na třetí... Matematická indukce je přesně tohle:

1. **Báze:** Ukážeš, že první kostka padne. *(Tvrzení platí pro nejmenší případ.)*
2. **Krok:** Ukážeš, že POKUD kostka č. $k$ padne, NUTNĚ padne i kostka č. $k+1$. *(Z pravdivosti pro $k$ plyne pravdivost pro $k+1$.)*
3. **Závěr:** Všechny kostky padnou. *(Tvrzení platí pro všechna $n$.)*

Na grafech to funguje stejně — jen místo „kostky č. $k$" říkáme „graf s $k$ vrcholy". A klíčový trik (viz níže) je, že nestavíme grafy od nuly nahoru, ale **rozebíráme je od větších k menším**.

> **Intuice bez vzorce:** Indukce = nejprve dokážeš malý případ, pak ukážeš, že každý větší případ se dá rozebrat na menší. A to stačí pro důkaz pro všechna $n$ najednou.

---

<div class="my-6 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-500/10 dark:bg-amber-950/20 overflow-hidden shadow-xs">
<div class="px-5 py-3.5 bg-amber-500/15 dark:bg-amber-900/40 border-b border-amber-300/80 dark:border-amber-800/80 flex items-center justify-between">
<div class="flex items-center gap-2.5 font-bold text-amber-950 dark:text-amber-200 text-sm sm:text-base">
<span>☕</span>
<span>Příklad: Platba mincemi (3 Kč a 5 Kč) — Slabá vs. Silná Indukce</span>
</div>
<span class="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">Klasika ze zkoušek</span>
</div>
<div class="p-5 text-sm leading-relaxed text-stone-800 dark:text-stone-200">
<p class="m-0 font-medium text-stone-900 dark:text-stone-100">
Dokážeme, že pomocí mincí s hodnotami <strong>3 Kč</strong> a <strong>5 Kč</strong> lze přesně vyplatit libovolnou celočíselnou částku ve výši <strong>alespoň 8 Kč</strong> (aniž by nám muselo být vraceno).
</p>
<div class="my-3 p-3 rounded-xl bg-white/80 dark:bg-[#0f0906]/80 border border-amber-200 dark:border-amber-900/60 font-mono text-xs sm:text-sm text-center">
Pro všechna n ≥ 8 dokazujeme tvrzení V(n):<br>
<strong>„Částku n Kč lze přesně vyplatit pouze s použitím tříkorun a pětikorun.“</strong>
</div>
<details class="mt-4" open>
<summary class="cursor-pointer font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 select-none py-1">
🔍 Zobrazit 2 způsoby důkazu: Slabá indukce vs. Silná indukce
</summary>
<div class="mt-4 space-y-6 pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
<div>
<h4 class="text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
Metoda 1: Důkaz Slabou Indukcí (Pravidlo výměny mincí: 5 ➔ 3+3 nebo 3+3+3 ➔ 5+5)
</h4>
<p class="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mb-2">
Zde nám stačí <strong>jediný bázový případ</strong> a krok $n \implies n + 1$ provedeme chytrou výměnou mincí v peněžence:
</p>
<ol class="text-xs sm:text-sm space-y-2 pl-5 list-decimal text-stone-800 dark:text-stone-200">
<li><strong>Báze indukce:</strong> Pro $n = 8$ máme $8 = 3 + 5$ Kč. Platí $V(8)$ ✅.</li>
<li><strong>Indukční krok ($n \implies n + 1$):</strong>
Předpokládejme, že částku $n$ Kč (kde $n \ge 8$) máme vyplacenu v mincích 3 Kč a 5 Kč (IP). Chceme z ní vytvořit částku $n + 1$ Kč.
Nahlédneme do peněženky a rozlišíme 3 situace podle toho, jaké mince máme k dispozici:
<div class="mt-2 space-y-2">
<div class="p-2.5 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">Případ A (V peněžence máme jen 5 Kč mince — žádnou 3 Kč):</strong><br>
Jednu 5 Kč minci odebereme a nahradíme ji <strong>dvěma 3 Kč mincemi</strong> ($5 \to 3 + 3$).<br>
<div class="my-1 font-mono text-xs text-amber-700 dark:text-amber-400 font-bold">
5 Kč ➔ 3 Kč + 3 Kč &nbsp; (např. 10 Kč = 5+5 ➔ 5+3+3 = 11 Kč, čistá změna: -5 + 6 = +1 Kč)
</div>
</div>
<div class="p-2.5 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">Případ B (V peněžence je 5 Kč i 3 Kč — máme obě mince):</strong><br>
Pětikorunu vyměníme za dvě tříkoruny ($5 \to 3 + 3$). Spolu s existující původní 3 Kč mincí tak vznikne <strong>trojice tříkorun 3 + 3 + 3</strong>:<br>
<div class="my-1 font-mono text-xs text-blue-700 dark:text-blue-400 font-bold">
(5 Kč) + 3 Kč ➔ (3 Kč + 3 Kč) + 3 Kč = 3 + 3 + 3 &nbsp; (např. 8 Kč = 5+3 ➔ 3+3+3 = 9 Kč, čistá změna: +1 Kč)
</div>
</div>
<div class="p-2.5 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">Případ C (V peněžence není žádná 5 Kč mince — máme jen 3 Kč mince):</strong><br>
Protože celková částka je $n \ge 8$ a skládá se výhradně z tříkorun, musíme mít <strong>alespoň tři tříkoruny</strong> ($3 \times 3 = 9$ Kč; dvě dávají jen 6 Kč &lt; 8).
Vezmeme tyto tři tříkoruny a nahradíme je <strong>dvěma pětikorunami</strong>:
<div class="my-1 font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold">
3 Kč + 3 Kč + 3 Kč ➔ 5 Kč + 5 Kč &nbsp; (např. 9 Kč = 3+3+3 ➔ 5+5 = 10 Kč, čistá změna: -9 + 10 = +1 Kč)
</div>
Částka vzrostla přesně na $n + 1$ Kč!
</div>
</div>
</li>
<li><strong>Závěr:</strong> Ve všech případech jsme z libovolné platné výplaty $n$ Kč sestrojili výplatu $n + 1$ Kč. Podle principu slabé indukce tvrzení platí pro všechna celá čísla $n \ge 8$.</li>
</ol>
</div>
<div>
<h4 class="text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
Metoda 2: Důkaz Silnou Indukcí (Pravidlo kroku o 3 Kč zpět: n+1 z n-2)
</h4>
<p class="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mb-2">
Zde si vystačíme bez jakékoliv výměny mincí v peněžence — stačí nám <strong>3 základní bázové případy</strong> a v indukčním kroku se vždy odvoláme na stav o <strong>3 Kč menší</strong>:
</p>
<ol class="text-xs sm:text-sm space-y-2 pl-5 list-decimal text-stone-800 dark:text-stone-200">
<li><strong>Báze indukce (3 po sobě jdoucí částky):</strong>
<ul class="list-disc pl-5 mt-1 space-y-1">
<li>Pro $n = 8$: $8 = 3 + 5$ Kč. Platí $V(8)$ ✅.</li>
<li>Pro $n = 9$: $9 = 3 + 3 + 3$ Kč. Platí $V(9)$ ✅.</li>
<li>Pro $n = 10$: $10 = 5 + 5$ Kč. Platí $V(10)$ ✅.</li>
</ul>
</li>
<li><strong>Indukční krok (od $n + 1 \ge 11$):</strong>
Předpokládejme, že <strong>všechny částky</strong> od $8$ do $n$ Kč již umíme vyplatit (Silný IP).<br>
Chceme vyplatit částku $n + 1$ Kč (kde $n + 1 \ge 11$).<br>
Vezmeme částku o 3 Kč menší, tedy $(n + 1) - 3 = n - 2$ Kč.<br>
Protože $n + 1 \ge 11$, platí $n - 2 \ge 8$. Dle silného indukčního předpokladu tedy částku $n - 2$ Kč už umíme vyplatit.<br>
K této sestavě mincí nyní stačí <strong>přidat jednu tříkorunu (+3 Kč)</strong>:
$$(n - 2) + 3 = n + 1 \text{ Kč}$$
Tím jsme přesně vyplatili $n + 1$ Kč, což jsme potřebovali dokázat!
</li>
</ol>
</div>
</div>
</details>
</div>
</div>

---

## 1. Peano Axiomy a Princip Matematické Indukce `[INSIGHT]`

V klasické algebře dokazujeme tvrzení $P(n)$ závislá na přirozeném čísle $n \in \mathbb{N}$ (např. součty řad) pomocí **Slabé Matematické Indukce**:
1. **Báze indukce:** Dokážeme, že $P(n_0)$ platí pro nejmenší případ (např. $n_0 = 1$).
2. **Indukční krok:** Pro libovolné $k \ge n_0$ dokážeme implikaci: $P(k) \implies P(k+1)$.
   - Předpoklad $P(k)$ nazýváme **Indukční předpoklad (IP)**.

V teoretické informatice a teorii grafů častěji využíváme **Silnou Matematickou Indukci**:

> 💡 **Poznámka k zápisu (neučte se nazpaměť!):**  
> Tuto formuli se v žádném případě **neučte zpaměti** — u zkoušky ji po vás nikdo nebude chtít odříkat. Je to jen test, jestli dokážete číst formální matematické symboly, co jste dříve znali jen napůl (např. $\bigwedge_{i=n_0}^k$ je jen velká konjunkce AND pro všechny mezistavy od $n_0$ do $k$, stejně jako $\sum$ je velký součet):
>
> $$\left( P(n_0) \land \forall k \ge n_0 : \left( \bigwedge_{i=n_0}^k P(i) \implies P(k+1) \right) \right) \implies \forall n \ge n_0 : P(n)$$

Při aplikaci na grafy nepředstavuje induktivní proměnná $n$ pouhé číslo, ale **velikost grafové struktury**:
- **Počet vrcholů** $n = |V|$ (počet atomů v molekule, proteinů v síti), nebo
- **Počet hran** $m = |E|$ (počet vazeb, enzymatických reakcí).

---

## 2. 🚨 CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční Indukce `[MEGA EPIC]` `[PAST U ZKOUŠKY]`

Toto je vůbec **nejčastější důvod pro udělení 0 bodů** u zkouškových důkazů z AG1 na FIT ČVUT!

---

### ❌ Špatný postup (Tzv. Redukční / Konstrukční past):

> *"Předpokládejme, že tvrzení platí pro graf $G_n$ s $n$ vrcholy. Nyní sestrojíme nový graf $G_{n+1}$ tak, že k $G_n$ přidáme jeden nový vrchol $v$ a připojíme ho hranami k nějakým vrcholům..."*

#### 💥 Proč vyučující udělují 0 bodů?
Pokud začnete od grafu $G_n$ a **přidáte** nový prvek, dokázali jste tvrzení **POUZE pro ty grafy o $n+1$ vrcholech, které lze vytvořit tímto konkrétním přidáním**!
Neověřili jste, zda každý obecný graf s $n+1$ vrcholy lze z nějakého menšího grafu takto vybudovat. Opomněli jste celou třídu grafů! Váš důkaz platí pro speciálně vytvořené grafy, ne pro **všechny platné grafy**.

---

### ✅ Správný postup (Dekonstrukční Indukce / Indukce z Podgrafů):

> *"Vezměme **LIBOVOLNÝ ZADANÝ** graf $G = (V, E)$ o $n+1$ vrcholech (který splňuje předpoklady věty). Najdeme v něm vhodný prvek (např. list nebo vrchol minimálního stupně), odebereme ho a získáme podgraf $G'$. Podgraf $G'$ má $n$ vrcholů. Ověříme, že $G'$ stále splňuje předpoklady věty. Použijeme **Indukční předpoklad (IP)** na podgraf $G'$. Nakonec prvek vrátíme a dokážeme, že platnost tvrzení se přenese i na původní celkový $G$."*

```
Správný myšlenkový tok (Dekonstrukční Indukce na grafech):

┌──────────────────────────────────────────────────────────┐
│ LIBOVOLNÝ Graf G o velikosti (n+1)                       │ ◄─── ZAČÍNÁME ZDE!
└────────────────────────────┬─────────────────────────────┘     (Libovolný zadaný objekt)
                             │
                             │ 1. Odebereme prvek / list / hranu
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Podgraf G' o velikosti (n)                               │ ◄─── APLIKUJEME INDUKČNÍ
└────────────────────────────┬─────────────────────────────┘     PŘEDPOKLAD (IP)!
                             │
                             │ 2. Dle IP tvrzení na G' platí
                             ▼
┌──────────────────────────────────────────────────────────┐
│ Vrátíme odebraný prvek a dokážeme platnost pro původní G │ ◄─── ZÁVĚR pro G(n+1)
└──────────────────────────────────────────────────────────┘
```

### 💡 Hlubší vhled: Dekonstrukční přístup u slabé i silné indukce

Podívejme se, jak princip dekonstrukce funguje v klasické indukci na grafech i číslech:

#### ❌ Konstrukční past u indukce (zdola nahoru):
Student řekne: *„Předpokládejme, že tvrzení platí pro $n$. Nyní z něj postavíme $n+1$ tím, že něco přidáme...“*  
- **V grafech:** Přidá vrchol k $G_n$ a doufá, že tak získá všechny grafy $G_{n+1}$ (obrovská zkoušková chyba, pomine celou řadu struktur!).
- **V mincích:** Zkouší přidat 1 Kč k částce $n$, ale 1 Kč minci nemá, takže musí vymýšlet konstrukční triky s výměnami mincí.

#### ✅ Dekonstrukční přístup (slabá indukce shora: $n+1 \to n$):
U dekonstrukce začínáme **vždy od zadaného cílového objektu velikosti $n+1$ shora** a zmenšujeme ho na velikost $n$:
1. **V grafech (krystalicky čistá slabá indukce):**
   - Vezmeme libovolný graf $G$ o $n+1$ vrcholech.
   - Odebereme 1 prvek (např. list $\deg(v) = 1$ u stromu).
   - Získáme podgraf $G'$ o přesně **$n$ vrcholech**.
   - Na podgraf $G'$ aplikujeme **slabý indukční předpoklad $P(n)$**.
   - Prvek vrátíme a dokážeme, že vlastnost platí pro původní $G$.
2. **V mincích (dekonstrukce z $n+1$ shora na $n$):**
   - Máme cílovou částku $n+1$ Kč ($n+1 \ge 9$). Chceme z ní odebráním/výměnou získat částku $n$ Kč (změna $-1\text{ Kč}$), abychom mohli použít slabý IP $P(n)$:
     - **Případ 1 (Máme alespoň dvě 3 Kč mince):** Vyměníme $3 + 3 \to 5$ Kč (čistá změna $-6 + 5 = -1\text{ Kč}$, získáme částku $n$ Kč).
     - **Případ 2 (Nemáme dvě 3 Kč mince):** Částka $n+1 \ge 9$ se skládá převážně z pětikorun (musí mít alespoň dvě 5 Kč: $5 + 5 = 10$). Vyměníme $5 + 5 \to 3 + 3 + 3$ Kč (čistá změna $-10 + 9 = -1\text{ Kč}$, opět získáme $n$ Kč).
   - V obou případech jsme z částky $n+1$ shora dekonstruovali stav $n$, na který použijeme slabý indukční předpoklad!

<details class="my-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 overflow-hidden no-print print:hidden print-hidden">
<summary class="cursor-pointer px-4 py-3 font-semibold text-sm text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center justify-between select-none">
<span class="flex items-center gap-2">
<span>🚀</span>
<span><strong>Proč je Silná indukce shora ještě jednodušší?</strong> (Odebírání bez výměn)</span>
</span>
<span class="text-xs text-stone-600 dark:text-stone-400 font-normal">Kliknutím rozbalit</span>
</summary>
<div class="p-4 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-3">
<p class="m-0">
Zatímco slabá indukce musí skákat o 1 ($n+1 \to n$), což u mincí vyžadovalo výměny, <strong>silná indukce výměny vůbec nepotřebuje</strong> — stačí odebrat celou minci či blok:
$$(n + 1) = ((n + 1) - k) + k$$
</p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
<div class="p-2.5 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">🧩 3 fundamentální bloky rozkladu:</strong>
<p class="mt-1 mb-0 text-xs">Každá platba $n \ge 8$ Kč obsahuje alespoň jeden z těchto bloků k odebrání:</p>
<ul class="list-disc pl-4 mt-1 space-y-0.5 text-xs">
<li><strong>$3 + 5 = 8$ Kč</strong> (pokud máme 3 i 5)</li>
<li><strong>$3 + 3 + 3 = 9$ Kč</strong> (pokud máme jen trojky)</li>
<li><strong>$5 + 5 = 10$ Kč</strong> (pokud máme jen pětky)</li>
</ul>
</div>
<div class="p-2.5 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">📐 Pravidlo pro velikost báze:</strong>
<p class="mt-1 mb-0 text-xs"><strong>O kolik kroků zpět dekonstruujeme, tolik bází musíme ověřit ručně:</strong></p>
<ul class="list-disc pl-4 mt-1 space-y-0.5 text-xs">
<li><strong>Odebrání 3 Kč ($n \to n - 3$):</strong> $n - 3 \ge 8 \implies n \ge 11$, vyžaduje <strong>3 báze</strong>: $\{8, 9, 10\}$.</li>
<li><strong>Odebrání $3+3 = 6$ Kč ($n \to n - 6$):</strong> $n - 6 \ge 8 \implies n \ge 14$, vyžaduje <strong>6 bází</strong>: čísla <strong>8 až 13</strong>.</li>
</ul>
</div>
</div>
</div>
</details>

---

## 3. Růst Počtu Hran při Dekonstrukci Sítě: Vrcholy Stupně 3 `[Relevance: 95%]` `[EPIC]`

Místo abstraktních lemmat se podívejme na přímý, intuitivní důkaz, který se přesně hodí k pochopení dekonstrukce na grafech: **jak roste počet hran se vzrůstajícím počtem vrcholů**.

---

### 🧬 Motivace z bioinformatiky a chemie
V biologických a chemických sítích často pracujeme s uzly, které mají fixní valenci (počet vazeb):
- $sp^2$ uhlíkové atomy v aromatických kruzích a grafenu se vážou právě se **3 sousedy** ($\deg(v) = 3$).
- Terciární větvení v molekulách RNA nebo proteinových doménách vytváří křižovatky stupně 3.
- V informatice se sítím, kde má každý uzel stupeň 3, říká **kubické (3-regulární) sítě**.

Položme si otázku: **Pokud v síti odebereme uzel stupně 3, jak přesně se změní počet hran?**

---

### 📜 Tvrzení (Rekurentní vztah pro počet hran):
Nechť $G = (V, E)$ je graf o $n$ vrcholech, který obsahuje vrchol $v$ se stupněm $\deg(v) = 3$.  
Pokud vrchol $v$ odebereme, získáme podgraf $G' = G \setminus \{v\}$ o $n - 1$ vrcholech. Mezi počtem hran původního grafu $|E(G)| = E(n)$ a podgrafu $|E(G')| = E(n-1)$ platí přesný vztah:

$$\mathbf{E(n) = E(n-1) + 3}$$

*(V bioinformatických textech se často píše $\text{edge}(n) = \text{edge}(n-1) + 3$, obecně pro vrchol libovolného stupně $d$: $E(n) = E(n-1) + d$.)*

---

### ✍️ Dekonstrukční Důkaz Indukcí

```
Schéma dekonstrukce odebráním uzlu v stupně 3:

       (u₁)                                        (u₁)
      /                                             
   (v) ──── (u₂)    ═══ Odebrání vrcholu v ═══>          (u₂)
      \             (zaniknou přesně 3 hrany)       
       (u₃)                                        (u₃)
 ┌──────────────────────┐                     ┌────────────────────────┐
 │ Graf G o n vrcholech │                     │ Podgraf G' o n-1 vrch. │
 │ Počet hran: E(n)     │                     │ Počet hran: E(n-1)     │
 └──────────────────────┘                     └────────────────────────┘
          ▲                                                │
          │         Vrátíme v se 3 hranami                 │
          └────────────────────────────────────────────────┘
```

#### 1. Volba libovolného grafu (Dekonstrukční start):
Mějme **libovolný zadaný** graf $G = (V, E)$ o $n$ vrcholech, který obsahuje uzel $v$ se stupněm $\deg(v) = 3$.  
Počet hran tohoto grafu označme $E(n) = |E|$.

#### 2. Odebrání uzlu a přechod k menšímu podgrafu:
Z grafu $G$ odebereme vrchol $v$ a všechny hrany, které do něj vstupují (jsou to právě hrany $\{v, u_1\}, \{v, u_2\}, \{v, u_3\}$).  
Získáme podgraf $G' = G \setminus \{v\}$:
- Počet vrcholů klesl o 1: $|V(G')| = n - 1$.
- Počet hran klesl přesně o 3: $|E(G')| = E(n) - 3$.

Označme počet hran v $G'$ jako $E(n-1) = |E(G')|$.

#### 3. Přímé vyjádření vztahu:
Jednoduchou úpravou rovnosti $E(n-1) = E(n) - 3$ dostáváme:
$$E(n) = E(n-1) + 3$$

#### 4. Návrat prvku a indukční závěr:
Vrátíme-li uzel $v$ zpět do grafu $G'$, každá z jeho 3 hran se připojí k vrcholům $u_1, u_2, u_3$, které v $G'$ již existují. K existujícím $E(n-1)$ hranám tedy přibudou přesně 3 hrany.  
Tím je dokázáno, že přidáním/odebráním uzlu stupně 3 se počet hran mění přesně o 3.

---

### 💡 Porovnání se stromy: Univerzální pravidlo dekonstrukce

Tento vztah vám okamžitě odemkne celou teorii grafů:

| Typ grafu / uzlu | Co odebíráme při dekonstrukci | Rekurence pro počet hran | Výsledný vzorec |
| :--- | :--- | :--- | :--- |
| **Strom** | List (stupeň $\deg(v) = 1$) | $E(n) = E(n-1) + 1$ | $m = n - 1$ |
| **Cesta / Kružnice** | Běžný uzel (stupeň $\deg(v) = 2$) | $E(n) = E(n-1) + 2$ | $m = n$ (pro kružnici) |
| **Síť s uzly stupně 3** | Uzel se 3 vazbami ($\deg(v) = 3$) | $E(n) = E(n-1) + 3$ | Roste o $+3$ na každý uzel |

> **Zlaté pravidlo teorie grafů:**  
> **$\mathbf{E(n) = E(n-1) + \deg(v)}$**  
> Kolik hran má odebíraný vrchol, o tolik se liší počet hran mezi grafem o $n$ vrcholech a jeho podgrafem o $n - 1$ vrcholech.  
> U stromu je to $+1$, u cyklu $+2$, u trojvazné sítě $+3$. Všechny tyto důkazy mají identickou strukturu!

---

## 4. Stromy v Letní Přípravě: Proč má strom $m = n - 1$ hran `[Relevance: 100%]` `[MEGA EPIC]`

Stromy jsou nejčastější grafovou strukturou v bioinformatice (fylogenetické evoluční stromy, hierarchie taxonomií, kostry molekulárních sítí).

> 🌲 **Základní intuitivní definice:**  
> **Strom je souvislý graf, který neobsahuje žádné cykly.**

---

### 🍃 Klíčová vlastnost pro indukci: Listy stromu
Každá konečná větev stromu musí někde skončit. Koncovým vrcholům říkáme **listy**:
- **List** je vrchol se stupněm $\deg(v) = 1$ (vede z něj právě jedna jediná hrana).
- Každý strom s alespoň 2 vrcholy má **minimálně dva listy**. *(Představte si klacík nebo větev – vždy má alespoň dva konce!)*

---

### ✍️ Proč má strom o $n$ vrcholech přesně $m = n - 1$ hran?
Tento slavný vzorec není žádná magie — je to přímý důsledek našeho **pravidla dekonstrukce**:

1. **Začátek (Dekonstrukce shora):** Vezměme libovolný strom $T$ s $n$ vrcholy ($n \ge 2$).
2. **Odebrání listu:** Najdeme koncový list $v$ (který má $\deg(v) = 1$) a odebereme ho i s jeho jedinou hranou.
3. **Co se stane s grafem:**
   - Počet vrcholů klesne o 1: $n \to n - 1$.
   - Počet hran klesne přesně o 1: $m \to m - 1$ (podle pravidla $E(n) = E(n-1) + 1$).
   - Zbytek je stále souvislý strom bez cyklů!
4. **Závěr:** Pokud budeme listy odebírat dál a dál, v každém kroku ubude přesně 1 vrchol a 1 hrana, až nám na konci zbude **1 jediný vrchol a 0 hran**.  
   Proto má strom vždy **o 1 hranu méně než vrcholů**:
   $$\mathbf{m = n - 1}$$

---

<details class="my-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 overflow-hidden no-print print:hidden print-hidden">
<summary class="cursor-pointer px-4 py-3 font-semibold text-sm text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center justify-between select-none">
<span class="flex items-center gap-2">
<span>🎓</span>
<span><strong>Pro zájemce do AG1:</strong> 5 ekvivalentních definic stromu & Důkaz Tree Leaf Lemmatu</span>
</span>
<span class="text-xs text-stone-600 dark:text-stone-400 font-normal">Kliknutím rozbalit</span>
</summary>
<div class="p-4 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-3">
<p class="m-0 font-medium text-stone-900 dark:text-stone-100">
V kurzu AG1 dostanete těchto 5 vlastností jako hotové věty. Pro libovolný konečný graf $G = (V, E)$ s $n = |V|$ vrcholy jsou následující tvrzení <strong>zcela ekvivalentní</strong>:
</p>
<ol class="list-decimal pl-5 space-y-1">
<li>$G$ je <strong>strom</strong> (je souvislý a nemá cykly).</li>
<li>$G$ je <strong>acyklický</strong> a má přesně $m = n - 1$ hran.</li>
<li>$G$ je <strong>souvislý</strong> a má přesně $m = n - 1$ hran.</li>
<li>Mezi každou dvojicí různých vrcholů $u, v \in V$ existuje <strong>právě jedna jednoduchá cesta</strong>.</li>
<li>$G$ je <strong>minimální souvislý graf</strong> (odebráním libovolné hrany se graf rozpadne).</li>
</ol>
<div class="p-3 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800 mt-2">
<strong class="text-stone-900 dark:text-stone-100">🍃 Důkaz existence listu (Tree Leaf Lemma):</strong>
<p class="mt-1 mb-0 text-xs leading-relaxed">
Zvolme ve stromu nejdelší možnou cestu $P = (v_0, v_1, \dots, v_k)$. Koncový vrchol $v_k$ nemůže mít souseda mimo cestu (jinak by cesta nebyla nejdelší) ani jiného souseda na cestě (jinak by vznikl cyklus). Jediným sousedem $v_k$ je tedy předchozí vrchol $v_{k-1}$, což znamená $\deg(v_k) = 1$ — uzel $v_k$ je list! Ze stejného důvodu je listem i $v_0$. Strom má tedy alespoň 2 listy.
</p>
</div>
</div>
</details>

---

## 5. 💡 Propojení s Bioinformatikou: Orientované Sítě bez Cyklů (DAGy) `[Relevance: 80%]`

V bioinformatice často nestudujeme jen obousměrné vztahy, ale **procesy, které tečou jedním směrem**:
- **Metabolické dráhy:** Glykolýza začíná glukózou a přes sérii nevratných enzymatických reakcí končí pyruvátem.
- **Signální a regulační kaskády:** Aktivace receptoru $\to$ fosforylace kinázy $\to$ exprese genu.

Pokud v takovém procesu nedochází k nekonečným smyčkám (zpětným cyklům), nazýváme ho v informatice **DAG** (*Directed Acyclic Graph* — orientovaný acyklický graf).

---

### 🌊 Klíčová bio-intuice: Zdroj a Výtok
V každé reálné jednosměrné dráze bez smyček musí existovat:
1. **Zdroj (Source):** Počáteční metabolit, do kterého žádná reakce nevstupuje ($\text{deg}^-(u) = 0$, např. vstupní glukóza).
2. **Výtok (Sink):** Finální metabolit, ze kterého už žádná reakce nepokračuje ($\text{deg}^+(w) = 0$, např. finální odpadní produkt / pyruvát).

Díky tomu lze celou metabolickou dráhu **seřadit v čase zleva doprava** — tomu se v informatice říká **Topologické uspořádání**.

---

<details class="my-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 overflow-hidden no-print print:hidden print-hidden">
<summary class="cursor-pointer px-4 py-3 font-semibold text-sm text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center justify-between select-none">
<span class="flex items-center gap-2">
<span>🎓</span>
<span><strong>Pokročilé pro zájemce:</strong> Rigorózní důkaz existence zdroje a Topologické řazení</span>
</span>
<span class="text-xs text-stone-600 dark:text-stone-400 font-normal">Kliknutím rozbalit</span>
</summary>
<div class="p-4 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-3">
<div class="p-3 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">1. Důkaz existence zdroje přes nejdelší orientovanou cestu:</strong>
<p class="mt-1 mb-0 text-xs leading-relaxed">
Zvolme v DAGu $G$ nejdelší orientovanou cestu $P = (v_0, v_1, \dots, v_k)$. Počáteční uzel $v_0$ nemůže mít předchůdce mimo cestu (spor s maximalitou délky) ani na cestě (vznikl by orientovaný cyklus, spor s DAGem). Proto do $v_0$ nevstupuje žádná hrana ($\text{deg}^-(v_0) = 0$) a uzel $v_0$ je zdrojem.
</p>
</div>
<div class="p-3 rounded-lg bg-white/70 dark:bg-[#150e09] border border-stone-200 dark:border-stone-800">
<strong class="text-stone-900 dark:text-stone-100">2. Důkaz existence Topologického uspořádání dekonstrukční indukcí:</strong>
<p class="mt-1 mb-0 text-xs leading-relaxed">
Vezmeme libovolný DAG $G$ o $n+1$ vrcholech. Najdeme zdroj $u$ ($\text{deg}^-(u) = 0$), odebereme ho a získáme menší DAG $G'$ o $n$ vrcholech. Dle indukčního předpokladu (IP) lze $G'$ seřadit do posloupnosti $(v_1', \dots, v_n')$. Zdroj $u$ předřadíme na 1. místo: $(u, v_1', \dots, v_n')$. Protože do $u$ nic nevstupovalo, všechny jeho hrany vedou doprava. Tím je topologické řazení hotové.
</p>
</div>
</div>
</details>

---

<details class="my-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/40 overflow-hidden no-print print:hidden print-hidden">
<summary class="cursor-pointer px-4 py-3 font-semibold text-sm text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 flex items-center justify-between select-none">
<span class="flex items-center gap-2">
<span>🧪</span>
<span><strong>Bonusové procvičovací úlohy:</strong> Bipartitnost stromů a Lesy</span>
</span>
<span class="text-xs text-stone-600 dark:text-stone-400 font-normal">Kliknutím rozbalit</span>
</summary>
<div class="p-4 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-4">
<div>
<strong class="text-stone-900 dark:text-stone-100">Úloha 1: 2-Obarvení stromu (Bipartitnost):</strong>
<p class="mt-1 text-xs">Každý strom lze obarvit 2 barvami tak, že žádní sousedé nemají stejnou barvu. Důkaz dekonstrukcí: odebereme list $v$, zbylý strom $T'$ o $n$ vrcholech obarvíme dle IP 2 barvami. List $v$ vrátíme a obarvíme opačnou barvou, než má jeho jediný soused.</p>
</div>
<div>
<strong class="text-stone-900 dark:text-stone-100">Úloha 2: Počet hran v lese ($m = n - c$):</strong>
<p class="mt-1 text-xs">Les s $n$ vrcholy a $c$ stromy (komponentami) má přesně $m = n - c$ hran. Důkaz dekonstrukcí podle hran: odebráním hrany $e$ se jedna komponenta rozpadne na dvě ($c' = c + 1$). Dle IP má menší les $m - 1 = n - (c + 1) = n - c - 1 \implies m = n - c$.</p>
</div>
</div>
</details>

---

## 6. Přehled: Co je základ letní přípravy a co přijde v AG1 `[Relevance: 80%]` `[INSIGHT]`

Z tohoto modulu vám pro letní přípravu bohatě stačí:

| Dovednost pro letní přípravu | Status |
| :--- | :---: |
| Rozdíl mezi dekonstrukcí (shora) a konstrukcí (zdola) | ✅ Zvládáte |
| Velikost báze podle kroku odebírání (krok o 3 ➔ 3 báze; krok o 6 ➔ 6 bází) | ✅ Zvládáte |
| Pravidlo růstu hran při dekonstrukci: $E(n) = E(n-1) + \deg(v)$ | ✅ Zvládáte |
| Proč má strom $m = n - 1$ hran (odebírání listů stupně 1) | ✅ Zvládáte |

