# Progtest (během semestru)
Souvisí: [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit) · [Struktura kódu](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu) · [Kalendář](/obor-bioinformatika/1-semestr/bi-pa1/kalendar)

Progtest je automat na odevzdávání — **hodně citlivý** na přesnost oproti zadání.

**Před submitem**

* Přesný výstup (mezery, konce řádků, hlášky).  
* Edge cases ze zadání, ne jen že to minimálně projde.  
* Lokální sada: [testovací skript](/obor-bioinformatika/1-semestr/bi-pa1/testovaci-skript).  
* Kompilace / paměť / warningy: [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit).  
* Když program na Progtestu padá — **potráp ho většími vstupy** lokálně.

### Co Progtest testuje (typy testů)

| Test | Co dělá |
|------|---------|
| **Základní test podle ukázky** | Spustí program na datech ze zadání. Pokud neprojde na 100 %, je zbytečné ho dávat do Progtestu. |
| **Test mezních hodnot** | Pole délky 0, 1 nebo milión prvků — okrajové podmínky. |
| **Test ošetření vstupních dat** | Nesprávné vstupy (nečíselné tam kde číslo, záporná délka…) — program musí správně odmítnout. |
| **Extenzivní test náhodnými hodnotami** | Větší náhodné vstupy, výsledky se srovnávají s referenčním řešením. |
| **Kontrola práce s pamětí** | Stejně jako extenzivní, ale navíc kontroluje přístupy mimo alokovanou paměť a správné `free`. Za úniky paměti **−30 %**. |

# Příprava na zkoušku (poznámky od přednášejících)

## Znalosti - Teorie je důležitá i v praktické části

*Když nevím X, v praxi se stane Y:*

* Když nevím, co je **struktura**, těžko napíšu přehledný kód.  
* Když nevím, co je **pointer**, těžko si poznamenám místa v paměti k pozdější návštěvě.  
* Když nevím, že **řetězec je zakončený nulovým znakem** (a že na něj potřebuji prostor), budu mít spoustu problémů s pamětí.  
* Když nevím, že **mezera ve formátovacím řetězci ve `scanf` přeskočí všechny bílé znaky**, budu místo toho vymýšlet šílenosti.  
* Když nevím, že (a proč) **`scanf("%s")` nemůže fungovat bezpečně**, budu se divit, proč mi Progtest padá.  
* Když nevím, jak funguje **dynamické pole**, nebudu umět uložit vstupní data.  
* Když nevím, že **realokovat je potřeba geometrickou řadou**, neprojdu nejspíš některou sadou testů na čas.  
* Když nevím, co je **asymptotická složitost**, nevím, kde zrychlit program.  
* Když nevím, že spoustu algoritmů **zrychlím seřazením dat**, budu mít zbytečně málo bodů.  
* Když nevím, jak si **udržovat seřazené pole bez řadicích funkcí**, budu se taky divit, proč mám málo bodů.  
* Když nevím, že ve standardní knihovně existují **`qsort` a `bsearch`**, nevím, jak rozumně řadit a pracovat se seřazeným polem.  
* Když nevím, že **rekurze potřebuje ukončovací podmínku**, nebude mi fungovat.  
* Když nevím, jak je organizovaná paměť (**halda, zásobník, datový segment**) a kdy se co používá, můžu se divit, proč mi padá rekurze nebo proč si nemůžu vracet pointer na lokální proměnnou.

## Funkce, které je dobré znát

* `malloc`, `realloc`, `free` a praktičtí kamarádi `getline`, `strdup`, `strndup`  
* `strcmp`, `strcasecmp`, `strncmp`, `strchr`, `strspn`  
* `isalpha`, `isdigit`, `isalnum`, `islower`, `isupper`, `isspace`, `tolower`, `toupper`  
* `printf` (ten většinou neobcházíte) a **`scanf`** (jeho schopnosti naopak obcházíte často); dál **`sscanf`** (obzvlášť s `%*` a `%n` je silný nástroj)  
* **`qsort` a `bsearch`**

---

## Příprava - Programovat, programovat, programovat

