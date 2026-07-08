# 🎓 Obecný průvodce studiem & Tipy (VŠCHT Survival Kit)

Vítejte na VŠCHT! Studium zde (a obzvláště bioinformatiky, která kombinuje chemii, biologii a informatiku) je maraton, nikoli sprint. Tato stránka obsahuje základní praktické tipy, jak si usnadnit život, nezbláznit se z kvanta učiva a efektivně organizovat svůj čas a studijní materiály.

---

## 🚀 Rychlý rozcestník (VŠCHT 101)

Abyste nemuseli složitě dohledávat základní odkazy, zde je rychlá startovací sada:

* **Informační systémy:** [SIS VŠCHT](https://sis.vscht.cz/) a [Moodle VŠCHT](https://e-learning.vscht.cz/)
* **Studijní literatura:** [VŠCHT nakladatelství](https://vydavatelstvi.vscht.cz/) (mnoho skript je dostupných zdarma v elektronické verzi pro studenty) nebo [starší e-learningový archiv skript](https://e-learning.vscht.cz/course/view.php?id=1076).
* **Wi-Fi připojení:** Pro snadné nastavení připojení k síti eduroam se připojte z budovy VŠCHT, popřípadě si stáhněte certifikát z [webu školy](https://vc.vscht.cz/navody/sit/wi-fi)
* **NTK Tisk:** Nejspolehlivější tisk v NTK je při stažení [speciálního insalačního programu](https://www.techlib.cz/cs/2912-jak-nainstalovat-ntk-tiskarny-na-vlastni-zarizeni) na Windows (a možná i macOS)
* **Oslovování vyučujících:** Nevíte, jak oslovit vyučujícího? Pomůže vám [Titulátor](https://titulator.smid.io/). Zapamatujte si základní pravidlo: *vždy oslovujeme nejvyšším dosaženým titulem*.

---

## 📝 Jak efektivně dělat zápisky z přednášek

### 1. Offline přednášky (v posluchárnách)
* **Zápisky rukou vs. na počítači:** Výzkumy ukazují, že zapisování si poznámek rukou (na papír nebo tablet se stylusem) je mnohem efektivnější pro zapamatování než psaní na klávesnici nebo podtrhávání prezentací. Nutí vás to totiž informace syntetizovat a přeformulovat, nikoli jen mechanicky přepisovat.
    * **Double-screen strategie:** Mějte prezentaci otevřenou na mobilu nebo tabletu vedle sešitu. Usnadní vám to doplňování poznámek k předchozím slajdům, pokud vyučující kliká příliš rychle.
    * **Tisk klíčových přehledů:** Pokud si píšete poznámky do tabletu, vytiskněte si nejdůležitější tabulky (např. periodickou tabulku, tabulku aminokyselin nebo přehled derivací) na papír. Je nesmírně otravné neustále překlikávat mezi poznámkami a tabulkou.

### 2. Online přednášky a záznamy
* **Přeskakování ticha:** Pokud sledujete nahrané přednášky, nainstalujte si rozšíření do prohlížeče, které automaticky přeskakuje tiché pasáže – například [Jump Cutter pro Chrome](https://chromewebstore.google.com/detail/jump-cutter/lmppdpldfpfdlipofacekcfleacbbncp) a Ušetří vám to až 20 % času. Navíc vám přidá možnost si v nastavit klávesové zkratky.

---

## 💻 Práce s kódem a psaní protokolů

Při dělání zápisků z programovacích předmětů se může hodit vkládat kód do zápisků, ale Word standardně neumí hezky formátovat kód. Proto vyzkoušejte:

1. **Doplněk:** [Easy Syntax Highlighter](https://appsource.microsoft.com/en-us/product/office/wa200000011?tab=overview). Umožňuje barvit kód přímo ve Wordu. Zkuste světlá témata *A11y Light* a tmavé *Tomorrow Night*.
2. **Automatické formátování maker:** Pokud kopírujete kód v písmu `Courier New` (velikost 11), následující VBA makro jej automaticky převede na moderní a čitelnější `Consolas` (velikost 9) a tabulkám nastaví profesionální tmavé pozadí `#1E1E1E`:

```
Sub CodeFiX()
    Dim rng As Range
    Dim tbl As Table
    Dim found As Boolean
    
    '# --- Krok 1: Změna písma z "Courier New" (11pt) na "Consolas" (9pt) ---
    Set rng = ActiveDocument.Content
    rng.Find.ClearFormatting
    rng.Find.Replacement.ClearFormatting
    
    With rng.Find
        .Font.Name = "Courier New"
        .Font.Size = 11
        .Text = ""
        .Forward = True
        .Wrap = wdFindStop
        .Format = True
        .MatchCase = False
        .MatchWholeWord = False
    End With
    
    Do While rng.Find.Execute
        found = True
        rng.Font.Name = "Consolas"
        rng.Font.Size = 9
        rng.Collapse wdCollapseEnd
    Loop
    
    '# --- Krok 2: Nastavení barvy pozadí tabulek na #1E1E1E (tmavý režim) ---
    For Each tbl In ActiveDocument.Tables
        tbl.Shading.BackgroundPatternColor = RGB(30, 30, 30) ' #1E1E1E v RGB
    Next tbl
    
    '# --- Upozornění uživatele ---
    If found Then
        MsgBox "Formátování kódu a barev tabulek proběhlo úspěšně.", vbInformation, "Hotovo"
    Else
        MsgBox "Text v písmu 'Courier New' (11pt) nebyl nalezen, ale pozadí tabulek bylo upraveno.", vbExclamation, "Částečně hotovo"
    End If
End Sub
```