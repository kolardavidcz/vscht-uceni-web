# 4 · Struktura kódu

## Obecně

* Všechny algoritmy jdou (zatím) často vměstnat do **2 (for/while) cyklů** - později zjistíte, kdy už to není pravda.
* **Přehlednost kódu je důležitější** než počet proměnných nebo podmínek.

## Krátký checklist pro PA1

* **Jedna funkce ≈ jedna jasná práce** (ne „načti + spočítej + vytiskni + ještě něco“ v jednom monobloku, pokud to nemusíš).
* **Pojmenuj proměnné** tak, abys za týden věděl, co jsou zač (ne `a1`, `tmp2`, `x` všude).
* Méně vnoření (a pokročilejší metoda radši více `return` - např. při chybě vstupu) je lepší než pyramidka `if` v `if` v `for`.
<iframe src="https://www.youtube.com/embed/CFRhGnuXG-4?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

* Komentář, který jen opakuje řádek kódu, nepomáhá; komentář „proč“ jsem se takto rozhodl ano.

<iframe src="https://www.youtube.com/embed/Bf7vDBBOBUA?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

* Neoptimalizuj předčasně - nejdřív správně napiš úlohu, pak (když máš čas) se můžeš pustit do času - měř (`perf`) a řeš složitost.

<iframe src="https://www.youtube.com/embed/tKbV6BpH-C8?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

* **Jeden obří `main`** bez funkcí - v praxi u zkoušky často končí neúspěchem. Funkce = kámoš na debug (testuješ po kusech).  
* **Žádné struktury** - data, která patří k sobě, dej do `struct` (např. dynamická paměť).

<div class="my-6 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
<div>
<div class="font-bold text-stone-900 dark:text-stone-100 text-sm">Časté chyby a postup u zkoušky</div>
<div class="text-xs text-stone-600 dark:text-stone-400">Přehled typických pastí, práce s pamětí a taktika výběru úlohy od vyučujících prosemináře.</div>
</div>
<a href="/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska" class="wiki-btn shrink-0">
<span>5 · Progtest a zkouška</span>
<span>→</span>
</a>
</div>
