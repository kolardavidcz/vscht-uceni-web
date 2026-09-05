# Modul 2: Indukce na Grafech & Redukční Past

> **[Relevance: 100%]** · **Tags:** `[MEGA EPIC]` `[PAST U ZKOUŠKY]` `[INSIGHT]`
> **Cíl modulu:** Pochopit, jak se v matematice dokazuje tvrzení pro všechny grafy najednou — a vyhnout se pasti, do které padne polovina studentů u zkoušky.

---

## 🁢 Dominová analogie (vážně, takhle to funguje)

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
<li><strong>Závěr:</strong> Ve všech případech jsme z libovolné platné výplaty $n$ Kč sestrojili výplatu $n + 1$ Kč. Podle principu slabé indukce tvrzení platí pro všechna celá čísla $n \ge 8$. $\blacksquare$</li>
</ol>
</div>
<div>
<h4 class="text-sm font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
Metoda 2: Důkaz Silnou Indukcí (Krok o 3 Kč zpět s 3 bázemi)
</h4>
<p class="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mb-2">
Tato metoda využívá fakt, že přidáním jedné 3 Kč mince získáme z částky $k$ částku $k + 3$. Abychom pokryli všechna čísla, potřebujeme <strong>3 po sobě jdoucí bázové případy</strong>:
</p>
<ol class="text-xs sm:text-sm space-y-1.5 pl-5 list-decimal text-stone-800 dark:text-stone-200">
<li><strong>Báze indukce (3 počáteční konfigurace):</strong>
<ul class="list-disc pl-4 space-y-0.5 mt-1">
<li>$V(8)$: $8 = 3 + 5$ Kč ✅</li>
<li>$V(9)$: $9 = 3 + 3 + 3$ Kč ✅</li>
<li>$V(10)$: $10 = 5 + 5$ Kč ✅</li>
</ul>
</li>
<li><strong>Indukční krok:</strong> Nechť $n \ge 10$. Předpokládejme, že tvrzení platí pro všechna $k \in \{8, 9, \dots, n\}$ (Silný indukční předpoklad). Potřebujeme ukázat, že platí i pro $n + 1$.</li>
<li><strong>Odvození:</strong>
Jelikož $n \ge 10$, platí $(n + 1) - 3 = n - 2 \ge 8$.
Podle indukčního předpokladu tedy dokážeme bez vracení vyplatit částku <strong>$(n - 2)$ Kč</strong>.
K této sestavě mincí nyní stačí <strong>přidat jednu tříkorunu (+3 Kč)</strong>:
$$(n - 2) + 3 = n + 1 \text{ Kč}$$
Tím jsme přesně vyplatili $n + 1$ Kč, což jsme potřebovali dokázat! $\blacksquare$
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
> **Princip Silné Indukce:** Předpokládáme, že tvrzení platí pro **všechny menší objekty** velikosti $i \in \{n_0, n_0+1, \dots, k\}$, a dokážeme platnost pro objekt velikosti $k+1$:
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

### 💡 Hlubší vhled: Proč dekonstrukce zachraňuje silnou indukci (Odebírání a velikost báze)

Podívejme se, jak tentýž princip dekonstrukce funguje v klasické indukci na číslech (např. v naší úloze o platbách mincemi 3 Kč a 5 Kč):

#### ❌ Konstrukční past u indukce:
Student řekne: *„Předpokládejme, že umíme vyplatit $n$ Kč. Chceme dokázat, že umíme vyplatit $n+1$ Kč. Přidáme minci...“*  
**Problém:** My ale nemáme minci v hodnotě 1 Kč! Student se pokouší objekt stavět odspodu přičítáním a musí vymýšlet složité výměny (např. $5 \to 3+3$), kde snadno zapomene ověřit existenci potřebné mince.

#### ✅ Dekonstrukční přístup (Silná indukce shora):
Místo skládání začneme **od zadaného cílového stavu $n$ (nebo $n+1$)** a **odebíráme** známý celek tak, abychom zbytek našli v indukčním předpokladu:
$$(n + 1) = \underbrace{((n + 1) - k)}_{\text{menší stav dle IP}} + \underbrace{k}_{\text{odebraný blok}}$$

---

#### 🧩 1. Fundamentální rozklad libovolné platby ($3+5$, $3+3+3$ nebo $5+5$)
Každou platnou výplatu $n \ge 8$ Kč z mincí $\{3, 5\}$ lze při dekonstrukci rozebrat na jeden ze **tří elementárních bloků**:

