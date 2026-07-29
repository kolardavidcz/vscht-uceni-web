# ☀️ Letní průvodce grafovou matematikou pro bioinformatiky

> **Pro koho?** Studenti Bioinformatiky na VŠCHT, kteří v září nastupují do 3. semestru a čeká je AG1 na FIT ČVUT.
> **Vibe?** Žádné tlusté skripta, žádný stres. Letní četba u kafe — jako kdyby ti to starší spolužák vysvětloval u oběda.

---

### 📺 Úvodní výukové video
<iframe src="https://www.youtube.com/embed/Rr_I0tdgubY?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

## 👋 Hele, tohle není strašidelný kurz

Spousta bioinformatiků slyší „diskrétní matematika a důkazy" a dostane špatný pocit z gymplu. Nemusíš. Tohle je **přípravný letní materiál** — přečteš ho pohodlně za pár dní a do září budeš mít jasno v tom, co AG1 po tobě vůbec chce.

Co konkrétně se naučíš? Jednoduše řečeno:
- Jak číst a psát matematická tvrzení o grafech (aniž by to bylo strašidelné)
- Jak dokázat, že algoritmus funguje správně (stačí 3 kroky, fakt)
- Jak myslet jako matematik, když řešíš strukturální problémy — a to ti pomůže i v bioinformatice

**Co tady NENÍ:** žádné integrály, žádné matice, žádná pravděpodobnost. Jen logika, grafy a pár hezkých triků na důkazy.

> [!TIP]
> Studenti FIT prošli celým předmětem *BI-DML* (Diskrétní matematika). Ty máš tento kurz — komprimovanou verzi toho nejdůležitějšího, co potřebuješ pro AG1. Zní to dobře? Začínáme.

---


## 🏷️ Systém Hodnocení a Značek v Kurzu

Každá kapitola a podkapitola obsahuje dvě klíčové značky:
- **[Relevance: X%]**: Jak moc je dané téma zásadní přímo pro zkoušku a zápočtové testy z AG1.
- **Štítky (Tags)**:
  - `[EPIC]` / `[MEGA EPIC]` – Klíčový teoretický pilíř s obrovským dopadem.
  - `[PAST U ZKOUŠKY]` – Místo, kde 80 % studentů ztratí body (např. redukční past u indukce).
  - `[INSIGHT]` – Hlavní myšlenkový koncept a biologická analogie.
  - `[CHALLENGE]` – Pokročilejší důkaz pro získání plného počtu bodů.

---

## 📊 Přehledová Tabulka 7 Modulů Kurzu

