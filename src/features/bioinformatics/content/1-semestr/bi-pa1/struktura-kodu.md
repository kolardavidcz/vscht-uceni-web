# Obecně o struktuře kódu

*Jak psát programy, abyste se z toho nezbláznili — a abyste je vůbec uměli opravit.*

Zpět: [kalendář](/obor-bioinformatika/1-semestr/bi-pa1/kalendar) · [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit)

---

## Obecně

* Všechny algoritmy jdou (zatím) často vměstnat do **2 (for/while) cyklů** — později zjistíte, kdy už to není pravda.
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

* Neoptimalizuj předčasně — nejdřív správně napiš úlohu, pak (když máš čas) se můžeš pustit do času - měř (`perf`) a řeš složitost.

<iframe src="https://www.youtube.com/embed/tKbV6BpH-C8?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

* **Jeden obří `main`** bez funkcí — v praxi u zkoušky často končí neúspěchem. Funkce = kámoš na debug (testuješ po kusech).  
* **Žádné struktury** — data, která patří k sobě, dej do `struct` (např. dynamická paměť).

Celý seznam chyb a postupu od učitle prosemináře: [Progtest a zkouška — rady](/obor-bioinformatika/1-semestr/bi-pa1/progtest-a-zkouska)
