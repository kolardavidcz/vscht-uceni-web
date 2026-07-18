# Windows s nástroji Linux (WSL)

Zdroj: [https://bioinformatika.moodiy.science/mod/page/view.php?id=17](https://bioinformatika.moodiy.science/mod/page/view.php?id=17)

---

* Nastavení BIOSu (před spuštěním systému) se může lišit podle výrobce počítače, nicméně budete muset povolit tzv. ****

* Video se na začátku a konci věnuje vývojovému prostředí VS Code. Vy se můžete soustředit jen na ****. Pokud používáte CLion, stačí v Nastavení / Build, Execution, Deployment / Toolchain přidat WSL pomocí symbolu „+“ (vlevo nahoře) a vybrat WSL



<iframe src="https://www.youtube.com/embed/wOimgBphkE0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>


Doplňující nastavení:


****


Kontrola aktuality





*  wsl --update


nastavení WSL na verzi 2


Výpis stažených distribucí





* wsl --list --verbose


Pokud máte "VERSION 1" 





* wsl --set-version <NÁZEV VAŠEHO OPERAČNÍHO SYSTÉMU> 2


nebo ocecně





* wsl --set-default-version 2




WSL nastavení


Instalace plugynů





* sudo apt install build-essential gdb clang-format valgrind -y



* Základní pack - kompilátory (gcc, g++), ulehečení zprávy projektu (make, ...)

* GDB (debugger)

* clang-format (kontrola syntaxe)

* Valgrind (nástroj na kontrolu dynamické paměit. viz druhá polovna semestru)







Update





* sudo apt update && sudo apt upgrade -y
