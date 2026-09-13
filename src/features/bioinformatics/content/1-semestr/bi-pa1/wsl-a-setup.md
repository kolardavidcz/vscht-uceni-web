# 1 · WSL a vývojové prostředí

> 💡 **ZLATÉ PRAVIDLO: NEJDŘÍV PROGRAMOVAT, AŽ PAK LADIT PROSTŘEDÍ!**  
> Nejdůležitější je **okamžitě začít psát kód**, ne se na dny zaseknout na ladění prostředí. Pokud vám WSL nebo IDE hned nenaskočí, otevřete si online kompilátor [OnlineGDB](https://www.onlinegdb.com/) a programujte přímo v prohlížeči.  
> **Při nastavování se nebojte ptát AI (ChatGPT / Claude / Gemini)** - zkopírujte jí chybovou hlášku, model notebooku nebo problém s BIOSem a dostanete přesné řešení na míru.

---

## Proč Linux / WSL pro BI-PA1?

Na FITu i v bioinformatice se pracuje v **Linuxu**. Úlohy v C se na Windows a Linuxu chovají odlišně (práce s pamětí, kompilátory, kontrola v Progtestu). Nejjednodušší cestou na Windows bez nutnosti přeinstalace je **WSL (Windows Subsystem for Linux)** - plnohodnotné linuxové prostředí běžící přímo uvnitř Windows.

---

## Krok 1 - Instalace WSL

Otevřete **PowerShell jako administrátor** a spusťte:

```powershell
wsl --install
```

Windows stáhne Ubuntu a po restartu nastavíte své uživatelské jméno a heslo. *(Pokud instalace hlásí chybu virtualizace, je nutné v BIOSu povolit VT-x / AMD-V - zeptejte se AI podle výrobce svého notebooku).*

<iframe src="https://www.youtube.com/embed/wOimgBphkE0?rel=0&wmode=transparent" class="w-full aspect-video rounded-xl my-4 border border-slate-200/85 shadow-sm" allowfullscreen></iframe>

---

## Krok 2 - Vývojářské nástroje

V nově otevřeném terminálu **Ubuntu** nainstalujte potřebnou výbavu jediným příkazem:

```bash
sudo apt update && sudo apt upgrade -y && \
sudo apt install -y build-essential gdb clang-format valgrind
```

Tím získáte kompilátory `gcc` / `g++` (`build-essential`), debugger `gdb` pro krokování kódu, automatický formátovač `clang-format` a detektor úniků paměti `valgrind` (klíčový pro druhou polovinu semestru; viz [Jak to spravit](/obor-bioinformatika/1-semestr/bi-pa1/jak-to-spravit)).

---

## 🛠️ Užitečné tipy z FITu

* **Nastavení CLionu s WSL**: V menu *Settings $\to$ Build, Execution, Deployment $\to$ Toolchains* klikněte na `+` a zvolte **WSL**. CLion automaticky najde `gcc`, `gdb` i `clang-format` uvnitř vašeho Ubuntu (studenti mají univerzitní licenci JetBrains zdarma).
* **Kritické pravidlo pro Dual-boot**: Pokud preferujete nativní Linux vedle Windows, vždy instalujte **nejprve Windows a až poté Linux**! Zavaděč Linuxu (GRUB) automaticky detekuje Windows a vytvoří spouštěcí nabídku. V opačném pořadí Windows instalátor zavaděč Linuxu přepíše.
* **Zářijová hromadná instalace na FITu**: Koncem září pořádá studentský klub na FIT ČVUT instalační den, kde vám starší studenti rádi pomohou s nastavením WSL, čistého Linuxu i ovladačů.

---

### Doplňující nastavení verze WSL

Pokud WSL nefunguje podle očekávání, ověřte verzi příkazem:

```powershell
wsl --update && wsl --list --verbose
```

Pokud vidíte `VERSION 1`, přepněte na moderní WSL 2:

```powershell
wsl --set-default-version 2
```