<div class="overflow-x-auto my-6 border border-slate-200/80 rounded-xl shadow-xs">
<table class="w-full text-left text-xs sm:text-sm border-collapse">
<thead>
<tr class="bg-slate-100/70 border-b border-slate-200">
<th class="px-3 py-2.5 text-slate-700 font-semibold">Modul</th>
<th class="px-3 py-2.5 text-slate-700 font-semibold">Název Kapitoly</th>
<th class="px-3 py-2.5 text-slate-700 font-semibold">Relevance</th>
<th class="px-3 py-2.5 text-slate-700 font-semibold">Čas Čtení</th>
<th class="px-3 py-2.5 text-slate-700 font-semibold">Hlavní Témata & Štítky</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 0</td>
<td class="px-3 py-2.5"><a href="./dml-bio-grafy" class="font-bold text-orange-600 hover:underline">Bio-Intuice & Jazyk Grafů</a></td>
<td class="px-3 py-2.5 font-bold text-emerald-600">95 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">25 min</td>
<td class="px-3 py-2.5">Množiny, relace, molekuly, metabolity, de Bruijn k-mery, PPI sítě, ohodnocené a bipartitní sítě, C++ matice vs. seznam. <span class="text-[10px] font-bold px-1 rounded bg-emerald-100 text-emerald-800">[BIO-ANALOGIE]</span></td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 1</td>
<td class="px-3 py-2.5"><a href="./dml-logicky-zaklad" class="font-bold text-orange-600 hover:underline">Logický & Důkazový Základ</a></td>
<td class="px-3 py-2.5 font-bold text-emerald-600">95 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">20 min</td>
<td class="px-3 py-2.5">Výroky, tabulka implikace (Slib zkoušejícího), De Morganovy zákony s pravdivostní tabulkou, negace ∀/∃, nutná vs. postačující. <span class="text-[10px] font-bold px-1 rounded bg-amber-100 text-amber-800">[INSIGHT]</span></td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 2</td>
<td class="px-3 py-2.5"><a href="./dml-indukce-na-grafech" class="font-bold text-orange-600 hover:underline">Indukce na Grafech & Redukční Past</a></td>
<td class="px-3 py-2.5 font-bold text-rose-600">100 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">20 min</td>
<td class="px-3 py-2.5">Dekonstrukční indukce, POZOR NA REDUKČNÍ PAST, Handshaking lemma, strom $m=n-1$, DAG topological sorting. <span class="text-[10px] font-bold px-1 rounded bg-rose-500 text-white">[MEGA EPIC]</span> <span class="text-[10px] font-bold px-1 rounded bg-rose-100 text-rose-800">[PAST U ZKOUŠKY]</span></td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 3</td>
<td class="px-3 py-2.5"><a href="./dml-dukazy-sporem" class="font-bold text-orange-600 hover:underline">Důkazy Sporem & Extremální Princip</a></td>
<td class="px-3 py-2.5 font-bold text-amber-600">90 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">15 min</td>
<td class="px-3 py-2.5">Šablona sporu ($A \land \neg B \implies \bot$), Bipartitnost $\iff$ bez lichých cyklů, nejkratší cesty, extremální prvek. <span class="text-[10px] font-bold px-1 rounded bg-slate-200 text-slate-700">[EPIC]</span></td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 4</td>
<td class="px-3 py-2.5"><a href="./dml-loop-invariants" class="font-bold text-orange-600 hover:underline">Invarianty Cyklů (BFS & Dijkstra)</a></td>
<td class="px-3 py-2.5 font-bold text-rose-600">100 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">20 min</td>
<td class="px-3 py-2.5">Tříkrokový důkaz (Inicializace, Udržování, Ukončení), BFS vlnoplocha, Dijkstra greedy invariant, obrácení pole. <span class="text-[10px] font-bold px-1 rounded bg-rose-500 text-white">[MEGA EPIC]</span></td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 5</td>
<td class="px-3 py-2.5"><a href="./dml-konstruktivni-dukazy" class="font-bold text-orange-600 hover:underline">Konstruktivní Důkazy & Bio-Algoritmy</a></td>
<td class="px-3 py-2.5 font-bold text-emerald-600">95 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">20 min</td>
<td class="px-3 py-2.5">Hierholzerův algoritmus na de Bruijn grafu (DNA assembly), Semi-Eulerovská cesta, Cut/Cycle Property u MST, Kruskal/Prim. <span class="text-[10px] font-bold px-1 rounded bg-emerald-100 text-emerald-800">[BIO-ANALOGIE]</span></td>
</tr>
<tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
<td class="px-3 py-2.5 font-mono font-bold">Modul 6</td>
<td class="px-3 py-2.5"><a href="./dml-zkouskovy-workshop" class="font-bold text-orange-600 hover:underline">Zkouškový Workshop & Šablony</a></td>
<td class="px-3 py-2.5 font-bold text-rose-600">100 %</td>
<td class="px-3 py-2.5 font-mono text-slate-500">25 min</td>
<td class="px-3 py-2.5">6 plně vyřešených zkouškových příkladů, formální šablony důkazů, bodovací rubrika FIT ČVUT a checklist. <span class="text-[10px] font-bold px-1 rounded bg-rose-500 text-white">[MEGA EPIC]</span> <span class="text-[10px] font-bold px-1 rounded bg-blue-100 text-blue-800">[CHALLENGE]</span></td>
</tr>
</tbody>
</table>
</div>

---

## 🗺️ Mapa Prerekvizit Mezi Moduly

