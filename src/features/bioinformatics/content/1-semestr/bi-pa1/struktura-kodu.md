# Obecně o struktuře kódu

*Jak psát programy, abyste se z toho nezbláznili — a abyste je vůbec uměli opravit.*

Zpět: [kalendář](/obor-bioinformatika/1-semestr/bi-pa1/01-kalendar) · [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/02-jak-to-spravit)

---

## Obecně

* Všechny algoritmy jdou (zatím) často vměstnat do **2 (for/while) cyklů** — později zjistíte, kdy už ne.
* **Přehlednost kódu je důležitější** než počet proměnných nebo podmínek.

## Krátký checklist pro PA1

* Jedna funkce ≈ jedna jasná práce (ne „načti + spočítej + vytiskni + ještě něco“ v jednom monobloku, pokud to nemusíš).
* Pojmenuj proměnné tak, abys za týden věděl, co jsou zač (ne `a1`, `tmp2`, `x` všude).
* Early return / méně vnoření > pyramidka `if` v `if` v `for`.
* Komentář, který jen opakuje řádek kódu, nepomáhá; komentář „proč“ ano.
* Neoptimalizuj předčasně — nejdřív správně a čitelně, pak (když timeout) měř a řeš složitost.

## Co u zkoušky (a těžkých HW) zabíjí nejvíc

* **Jeden obří `main`** bez funkcí — v praxi u zkoušky často končí neúspěchem. Funkce = kámoš na debug (testuješ po kusech).  
* **Žádné struktury** — data, která patří k sobě, dej do `struct`.  
* **Dynamické pole jako tři volné argumenty** místo struktury → `int **`, priorita `*` vs `[]`/`.`, mizící paměť po `realloc`. Radši struct + helper funkce.  
* Smíchaný vstup + alokace + algoritmus v jedné funkci → nejde najít bug.

Celý seznam 😿 chyb a postupu u úlohy:  
→ [Progtest a zkouška — rady](/obor-bioinformatika/1-semestr/bi-pa1/06-progtest-a-zkouska)

Když Progtest strhne body za strukturu a ty nevidíš proč: [Jak to spravit — clang / pedantic](/obor-bioinformatika/1-semestr/bi-pa1/02-jak-to-spravit).

---

## O struktuře kódu (videa)

### Why You Shouldn't Nest Your Code

<iframe src="https://www.youtube.com/embed/CFRhGnuXG-4?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

### Don't Write Comments

<iframe src="https://www.youtube.com/embed/Bf7vDBBOBUA?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

### Premature Optimization

<iframe src="https://www.youtube.com/embed/tKbV6BpH-C8?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>
