/**
 * Module 4: Logický & Důkazový základ
 * Source: src/features/bioinformatics/content/3-semestr/pre-ag1/dml-logicky-zaklad.md
 * Exact 1:1 text fidelity with website markdown.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createThreeCardSlide,
  createCodeSlide,
  createTableSlide
} from "../pptx_engine.mjs";

export function addModule4Slides(pres) {
  const breadcrumb = "4 · Logický & Důkazový základ";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 4,
    title: "Logický & Důkazový základ",
    goal: "Cíl kapitoly: Ovládnout přesný formální jazyk matematické logiky, získat 100% jistotu v negování složitých kvantifikovaných výroků (∀, ∃, ∃!), bezchybně rozlišovat nutnou a postačující podmínku a osvojit si 4 základní důkazové šablony pro zápočtové testy a zkoušku z AG1 na FIT ČVUT.",
    topics: [
      "🌱 Než začneme: Proč se biologové učí logiku?",
      "1. Úvod do Matematické Logiky a Definice Výroku",
      "2. Výrokové Spojky a Pravdivostní Tabulky",
      "📐 Doplňkové symboly BI-DML (Množiny & Formální logika)",
      "2.1 Mnemotechnika Implikace (Student vs. Učitel)",
      "Past u zkoušky z DML: Směr implikace & Triviální pravdivost",
      "2.2 De Morganovy Zákony & Podmínky if v Jazyce C",
      "Příklady z reálného života: Laboratoř VŠCHT & Sleva ISIC",
      "2.3 Převod Implikace, Negace a Kontrapozice",
      "3. Nutná vs. Postačující Podmínka",
      "4. Kvantifikátory (∀, ∃, ∃!) a Pravidlo Negace",
      "4.2 Složité Řetězené Negace v Bioinformatice",
      "5. Přehled 4 Základních Důkazových Technik pro AG1",
      "Úloha 1.1: Bezchybná Negace Složité Formule Enzymu",
      "Úloha 1.2: Důkaz v Sítích (Kontrapozice vs. Přímý Důkaz)"
    ]
  });

  // 2. Introduction: Proč se biologové učí logiku?
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "🌱 Než Začneme: Proč se Biologové Učí Logiku?",
    leftCard: {
      title: "Příklad s Expresí Proteinu",
      badge: "BIOLOGICKÁ INTUICE",
      type: "neutral",
      items: [
        { bold: "Kolegovo tvrzení:", text: "Představ si, že zkoumáš nový protein. Kolega tvrdí: „Pokud je tento gen aktivní, pak se protein exprimuje.“" },
        { bold: "Výsledek experimentu:", text: "V experimentu vidíš buňky, kde gen aktivní není — a protein se tam taky neobjevuje. Potvrzuje to kolegovo tvrzení, nebo ho vyvrací?" },
        { bold: "Problém přirozeného jazyka:", text: "Odpověď závisí přesně na tom, jak přečteme implikaci „pokud A, pak B“. Přirozený jazyk je nejednoznačný. Věta „Pokud prší, vezmu deštník“ nic neříká o tom, co uděláš, když neprší — třeba deštník vezmeš stejně, protože je hezký." }
      ]
    },
    rightCard: {
      title: "Odstranění Nejednoznačnosti",
      badge: "PŘÍSLIB KAPITOLY",
      type: "warm",
      items: [
        { bold: "Úloha logiky:", text: "Matematická logika je nástroj, který tuto nejednoznačnost odstraňuje. Ve zkouškách z AG1 budeš formulovat tvrzení o grafech a dokazovat je — a každá nejednoznačnost v logickém zápisu = ztráta bodů." },
        { bold: "Příslib této kapitoly:", text: "Po přečtení budeš umět přesně přečíst jakékoliv formální tvrzení, bezchybně ho znegovat a zvolit správnou strategii důkazu." },
        { bold: "Bez abstraktní teorie:", text: "Všechny principy stavíme na situacích ze skutečného studentského života, chemické praxe a programování v C — žádná teorie grafů není předem potřeba!" }
      ]
    }
  });

  // 3. Section 1: Úvod do Matematické Logiky a Výroky
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Úvod do Matematické Logiky a Výroky",
    leftCard: {
      title: "Definice Výroku",
      badge: "ZÁKLADNÍ POJEM",
      type: "neutral",
      items: [
        { bold: "Mnohoznačnost vs. Exaktnost:", text: "V běžném jazyce bývají biologická a chemická tvrzení často mnohoznačná. V počítačové vědě a teoretické informatice však musíme formulovat myšlenky tak, aby neexistovala žádná pochybnost o jejich pravdivosti." },
        { bold: "Definice Výroku:", text: "Výrok je oznamovací věta, o níž má smysl prohlásit, zda je pravdivá (značíme 1, True, T) nebo nepravdivá (značíme 0, False, F)." }
      ]
    },
    rightCard: {
      title: "Příklady v Bioinformatice a Matematice",
      badge: "VÝROK VS. NE-VÝROK",
      type: "warm",
      items: [
        { bold: "„Molekula vody obsahuje 2 atomy vodíku.“:", text: "⇒ Výrok (Pravdivý = 1)." },
        { bold: "„Kofein má sumární vzorec C₈H₁₀N₄O₂.“:", text: "⇒ Výrok (Pravdivý = 1)." },
        { bold: "„Číslo 17 je prvočíslo.“:", text: "⇒ Výrok (Pravdivý = 1)." },
        { bold: "„Tento kód v C++ je pěkný.“:", text: "⇒ NENÍ výrok (subjektivní hodnocení, nelze jednoznačně určit 0 nebo 1)." },
        { bold: "„Kolik prvků má množina V?“:", text: "⇒ NENÍ výrok (otázka)." }
      ]
    }
  });

  // 4. Section 2: Výrokové Spojky a Pravdivostní Tabulky
  createTableSlide(pres, {
    breadcrumb,
    title: "2. Výrokové Spojky a Pravdivostní Tabulky",
    subtitle: "Složitější výroky stavíme z jednoduchých výrokových proměnných (A, B, C) pomocí výrokových spojek:",
    headers: ["Symbol", "Název", "Zápis", "Význam v češtině", "Pravdivostní pravidlo / Definice"],
    colWidths: [1.2, 2.3, 1.8, 2.8, 3.6],
    rows: [
      ["¬", "Negace", "¬A", "„Není pravda, že A“", "Obrátí pravdivostní hodnotu (1 → 0, 0 → 1)."],
      ["∧", "Konjunkce", "A ∧ B", "„A a zároveň B“", "Pravda pouze v případě, že oba výroky A i B platí."],
      ["∨", "Disjunkce", "A ∨ B", "„A nebo B“", "Pravda, pokud platí alespoň jeden z výroků A, B."],
      ["⇒", "Implikace", "A ⇒ B", "„Jestliže A, pak B“", "Nepravda pouze v případě, že A platí a B neplatí (1 ⇒ 0)."],
      ["⇔", "Ekvivalence", "A ⇔ B", "„A právě tehdy, když B“", "Pravda, pokud mají A i B stejnou pravdivostní hodnotu."],
      ["∀", "Všeobecný kvantifikátor", "∀x ∈ M : P(x)", "„Pro každý prvek x…“", "Pravda, pokud vlastnost P(x) platí pro všechny prvky z M."],
      ["∃", "Existenční kvantifikátor", "∃x ∈ M : P(x)", "„Existuje alespoň jedno x…“", "Pravda, pokud vlastnost P(x) platí pro alespoň jeden prvek z M."],
      ["∃!", "Jednoznačná existence", "∃!x ∈ M : P(x)", "„Existuje právě jedno x…“", "Pravda, pokud v M existuje přesně jeden (jediný) prvek splňující P(x)."]
    ]
  });

  // 5. Supplementary Symbols: BI-DML Reference
  createTableSlide(pres, {
    breadcrumb,
    title: "📐 Doplňkové Symboly (BI-DML Reference)",
    subtitle: "Doplňkové symboly (Množiny & Formální logika v BI-DML):",
    headers: ["Symbol", "Význam symbolu", "Formální popis & Definice"],
    colWidths: [2.0, 3.2, 6.5],
    rows: [
      ["⊤", "tautologie", "Výroková formule, která je vždy pravdivá (hodnota 1) při libovolném ohodnocení (např. A ∨ ¬A)"],
      ["⊥", "kontradikce", "Výroková formule, která je vždy nepravdivá (hodnota 0) při libovolném ohodnocení (např. A ∧ ¬A)"],
      ["E ⊨ F", "logický důsledek mezi formulemi E a F", "Formule F je sémantickým důsledkem E; každý model formule E je i modelem F"],
      ["E ≡ F", "logická ekvivalence formulí E a F", "Formule E a F jsou sémanticky ekvivalentní; mají shodné ohodnocení ve všech modelech"],
      ["x ∈ M, x ∉ M", "náležení / nenáležení prvku do množiny", "x ∈ M znamená, že prvek x je prvkem množiny M; x ∉ M ⇔ ¬(x ∈ M)"],
      ["A ⊆ B, A ⊊ B", "podmnožina a vlastní podmnožina", "A ⊆ B ⇔ (∀x: x ∈ A ⇒ x ∈ B); vlastní podmnožina navíc vyžaduje A ≠ B"],
      ["A ∪ B, A ∩ B, A ∖ B", "sjednocení, průnik a rozdíl množin", "A ∪ B = {x | x ∈ A ∨ x ∈ B}, A ∩ B = {x | x ∈ A ∧ x ∈ B}, A ∖ B = {x | x ∈ A ∧ x ∉ B}"],
      ["A × B", "kartézský součin množin", "Množina všech uspořádaných dvojic {(a, b) | a ∈ A ∧ b ∈ B}; mohutnost |A × B| = |A| · |B|"],
      ["∅ (nebo {})", "prázdná množina", "Množina neobsahující žádný prvek; |∅| = 0, je podmnožinou každé množiny (∅ ⊆ A)"],
      ["(n nad k)", "kombinační číslo („n nad k“)", "Počet všech k-prvkových podmnožin n-prvkové množiny: n! / (k!(n-k)!)"]
    ]
  });

  // 6. Section 2.1: Mnemotechnika Implikace (Student vs. Učitel)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "2.1 Mnemotechnika Implikace: Student vs. Učitel",
    leftCard: {
      title: "Kdo z Koho (1. Student vs. 2. Učitel)",
      badge: "MNEMOTECHNIKA",
      type: "warm",
      items: [
        { bold: "Představa ústní zkoušky:", text: "Střetnou se znalosti studenta a zkoušejícího profesora:" },
        { bold: "1. Student (S):", text: "1 = umí, 0 = neumí." },
        { bold: "2. Učitel (U):", text: "1 = umí (zkouší, vyžaduje, ví všechno), 0 = neumí (nevyzná se / neví, na co se zeptat)." },
        { bold: "Kdy student projde (GOOD / 1):", text: "Jestli umí student a neumí učitel ⇒ GOOD (1): Student látku ovládá, zkoušející ho nedokáže zaskočit. Student projde!" },
        { bold: "Kdy dostane 0:", text: "Jestli neumí student a umí učitel ⇒ 0 (0): Student tápe a zkoušející je kapacita. Student okamžitě letí s nulou!" }
      ]
    },
    rightCard: {
      title: "Logická Vazba (U ⇒ S)",
      badge: "PRAVDIVOSTNÍ TABULKA",
      type: "neutral",
      items: [
        { bold: "1 ⇒ 1 = 1 (GOOD / OK):", text: "Student umí, učitel umí. Proběhne férová debata, student látku obhájí a má zkoušku v kapse." },
        { bold: "0 ⇒ 1 = 1 (GOOD):", text: "Student umí a učitel neumí (neví, na co se zeptat). Student situaci ovládne a exceluje." },
        { bold: "0 ⇒ 0 = 1 (GOOD):", text: "Student neumí a učitel látku taky neumí. Nikdo nic neodhalil → student bez problému projde (Triviální pravdivost)." },
        { bold: "1 ⇒ 0 = 0 (KATASTROFA):", text: "Student neumí a učitel umí. Zkoušející studenta okamžitě nachytá a vyrazí ho s nulou! JEDINÝ PŘÍPAD NULY (NEPRAVDY)!" }
      ]
    }
  });

  // 7. Exam Trap: Směr Implikace a Triviální Pravdivost
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Past u Zkoušky: Směr Implikace a Vacuous Truth",
    leftCard: {
      title: "Pozor na Směr Implikace (A ⇒ B vs. B ⇒ A)",
      badge: "⚠️ PAST U ZKOUŠKY",
      type: "rose",
      items: [
        { bold: "Není komutativní:", text: "A ⇒ B  ≢  B ⇒ A." },
        { bold: "Jediný případ nepravdy:", text: "Ve formální logice je implikace A ⇒ B nepravdivá (0) POUZE v případě 1 ⇒ 0 (předpoklad platí, ale závěr nenastal)." },
        { bold: "Nepravdivý předpoklad:", text: "Pokud je předpoklad A = 0 (nepravdivý), je celá implikace VŽDY PRAVDIVÁ (1), bez ohledu na to, zda závěr B platí či ne (triviální pravdivost / vacuous truth)." }
      ]
    },
    rightCard: {
      title: "Triviální Pravdivost (Vacuous Truth)",
      badge: "💡 DEFINICE A PŘÍKLAD",
      type: "warm",
      items: [
        { bold: "Princip:", text: "Pokud je předpoklad A nepravdivý (A = 0), je implikace A ⇒ B VŽDY PRAVDIVÁ, bez ohledu na to, zda B platí nebo ne!" },
        { bold: "Příklad z bioinformatiky:", text: "Tvrzení „Každá molekula s 0 atomy uhlíku je bílkovina“ je matematicky pravdivý výrok, protože předpoklad (molekula s 0 uhlíky tvořící bílkovinu) je prázdný." }
      ]
    }
  });

  // 8. Section 2.2: De Morganovy Zákony a Důkaz Tabulkou
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "2.2 De Morganovy Zákony a Klíčové Ekvivalence",
    leftCard: {
      title: "Formulace Zákonů",
      badge: "ZÁKONY",
      type: "warm",
      items: [
        { bold: "Základní pravidlo:", text: "De Morganovy zákony tvoří základní pravidlo pro distribuci negace přes logickou konjunkci (∧) a disjunkci (∨)." },
        { bold: "1. De Morgan pro konjunkci:", text: "¬(A ∧ B)  ≡  ¬A ∨ ¬B. „Není pravda, že platí A i B zároveň ⇔ Neplatí A, nebo neplatí B.“" },
        { bold: "2. De Morgan pro disjunkci:", text: "¬(A ∨ B)  ≡  ¬A ∧ ¬B. „Není pravda, že platí A nebo B ⇔ Neplatí A a zároveň neplatí B.“" }
      ]
    },
    rightCard: {
      title: "Důkaz ¬(A ∧ B) ≡ ¬A ∨ ¬B Pravdivostní Tabulkou",
      badge: "VERIFIKACE",
      type: "neutral",
      items: [
        { bold: "A=0, B=0:", text: "A ∧ B = 0  ⇒  ¬(A ∧ B) = 1  |  ¬A ∨ ¬B = 1 ∨ 1 = 1." },
        { bold: "A=0, B=1:", text: "A ∧ B = 0  ⇒  ¬(A ∧ B) = 1  |  ¬A ∨ ¬B = 1 ∨ 0 = 1." },
        { bold: "A=1, B=0:", text: "A ∧ B = 0  ⇒  ¬(A ∧ B) = 1  |  ¬A ∨ ¬B = 0 ∨ 1 = 1." },
        { bold: "A=1, B=1:", text: "A ∧ B = 1  ⇒  ¬(A ∧ B) = 0  |  ¬A ∨ ¬B = 0 ∨ 0 = 0." },
        { bold: "Závěr:", text: "Sloupce ¬(A ∧ B) a ¬A ∨ ¬B mají ve všech řádcích identickou pravdivostní hodnotu. Ekvivalence je dokázána!" }
      ]
    }
  });

  // 9. De Morgan in C Language (if conditions)
  createCodeSlide(pres, {
    breadcrumb,
    title: "De Morganovy Zákony v Jazyce C (Podmínky if)",
    codeTitle: "BI-PA1 Programování v C",
    code: `// 1. Negace konjunkce: !(A && B)  ===>  (!A || !B)
// Kontrola rozsahu: hodnota nesmí být mimo povolený interval 0 až 100
if (!(score >= 0 && score <= 100))     // Intuitivní: „když NENÍ uvnitř platného intervalu"
if (score < 0 || score > 100)          // De Morgan: „když je menší než min NEBO větší než max"

// 2. Negace disjunkce: !(A || B)  ===>  (!A && !B)
// Kontrola volby: uživatel nepotvrdil pokračování volbou 'a' ani 'y'
if (!(ans == 'a' || ans == 'y'))       // Intuitivní: „když nezvolil ani jednu z povolených možností"
if (ans != 'a' && ans != 'y')          // De Morgan: „když nezadal 'a' A ZÁROVEŇ nezadal 'y'"

// 3. Kontrola rozměrů: obrazec musí mít kladnou šířku i výšku
if (!(width > 0 && height > 0))        // Intuitivní: „když neplatí, že jsou oba rozměry kladné"
if (width <= 0 || height <= 0)         // De Morgan: „když je neplatná šířka NEBO neplatná výška"`,
    leftCard: {
      title: "Význam pro Programování",
      badge: "PRAXE V C",
      type: "neutral",
      items: [
        { bold: "Dvě formy zápisu:", text: "V programování (BI-PA1) v různých situacích dává smysl použít obě formy zápisu." },
        { bold: "Čitelnost kódu:", text: "Zatímco !(A && B) intuitivně vyjadřuje negaci celého platného stavu, (!A || !B) přímo testuje chybové mezní stavy pro předčasný návrat." }
      ]
    },
    analysisItems: []
  });

  // 10. Real life examples: Laborka VŠCHT & ISIC
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Příklady z Reálného Života: Laboratoř & ISIC",
    leftCard: {
      title: "Vstup do Laboratoře na VŠCHT",
      badge: "NEGACE KONJUNKCE",
      type: "warm",
      items: [
        { bold: "Podmínky pro práci (A ∧ B):", text: "1. Ochranné pomůcky (A): plášť a brýle. 2. Bezpečnostní test (B): podepsané školení a vstupní test." },
        { bold: "Zákaz vstupu ¬(A ∧ B):", text: "¬(A ∧ B) ≡ ¬A ∨ ¬B." },
        { bold: "Didaktický aha-moment:", text: "K tomu, aby vás vyučující poslal pryč ode dveří, nemusíte porušit obě podmínky najednou! Podle De Morgana stačí udělat jedinou chybu: zapomenout plášť či brýle (¬A) NEBO nenapsat test bezpečnosti (¬B). Stačí alespoň jedno z toho a do laborky nesmíte!" }
      ]
    },
    rightCard: {
      title: "Studentská Sleva na Jízdenku",
      badge: "NEGACE DISJUNKCE",
      type: "neutral",
      items: [
        { bold: "Nárok na slevu (A ∨ B):", text: "Je vám méně než 18 let (A), NEBO předložíte platný průkaz ISIC (B)." },
        { bold: "Plné jízdné ¬(A ∨ B):", text: "¬(A ∨ B) ≡ ¬A ∧ ¬B." },
        { bold: "Didaktický aha-moment:", text: "Plnou cenu platíte právě tehdy, když je vám 18 a více (¬A) A ZÁROVEŇ u sebe nemáte platný ISIC (¬B). Pokud platí alespoň jedna výhoda (např. 21 let, ale máte ISIC), slevu dostanete. O slevu přijdete pouze při selhání obou podmínek naráz!" }
      ]
    }
  });

  // 11. Section 2.3: Převod Implikace a Kontrapozice
  createThreeCardSlide(pres, {
    breadcrumb,
    title: "2.3 Převod Implikace a Kontrapozice",
    card1: {
      title: "1. Převod na Disjunkci",
      badge: "DISJUNKCE",
      type: "neutral",
      items: [
        { bold: "Zákon:", text: "(A ⇒ B) ≡ (¬A ∨ B)" },
        { bold: "Význam:", text: "Tvrzení „Jestliže A, pak B“ znamená přesně to samé, jako že buď předpoklad vůbec neplatil (¬A), nebo závěr nastal (B)." }
      ]
    },
    card2: {
      title: "2. Negace Implikace",
      badge: "NEGACE",
      type: "rose",
      items: [
        { bold: "Zákon:", text: "¬(A ⇒ B) ≡ (A ∧ ¬B)" },
        { bold: "Význam:", text: "Implikace neplatí právě tehdy, když platí předpoklad A a zároveň NEPLATÍ závěr B!" }
      ]
    },
    card3: {
      title: "3. Kontrapozice",
      badge: "OBMĚNA",
      type: "emerald",
      items: [
        { bold: "Zákon:", text: "(A ⇒ B) ≡ (¬B ⇒ ¬A)" },
        { bold: "Význam:", text: "Obměněná implikace má identickou pravdivostní hodnotu. Základ důkazu kontrapozicí." }
      ]
    }
  });

  // 12. Section 3: Nutná vs. Postačující Podmínka
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "3. Nutná vs. Postačující Podmínka",
    leftCard: {
      title: "Definice v Implikaci A ⇒ B",
      badge: "DEFINICE",
      type: "neutral",
      items: [
        { bold: "A je POSTAČUJÍCÍ pro B:", text: "Platnost A nám zcela stačí k tomu, abychom zaručili platnost B. (Jakmile nastane A, automaticky platí B)." },
        { bold: "B je NUTNÁ pro A:", text: "Bez platnosti B nemůže A vůbec nastat. Pokud neplatí B, je vyloučeno, aby platilo A (¬B ⇒ ¬A)." },
        { bold: "Ekvivalence (A ⇔ B):", text: "Pokud platí ekvivalence A ⇔ B, říkáme, že A je nutnou A ZÁROVEŇ postačující podmínkou pro B (a naopak)." }
      ]
    },
    rightCard: {
      title: "Příklady ze Života, Chemie a Univerzity",
      badge: "PŘEHLED VZTAHŮ",
      type: "warm",
      items: [
        { bold: "Glukóza ⇒ Obsahuje Uhlík:", text: "Být glukózou STAČÍ k obsahu uhlíku. Obsahovat uhlík je NUTNÉ pro glukózu." },
        { bold: "Student VŠCHT ⇒ Vysokoškolák:", text: "Studovat na VŠCHT STAČÍ být vysokoškolák. Být vysokoškolákem je NUTNÉ pro VŠCHT." },
        { bold: "Řízení auta ⇒ Věk ≥ 18:", text: "Být legálním řidičem STAČÍ k věku ≥ 18. Věk ≥ 18 je NUTNÝ pro řízení auta." },
        { bold: "Červený diplom ⇒ Složit státnice:", text: "Červený diplom STAČÍ k úspěšným státnicím. Složit státnice je NUTNÉ pro diplom." }
      ]
    }
  });

  // 13. Section 4: Kvantifikátory a Jejich Negace
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "4. Kvantifikátory (∀, ∃, ∃!) a Jejich Negace",
    leftCard: {
      title: "Pravidlo Negace Kvantifikátorů",
      badge: "PRAVIDLO",
      type: "warm",
      items: [
        { bold: "Dvě neúprosná pravidla:", text: "1. Záměna kvantifikátoru: ∀ ⟷ ∃. 2. Negace vnitřní formule: Znegujeme tvrzení uvnitř." },
        { bold: "Negace ∀:", text: "¬(∀x ∈ M : P(x))  ≡  ∃x ∈ M : ¬P(x)" },
        { bold: "Negace ∃:", text: "¬(∃x ∈ M : P(x))  ≡  ∀x ∈ M : ¬P(x)" },
        { bold: "Podstata:", text: "V matematice, bioinformatice i algoritmických sítích popisujeme vlastnosti celých množin prvků pomocí kvantifikátorů." }
      ]
    },
    rightCard: {
      title: "Mnemotechnika: Studenti & Chytrost",
      badge: "MNEMOTECHNIKA",
      type: "neutral",
      items: [
        { bold: "Negace ∀ (∀ ⟶ ∃):", text: "Původní: „Každý student je chytrý.“ Negace: „Není pravda, že každý student je chytrý.“ ⇔ „Existuje alespoň 1 student, který není chytrý.“ K vyvrácení nepotřebujete, aby byli všichni hloupí — stačí najít jediného studenta, který chytrý není!" },
        { bold: "Negace ∃ (∃ ⟶ ∀):", text: "Původní: „Existuje chytrý student.“ Negace: „Není pravda, že existuje chytrý student.“ ⇔ „Každý student je ne-chytrý (všichni jsou blbí).“ Pokud není pravda, že by existoval byť jediný, pak nutně všichni chytří nejsou." }
      ]
    }
  });

  // 14. Section 4.2: Složité Řetězené Negace v Bioinformatice
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "4.2 Složité Řetězené Negace v Bioinformatice",
    leftCard: {
      title: "Případ 1: Souvislost Sítě (Grafu)",
      badge: "SOUVISLOST",
      type: "neutral",
      items: [
        { bold: "Původní tvrzení S (Síť je souvislá):", text: "∀u, v ∈ V : (u ≠ v ⇒ ∃ cesta P z u do v)" },
        { bold: "Formální negace ¬S (Síť je nesouvislá):", text: "1. Zaměníme ∀u, v za ∃u, v. 2. Znegujeme implikaci ¬(A ⇒ B) ≡ A ∧ ¬B. 3. Zaměníme ∃P za ∀P:" },
        { bold: "Výsledný tvar:", text: "∃u, v ∈ V : (u ≠ v ∧ ∀ cestu P : P NESPOJUJE u a v)" },
        { bold: "Slovní překlad:", text: "„Existuje dvojice různých uzlů u, v v síti taková, že mezi nimi neexistuje žádná spojující cesta (síť je rozpojená).“" }
      ]
    },
    rightCard: {
      title: "Případ 2: Slepá Ulička v Reakční Síti",
      badge: "REAKČNÍ SÍŤ",
      type: "warm",
      items: [
        { bold: "Původní tvrzení R:", text: "∀v ∈ V ∃w ∈ V : (v, w) ∈ E (Z každého metabolitu vedou reakce dál)" },
        { bold: "Formální negace ¬R:", text: "∃v ∈ V ∀w ∈ V : (v, w) ∉ E" },
        { bold: "Slovní překlad:", text: "„Existuje metabolit v takový, že z něj nevede biochemická reakce do žádné jiné molekuly w.“ (Slepá ulička syntézy)." }
      ]
    }
  });

  // 15. Section 5: Přehled 4 Základních Důkazových Technik pro AG1
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "5. Přehled 4 Základních Důkazových Technik",
    leftCard: {
      title: "1. Přímý Důkaz & 2. Kontrapozice",
      badge: "DEDUKCE A OBMĚNA",
      type: "neutral",
      items: [
        { bold: "1. Přímý důkaz (A ⇒ B):", text: "Vyjdeme z předpokladu A a posloupností ekvivalentních úprav a definic přímo odvodíme B: A ⇒ A₁ ⇒ A₂ ⇒ … ⇒ B. Postupná dedukce, přirozený postup." },
        { bold: "2. Důkaz Kontrapozicí (¬B ⇒ ¬A):", text: "Místo obtížné implikace A ⇒ B dokážeme logicky ekvivalentní obměněnou implikaci ¬B ⇒ ¬A. Kdy použít: Když je negovaný závěr ¬B konstrukčně snazší uchopit než předpoklad A." }
      ]
    },
    rightCard: {
      title: "3. Důkaz Sporem & 4. Matematická Indukce",
      badge: "SPOR A INDUKCE",
      type: "warm",
      items: [
        { bold: "3. Důkaz Sporem (A ∧ ¬B ⇒ ⊥):", text: "Předpokládáme logický opak požadovaného tvrzení (tj. předpokládáme platnost A a zároveň ¬B). Odvozováním dojdeme ke sporu (⊥) s definicí, předpokladem nebo známou větou." },
        { bold: "4. Dekonstrukční Indukce:", text: "Pro dokazování tvrzení závislých na velikosti grafu n = |V| nebo m = |E|. Dekonstruujeme libovolný graf velikosti n+1 na podgraf velikosti n, aplikujeme Indukční předpoklad (IP) a navrátíme prvek." }
      ]
    }
  });

  // 16. Exercise 1.1: Negation of Enzyme Formula
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Úloha 1.1: Bezchybná Negace Formule Enzymu",
    leftCard: {
      title: "Zadání Výroku o Enzymu",
      badge: "ZADÁNÍ ÚLOHY",
      type: "neutral",
      items: [
        { bold: "Původní výrok:", text: "V = ∀x ∈ Enzymy ∃y ∈ Substráty : (Váže(x, y) ⟹ Aktivní(x))" },
        { bold: "Formální zápis v predikátové logice:", text: "V = ∀x ∈ ℰ ∃y ∈ 𝒮 : (V(x, y) ⇒ A(x))" },
        { bold: "Význam symbolů:", text: "ℰ značí enzymy, 𝒮 substráty, predikát V(x, y) „x se váže na y“ a A(x) „x je aktivní“." }
      ]
    },
    rightCard: {
      title: "Řešení a Výsledná Negace",
      badge: "ŘEŠENÍ",
      type: "emerald",
      items: [
        { bold: "1. Kvantifikátory:", text: "∀x se změní na ∃x, a ∃y se změní na ∀y." },
        { bold: "2. Vnitřní implikace:", text: "Znegujeme podle pravidla ¬(A ⇒ B) ≡ A ∧ ¬B: ¬(V(x, y) ⇒ A(x)) ≡ V(x, y) ∧ ¬A(x)." },
        { bold: "Výsledná znegovaná formule ¬V:", text: "¬V = ∃x ∈ Enzymy ∀y ∈ Substráty : (Váže(x, y) ∧ ¬Aktivní(x))" },
        { bold: "Slovní překlad:", text: "„Existuje enzym x takový, že pro všechny substráty y platí, že se na ně enzym x váže a zároveň není aktivní.“" }
      ]
    }
  });

  // 17. Exercise 1.2: Metoda A (Kontrapozice)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Úloha 1.2: Důkaz v Sítích — Metoda A (Kontrapozice)",
    leftCard: {
      title: "Tvrzení o Stupních a Cyklu",
      badge: "ZADÁNÍ & INTUICE",
      type: "neutral",
      items: [
        { bold: "Zadání:", text: "Dokážeme tvrzení pro libovolnou konečnou síť (graf) G = (V, E): „Pokud z každého uzlu v ∈ V vycházejí alespoň 2 spojnice (deg(v) ≥ 2), pak síť G nutně obsahuje alespoň jednu uzavřenou smyčku (cyklus).“" },
        { bold: "Intuitivní představa:", text: "Představte si chodby v bludišti. Pokud z každé místnosti vedou alespoň 2 dveře (deg(v) ≥ 2), nikdy nemůžete uvíznout ve slepé uličce. Když procházíte kupředu a nevracíte se stejnými dveřmi zpět, v konečném počtu místností musíte narazit do místnosti, kde už jste byli — a tím jste uzavřeli cyklus!" }
      ]
    },
    rightCard: {
      title: "Metoda A: Řešení Kontrapozicí (¬B ⇒ ¬A)",
      badge: "DŮKAZ KONTRAPOZICÍ",
      type: "warm",
      items: [
        { bold: "Obměněné tvrzení ¬B ⇒ ¬A:", text: "¬B: Síť neobsahuje žádnou uzavřenou smyčku. ¬A: Existuje uzel v ∈ V, ze kterého vychází méně než 2 spojnice (deg(v) ≤ 1)." },
        { bold: "1. Předpoklad:", text: "Síť neobsahuje žádné uzavřené smyčky (¬B)." },
        { bold: "2. Případ m = 0:", text: "Všechny uzly mají deg(v) = 0 < 2, tedy ¬A triviálně platí." },
        { bold: "3. Případ m > 0:", text: "Zvolme nejdelší možnou trasu bez opakování P = (v₁, v₂, …, vk). Krajní uzel v₁ nemůže mít souseda mimo trasu P (jinak by se trasa prodloužila) ani uvnitř trasy (vytvořil by cyklus). Jediným sousedem je v₂ na trase. Tedy deg(v₁) = 1 < 2. Nalezli jsme uzel s deg(v) ≤ 1, čímž je dokázáno ¬A. Tvrzení platí!" }
      ]
    }
  });

  // 18. Exercise 1.2: Metoda B (Přímý Důkaz)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Úloha 1.2: Metoda B — Přímý Důkaz (Zpětná Hrana)",
    leftCard: {
      title: "Sestavení Nejdelší Cesty do Řady",
      badge: "PŘÍMÝ POSTUP",
      type: "neutral",
      items: [
        { bold: "1. Předpoklad:", text: "Síť G je konečná (|V| = n) a každý uzel má stupeň alespoň 2 (deg(v) ≥ 2)." },
        { bold: "2. Sestavení nejdelší cesty do řady:", text: "Zvolme v grafu nejdelší možnou prostou trasu (cestu bez opakování vrcholů) a seřaďme její vrcholy zleva doprava: v₁ ─ v₂ ─ v₃ ─ … ─ vk-1 ─ vk. Jelikož je graf konečný, nejdelší prostá cesta má konečnou délku k ≤ n." },
        { bold: "3. Vrchol vk nejvíce napravo:", text: "Ze zadání má deg(vk) ≥ 2 (musí mít alespoň 2 různé sousedy). Prvním sousedem je uzel bezprostředně nalevo na trase (vk-1)." }
      ]
    },
    rightCard: {
      title: "Proč Uzel Napravo Musí Ukázat Zpět do Řady",
      badge: "UZAVŘENÍ CYKLU",
      type: "emerald",
      items: [
        { bold: "Kde leží druhý soused?:", text: "Nemůže ležet vně trasy jako nový vrchol vk+1 doprava (to by byla trasa delší, spor s maximalitou P). Nemůže být „na kraji“ bez napojení, protože má deg(vk) ≥ 2." },
        { bold: "Zpětná hrana:", text: "Druhý soused vrcholu vk nutně musí být některý z již navštívených vrcholů vi nalevo na trase (1 ≤ i ≤ k-2)! V krajním případě tato hrana vede z vk přímo zpět do počátečního uzlu v₁." },
        { bold: "4. Uzavření cyklu:", text: "Posloupnost hran podél trasy z vi do vk spolu se zpětnou spojnicí {vk, vi} tvoří uzavřený cyklus: (vi, vi+1, …, vk-1, vk, vi)." },
        { bold: "5. Závěr:", text: "V síti nutně existuje cyklus. Tvrzení je dokázáno přímo." }
      ]
    }
  });
}
