# 🚀 Prázdniny s programováním (Přechod na C++ a Algoritmy)

<div class="bg-indigo-50/80 border border-indigo-200/60 border-l-4 border-indigo-500 p-4 my-6 rounded-r-2xl shadow-sm text-indigo-950 font-medium transition-all hover:shadow-md">
📂 <strong>Moje zápisky z prázdnin:</strong> <a href="https://drive.google.com/drive/u/0/folders/1cKcxsrkuBaDtKWoghZcUiU-G7Nk5MC4N" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-500 font-bold underline inline-flex items-center gap-1">Google Disk – zápisky a materiály <span class="text-[10px] opacity-70">↗</span></a>
</div>

Tento rozcestník pokrývá přechod od strukturovaného jazyka C k objektovému C++ a základní vyhledávací algoritmy.

---

## 🚀 PA2: Přechod z C do C++ (Klíčové rozdíly)

C++ staví na C, ale přináší moderní abstrakce, které vám ušetří práci s ruční správou paměti:

1. **Reference (`&`)**: Místo ukazatelů (`int * x`) můžete předávat hodnoty referencí (`int & x`). Kód je čistší, protože nemusíte psát hvězdičky a ampersandy při volání:
   ```cpp
   void zvetsi(int & hodnota) {
       hodnota++; // Měníme přímo originální proměnnou
   }
   ```
2. **Kontejnery (`std::vector`, `std::string`)**: Zapomeňte na `char[]` a ruční alokaci polí. `std::vector` se automaticky zvětšuje a sám uvolní paměť, jakmile proměnná zanikne:
   ```cpp
   #include <vector>
   #include <string>
   
   std::vector<int> cisla = {1, 2, 3};
   cisla.push_back(4); // Automaticky alokuje paměť pro čtvrtý prvek
   ```
3. **Objekty a třídy**: Seskupování dat a funkcí, které nad nimi pracují, do jednoho celku.

### 📚 Studijní zdroje pro PA2:
* **Praktické materiály**: [Gitlab cvičení od dr. Matouška (Praktická teorie + Úlohy)](https://gitlab.fit.cvut.cz/matouj10/pa2-2022-lab/-/tree/master/lab?ref_type=heads)
* **Teorie grafů v PA2**: [Praktické úlohy na grafy](https://gitlab.fit.cvut.cz/matouj10/pa2-2022-lab/-/tree/master/lab/06-solution/2-graph)
* **Kompilátory a syntaxe**: [Materiály pro cvičení z PA2](https://gitlab.fit.cvut.cz/matouj10/pa2-2022-lab/-/tree/master/lab/07?ref_type=heads)

---

## 📊 AG1: Dva základní průchody grafem

| Algoritmus | Datová struktura | Princip | Využití |
| :--- | :--- | :--- | :--- |
| BFS (Prohledávání do šířky) | Fronta (FIFO) | Prochází graf po "vlnách" (nejdříve sousedé, pak sousedé sousedů). | Hledání nejkratší cesty v neohodnoceném grafu. |
| DFS (Prohledávání do hloubky) | Zásobník (LIFO) / Rekurze | Jde co nejdále po větvi, dokud nenarazí na konec, pak se vrací (backtracking). | Detekce cyklů, topologické uspořádání. |

---

## 📚 Doporučené studijní zdroje (Programování a C++)

Přechod na C++ a objektové programování (PA2) vyžaduje kvalitní dokumentaci a pravidelné zkoušení. Zde jsou ty nejlepší zdroje:

* 📖 **[LearnCpp.com](https://www.learncpp.com/)** – Světově nejlepší bezplatný tutoriál na C++. Pokrývá vše od základních datových typů až po pokročilou správu paměti, šablony a výjimky. Doporučuje ho většina vyučujících na FITu.
* 🌐 **[cppreference.com](https://en.cppreference.com/)** – Kompletní referenční příručka standardní knihovny C++. Klíčové místo pro rychlé vyhledání funkcí u kontejnerů jako `std::vector`, `std::map`, `std::set`, atd.
* 📚 **[FIT-Wiki BI-PA2](https://fit-wiki.cz/skola/predmety/pa2/start)** – Studentská wiki obsahující užitečné tipy na semestrální projekty, minulé testy a zkouškové otázky.

### 💡 Tipy, jak úspěšně projít PA2 (a přežít Progtest):
1. **Naučte se pracovat s Valgrindem:** C++ vyžaduje ruční správu paměti (pokud nepoužíváte chytré ukazatele). Progtest kontroluje úniky paměti. Vždy lokálně testujte spuštěním přes Valgrind:
   `valgrind --leak-check=full ./a.out`
2. **Dodržujte pravidlo RAII:** (Resource Acquisition Is Initialization). Když alokujete paměť přes `new`, ujistěte se, že se v destruktoru uvolní přes `delete`. Nejlépe však používejte moderní C++ kontejnery (`std::vector`, `std::unique_ptr`), které se čistí samy.
3. **Nepodceňte semestrální projekt:** Projekt z PA2 (často tvorba komplexní textové hry, spreadsheet kalkulátoru nebo archivu) bývá časově nejnáročnější úkol semestru. Začněte na něm pracovat okamžitě po zadání!