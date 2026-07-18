# SUS errory

Zdroj: [https://bioinformatika.moodiy.science/mod/page/view.php?id=153](https://bioinformatika.moodiy.science/mod/page/view.php?id=153)

---

####



#### Kompilace a chyby ve struktuře


**** `g++` Používané volby:
`g++ ./main -o "main" -pedantic -Wall -std=c++20`


Pokud vám Progtest strhne body za strukturu kódu a `g++` s kontrolami nic neříká, zkuste druhý kompilátor:
`clang ./main -o "main" -pedantic -std=c23`


Progtest má v kategorii **** kompilátor nastavený stejně jako kontroly vašich úkolů. Můžete si tam kód zkontrolovat.



##### Zakázaná slovíčka


Kromě C klíčových slov v jsou zakázána i: *new, delete, private, public, protected*



#### Testování Paměti (Memory Leaks)


Pro kontrolu paměti použijte jednu z možností (nelze kombinovat):





* 
**** Přidejte kompilační volbu `-fsanitize=address`.




* 
**** Spusťte program s `valgrind --leak-check=full ./main`.






#### Strhnuté body za vracení NULL místo nullptr


Pokud vám C píše, že nezná klíčové slovo nullptr (stává se, když máte nastavenou verzi před C23), použijte toto na začátku kódu hned po #include



```c
#ifndef nullptr
#define nullptr NULL
#endif
```



#### Debugging: Zobrazování polí



##### Zobrazování polí (Arrays)





* 
**** Jednoduše pomocí syntaxe `ARRAY_NAME[SIZE]`




* 
**** `(T(*)[SIZE])ARRAY_NAME`, kde `T` je datový typ pole (např. `int`, `double`, `char`, ...)






#### printf se nevypisuje hned





* 
Standardní `printf` se nemusí hned vypsat (typické pro C v CLion). Výstup se objeví až po ukončení programu.




* 
Řešení rovnou za printf napište fflush(stdout) - vynutí se okamžitý *vylití* textu






```c
printf("TEXT\n");
fflush(stdout);
```