```
                ┌─────────────────────────────────────────┐
                │ Modul 0: Bio-Intuice & Jazyk Grafů       │
                └────────────────────┬────────────────────┘
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │ Modul 1: Logický & Důkazový Základ       │
                └────────────────────┬────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
┌─────────────────────────────────┐     ┌─────────────────────────────────┐
│ Modul 2: Indukce na Grafech      │     │ Modul 3: Důkazy Sporem          │
│          & Redukční Past        │     │          & Extremální Princip   │
└────────────────┬────────────────┘     └────────────────┬────────────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │ Modul 4: Invarianty Cyklů (BFS & Dij)   │
                └────────────────────┬────────────────────┘
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │ Modul 5: Konstruktivní Důkazy (DNA & MST)│
                └────────────────────┬────────────────────┘
                                     │
                                     ▼
                ┌─────────────────────────────────────────┐
                │ Modul 6: Zkouškový Workshop & Šablony   │
                └─────────────────────────────────────────┘
```

---

## ❓ Často Kladené Dotazy (FAQ) Bioinformatiků `[INSIGHT]`

#### 1. Musím si letní kurz projít celý před 1. týdnem semestru?
Není to striktní nutností, ale silně to doporučujeme! Pokud si projdete alespoň Moduly 0, 1 a 2, vyhnete se počátečnímu šoku z formálních matematických důkazů.

#### 2. Proč je redukční indukce ($G_n \to G_{n+1}$) hodnocena 0 body?
Protože přidaný uzel generuje pouze speciální podtřídu grafů. Dekonstrukční indukce ($G_{n+1} \to G'$) zaručuje, že důkaz platí pro **všechny platné grafy**.

#### 3. Je C++ kód v AG1 stejný jako v BI-PA2 na FIT?
V AG1 se nepíší složité třídní hierarchie ani paměťové správy. Píšete čisté grafové algoritmy (BFS, Dijkstra, Kruskal), kde se hodnotí především **asymptotická složitost $\mathcal{O}$** a správnost.

#### 4. Kdy se vyplatí dokazovat kontrapozicí místo přímo?
Kdykoliv je negovaná vlastnost závěru $\neg B$ konstrukčně jednodušší (např. vteřinový průkaz neexistence cyklu v lesích).

#### 5. Jak souvisí de Bruijn grafy s reálnou sekvenací DNA?
Současné sekvenátory generují fragmenty ($k$-mery). de Bruijn graf z nich vytvoří uzel-hrana strukturu, kde nalezení Eulerova tahu zrekonstruuje souvislý genom.

#### 6. Co je to "Triviální Pravdivost" (Vacuous Truth)?
Implikace $A \implies B$, jejíž předpoklad $A$ je nepravdivý, platí automaticky jako pravda ($1$). Např. *"Všechny molekuly bez atomů uhlíku jsou proteiny"*.

#### 7. Jak bezpečně znegovat výrok s kvantifikátory $\forall x \exists y$?
Zaměníte $\forall \to \exists$, $\exists \to \forall$ a znegujete pouze vnitřní formuli: $\exists x \forall y \neg P(x, y)$.

#### 8. Jaký je rozdíl mezi Cut Property a Cycle Property u MST?
- **Cut Property:** Nejlehčí hrana řezu **musí** patřit do MST.
- **Cycle Property:** Nejťažší hrana cyklu **nemůže** patřit do žádné MST.

#### 9. Proč Dijkstrův algoritmus nefunguje se zápornými vahami hran?
Protože záporná hrana může snížit délku cesty i po vyřízení uzlu v haldě, čímž poruší chování greedy invariantu.

#### 10. Kolik bodů na zkoušce tvoří matematické důkazy z grafů?
Teoretické důkazy a invarianty tvoří typicky **40–50 % celkového počtu bodů u zkoušky z AG1**.

---

## 💬 Citáty Velkých Počítačových Vědců

> *"Informatics is no more about computers than astronomy is about telescopes."*  
> — **Edsger W. Dijkstra**

> *"Beware of bugs in the above code; I have only proved it correct, not tried it."*  
> — **Donald E. Knuth**

> *"Simplification is the first step toward mastery."*  
> — **Leonhard Euler**

---

> ➡️ **Začněte studium nulovým modulem:** [0 · Biologická intuice & Jazyk grafů](./dml-bio-grafy)
