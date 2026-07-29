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