1. **Obsahuje alespoň jednu 3 Kč a jednu 5 Kč:**  
   Obsahuje blok **$3 + 5 = 8\text{ Kč}$**.
2. **Neobsahuje žádnou 5 Kč (skládá se pouze z 3 Kč mincí):**  
   Protože celková částka je $n \ge 8$, musí obsahovat alespoň tři trojky ($3 \times 3 = 9 \ge 8$).  
   Obsahuje blok **$3 + 3 + 3 = 9\text{ Kč}$**.
3. **Neobsahuje žádnou 3 Kč (skládá se pouze z 5 Kč mincí):**  
   Protože $n \ge 8$, musí obsahovat alespoň dvě pětky ($2 \times 5 = 10 \ge 8$).  
   Obsahuje blok **$5 + 5 = 10\text{ Kč}$**.

> **Aha-moment:** Neexistuje žádná platná platba $n \ge 8$ Kč, ze které by nebylo možné vyjmout $3+5$, $3+3+3$ nebo $5+5$. Každou platbu lze tímto způsobem bezpečně dekonstruovat na menší platný případ!

---

#### 📐 2. Proč velikost odebíraného kroku určuje počet bází $n_0$ (Krok o 3 vs. Krok o 6)
Častá zkoušková otázka: *„Proč má někdy bázová množina 3 prvky a jindy 6 prvků?“*

> ⚡ **Zlaté pravidlo indukce:**  
> **O kolik kroků zpět při dekonstrukci odebíráme, přesně tolik po sobě jdoucích bázových případů musíme ověřit ručně na začátku!**

- **Varianta A: Odebíráme 3 Kč ($n \to n - 3$) ➔ 3 bázové případy:**  
  Při dekonstrukci o 3 Kč zpět potřebujeme, aby zbytek byl stále platný: $n - 3 \ge 8 \implies n \ge 11$.  
  Indukční krok proto funguje až pro $n \ge 11$. Vše pod tím tvoří bázi:  
  **$n_0 \in \{8, 9, 10\}$ (3 díly)**.
  
- **Varianta B: Odebíráme dvě trojky = 6 Kč ($n \to n - 6$) ➔ 6 bázových případů (8 až 13):**  
  Co kdybychom chtěli dekonstruovat odebíráním dvojice tříkorun ($3 + 3 = 6\text{ Kč}$)?  
  Aby byl zbytek $n - 6$ platnou částkou ($\ge 8\text{ Kč}$), musí být $n - 6 \ge 8 \implies n \ge 14$.  
  Indukční krok tedy funguje až od $n = 14$ výše!  
  Všechna čísla pod $14$ musíme ověřit ručně, čímž **bázová množina $n_0$ má přesně 6 dílů (čísla 8 až 13)**:
  - $n = 8 = 3 + 5$
  - $n = 9 = 3 + 3 + 3$
  - $n = 10 = 5 + 5$
  - $n = 11 = 3 + 3 + 5$
  - $n = 12 = 3 + 3 + 3 + 3$
  - $n = 13 = 3 + 5 + 5$
  
  Pro libovolné $n \ge 14$ pak odebereme dvě tříkoruny ($n - 6 \ge 8$), podle silného IP je zbytek vyplatitelný a vrácením $3+3$ máme $n$.  
  **Krok o 6 zpět vyžaduje 6 bází, krok o 3 vyžaduje 3 báze, krok o 1 vyžaduje 1 bázi.**

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
Pokud vrchol $v$ odebereme, získáme podgraf $G' = G \setminus \{v\}$ o $n - 1$ vrcholech. Mezi počtem hran původního grafu $|E(G)| = \text{edge}_n$ a podgrafu $|E(G')| = \text{edge}_{n-1}$ platí přesný vztah:

$$\mathbf{\text{edge}_n = \text{edge}_{n-1} + 3}$$

*(Obecně pro vrchol libovolného stupně $d$: $\text{edge}_n = \text{edge}_{n-1} + d$.)*

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
 │ Počet hran: edge_n   │                     │ Počet hran: edge_{n-1} │
 └──────────────────────┘                     └────────────────────────┘
          ▲                                                │
          │         Vrátíme v se 3 hranami                 │
          └────────────────────────────────────────────────┘
