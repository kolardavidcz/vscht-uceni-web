/**
 * Module 4: Logický & Důkazový základ
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide,
  createSingleCardSlide,
  createCodeSlide,
  createThreeCardSlide,
  createProofSlide
} from "../pptx_engine.mjs";

export function addModule4Slides(pres) {
  const breadcrumb = "4 · Logický & Důkazový základ";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 4,
    title: "Logický & Důkazový základ",
    goal: "Ovládnout formální jazyk výrokové a predikátové logiky, bezchybně negovat kvantifikované formule (∀, ∃), chápat triviální pravdivost implikace, rozlišovat nutnou a postačující podmínku a osvojit si 4 klíčové důkazové šablony pro AG1.",
    topics: [
      "Proč se biologové a informatici učí formální logiku",
      "Výroková logika: Co je výrok a přehled logických spojek",
      "Mnemotechnika implikace (Student vs. Učitel) a Vacuous Truth",
      "De Morganovy zákony v teorii, kódu C++ a v laboratoři VŠCHT",
      "Nutná vs. Postačující podmínka a logická ekvivalence",
      "Predikátová logika: Kvantifikátory ∀, ∃ a pravidla negace",
      "Řetězené negace v sítích (souvislost grafu a terminální uzly)",
      "4 základní důkazové techniky a řešené úlohy"
    ]
  });

  // 2. Why Bioinformaticians Need Logic
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Proč se Biologové Učí Formální Logiku?",
    leftCard: {
      title: "Nejednoznačnost Běžného Jazyka",
      badge: "PROBLÉM JAZYKA",
      type: "rose",
      items: [
        { bold: "Příklad s genem:", text: "Kolega tvrdí: 'Pokud je gen aktivní, pak se protein exprimuje.'" },
        { bold: "Pozorování v buňce:", text: "Gen není aktivní a protein se neobjevuje. Potvrzuje to tvrzení?" },
        { bold: "Běžný klam:", text: "Lidé si pletou implikaci A ⇒ B s oboustrannou ekvivalencí A ⇔ B." },
        { bold: "Věta o deštníku:", text: "'Když prší, vezmu deštník' – neříká nic o tom, co udělám, když neprší!" }
      ]
    },
    rightCard: {
      title: "Matematická Logika jako Přesný Nástroj",
      badge: "ŘEŠENÍ V AG1",
      type: "emerald",
      items: [
        { bold: "Odstranění dvojznačnosti:", text: "Každý výrok má v daném modelu přesně definovanou hodnotu 1 (True) nebo 0 (False)." },
        { bold: "Zkouškový význam:", text: "V AG1 dokazujete vlastnosti grafů. Každá nejednoznačnost v zápisu vede ke ztrátě bodů." },
        { bold: "Algoritmizace:", text: "Podmínky if, while a invarianty v kódu jsou přímým přepisem výrokových formulí." }
      ]
    }
  });

  // 3. Definition of Proposition & Connectives
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Výroková Logika: Co je Výrok a Spojky",
    leftCard: {
      title: "Definice Výroku",
      badge: "DEFINICE",
      type: "warm",
      items: [
        { bold: "Výrok:", text: "Oznamovací věta, o níž má smysl jednoznačně prohlásit, zda je pravdivá (1 / True), nebo nepravdivá (0 / False)." },
        { bold: "Molekula vody má 2 atomy H:", text: "Pravdivý výrok (1)." },
        { bold: "Číslo 17 je prvočíslo:", text: "Pravdivý výrok (1)." },
        { bold: "Tento kód v C++ je hezký:", text: "NENÍ výrok (subjektivní pocit, nelze určit 0/1)." },
        { bold: "Kolik uzlů má graf G?:", text: "NENÍ výrok (otázka)." }
      ]
    },
    rightCard: {
      title: "Přehled Výrokových Spojek",
      badge: "SPOJKY",
      type: "neutral",
      items: [
        { bold: "¬A (Negace):", text: "Není pravda, že A. Obrátí hodnotu (1 → 0, 0 → 1)." },
        { bold: "A ∧ B (Konjunkce):", text: "A a zároveň B. Platí pouze tehdy, když platí oba." },
        { bold: "A ∨ B (Disjunkce):", text: "A nebo B. Platí, pokud platí alespoň jeden z nich." },
        { bold: "A ⇒ B (Implikace):", text: "Jestliže A, pak B. Nepravda pouze v případě 1 ⇒ 0." },
        { bold: "A ⇔ B (Ekvivalence):", text: "A právě tehdy, když B. Mají stejnou hodnotu." }
      ]
    }
  });

  // 4. Implication Mnemonics: Student vs Teacher
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Mnemotechnika Implikace (A ⇒ B): Kdo z Koho",
    leftCard: {
      title: "Zkoušková Mnemotechnika: U ⇒ S",
      badge: "STUDENT VS UČITEL",
      type: "warm",
      items: [
        { bold: "1. Student (S):", text: "1 = látku umí, 0 = látku neumí." },
        { bold: "2. Učitel (U):", text: "1 = umí (vyžaduje detail), 0 = neumí (neví, na co se ptát)." },
        { bold: "Otázka:", text: "Kdy student zkouškou projde (1 = GOOD) a kdy vyletí (0)?" },
        { bold: "Jediná nula:", text: "Učitel látku vyžaduje (U = 1), ale student ji neumí (S = 0) → 1 ⇒ 0 = 0 (KATASTROFA)." }
      ]
    },
    rightCard: {
      title: "Pravdivostní Tabulka Implikace",
      badge: "PRAVDIVOSTNÍ TABULKA",
      type: "neutral",
      items: [
        { bold: "1 ⇒ 1 = 1 (GOOD):", text: "Učitel zkouší, student umí → férová debata, zkouška hotova." },
        { bold: "0 ⇒ 1 = 1 (GOOD):", text: "Učitel neví na co se ptát, student exceluje → student prošel." },
        { bold: "0 ⇒ 0 = 1 (GOOD):", text: "Učitel i student látku neumí → nikdo nic neodhalil, student prošel." },
        { bold: "1 ⇒ 0 = 0 (KATASTROFA):", text: "Učitel ví, student tápe → okamžitý vyhazov s nulou!" }
      ]
    }
  });

  // 5. Vacuous Truth & Implication Direction
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Triviální Pravdivost (Vacuous Truth) a Směr",
    leftCard: {
      title: "Triviální Pravdivost (Vacuous Truth)",
      badge: "KLÍČOVÝ ZÁKON",
      type: "emerald",
      items: [
        { bold: "Pravidlo nepravdivého předpokladu:", text: "Pokud je předpoklad A nepravdivý (A = 0), je celá implikace A ⇒ B VŽDY PRAVDIVÁ (1)!" },
        { bold: "Nezávislost na závěru:", text: "Je úplně jedno, zda je B pravda či lež. Z nepravdy plyne cokoliv." },
        { bold: "Příklad z bioinformatiky:", text: "'Každá molekula s 0 atomy uhlíku je bílkovina.' – Formálně pravdivý výrok, protože žádná taková molekula neexistuje!" },
        { bold: "Prázdná množina:", text: "∀x ∈ ∅: P(x) platí triviálně pro libovolnou vlastnost P." }
      ]
    },
    rightCard: {
      title: "⚠️ Past: Implikace Není Komutativní!",
      badge: "POZOR NA SMĚR",
      type: "rose",
      items: [
        { bold: "Neekvivalence směru:", text: "A ⇒ B obecně NEZNAMENÁ B ⇒ A! (A ⇒ B ≢ B ⇒ A)." },
        { bold: "Příklad:", text: "'Je-li zvíře pes, je to savec' (1). Ale 'Je-li savec, je to pes' (0 – může to být kočka)." },
        { bold: "Obměněná implikace:", text: "Správný ekvivalentní směr je Kontrapozice: (A ⇒ B) ≡ (¬B ⇒ ¬A)." },
        { bold: "Zkouškový důsledek:", text: "Obrácení směru implikace v důkazu znamená automaticky 0 bodů za příklad." }
      ]
    }
  });

  // 6. De Morgan's Laws
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "De Morganovy Zákony: Negace ∧ a ∨",
    leftCard: {
      title: "1. Negace Konjunkce (A ∧ B)",
      badge: "1. DE MORGAN",
      type: "warm",
      items: [
        { bold: "Vzorec:", text: "¬(A ∧ B) ≡ ¬A ∨ ¬B" },
        { bold: "Význam v češtině:", text: "'Není pravda, že platí A i B zároveň' ⇔ 'Neplatí A, NEBO neplatí B'." },
        { bold: "Intuice:", text: "Aby neplatilo, že máte obojí, stačí vám postrádat alespoň jednu věc." },
        { bold: "Tabulkový důkaz:", text: "Pravdivostní sloupce ¬(A ∧ B) a ¬A ∨ ¬B dávají hodnoty [1, 1, 1, 0]." }
      ]
    },
    rightCard: {
      title: "2. Negace Disjunkce (A ∨ B)",
      badge: "2. DE MORGAN",
      type: "warm",
      items: [
        { bold: "Vzorec:", text: "¬(A ∨ B) ≡ ¬A ∧ ¬B" },
        { bold: "Význam v češtině:", text: "'Není pravda, že platí A nebo B' ⇔ 'Neplatí A A ZÁROVEŇ neplatí B'." },
        { bold: "Intuice:", text: "Aby neplatila ani jedna možnost, musí nutně selhat obě dvě současně." },
        { bold: "Tabulkový důkaz:", text: "Pravdivostní sloupce ¬(A ∨ B) a ¬A ∧ ¬B dávají hodnoty [1, 0, 0, 0]." }
      ]
    }
  });

  // 7. De Morgan in C/C++ Code
  createCodeSlide(pres, {
    breadcrumb,
    title: "De Morganovy Zákony v Kódu C++ (Podmínky if)",
    leftCard: {
      title: "Ekvivalence v Programování",
      badge: "PROGRAMOVÁNÍ",
      type: "warm",
      items: [
        { bold: "Význam pro čitelnost:", text: "V programování (PA1, PA2) často potřebujeme otočit logiku podmínky if." },
        { bold: "!(A && B) vs (!A || !B):", text: "Negace intervalu [0, 100]: hodnota není uvnitř ⇔ je < 0 NEBO > 100." },
        { bold: "!(A || B) vs (!A && !B):", text: "Negace volby 'a'/'y': uživatel nezvolil ani jedno ⇔ nezadal 'a' A ZÁROVEŇ nezadal 'y'." }
      ]
    },
    codeBlock: {
      title: "Praktické podmínky v jazyce C++",
      code: `// 1. Kontrola rozsahu: mimo povolený interval [0, 100]
if (!(score >= 0 && score <= 100)) // Lidská formulace
if (score < 0 || score > 100)      // De Morgan v C++

// 2. Kontrola vstupu: uživatel nepotvrdil 'a' ani 'y'
if (!(ans == 'a' || ans == 'y'))   // Lidská formulace
if (ans != 'a' && ans != 'y')      // De Morgan v C++

// 3. Kladné rozměry matice / grafu
if (!(width > 0 && height > 0))    // Negace konjunkce
if (width <= 0 || height <= 0)     // De Morgan v C++`,
      analysisItems: [
        "Kompilátor optimalizuje obě varianty na identický binární kód.",
        "De Morgan umožňuje eliminovat matoucí vnější operátory negace !"
      ]
    }
  });

  // 8. Real Life Examples: Lab Safety & Discount
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "De Morgan v Reálném Životě: Laborka a Sleva",
    leftCard: {
      title: "Vstup do Laboratoře VŠCHT (¬(A ∧ B))",
      badge: "LABORATOŘ VŠCHT",
      type: "rose",
      items: [
        { bold: "Pravidlo vstupu:", text: "Vstup povolen jen když: Má plášť i brýle (A) ∧ Má bezpečnostní test (B)." },
        { bold: "Kdy vás vyhodí? (¬(A ∧ B)):", text: "Podle De Morgana ¬A ∨ ¬B. Stačí udělat jedinou chybu!" },
        { bold: "Aha-moment:", text: "Vyučující vás pošle pryč, když jste zapomněli brýle (¬A) NEBO nemáte test (¬B)." },
        { bold: "Poučení:", text: "Nemusíte porušit obojí najednou – stačí selhání jediné podmínky." }
      ]
    },
    rightCard: {
      title: "Studentská Sleva na Jízdenku (¬(A ∨ B))",
      badge: "SLEVA NA JÍZDNÉ",
      type: "emerald",
      items: [
        { bold: "Pravidlo slevy:", text: "Sleva platí když: Věk < 18 let (A) ∨ Má platný průkaz ISIC (B)." },
        { bold: "Kdy platíte plnou cenu? (¬(A ∨ B)):", text: "Podle De Morgana ¬A ∧ ¬B. Musí selhat obě výhody současně!" },
        { bold: "Aha-moment:", text: "Plnou cenu platíte jen když je vám ≥ 18 (¬A) A ZÁROVEŇ nemáte ISIC (¬B)." },
        { bold: "Poučení:", text: "Pokud platí alespoň jedna výhoda (např. je vám 22, ale máte ISIC), slevu máte!" }
      ]
    }
  });

  // 9. Necessary vs Sufficient Condition
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Nutná vs. Postačující Podmínka (A ⇒ B)",
    leftCard: {
      title: "1. Postačující Podmínka (A)",
      badge: "POSTAČUJÍCÍ (STAČÍ TO)",
      type: "warm",
      items: [
        { bold: "Definice:", text: "Platnost A zcela stačí k tomu, abychom zaručili platnost B." },
        { bold: "Příklad VŠCHT:", text: "Být studentem VŠCHT zcela stačí k tomu, být vysokoškolákem." },
        { bold: "Příklad Chemie:", text: "Být glukózou zcela stačí k tomu, obsahovat atomy uhlíku." },
        { bold: "Příklad Řidičák:", text: "Mít legální řidičský průkaz stačí k tomu, mít věk alespoň 18 let." }
      ]
    },
    rightCard: {
      title: "2. Nutná Podmínka (B)",
      badge: "NUTNÁ (BEZ NÍ TO NEJDE)",
      type: "emerald",
      items: [
        { bold: "Definice:", text: "Bez platnosti B nemůže A vůbec nastat (¬B ⇒ ¬A)." },
        { bold: "Příklad VŠCHT:", text: "Být vysokoškolákem je nutné pro to, být studentem VŠCHT." },
        { bold: "Příklad Chemie:", text: "Obsahovat uhlík je nutnou podmínkou k tomu, být glukózou." },
        { bold: "Ekvivalence (Nutná i postačující):", text: "A ⇔ B nastává, když A stačí pro B a zároveň B je nutné pro A." }
      ]
    }
  });

  // 10. Quantifiers & Negation Rules
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Kvantifikátory (∀, ∃) a Pravidla Negace",
    leftCard: {
      title: "Přehled Kvantifikátorů",
      badge: "KVANTIFIKÁTORY",
      type: "neutral",
      items: [
        { bold: "∀ (Všeobecný kvantifikátor):", text: "Pro všechny, pro každý prvek množiny platí P(x)." },
        { bold: "∃ (Existenční kvantifikátor):", text: "Existuje alespoň jeden prvek množiny splňující P(x)." },
        { bold: "∃! (Kvantifikátor jednoznačnosti):", text: "Existuje právě jeden jediný prvek splňující P(x)." },
        { bold: "Pravidlo 1:", text: "Při negaci se kvantifikátor vždy zamění: ∀ ↔ ∃." },
        { bold: "Pravidlo 2:", text: "Vnitřní formule se zneguje: ¬P(x)." }
      ]
    },
    rightCard: {
      title: "Mnemotechnika: Studenti a Chytrost",
      badge: "MNEMOTECHNIKA",
      type: "warm",
      items: [
        { bold: "Negace ∀: ¬(Každý student je chytrý):", text: "K vyvrácení nepotřebujete, aby byli všichni hloupí! Stačí najít JEDINÉHO studenta, který chytrý není: ∃x: ¬P(x)." },
        { bold: "Negace ∃: ¬(Existuje chytrý student):", text: "Pokud není pravda, že existuje byť jediný chytrý student, pak nutně VŠICHNI do jednoho chytří nejsou: ∀x: ¬P(x)." },
        { bold: "Zlaté pravidlo:", text: "Vyvrátit 'všichni' je snadné (stačí 1 protipříklad). Vyvrátit 'existuje' vyžaduje zkontrolovat všechny!" }
      ]
    }
  });

  // 11. Chained Negations in Graph Networks
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "Složité Řetězené Negace v Grafových Sítích",
    leftCard: {
      title: "Příklad 1: Souvislost Grafu (Sítě)",
      badge: "SOUVISLOST SÍTĚ",
      type: "warm",
      items: [
        { bold: "Tvrzení (Síť je souvislá):", text: "∀u, v ∈ V: (u ≠ v ⇒ ∃ cesta P z u do v)." },
        { bold: "Postup negace:", text: "1. ∀u, v se změní na ∃u, v. 2. Negace implikace ¬(A ⇒ B) ≡ A ∧ ¬B. 3. ∃P se změní na ∀P." },
        { bold: "Formální negace:", text: "∃u, v ∈ V: (u ≠ v ∧ ∀ cestu P: P nespojuje u a v)." },
        { bold: "Slovní význam:", text: "Existuje dvojice uzlů, mezi nimiž neexistuje žádná spojující cesta (síť je rozpojená)." }
      ]
    },
    rightCard: {
      title: "Příklad 2: Slepá Ulička v Reakční Síti",
      badge: "REAKČNÍ SÍŤ",
      type: "neutral",
      items: [
        { bold: "Tvrzení (Z každého uzlu vede reakce):", text: "∀v ∈ V ∃w ∈ V: (v, w) ∈ E." },
        { bold: "Postup negace:", text: "1. ∀v se změní na ∃v. 2. ∃w se změní na ∀w. 3. (v, w) ∈ E se změní na (v, w) ∉ E." },
        { bold: "Formální negace:", text: "∃v ∈ V ∀w ∈ V: (v, w) ∉ E." },
        { bold: "Slovní význam:", text: "Existuje metabolit v, ze kterého nevede žádná enzymatická reakce (terminální metabolit / slepá ulička)." }
      ]
    }
  });

  // 12. 4 Proof Techniques Overview
  createThreeCardSlide(pres, {
    breadcrumb,
    title: "4 Základní Důkazové Techniky v AG1",
    cards: [
      {
        title: "Přímý Důkaz & Kontrapozice",
        badge: "DEDUKCE",
        type: "warm",
        items: [
          { bold: "Přímý důkaz (A ⇒ B):", text: "Vyjdeme z A a sérií úprav odvodíme B: A ⇒ A₁ ⇒ ... ⇒ B." },
          { bold: "Kontrapozice (¬B ⇒ ¬A):", text: "Místo A ⇒ B dokážeme ¬B ⇒ ¬A. Vhodné, když se s negovaným závěrem lépe pracuje." },
          { bold: "Ekvivalence:", text: "Kontrapozice je přesným logickým ekvivalentem původní implikace." }
        ]
      },
      {
        title: "Důkaz Sporem",
        badge: "ROZPOR",
        type: "rose",
        items: [
          { bold: "Předpoklad:", text: "Předpokládáme, že platí A a ZÁROVEŇ NEPLATÍ B (A ∧ ¬B)." },
          { bold: "Cíl:", text: "Logickým odvozováním dospět ke sporu (⚡ / ⊥) s větou, definicí či předpokladem A." },
          { bold: "Závěr:", text: "Předpoklad pro spor byl chybný, proto původní A ⇒ B musí platit." }
        ]
      },
      {
        title: "Matematická Indukce",
        badge: "INDUKCE",
        type: "emerald",
        items: [
          { bold: "Problémy s n prvky:", text: "Vhodné pro tvrzení závisející na velikosti grafu n = |V| nebo m = |E|." },
          { bold: "1. Báze indukce:", text: "Ověříme platnost pro nejmenší graf P(n₀)." },
          { bold: "2. Indukční krok:", text: "Z libovolného G_{n+1} dekonstrukcí vytvoříme G_n, aplikujeme IP a vrátíme prvek." }
        ]
      }
    ]
  });

  // 13. Worked Exercise: Minimum Degree deg(v) >= 2 implies Cycle
  createProofSlide(pres, {
    breadcrumb,
    title: "Řešená Úloha: deg(v) ≥ 2 Implikuje Existenci Cyklu",
    theorem: {
      statement: "Pokud v konečném grafu G = (V, E) má každý vrchol stupeň alespoň 2 (∀v ∈ V: deg(v) ≥ 2), pak graf G nutně obsahuje alespoň jeden cyklus.",
      context: "Základní grafová věta. Vyjadřuje intuici bludiště: pokud z každé místnosti vedou alespoň 2 dveře, nelze uvíznout ve slepé uličce a musíme uzavřít kruh.",
      strategy: "Přímý důkaz pomocí výběru nejdelší prosté cesty P v grafu."
    },
    steps: [
      { step: "1. Zvolení nejdelší cesty", text: "Protože graf G je konečný, existuje v něm nejdelší prostá cesta P = (v₁, v₂, ..., v_k)." },
      { step: "2. Analýza koncového uzlu v_k", text: "Uzel v_k má deg(v_k) ≥ 2. Jeden jeho soused je v_{k-1} na cestě. Kde leží jeho druhý soused?" },
      { step: "3. Soused mimo cestu nemůže existovat", text: "Kdyby měl v_k souseda u ∉ P, mohli bychom cestu prodloužit o u, což odporuje tomu, že P je nejdelší možná!" },
      { step: "4. Zpětná hrana uzavírá cyklus", text: "Druhý soused v_i tedy nutně leží na cestě P (1 ≤ i ≤ k - 2). Hrana {v_k, v_i} spolu s úsekem cesty mezi v_i a v_k tvoří uzavřený cyklus!" }
    ],
    takeaway: "Nalezli jsme cyklus (v_i, v_{i+1}, ..., v_k, v_i). Tvrzení je dokázáno přímo. Q.E.D."
  });
}
