/**
 * Module 4: Logický & Důkazový základ
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml-logicky-zaklad.md
 */
import {
  createDocSlide,
  renderDocHeading,
  renderDocParagraph,
  renderDocList,
  renderDocCallout,
  renderDocCode,
  renderDocTable,
  renderSolutionBanner,
  colors,
  fs
} from "../pptx_document_engine.mjs";

export function addModule4Slides(pres) {
  const breadcrumb = "MODUL 4 · 📐 LOGICKÝ & DŮKAZOVÝ ZÁKLAD";

  // --------------------------------------------------------------------------
  // Slide 4.1a: Titul & Cíl kapitoly
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Logický & Důkazový základ", { level: 1, y });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Cíl kapitoly:",
      text: "Ovládnout přesný formální jazyk matematické logiky, získat 100% jistotu v negování složitých kvantifikovaných výroků (∀, ∃, ∃!), bezchybně rozlišovat nutnou a postačující podmínku a osvojit si 4 základní důkazové šablony pro zápočtové testy a zkoušku z AG1 na FIT ČVUT.",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.1b: 🌱 Než začneme: Proč se biologové učí logiku?
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Úvod" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🌱 Než začneme: Proč se biologové učí logiku?", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Představ si, že zkoumáš nový protein. Kolega tvrdí: *„Pokud je tento gen aktivní, pak se protein exprimuje.“* Jenže v experimentu vidíš buňky, kde gen aktivní **není** — a protein se tam taky neobjevuje. Potvrzuje to kolegovo tvrzení, nebo ho vyvrací?",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Příslib této kapitoly:",
      text: "Matematická logika odstraňuje nejednoznačnost přirozeného jazyka. Po přečtení budeš umět přesně přečíst jakékoliv formální tvrzení, bezchybně ho znegovat a zvolit správnou strategii důkazu.",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.2a: 1. Úvod do Matematické Logiky & Definice Výroku
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "1. Úvod do Matematické Logiky", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V běžném jazyce bývají biologická a chemická tvrzení často mnohoznačná. V počítačové vědě a teoretické informatice však musíme formulovat myšlenky tak, aby neexistovala žádná pochybnost o jejich pravdivosti.",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Definice Výroku:",
      text: "Výrok je oznamovací věta, o níž má smysl prohlásit, zda je **pravdivá (značíme 1, True, T)** nebo **nepravdivá (značíme 0, False, F)**.",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.2b: Příklady výroků v Bioinformatice & Matematice
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "1. Úvod do Logiky" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Příklady v Bioinformatice & Matematice:", { level: 3, y });

    renderDocList(slide, [
      "„Molekula vody obsahuje 2 atomy vodíku.“ ➔ **Výrok (Pravdivý = 1)**.",
      "„Kofein má sumární chemický vzorec C₈H₁₀N₄O₂.“ ➔ **Výrok (Pravdivý = 1)**.",
      "„Číslo 17 je prvočíslo.“ ➔ **Výrok (Pravdivý = 1)**.",
      "„Tento kód v C++ je pěkný.“ ➔ **NENÍ výrok** (subjektivní hodnocení, nelze jednoznačně určit 0 nebo 1).",
      "„Kolik prvků má množina V?“ ➔ **NENÍ výrok** (otázka)."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.3: 2. Výrokové Spojky a Pravdivostní Tabulky
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2. Výrokové Spojky a Pravdivostní Pravidla", { level: 2, y, showUnderline: true });

    y = renderDocTable(slide, {
      headers: ["Symbol", "Název", "Zápis", "Význam v češtině", "Pravdivostní pravidlo"],
      rows: [
        ["¬", "Negace", "¬A", "Není pravda, že A", "Obrátí pravdivostní hodnotu (1 ➔ 0, 0 ➔ 1)."],
        ["∧", "Konjunkce", "A ∧ B", "A a zároveň B", "Pravda pouze v případě, že OBA výroky platí."],
        ["∨", "Disjunkce", "A ∨ B", "A nebo B", "Pravda, pokud platí ALESPOŇ JEDEN z výroků."],
        ["⇒", "Implikace", "A ⇒ B", "Jestliže A, pak B", "Nepravda POUZE když A platí a B neplatí (1 ⇒ 0)."],
        ["⇔", "Ekvivalence", "A ⇔ B", "A právě tehdy, když B", "Pravda, pokud mají A i B STEJNOU hodnotu."],
        ["∀", "Všeobecný kvantifikátor", "∀x ∈ M : P(x)", "Pro každý prvek x...", "Pravda, pokud P(x) platí pro VŠECHNY prvky."],
        ["∃", "Existenční kvantifikátor", "∃x ∈ M : P(x)", "Existuje alespoň jedno x...", "Pravda, pokud P(x) platí pro ALESPOŇ JEDEN prvek."],
        ["∃!", "Jednoznačná existence", "∃!x ∈ M : P(x)", "Existuje právě jedno x...", "Pravda, pokud existuje PŘESNĚ JEDEN prvek splňující P."]
      ],
      colWidths: [1.0, 2.3, 1.8, 2.7, 3.933],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.4: 📐 Doplňkové symboly (Množiny & Formální logika v BI-DML)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📐 Doplňkové symboly (Množiny & Formální logika v BI-DML)", { level: 2, y, showUnderline: true });

    y = renderDocTable(slide, {
      headers: ["Symbol", "Význam symbolu", "Formální popis & Definice"],
      rows: [
        ["⊤", "tautologie", "Výroková formule, která je vždy pravdivá (hodnota 1) při libovolném ohodnocení (např. A ∨ ¬A)."],
        ["⊥", "kontradikce", "Výroková formule, která je vždy nepravdivá (hodnota 0) při libovolném ohodnocení (např. A ∧ ¬A)."],
        ["E ⊨ F", "logický důsledek", "Formule F je sémantickým důsledkem E; každý model formule E je i modelem F."],
        ["E ≡ F", "logická ekvivalence", "Formule E a F jsou sémanticky ekvivalentní; mají shodné ohodnocení ve všech modelech."],
        ["x ∈ M, x ∉ M", "náležení / nenáležení", "x ∈ M znamená, že prvek x patří do množiny M; x ∉ M ⇔ ¬(x ∈ M)."],
        ["A ⊆ B, A ⊊ B", "podmnožina / vlastní", "A ⊆ B ⇔ (∀x : x ∈ A ⇒ x ∈ B); vlastní podmnožina navíc vyžaduje A ≠ B."],
        ["A ∪ B, A ∩ B, A ∖ B", "sjednocení, průnik, rozdíl", "A ∪ B = {x | x ∈ A ∨ x ∈ B}, A ∩ B = {x | x ∈ A ∧ x ∈ B}, A ∖ B = {x | x ∈ A ∧ x ∉ B}."],
        ["∅", "prázdná množina", "Množina neobsahující žádný prvek; |∅| = 0, je podmnožinou každé množiny (∅ ⊆ A)."],
        ["(n nad k)", "kombinační číslo", "Počet všech k-prvkových podmnožin n-prvkové množiny: n! / (k! · (n-k)!)."]
      ],
      colWidths: [1.8, 2.7, 7.233],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.5: 2.1 Mnemotechnika Implikace: Student vs. Učitel
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2.1 Mnemotechnika Implikace ($A \\Rightarrow B$): Student vs. Učitel", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Studenti VŠCHT nejčastěji chybují v pravdivosti **implikace**, pokud je předpoklad nepravdivý. Jak si to okamžitě a bezpečně zapamatovat?\n**Mnemotechnika: Kdo z koho (1. Student vs. 2. Učitel):** Zkoušející klade požadavky ($U \\Rightarrow S$):",
      { y }
    );

    y = renderDocTable(slide, {
      headers: ["1. Student (S)", "2. Učitel (U)", "Výsledek pro studenta", "Logická vazba", "Didaktické zhodnocení situace"],
      rows: [
        ["1 (Umí)", "1 (Umí)", "1 (GOOD)", "1 ⇒ 1 = 1", "Student umí, učitel umí. Férová debata, student obhájí a má zkoušku v kapse (OK)."],
        ["1 (Umí)", "0 (Neumí)", "1 (GOOD)", "0 ⇒ 1 = 1", "Student umí, učitel neumí (neví na co se ptát). Student exceluje a projde (GOOD)."],
        ["0 (Neumí)", "0 (Neumí)", "1 (GOOD)", "0 ⇒ 0 = 1", "Student neumí, učitel taky neumí (dá to všem). Nikdo nic neodhalil ➔ projde (Triviální pravdivost)."],
        ["0 (Neumí)", "1 (Umí)", "0 (KATASTROFA)", "1 ⇒ 0 = 0", "Student neumí a učitel umí. Okamžitě nachytán a vyražen s nulou! JEDINÁ NULA!"]
      ],
      colWidths: [1.8, 1.8, 2.2, 1.8, 4.133],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "warning",
      title: "Triviální Pravdivost (Vacuous Truth):",
      text: "Pokud je předpoklad A nepravdivý (A = 0), je implikace A ⇒ B VŽDY PRAVDIVÁ (1), bez ohledu na závěr B! Příklad: „Každá molekula s 0 atomy uhlíku je bílkovina“ je matematicky pravdivý výrok.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.6a: 2.2 De Morganovy Zákony
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2.2 De Morganovy Zákony a Klíčové Logické Ekvivalence", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "**De Morganovy zákony** tvoří základní pravidlo pro distribuci negace přes logickou konjunkci (∧) a disjunkci (∨):",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "note",
      title: "De Morganovy formulace:",
      items: [
        "1. Negace konjunkce: ¬(A ∧ B) ≡ ¬A ∨ ¬B  („Není pravda, že platí A i B zároveň ⇔ Neplatí A, nebo neplatí B.“)",
        "2. Negace disjunkce: ¬(A ∨ B) ≡ ¬A ∧ ¬B  („Není pravda, že platí A nebo B ⇔ Neplatí A a zároveň neplatí B.“)"
      ],
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.6b: Důkaz De Morganova Zákona Pravdivostní Tabulkou
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "2.2 De Morganovy Zákony" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "📊 Důkaz De Morganova Zákona Pravdivostní Tabulkou:", { level: 3, y });

    y = renderDocTable(slide, {
      headers: ["A", "B", "A ∧ B", "¬(A ∧ B)", "¬A", "¬B", "¬A ∨ ¬B"],
      rows: [
        ["0", "0", "0", "1", "1", "1", "1"],
        ["0", "1", "0", "1", "1", "0", "1"],
        ["1", "0", "0", "1", "0", "1", "1"],
        ["1", "1", "1", "0", "0", "0", "0"]
      ],
      colWidths: [1.6, 1.6, 1.7, 1.8, 1.6, 1.6, 1.833],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Závěr tabulky:",
      text: "Sloupce ¬(A ∧ B) a ¬A ∨ ¬B mají ve všech 4 řádcích identickou pravdivostní hodnotu. Ekvivalence je matematicky dokázána!",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.7a: De Morgan v Jazyce C
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "De Morganovy Zákony v Jazyce C (BI-PA1 / PA2)", { level: 3, y });

    const cCode = `// 1. Negace konjunkce: !(A && B) ===> (!A || !B)
// Kontrola rozsahu: hodnota nesmí být mimo povolený interval 0 až 100
if (!(score >= 0 && score <= 100))     // Intuitivní: „když NENÍ uvnitř intervalu"
if (score < 0 || score > 100)          // De Morgan: „když je menší než min NEBO větší než max"

// 2. Negace disjunkce: !(A || B) ===> (!A && !B)
// Kontrola volby: uživatel nezadal 'a' ani 'y'
if (!(ans == 'a' || ans == 'y'))       // Intuitivní: „když nezvolil ani jednu možnost"
if (ans != 'a' && ans != 'y')          // De Morgan: „když nezadal 'a' A ZÁROVEŇ nezadal 'y'"`;

    renderDocCode(pres, slide, cCode, { lang: "C (Podmínky a negace)", y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.7b: De Morgan v Reálném Životě na VŠCHT
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "De Morganovy Zákony v Praxi" });
    let y = 0.85;

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "🧪 Vstup do Laboratoře na VŠCHT (Negace Konjunkce):",
      text: "Vstup je povolen právě když: Plášť a brýle (A) ∧ Bezpečnostní test (B). Do laborky vás NEPUSTÍ (¬(A ∧ B)), pokud nastane ¬A ∨ ¬B — stačí zapomenout brýle, NEBO nemít test!",
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "🚆 Studentská Sleva na Jízdenku (Negace Disjunkce):",
      text: "Sleva platí když: Věk < 18 (A) ∨ Průkaz ISIC (B). Plnou cenu platíte (¬(A ∨ B)) právě když: Věk ≥ 18 (¬A) ∧ Nemáte ISIC (¬B). O slevu přijdete pouze při selhání obou podmínek naráz!",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.8a: 3. Nutná vs. Postačující Podmínka
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3. Nutná vs. Postačující Podmínka", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V předmětu AG1 musíte bez váhání rozumět slovnímu spojení *„Nutná a postačující podmínka“*:\nUvažujme implikaci $A \\Rightarrow B$:",
      { y }
    );

    y = renderDocList(slide, [
      "**A je POSTAČUJÍCÍ podmínka pro B:** Platnost A nám **zcela stačí** k tomu, abychom zaručili platnost B. (Jakmile nastane A, automaticky platí B).",
      "**B je NUTNÁ podmínka pro A:** Bez platnosti B nemůže A vůbec nastat. Pokud neplatí B, je vyloučeno, aby platilo A ($\\neg B \\implies \\neg A$)."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Ekvivalence (A ⇔ B):",
      text: "Pokud platí A ⇔ B, říkáme, že A je nutnou A ZÁROVEŇ postačující podmínkou pro B (a naopak). Příklad: Voda v kádince vře právě tehdy, když její teplota dosáhla 100 °C.",
      y: y + 0.1,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.8b: Srovnávací tabulka implikací a podmínek
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "3. Nutná vs. Postačující Podmínka" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Srovnání na konkrétních vztazích:", { level: 3, y });

    renderDocTable(slide, {
      headers: ["Vztah A ⇒ B", "Postačující podmínka (A)", "Nutná podmínka (B)"],
      rows: [
        ["Glukóza ⇒ Obsahuje Uhlík", "Být glukózou STAČÍ k obsahu uhlíku.", "Obsahovat uhlík je NUTNÉ pro glukózu."],
        ["Student VŠCHT ⇒ Vysokoškolák", "Studovat na VŠCHT STAČÍ být vysokoškolákem.", "Být vysokoškolákem je NUTNÉ pro VŠCHT."],
        ["Řízení auta na silnici ⇒ Věk ≥ 18", "Být legálním řidičem STAČÍ k věku ≥ 18.", "Věk ≥ 18 je NUTNÝ pro řízení auta."],
        ["Červený diplom ⇒ Složit státnice", "Červený diplom STAČÍ k úspěšným státnicím.", "Složit státnice je NUTNÉ pro diplom."]
      ],
      colWidths: [3.8, 3.9, 4.033],
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.9: 4. Kvantifikátory (∀, ∃, ∃!) a Jejich Negace
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "4. Kvantifikátory (∀, ∃, ∃!) a Jejich Negace", { level: 2, y, showUnderline: true });

    y = renderDocList(slide, [
      "**∀ (Všeobecný kvantifikátor):** *„Pro všechny...“*, *„Pro každý...“*.",
      "**∃ (Existenční kvantifikátor):** *„Existuje alespoň jeden...“*, *„Lze najít takový...“*.",
      "**∃! (Jednoznačný existenční kvantifikátor):** *„Existuje právě jeden...“*, *„Existuje jediný...“*."
    ], { y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Pravidlo Negace Kvantifikátorů:",
      items: [
        "1. Záměna kvantifikátoru: ∀ ⟷ ∃",
        "2. Negace vnitřní formule: Znegujeme tvrzení uvnitř: ¬(∀x ∈ M : P(x)) ≡ ∃x ∈ M : ¬P(x) a ¬(∃x ∈ M : P(x)) ≡ ∀x ∈ M : ¬P(x)"
      ],
      y,
    });

    y = renderDocHeading(pres, slide, "🧠 Mnemotechnika ze života (Studenti & Chytrost):", { level: 3, y });

    y = renderDocList(slide, [
      "**Negace ∀ ➔ ∃:** Původní: *„Každý student je chytrý.“* ➔ Negace: *„Existuje student, který NENÍ chytrý.“* (K vyvrácení nepotřebujete, aby byli všichni hloupí — stačí najít jediného, který chytrý není!).",
      "**Negace ∃ ➔ ∀:** Původní: *„Existuje chytrý student.“* ➔ Negace: *„Každý student je ne-chytrý (všichni jsou hloupí).“* (Pokud neexistuje ani jeden chytrý, všichni do jednoho chytří nejsou)."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.10a: 4.2 Složité Řetězené Negace: Souvislost Sítě
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "4.2 Složité Řetězené Negace v Bioinformatice", { level: 3, y });

    y = renderDocHeading(pres, slide, "Případ 1: Souvislost Sítě (Grafu)", { level: 4, y, showUnderline: false });
    renderDocList(slide, [
      "**Původní tvrzení S (Síť je souvislá):** $\\forall u, v \\in V : (u \\neq v \\implies \\exists \\text{ cesta } P \\text{ z } u \\text{ do } v)$",
      "**Postup negace:** 1. Zaměníme $\\forall u, v$ za $\\exists u, v$. 2. Znegujeme implikaci: $A \\land \\neg B$. 3. Zaměníme $\\exists P$ za $\\forall P$.",
      "**Formální Negace ¬S:** $\\exists u, v \\in V : (u \\neq v \\land \\forall \\text{ cestu } P : P \\text{ NESPOJUJE } u \\text{ a } v)$",
      "**Slovní překlad:** *„Existuje dvojice různých uzlů u, v v síti taková, že mezi nimi neexistuje žádná spojující cesta (síť je rozpojená).“*"
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.10b: Slepá Ulička v Reakční Síti
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "4.2 Složité Řetězené Negace" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Případ 2: Slepá Ulička v Reakční Síti (Terminal Metabolite)", { level: 4, y, showUnderline: false });
    renderDocList(slide, [
      "**Původní tvrzení R (Z každého metabolitu vedou reakce dál):** $\\forall v \\in V \\; \\exists w \\in V : (v, w) \\in E$",
      "**Formální Negace ¬R:** $\\exists v \\in V \\; \\forall w \\in V : (v, w) \\notin E$",
      "**Slovní překlad:** *„Existuje metabolit v takový, že z něj nevede biochemická reakce do žádné jiné molekuly w.“*"
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.11: 5.1 Anatomie Důkazu: Heuristický vs. Formální
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "5.1 Anatomie Důkazu: Cesta k Výsledku vs. Úsporný Zápis", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Proč vznikly matematické důkazy?",
      text: "Důkazy nevznikly kvůli abstraktním výrazům, ale z inženýrské potřeby: získat 100% jistotu, že náš algoritmus funguje za všech okolností (a neselže na neznámých biologických datech v produkci).",
      y,
    });

    y = renderDocTable(slide, {
      headers: ["Typ Důkazu", "Jak Funguje v Praxi", "Proč Může Zmást Studenta", "Význam pro Bioinformatiku a AG1"],
      rows: [
        ["1. Heuristický / Objevný", "Ukazuje skutečný myšlenkový postup autora — od motivace a náčrtků po obecný vzorec.", "Bývá delší, neskrývá slepé uličky a experimentální intuici.", "Zásadní: tento důkaz často přímo generuje algoritmus a kód v C++."],
        ["2. Formální / Úsporný", "Dokazuje tvrzení v co nejmenším počtu řádků a zkracuje všechno, co může.", "Působí jako kouzlo spadlé z nebe — autor zahodil náčrtky a ukáže jen geniální trik.", "Slouží k neprůstřelnému ověření, ale sám o sobě nenaučí, jak na řešení přijít."]
      ],
      colWidths: [2.5, 3.1, 3.1, 3.033],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "💡 Tajemství zkouškových premiantů:",
      text: "Skutečné poznání začíná pokusem a omylem, kreslením náčrtků a hledáním invariantů! Formální důkaz je až slavnostní obal, kterým svou intuici obhájíte před světem.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.12a: 5.2 Čtyři Základní Důkazové Techniky v AG1 (Přehled)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "5.2 Čtyři Základní Důkazové Techniky v AG1", { level: 2, y, showUnderline: true });

    // ASCII 4 techniky box
    const boxW = 11.733;
    const boxH = 4.2;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐\n│      PŘÍMÝ DŮKAZ      │   │     KONTRAPOZICE      │   │     DŮKAZ SPOREM      │   │  MATEMATICKÁ INDUKCE  │\n│ A => A1 => ... => B   │   │    !B => ... => !A    │   │   (A && !B) => SPOR   │   │   1. Báze + 2. Krok   │\n├───────────────────────┤   ├───────────────────────┤   ├───────────────────────┤   ├───────────────────────┤\n│ - Postupná dedukce    │   │ - Obměněná implikace  │   │ - Předpoklad opaku    │   │ - Pro n prvků / uzlů  │\n│ - Přímo od A k B      │   │ - Ekvivalentní tvar   │   │ - Dovedení ke sporu   │   │ - Krok n -> n+1       │\n│ - Přirozený postup    │   │ - Když je !B snazší   │   │ - Spor s větou / def. │   │ - Dekonstrukce grafu  │\n└───────────────────────┘   └───────────────────────┘   └───────────────────────┘   └───────────────────────┘",
      {
        x: 0.95,
        y: y + 0.3,
        w: boxW - 0.3,
        h: boxH - 0.6,
        fontFace: "Courier New",
        fontSize: fs(10),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.2,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 4.12b: Popis 4 Základních Důkazových Technik
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "5.2 Čtyři Základní Důkazové Techniky" });
    let y = 0.85;

    renderDocList(slide, [
      "**1. Přímý důkaz (A ⇒ B):** Posloupností ekvivalentních úprav a definic přímo odvodíme B: $A \\implies A_1 \\implies A_2 \\implies \\dots \\implies B$.",
      "**2. Důkaz Kontrapozicí (¬B ⇒ ¬A):** Dokážeme logicky ekvivalentní obměněnou implikaci. Použijeme, když je negovaný závěr $\\neg B$ snazší uchopit.",
      "**3. Důkaz Sporem (A ∧ ¬B ⇒ ⊥):** Předpokládáme platnost A a současně $\\neg B$. Odvozováním dojdeme ke sporu ($\\bot$) s definicí či větou.",
      "**4. Dekonstrukční Indukce:** Dekonstruujeme libovolný graf velikosti $n+1$ na podgraf velikosti $n$, aplikujeme IP a navrátíme prvek."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.13: Úloha 1.1: Bezchybná Negace Složité Formule (Zadání)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "### Úloha 1.1: Bezchybná Negace Složité Formule", { level: 3, y });

    y = renderDocParagraph(slide,
      "Znegujte následující výrok reprezentující vazebnou vlastnost biologického enzymu $E$:\n\nFormální zápis v predikátové logice (matematická notace):",
      { y }
    );

    // Formule box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.8,
      y,
      w: 9.733,
      h: 1.0,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1.5 },
    });
    slide.addText(
      "V = ∀x ∈ Enzymy ∃y ∈ Substráty : (Váže(x, y) ⟹ Aktivní(x))\nV = ∀x ∈ ℰ  ∃y ∈ 𝒮 : (V(x, y) ⟹ A(x))",
      {
        x: 2.0,
        y: y + 0.15,
        w: 9.333,
        h: 0.7,
        fontFace: "Courier New",
        fontSize: fs(13),
        bold: true,
        color: colors.textPrimary,
        align: "center",
        lineSpacingMultiple: 1.2,
      }
    );
    y += 1.2;

    y = renderDocParagraph(slide,
      "*(kde ℰ značí enzymy, 𝒮 substráty, predikát V(x, y) vyjadřuje „x se váže na y“ a A(x) „x je aktivní“)*",
      { y }
    );

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "✍️ Zadání k procvičení:",
      text: "Zkuste si formuli znegovat samostatně na papír. Na dalším snímku následuje podrobný krok za krokem rozbor řešení!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.14: 💡 Vzorové Řešení Úlohy 1.1
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Úloha 1.1" });
    let y = 0.85;

    y = renderSolutionBanner(pres, slide, { title: "Vzorové Řešení: Úloha 1.1 (Negace Kvantifikované Formule)", y });

    y = renderDocList(slide, [
      "**Krok 1 (Záměna kvantifikátorů):** $\\forall x$ se změní na $\\exists x$, a $\\exists y$ se změní na $\\forall y$.",
      "**Krok 2 (Negace vnitřní implikace):** Podle pravidla $\\neg(A \\implies B) \\equiv A \\land \\neg B$ dostáváme:\n$$\\neg(V(x, y) \\implies A(x)) \\quad \\equiv \\quad V(x, y) \\land \\neg A(x)$$",
      "**Krok 3 (Sestavení výsledné znegované formule ¬V):**"
    ], { y });

    // Výsledná formule box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.8,
      y,
      w: 9.733,
      h: 1.0,
      rectRadius: 0.08,
      fill: { color: "F0FDF4" },
      line: { color: "BBF7D0", width: 1.5 },
    });
    slide.addText(
      "¬V = ∃x ∈ Enzymy ∀y ∈ Substráty : (Váže(x, y) ∧ ¬Aktivní(x))\n¬V = ∃x ∈ ℰ  ∀y ∈ 𝒮 : (V(x, y) ∧ ¬A(x))",
      {
        x: 2.0,
        y: y + 0.15,
        w: 9.333,
        h: 0.7,
        fontFace: "Courier New",
        fontSize: fs(13),
        bold: true,
        color: "047857",
        align: "center",
        lineSpacingMultiple: 1.2,
      }
    );
    y += 1.2;

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Slovní překlad výsledku:",
      text: "„Existuje enzym x takový, že pro všechny substráty y platí, že se na ně enzym x váže a zároveň není aktivní.“",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.15: Úloha 1.2: Důkaz v Sítích: deg(v) ≥ 2 implikuje cyklus (Zadání)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "### Úloha 1.2: Důkaz v Sítích: Kontrapozice vs. Přímý Důkaz", { level: 3, y });

    y = renderDocParagraph(slide,
      "Dokážeme tvrzení pro libovolnou konečnou síť (graf) $G = (V, E)$, kde $V$ jsou uzly a $E$ jsou spojnice mezi nimi (přičemž $\\deg(v)$ značí stupeň uzlu = počet spojnic vycházejících z uzlu $v$):",
      { y }
    );

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Dokazované tvrzení:",
      text: "„Pokud z každého uzlu v ∈ V vycházejí alespoň 2 spojnice (deg(v) ≥ 2), pak síť G nutně obsahuje alespoň jednu uzavřenou smyčku (cyklus).“",
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "💡 Intuitivní představa před formálním důkazem:",
      text: "Představte si chodby v bludišti. Pokud z každé místnosti vedou alespoň 2 dveře (deg(v) ≥ 2), nikdy nemůžete uvíznout ve slepé uličce. Když budete bludištěm procházet stále kupředu a nikdy se nevrátíte stejnými dveřmi, v konečném počtu místností musíte narazit do místnosti, kde už jste byli — a tím jste uzavřeli cyklus!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 4.16a: 💡 Vzorové Řešení Úlohy 1.2: Metoda A (Kontrapozice - Princip)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Úloha 1.2" });
    let y = 0.85;

    y = renderSolutionBanner(pres, slide, { title: "Vzorové Řešení Úlohy 1.2: Metoda A (Kontrapozice)", y });

    y = renderDocParagraph(slide,
      "Místo obtížné implikace $A \\implies B$ dokážeme logicky ekvivalentní obměněnou implikaci $\\neg B \\implies \\neg A$:",
      { y }
    );

    renderDocList(slide, [
      "**¬B:** Síť **neobsahuje žádný cyklus** (je to strom nebo soubor stromů).",
      "**¬A:** Existuje uzel $v \\in V$, ze kterého vychází méně než 2 spojnice ($\\deg(v) < 2$, tj. $\\deg(v) \\le 1$)."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.16b: Důkaz obměněného tvrzení ¬B ⇒ ¬A
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Úloha 1.2 · Kontrapozice" });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "✍️ Důkaz obměněného tvrzení ¬B ⇒ ¬A:", { level: 4, y, showUnderline: false });

    renderDocList(slide, [
      "1. Předpokládejme, že síť neobsahuje žádné cykly ($\\neg B$). Pokud nemá žádné hrany ($m=0$), všechny uzly mají $\\deg(v) = 0 < 2$ (platí triviálně).",
      "2. Zvolme v síti nejdelší možnou trasu bez opakování $P = (v_1, v_2, \\dots, v_k)$.",
      "3. Krajní uzel $v_1$ nemůže mít souseda mimo trasu $P$ (jinak by $P$ nebyla nejdelší), ani souseda $v_j$ ($j \\ge 3$) uvnitř trasy (to by vytvořilo cyklus!).",
      "4. Jediným sousedem koncového uzlu $v_1$ může být pouze uzel $v_2$. Tedy $\\deg(v_1) = 1 < 2$. Nalezli jsme uzel s $\\deg(v) \\le 1$, čímž je $\\neg A$ dokázáno!",
      "5. Podle principu kontrapozice tím bezpečně platí i původní tvrzení $A \\implies B$."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 4.17: 💡 Vzorové Řešení Úlohy 1.2: Metoda B (Přímý Důkaz)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb, continuationHeader: "Úloha 1.2" });
    let y = 0.85;

    y = renderSolutionBanner(pres, slide, { title: "Vzorové Řešení Úlohy 1.2: Metoda B (Přímý Důkaz)", y });

    y = renderDocParagraph(slide,
      "Tvrzení dokážeme přímo ($A \\implies B$) sestavením nejdelší trasy $P = (v_1, v_2, \\dots, v_k)$ do řady zleva doprava:",
      { y }
    );

    // ASCII zpětná hrana box
    const boxW = 10.5;
    const boxH = 2.0;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.4,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "      ┌────────────────────────────────────────────────────────┐\n      │                                                        │ (zpětná hrana uzavírá cyklus!)\n      ▼                                                        │\n   ┌──────┐        ┌──────┐               ┌────────┐        ┌──┴───┐\n   │  v₁  ├────────┤  v₂  ├─── ... ───────┤  vk-1  ├────────┤  vk  │\n   └──────┘        └──────┘               └────────┘        └──────┘\n   (začátek řady)                                           (nejvíce napravo:\n                                                             nemůže pokračovat doprava,\n                                                             musí se napojit zpět doleva!)",
      {
        x: 1.6,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
    y += boxH + 0.15;

    y = renderDocList(slide, [
      "**Proč uzel nejvíce napravo (vk) musí ukázat zpět do řady?** Má $\\deg(v_k) \\ge 2$. Jeden soused je $v_{k-1}$. Druhý soused nemůže vést doprava (spor s maximalitou $P$), musí tedy mířit doleva k již navštívenému uzlu $v_i$ ($1 \\le i \\le k-2$).",
      "**Závěr:** Úsek trasy z $v_i$ do $v_k$ spolu se zpětnou spojnicí $\\{v_k, v_i\\}$ tvoří uzavřený cyklus! Tvrzení je dokázáno."
    ], { y });
  }
}