```

#### 1. Volba libovolného grafu (Dekonstrukční start):
Mějme **libovolný zadaný** graf $G = (V, E)$ o $n$ vrcholech, který obsahuje uzel $v$ se stupněm $\deg(v) = 3$.  
Počet hran tohoto grafu označme $\text{edge}_n = |E|$.

#### 2. Odebrání uzlu a přechod k menšímu podgrafu:
Z grafu $G$ odebereme vrchol $v$ a všechny hrany, které do něj vstupují (jsou to právě hrany $\{v, u_1\}, \{v, u_2\}, \{v, u_3\}$).  
Získáme podgraf $G' = G \setminus \{v\}$:
- Počet vrcholů klesl o 1: $|V(G')| = n - 1$.
- Počet hran klesl přesně o 3: $|E(G')| = \text{edge}_n - 3$.

Označme počet hran v $G'$ jako $\text{edge}_{n-1} = |E(G')|$.

#### 3. Přímé vyjádření vztahu:
Jednoduchou úpravou rovnosti $\text{edge}_{n-1} = \text{edge}_n - 3$ dostáváme:
$$\text{edge}_n = \text{edge}_{n-1} + 3$$

#### 4. Návrat prvku a indukční závěr:
Vrátíme-li uzel $v$ zpět do grafu $G'$, každá z jeho 3 hran se připojí k vrcholům $u_1, u_2, u_3$, které v $G'$ již existují. K existujícím $\text{edge}_{n-1}$ hranám tedy přibudou přesně 3 hrany.  
Tím je dokázáno, že přidáním/odebráním uzlu stupně 3 se počet hran mění přesně o 3. $\blacksquare$

---

### 💡 Porovnání se stromy: Univerzální pravidlo dekonstrukce

Tento vztah vám okamžitě odemkne celou teorii grafů:

| Typ grafu / uzlu | Co odebíráme při dekonstrukci | Rekurence pro počet hran | Výsledný vzorec |
| :--- | :--- | :--- | :--- |
| **Strom** | List (stupeň $\deg(v) = 1$) | $\text{edge}_n = \text{edge}_{n-1} + 1$ | $m = n - 1$ |
| **Cesta / Kružnice** | Běžný uzel (stupeň $\deg(v) = 2$) | $\text{edge}_n = \text{edge}_{n-1} + 2$ | $m = n$ (pro kružnici) |
| **Síť s uzly stupně 3** | Uzel se 3 vazbami ($\deg(v) = 3$) | $\text{edge}_n = \text{edge}_{n-1} + 3$ | Roste o $+3$ na každý uzel |

> **Zlaté pravidlo teorie grafů:**  
> **$\mathbf{\text{edge}_n = \text{edge}_{n-1} + \deg(v)}$**  
> Kolik hran má odebíraný vrchol, o tolik se liší počet hran mezi grafem o $n$ vrcholech a jeho podgrafem o $n - 1$ vrcholech.  
> U stromu je to $+1$, u cyklu $+2$, u trojvazné sítě $+3$. Všechny tyto důkazy mají identickou strukturu!

---

## 4. Teorie Stromů & Ekvivalentní Definice `[Relevance: 100%]` `[MEGA EPIC]`

Stromy jsou vůben nejdůležitější grafovou strukturou v bioinformatice (fylogenetické stromy, rozhodovací stromy, kostry sítí).

> **Základní Definice Stromu:** Strom je souvislý neorientovaný graf bez cyklů.

---

### 4.1 5 Ekvivalentních Definic Stromu

Pro libovolný konečný neorientovaný graf $G = (V, E)$ s $n = |V|$ vrcholy jsou následující tvrzení **zcela ekvivalentní**:

1. $G$ je **strom** (je souvislý a nemá cykly).
2. $G$ je **acyklický** a má přesně $m = n - 1$ hran.
3. $G$ je **souvislý** a má přesně $m = n - 1$ hran.
4. Mezi každou dvojicí různých vrcholů $u, v \in V$ existuje **právě jedna jednoduchá cesta**.
5. $G$ je **minimální souvislý graf** (přidáním libovolné hrany vznikne cyklus, odebráním libovolné hrany se graf stane nesouvislým).

---

### 4.2 Tree Leaf Lemma (Lema o Existenci Listu v Keři)

> 🍃 **Věta (Tree Leaf Lemma):** Každý strom $T = (V, E)$ s $n \ge 2$ vrcholy obsahuje alespoň 2 **listy** (vrcholy stupně 1).

#### ✍️ Rigorózní 3-řádkový Důkaz Lemmatu přes Extremální Cestu `[INSIGHT]`:
1. Zvolme ve stromu $T$ **nejdelší jednoduchou cestu** $P = (v_0, v_1, \dots, v_k)$. Jelikož $n \ge 2$, cesta obsahuje alespoň 1 hranu ($k \ge 1$).
2. Uvažujme koncový vrchol $v_k$. Vrchol $v_k$ nemůže mít žádného souseda mimo cestu $P$ (jinak bychom cestu prodloužili, což je spor s maximalitou $P$).
3. Vrchol $v_k$ nemůže mít ani žádného souseda na cestě $P$ s výjimkou $v_{k-1}$ (jinak by v $T$ vznikl cyklus, což je spor s definicí stromu).
4. Proto jediným sousedem vrcholu $v_k$ je $v_{k-1}$, čímž $\deg(v_k) = 1$. Ze stejné logiky je i $v_0$ listem stupně 1. Strom $T$ obsahuje alespoň 2 listy. $\blacksquare$

---

### 4.3 Vzorový Důkaz: Počet Hran ve Stromu ($m = n - 1$)

### 📜 Věta:
Každý strom $T = (V, E)$ o $n \ge 1$ vrcholech má přesně $m = n - 1$ hran.

---

### ✍️ Rigorózní Důkaz Dekonstrukční Indukcí podle $n = |V|$ `[MEGA EPIC]`:

#### 1. Báze indukce ($n = 1$):
Strom s 1 vrcholem nemá žádné hrany ($m = 0$).
$$m = 0 = 1 - 1 = n - 1$$
Báze pro $n = 1$ platí.

#### 2. Indukční předpoklad (IP):
Předpokládejme, že **každý** strom s $k$ vrcholy (kde $1 \le k \le n$) má přesně $k - 1$ hran.

#### 3. Indukční krok ($n \to n + 1$):
Vezměme **LIBOVOLNÝ** strom $T = (V, E)$ s $n + 1$ vrcholy ($n + 1 \ge 2$).
*(Nezakládáme nový strom přidáváním vrcholu – dekonstruujeme zadaný strom $T$ s $n+1$ vrcholy!)*

1. Protože $T$ má $n + 1 \ge 2$ vrcholů, podle **Tree Leaf Lemmatu** obsahuje alespoň jeden list $v \in V$ s $\deg(v) = 1$.
2. Budiž $e = \{v, u\} \in E$ jediná hrana incidentní s listem $v$.
3. Vytvořme podgraf $T' = (V \setminus \{v\}, E \setminus \{e\})$, který vznikne odebráním listu $v$ a jeho hrany $e$.
4. **Ověření předpokladů pro IP na podgrafu $T'$:**
   - Podgraf $T'$ má přesně $(n+1) - 1 = n$ vrcholů.
   - Podgraf $T'$ je stále souvislý (odebráním listu stupně 1 nevznikne nespojitost).
   - Podgraf $T'$ nemá cykly (odebráním prvků nové cykly nevzniknou).
   - Tedy $T'$ je platný strom o $n$ vrcholech!
5. Aplikujeme **Indukční předpoklad (IP)** na $T'$:
   $$|E(T')| = n - 1$$
6. Původní strom $T$ měl o 1 hranu více než $T'$:
   $$|E(T)| = |E(T')| + 1 = (n - 1) + 1 = n = (n + 1) - 1$$

Dokázali jsme, že libovolný strom s $n+1$ vrcholy má přesně $(n+1) - 1$ hran. $\blacksquare$

---

---

## 5. Indukce na Orientovaných Akalických Grafech (DAGs) `[Relevance: 95%]` `[BIO-ANALOGIE]`

V bioinformatických aplikacích (metabolické dráhy glykolýzy, enzymatické reakční kaskády, gene regulatory networks) se neobcházíme bez **Orientovaných Acyklických Grafů (DAG - Directed Acyclic Graphs)**.

> **Lema o Existenci Zdroje v DAGu:** Každý konečný orientovaný acyklický graf $G = (V, E)$ s $|V| \ge 1$ obsahuje alespoň jeden **zdrojový uzel (source)** $u \in V$, pro který platí:
> $$\text{deg}^-(u) = 0$$
> *(Existuje uzel, do kterého nevstupuje žádná orientovaná hrana).*

---

### ✍️ Rigorózní Důkaz Lemmatu o Zdroji přes Extremální Orientovanou Cestu `[INSIGHT]`:
1. Zvolme v DAGu $G$ **nejdelší orientovanou jednoduchou cestu** $P = (v_0, v_1, \dots, v_k)$.
2. Uvažujme počáteční uzel $v_0$. Pokud by existovala orientovaná hrana $(w, v_0) \in E$, pak:
   - Pokud $w \notin P$, mohli bychom cestu $P$ prodloužit zlevo na $(w, v_0, \dots, v_k)$, což je SPOR s maximalitou $P$.
   - Pokud $w \in P$, hrana $(w, v_0)$ by společně s úsekem cesty vytvořila orientovaný cyklus, což je SPOR s tím, že $G$ je acyklický DAG!
3. Proto do $v_0$ nevstupuje žádná hrana $\implies \text{deg}^-(v_0) = 0$. Uzel $v_0$ je zdrojem. $\blacksquare$

---

### 📜 Věta (Existencie Topologického Uspořádání v DAGu):
Každý konečný orientovaný acyklický graf $G = (V, E)$ s $n = |V|$ vrcholy lze **topologicky uspořádat**, tj. jeho vrcholy lze seřadit do posloupnosti $(v_1, v_2, \dots, v_n)$ tak, že všechny orientované hrany vedou pouze zlevo doprava:
$$\forall (v_i, v_j) \in E \implies i < j$$

#### ✍️ Důkaz Dekonstrukční Indukcí podle $n = |V|$ `[MEGA EPIC]`:

1. **Báze ($n = 1$):** DAG s 1 vrcholem má triviální topologické uspořádání $(v_1)$. Báze platí.
2. **Indukční předpoklad (IP):** Předpokládejme, že každý DAG s $k \le n$ vrcholy lze topologicky uspořádat.
3. **Indukční krok ($n \to n + 1$):** Vezměme **LIBOVOLNÝ** DAG $G = (V, E)$ s $n + 1$ vrcholy.
   - Podle Lemmatu o zdroji obsahuje $G$ alespoň jeden uzel $u \in V$ s $\text{deg}^-(u) = 0$.
   - Odeberme uzel $u$ a všechny z něj vycházející hrany a získáme podgraf $G' = G \setminus \{u\}$.
   - Podgraf $G'$ má $n$ vrcholů a je stále platným DAGem (odebráním uzlu cykly nevzniknou).
   - Aplikujeme **IP** na podgraf $G'$: Vrcholy $G'$ lze topologicky uspořádat do posloupnosti $(v_1', v_2', \dots, v_n')$.
   - Jelikož $\text{deg}^-(u) = 0$ v původním $G$, do $u$ nevedly žádné hrany. Můžeme tedy uzel $u$ bezpečně předřadit na 1. místo celkového uspořádání:
     $$\text{Topologické Uspořádání } G = (u, v_1', v_2', \dots, v_n')$$
   - Všechny hrany vycházející z $u$ směřují doprava do $v_j'$. Podmínka $i < j$ drží. $\blacksquare$

---

## 🧪 Procvičovací Úlohy pro Bioinformatiky

### Úloha 2.1: 2-Obarvení Stromu (Bipartitnost Stromů)
Dokážete dekonstrukční indukcí podle počtu vrcholů $n = |V|$, že každý strom $T = (V, E)$ je **bipartitní** (jeho vrcholy lze obarvit 2 barvami tak, že žádné dva sousední vrcholy nemají stejnou barvu).

<details>
<summary>🔍 Zobrazit vzorový zkouškový důkaz</summary>

### ✍️ Řešení Dekonstrukční Indukcí:
1. **Báze ($n = 1$):** Strom s 1 vrcholem obarvíme 1 barvou. Tvrzení platí.
2. **IP:** Předpokládejme, že každý strom s $k$ vrcholy ($1 \le k \le n$) lze obarvit 2 barvami (Červená a Modrá).
3. **Indukční krok ($n \to n + 1$):** Vezměme **libovolný** strom $T$ s $n+1$ vrcholy.
   - Podle Tree Leaf Lemmatu má $T$ list $v \in V$ s $\deg(v) = 1$ a hranou $\{v, u\}$.
   - Odebereme list $v$ a získáme strom $T'$ o $n$ vrcholech.
   - Podle **IP** lze strom $T'$ obarvit 2 barvami. Nechť $u$ dostal např. Červenou barvu.
   - Navrátíme list $v$ a přiřadíme mu druhou barvu (Modrou).
   - Jediná nová hrana v $T$ je $\{v, u\}$, která spojuje Červený uzel $u$ a Modrý uzel $v$.
   - Strom $T$ o $n+1$ vrcholech je platně 2-obarven. $\blacksquare$
</details>

---

### Úloha 2.2: Počet Hran v Lese (Les s $c$ Komponentami)
Dokážte dekonstrukční indukcí podle počtu hran $m$, že každý neorientovaný acyklický graf (les) $G = (V, E)$ s $n = |V|$ vrcholy a $c$ komponentami souvislosti má přesně:
$$m = n - c \text{ hran}$$

<details>
<summary>🔍 Zobrazit vzorový zkouškový důkaz</summary>

### ✍️ Řešení Dekonstrukční Indukcí podle $m$:
1. **Báze ($m = 0$):** Graf bez hran má $n$ izolovaných vrcholů, tedy $c = n$ komponent. $m = 0 = n - n = n - c$. Báze platí.
2. **IP:** Předpokládejme, že pro les s $k < m$ hranami platí $k = n - c_k$.
3. **Indukční krok ($m$ hran):** Vezměme **libovolný** les $G$ s $m$ hranami a $c$ komponentami.
   - Zvolme libovolnou hranu $e = \{u, v\} \in E$.
   - Odeberme hranu $e$ a získáme les $G' = (V, E \setminus \{e\})$ s $m - 1$ hranami.
   - Protože $G$ neobsahoval cykly, hrana $e$ byla jediným spojením mezi $u$ a $v$. Jejím odebráním se komponenta rozpadla na 2 nové komponenty!
   - Počet komponent v $G'$ je tedy $c' = c + 1$.
   - Aplikujeme **IP** na $G'$: $|E(G')| = n - c' \implies m - 1 = n - (c + 1) = n - c - 1$.
   - Přičtením 1 k oběma stranám dostáváme $m = n - c$. Les má $n - c$ hran. $\blacksquare$
</details>

---

### Úloha 2.3: Existencie Výtokového Uzlu (Sink) v DAGu
Dokážete duální lema k Lemmatu o zdroji, že každý konečný DAG s $|V| \ge 1$ obsahuje alespoň jeden **výtokový uzel (sink)** $w \in V$, pro který platí:
$$\text{deg}^+(w) = 0$$

<details>
<summary>🔍 Zobrazit vzorové řešení přes extremální cestu</summary>

### ✍️ Řešení:
Zvolme v DAGu $G$ nejdelší orientovanou cestu $P = (v_0, v_1, \dots, v_k)$. Uvažujme koncový uzel $v_k$.
Pokud by existovala hrana $(v_k, z) \in E$, pak $z \notin P$ by prodloužilo cestu $P$ doprava (spor s maximalitou $P$) a $z \in P$ by vytvořilo orientovaný cyklus (spor s acykličností DAGu).
Tedy $\text{deg}^+(v_k) = 0$, uzel $v_k$ je výtokem (sink). $\blacksquare$
</details>

---

## 6. Přehled: Co víte o Stromech a Co přijde v AG1 `[Relevance: 80%]` `[INSIGHT]`

Z tohoto modulu byste teď měli bezpečně zvládat:

| Dovednost | Status |
| :--- | :---: |
| Dekonstrukční indukce podle $\|V\|$ a $\|E\|$ | ✅ Ovládáte |
| Růst hran v síti při dekonstrukci ($\text{edge}_n = \text{edge}_{n-1} + \deg(v)$) | ✅ Ovládáte |
| Lema o existenci listu (přes nejdelší cestu) | ✅ Ovládáte |
| Důkaz $m = n - 1$ pro stromy | ✅ Ovládáte |
| Indukce pro lesy ($m = n - c$) | ✅ Ovládáte |

### Co přijde v AG1 (budete mít k dispozici, nemusíte dokazovat od nuly):
- **5 ekvivalentních definic stromu** — V AG1 je dostanete jako hotové věty, budete je používat (ne dokazovat jejich ekvivalenci navzájem).
- **Existence kostry** — Plyne přímo z algoritmů (Kruskal, Prim), které AG1 prezentuje jako hotové.
- **Bipartitnost stromů** — Zajímavá vlastnost, ale v přípravném kurzu ji necháme stranou. Pozor — bipartitní grafy obecně jsou klíčové téma AG1 (viz modul Důkazy Sporem).

> [!TIP]
> **Letní příprava hotova!** Pokud zvládáte dekonstrukční indukci a výše uvedené důkazy, máte solidní základ pro první přednášku AG1. Stromy budou průběžným motivačním příkladem celého semestru.

---

> ➡️ **Pokračujte na další modul:** [6 · Modul 3: Důkazy Sporem & Extremální Princip](./dml-dukazy-sporem)

