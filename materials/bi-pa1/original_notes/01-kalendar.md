# PA1 Kalendář co musím umět

Zdroj: [https://bioinformatika.moodiy.science/mod/page/view.php?id=174](https://bioinformatika.moodiy.science/mod/page/view.php?id=174)

---

* 

### ****





* 
Kompilace C: Viz  *Set Up*  nebo sekce v *Příručce prváka* . Poslední krátkodobá naděje je [online kompiler](https://www.onlinegdb.com/)




* naučte se ****

* 
Zjistěte si, proč má kód tuto základnístrukturu:





* 

```c
#include 

int main() {
printf("Hello World");
return 0;
}
```







* 
**** `g++ ./main -std=c++20 -pedantic -Wall -Wextra`







* 

### ****





* printf(), scanf()

* Debugging - Jde o možnost se v každém kroku programu podívat, jaká hodnota je v proměnných a kudy program vlastně jde.



* ZEPTEJTE SE CVIČÍCÍHO / staršího studenta

* reálně jsem nenašel video, který by debugging v C dobře vysvětlovalo







* 

### ****





*

<iframe src="https://www.youtube.com/embed/bbkcEiUjehk?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>



* [Interaktivní Float/Double](https://float.exposed/0x5cbf9401)

* 
Matematika začíná být těžší: hodí se googlit různé vzorečky, které neznáte ze střední (např. pro Největšího společného dělitele a Nejmenší společný násobek).




* Zjišťování edge cases



* 
**** Začněte používat papír a počítejte/procházejte si, jak se který vstup vyhodnotí. Mohou pomoci ****, díky kterým si váš **** nakreslíte (viz i

<iframe src="https://www.youtube.com/embed/Yq1OPs5hCt0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

)




* Začněte používat papír a počítejte/procházejte si, jak se který vstup vyhodnotí. Mohou na to pomoci FlowChars, díky kterým si váš algorytmus nakreslíte 







* ?



* 
Prozatím lze všechny algoritmy "fintou" dostat do **** (později sami zjistíte, kdy už to není pravda).




* pokud je se v zadání objeví slovo "maska", tak to bude nekomfortní úkol (aka. pondělí se značí jako 1000000, úterý jako 0100000, víkend 0000011, ...)




* ?

* ? Pole a řetězce



* úlohy začínají být jednodušší na matematiku a spíš testují programování




* Pochopit ukazatele



##### Moje analogie s jablky a šuplíky


Máme 11 jablek





* 
Máme 11 jablek. Pokud někomu předáme papírek s **** `11` (předali jsme hodnotou):




* 
Pokud se ale počet jablek změní (např. se nějaké sní) tak i když si to někdo na tom papírku přepíše (aktualizuje hodnotu jablekVeFunkci ) tak my tuto změnu nevidíme






```c
void mojeFunkce( int jablekVeFunkci ); //pro kompiler musím před zavoláním funkce napsat alespoň její hlavičku

int main() {
int pocetJablek = 11;
mojeFunkce( pocetJablek ); // předáváme papírek s kopií hodnoty "jablka"
return pocetJablek; // vidíme 11. To že si někdo na papírku něco přepsal, bohužel nevidíme.
}

void mojeFunkce( int jablekVeFunkci ) {
jablekVeFunkci = 9;
// Změnili jsme jen hodnotu na kopii papírku, originál zůstal beze změny.
}
```



###### Pointers





* Řešení je, že si místo počtu, předáme **** (paměťového místa). kam si náš počet jablek budeme ukládat a z něho číst.

* V C/C++ má `*` hvězdička 2 významy



* `int * variable` - při deklaraci variable (po datovém typu) nám říká, že to není pouhý int, ale že to je datový typ obsahující adresa na schovku (aka. kde máme hodnotu uložený např. int)

* `*variable` - před variable nám říká: jdi na místo schovky a pracuj s hodnotou uvnitř.




* V C má`&` následujíí význam



* Každá proměnná je uložená v nějaké schovce a má tedy svou adresu. Adresu (ukazatel) lze získat pomocí `&variable`






```c
void mojeFunkce2( int * jablekVeFunkci ); //pro kompiler musím před zavoláním funkce napsat alespoň její hlavičku

int main () {
int pocetJablek = 11; // Vytvoříme si int s hodnotou 11
int * ukazatelNaJablka = &pocetJablek; // Vytvoříme ukazatel a uložíme do něj adresu (ampersantem &) jablek
mojeFunkce2 ( ukazatelNaJablka ); // Předáváme adresu schránky
return pocetJablek; // Nyní vidíme, že jablek je 9 (Původní proměnná byla změněna.)
}

void mojeFunkce2 ( int * jablekVeFunkci ) {
*jablekVeFunkci = 9; // Na adrese schránky přepíšeme hodnotu na 9.
}
```



###### Pole (Předávání více hodnot)





* Abychom si nemuseli předávat adressy na hromadu schovek, můžeme se domluvit, že si **** My si pak předáme adresu na **** a ****(např. ****) ****, kam si naše data budeme ukládat. (např. akciové ceny jablek za tento měsíc si uložíme v téhle schránce a dalších 30 schránek od ní doprava)

* 
Schránky si rezervujeme ve formátu `datovýTyp variable[VELIKOST_POLE]`.






```c
int main () {
int akciovéCenyJablek[30]; // Vytvoříme si schránku o velikosti 30
for(int i = 0; i < 30; i++) {
// ... dosadíme si správné hodnoty akcií ...
}

mojeFunkce3 ( akciovéCenyJablek, 30); // Předáváme adresu prvního prvku a počet.
//...
}

void mojeFunkce3 ( int * odkazNaPrvníSchránku, int delka ) { // Pole se přenáší jako int*
//... hodnoty akcií můžeme upravovat pomocí indexování: odkazNaPrvníSchránku[i]
}
```



###### Více dimenzionální pole


**** Uložit měsíční (30 dní) akciové ceny **** (více druhů).
Primitivní Způsob (Jednorozměrné Pole)
****





* Využít jedno dlouhé pole a dohodnout se na indexování.

* **** Můžeme se dohodnout, že každých **** (indexů) budeme měnit typ ovoce.

* **** Nepotřebuje složitou syntaxi ukazatelů. **** Indexování (výpočet, kde začíná dané ovoce) je složité.


Komplexnější Způsob - Pole Ukazatelů





* **** Vytvořit pole, kde každý prvek odkazuje na samostatné pole cen.



* 
**** Uděláme si hlavní pole schránek (pro každý druh ovoce jednu)




* 
. **** Každá schránka v hlavním poli bude obsahovat **** (ukazatel) na další, menší pole, kde jsou uložené jeho akciové ceny







* ****



* 
**** si zarezervujeme schránky pro každý typ ovoce i všechny ceny akcií.









```c
void mojeFunkce4 ( int odkazNaPrvníSchránku[100][30], int vKolikaNásledujícíchŠuplícíchMámHledatOvoce, int vKolikaNásledujícíchŠuplícíchMámHledatCeny );

int main () {
int typyOvoce[100][30]; // pronajmeme si 100 schránky které můžeme "rozkliknout" a podívat se na posledních 30 akciových cen
for ( int i = 0 ; i < 100 ; i++ ) {
for ( int j = 0; j < 30; j++) {
// ... dosadíme si správné hodnoty akcií pro každé ovoce ...
}
}

mojeFunkce4 ( typyOvoce, 100, 30); // předáváme adresu schránek a počet typů ovoce a počet akciovýchCen
//...
}

void mojeFunkce4 ( int odkazNaPrvníSchránku[100][30], int vKolikaNásledujícíchŠuplícíchMámHledatOvoce, int vKolikaNásledujícíchŠuplícíchMámHledatCeny ) {
//... hodnoty akcií můžeme upravovat
}
```





* později budete umět vytvořit pole tak, aby se nemusela vědět velikost dopředu. Viz 8. týden. (odkaz [zde](https://pastebin.com/AgpG70bQ))





### 8. ****, ****(CLion ho má cool integrovaný)





* **** – kontroluje paměť, hlásí úniky a chybné čtení/zápisy.

* **** – moderní kompilátorový nástroj (např. v CLionu nebo gcc/clang flag -fsanitize=address), který při běhu odhalí chyby v paměti. `g++ -fsanitize=address -g main.cpp -o main`



### 9. ?



### 10. Stromy 101



### 11. ****a její části





* kontrola podmínky, výpočty, posunutí do nižšího stupně (nemusí být v tomto pořadí) + (přípravná funkce)



### 12. ?



### 13. ?