* Vyřeš na Progtestu **domácí úlohu z každého týdne** (vždy aspoň jednu z 3b/5b dvojice); řešit můžeš i **po termínu**.  
* Projdi si úlohy na [Traineru](https://trainer.ksi.fit.cvut.cz/courses/81).  
* Zkus naprogramovat **zkouškové úlohy z předchozích let**; dej si **~2 hodiny** na úlohu.

### Nauč se nástroje

Detaily a příkazy: [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit). Stručně:

* `-Wall -Wextra -pedantic` - nahlásí co nejvíce potenciálních problémů; doporučuji vyřešit všechny 
* `-g` — přidá do zkompilovaného programu ladící informace (např. čísla řádků)  
* `-O2` — neodstraní špatnou složitost; může shodit nekorektní kód  
* `-fsanitize=undefined,address` - přidá do programu kontroly nedefinovaného chování (např. práce s neinicializovanou proměnnou) a kontroly práce s pamětí

* Ladicí nástroj `valgrind` umí spoustu věcí, nás primárně zajímá `memcheck` (výchozí nástroj, když pustíme `valgrind`). 
    * `--leak-check=full` - zjistí bližší informace k neuvolněné paměti (např. čím byla alokována)
    * `--track-origins=yes` - detekuje práci s neinicializovanou pamětí
    * Valgrind **nikdy** se nezpouštíme s programem, co byl zkompilován s `-fsanitize`

---
## Časté chyby u zkoušky

### 😿 Nepoužívání funkcí

Velice často student napíše **jednu dlouhou `main`**, maximálně jednu malou pomocnou. V **~90 %** takových případů zkoušku nezvládne.

Funkce není nepřítel. Funkce je kámoš. Investujte čas do psaní ve funkcí... bohatě se vrátí v snadnějším hledání a opravování chyb, protože můžu každou funkci testovat zvlášť a každý kus kódu mám pojmenovaný.

→ [Struktura kódu](/obor-bioinformatika/1-semestr/bi-pa1/struktura-kodu)

### 😿 Nepoužívání struktur

Bez rozumné organizace dat se nikam nedostaneš. Ve zkouškových úlohách data spolu souvisí — **struktury** jsou přirozená reprezentace.

**Typická střela do nohy:** nepoužít strukturu pro dynamické pole. Napíšeš funkci, která realokuje pole předané **třemi argumenty**… program nefunguje, paměť „mizí“, pointer ukazuje pořád stejně… protože pointer na pole musíš předat jako **výstupní argument** (`int **arrayPtr`)… přidáš hvězdičku… a dalším nepřítelem je **priorita operátorů** (`[]`, `.`, `->`, `++`, `--` mají přednost před `*`) — hromada závorek.

Máš na to nervy? Radši **strukturu**.

### 😿 Neinicializované proměnné

V C jsou proměnné běžně **neinicializované** — s hodnotou nemůžeš pracovat, dokud ji nenastavíš. Stejně tak paměť z alokace. To není „bug jazyka“, je to způsob rychlých programů; začátečníky to drtí. Proto sanitizer / Valgrind — [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit).

### 😿 Zbytečná alokace paměti

Příklad: `char **words` — při realokaci **nedává smysl** hned alokovat místo pro každé nové „prázdné“ slovo (`for … words[i] = malloc(WORD_LEN)`). V C je zvyk pracovat s věcmi, **až když je potřebuješ**: alokuj, až víš že použiješ; nastav hodnotu, až ji potřebuješ. Nic nezkazíš polem délky 0 a `NULL` pointerem — první alokaci zařídí `realloc`.

U sekvencí (typicky řetězce) se snaž **vyhnout zbytečnému kopírování** (pomalé + další chyby). Raději algoritmus, který kopíruje co nejméně.

### 😿 Nepoužívání knihovních funkcí

Studenti často vynalézají kolo — chybné a zbytečná práce. Standardní knihovna C není tak velká, aby se nedalo těch pár užitečných funkcí naučit (viz seznam výše).

### 😿 Neefektivní práce se vstupem a s řetězci

* Často: načíst **celý vstup do jednoho řetězce** a pak složitě parsnout. Ve většině případů stačí zpracovávat **po částech** přes `scanf` a známé konverze.  
* Často se nevyužije, že `scanf(" ")` **přeskočí bílé znaky**.  
* Často cyklus se **`strlen`**.  
* Kontrola prázdného řetězce přes `strlen` — stačí `s[0] == '\0'` (nebo `strcmp` s `""`).  
* Špatná práce s **ukončovací nulou** (zapomenutá, nebo naopak její šikovné vložení by zjednodušilo algoritmus).

---

## Postup u úlohy (u zkoušky i u těžkého HW)

### Taktika výběru úlohy

* **Nejjistější:** pořádně rekurze a seznamy — úlohy na to bývají jednodušší.  
* **Dynamická alokace + řetězce** vyžadují sebekázeň a nedělat si rány arzenálem C. Vypadá to přístupněji (bylo dřív v semestru), ale úlohy bývají **náročnější**.  
* **Pročti si obě zadání. Až potom si vyber.**

---

1. **Pozorně si přečti zadání.** I v **poslední poznámce** bývá rada nebo zjednodušení.  
2. **Papír** od dozoru / vedle sebe — nakresli situaci.  
3. Začni od **datových struktur** reprezentujících problém.  
4. Zvýrazni, **co musí být ve výstupu** a s čím se pracuje.  
5. Zjednoduš, co jde.  
    * Ke každé struktuře **operace** a přemýšlej o **asymptotické složitosti**.  
    * Znovu: jde to ještě zjednodušit?  
    * Když nevidíš algoritmus — šlo by **data seřadit** a pak je to snazší?  
9. Až po rozmyšlení **programuj**: nejdřív struktury, pak funkce k nim.  
10. Pořadí (vstup / realloc / jádro) je na tobě — důležité je, aby se různorodé věci **nemíchaly v jedné funkci**.  
11. Otestuj na stažených datech + **všechny ladicí nástroje**.  
12. Padá Progtest → potrápěte lokální program většími vstupy.  
13. V půlce času je pořád ještě možný jít na úlohu rekurze / spojený seznam / řasezní.


## Znalosti ke zkoušce
### Základní obraty

* **Dynamické pole jako struktura** s pomocnými funkcemi.  
* Načítání řádků ze vstupu přes **`getline()`** a jejich zpracování.  
* Průchod řetězce **bez** `strlen()` ve smyčce.  
* Formátovací řetězec ve `scanf` by ideálně měl **končit konverzí**.

### Doporučené obraty
* Reprezentuje-li struktura část vstupu/výstupu → funkce na **čtení/výpis** struktury.  
* **Sklepávání pole** (read a write indexy).  
* Udržování **seřazeného** pole / seznamu.  
* **Binární vyhledávání** v seřazeném poli (klidně umět přepsat myšlenku `std::lower_bound` z cppreference).  
* Procházení seřazených polí/seznamů **najednou** (merge a variace).  
* **Dvojhvězdičkový pointer** na manipulaci seznamu / stromu.  

---

## Trainer před termínem

* [Příprava na zkoušku I](https://trainer.ksi.fit.cvut.cz/lessons/546)  
* [Příprava na zkoušku II](https://trainer.ksi.fit.cvut.cz/lessons/549) · [navazující](https://trainer.ksi.fit.cvut.cz/lessons/550)