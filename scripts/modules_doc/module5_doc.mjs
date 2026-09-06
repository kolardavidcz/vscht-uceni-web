/**
 * Module 5: Indukce na Grafech & Redukční Past
 * 1:1 match to src/features/bioinformatics/content/3-semestr/pre-ag1/dml-indukce-na-grafech.md
 */
import {
  createDocSlide,
  renderDocHeading,
  renderDocParagraph,
  renderDocList,
  renderDocCallout,
  renderDocTable,
  colors,
  fs
} from "../pptx_document_engine.mjs";

export function addModule5Slides(pres) {
  const breadcrumb = "MODUL 5 · 🎯 INDUKCE NA GRAFECH & REDUKČNÍ PAST";

  // --------------------------------------------------------------------------
  // Slide 5.1: Titul & Dominová analogie
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Indukce na Grafech & Redukční Past", { level: 1, y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Cíl kapitoly:",
      text: "Pochopit, jak se v matematice dokazuje tvrzení pro všechny grafy najednou — a vyhnout se pasti, do které padne polovina studentů u zkoušky z AG1.",
      y,
    });

    y = renderDocHeading(pres, slide, "🎯 Dominová analogie (vážně, takhle to funguje)", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Znáš dominový efekt? Postavíš řadu kostek a první padne na druhou, druhá na třetí... Matematická indukce je přesně tohle:",
      { y }
    );

    y = renderDocList(slide, [
      "**1. Báze:** Ukážeš, že první kostka padne. *(Tvrzení platí pro nejmenší případ $n_0$.)*",
      "**2. Krok:** Ukážeš, že POKUD kostka č. $k$ padne, NUTNĚ padne i kostka č. $k+1$. *(Z pravdivosti pro $k$ plyne pravdivost pro $k+1$.)*",
      "**3. Závěr:** Všechny kostky padnou. *(Tvrzení platí pro všechna $n$.)*"
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Intuice pro grafy:",
      text: "Na grafech to funguje stejně — jen místo „kostky č. k“ říkáme „graf s k vrcholy“. A klíčový trik je, že nestavíme grafy od nuly nahoru, ale ROZEBÍRÁME JE OD VĚTŠÍCH K MENŠÍM (dekonstrukce)!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.2: Příklad s mincemi 3 Kč a 5 Kč (Slabá Indukce)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "☕ Příklad: Platba mincemi (3 Kč a 5 Kč) — Slabá vs. Silná Indukce", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Dokážeme, že pomocí mincí s hodnotami **3 Kč a 5 Kč** lze přesně vyplatit libovolnou celočíselnou částku ve výši **alespoň 8 Kč** ($n \\ge 8$).",
      { y }
    );

    y = renderDocHeading(pres, slide, "Metoda 1: Důkaz Slabou Indukcí (Pravidla výměny mincí)", { level: 3, y });

    y = renderDocList(slide, [
      "**Báze indukce (n = 8):** $8 = 3 + 5$ Kč. Tvrzení platí ✅.",
      "**Indukční krok (n ➔ n + 1):** Předpokládejme, že částku $n$ Kč již máme vyplacenu v mincích 3 a 5 Kč (IP). Podle obsahu peněženky rozlišíme 3 situace:",
      "• **Případ A (V peněžence je 5 Kč):** Jednu 5 Kč odebereme a nahradíme dvěma 3 Kč ($5 \\to 3 + 3$). Čistá změna: $-5 + 6 = +1$ Kč.",
      "• **Případ B (Máme 5 Kč i 3 Kč):** Pětikorunu vyměníme za dvě tříkoruny ($5 \\to 3+3$), získáme trojici $3+3+3$. Čistá změna: $+1$ Kč.",
      "• **Případ C (Máme jen 3 Kč mince):** Protože $n \\ge 8$, musíme mít alespoň tři 3 Kč ($3 \\times 3 = 9$). Nahradíme je dvěma pětikorunami ($3+3+3 \\to 5+5$). Čistá změna: $-9 + 10 = +1$ Kč!"
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Závěr slabé indukce:",
      text: "Ve všech případech jsme z libovolné výplaty n Kč sestrojili výplatu n + 1 Kč. Tvrzení platí pro všechna n ≥ 8.",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.3: Metoda 2: Důkaz Silnou Indukcí (Krok o 3 Kč zpět)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Metoda 2: Důkaz Silnou Indukcí (Krok o 3 Kč zpět: n+1 z n-2)", { level: 3, y });

    y = renderDocParagraph(slide,
      "Zde si vystačíme bez jakékoliv výměny mincí v peněžence — stačí nám **3 základní bázové případy** a v indukčním kroku se vždy odvoláme na stav o **3 Kč menší**:",
      { y }
    );

    y = renderDocList(slide, [
      "**Báze indukce (3 po sobě jdoucí částky):**",
      "• Pro $n = 8$: $8 = 3 + 5$ Kč ✅.",
      "• Pro $n = 9$: $9 = 3 + 3 + 3$ Kč ✅.",
      "• Pro $n = 10$: $10 = 5 + 5$ Kč ✅.",
      "**Indukční krok (od n + 1 ≥ 11):**",
      "• Předpokládejme, že **všechny částky** od 8 do $n$ Kč již umíme vyplatit (Silný IP).",
      "• Chceme vyplatit částku $n + 1$ Kč (kde $n + 1 \\ge 11$).",
      "• Vezmeme částku o 3 Kč menší: $(n + 1) - 3 = n - 2$ Kč. Protože $n + 1 \\ge 11$, platí $n - 2 \\ge 8$.",
      "• Dle silného IP částku $n - 2$ Kč umíme vyplatit. K této sestavě mincí **přidáme jednu 3 Kč minci**:\n$$(n - 2) + 3 = n + 1 \\text{ Kč}$$"
    ], { y });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Proč je Silná indukce elegantnější?",
      text: "Nevyžaduje žádná složitá pravidla výměny mincí. Pravidlo báze: o kolik kroků zpět dekonstruujeme (krok o 3), tolik bází musíme ověřit ručně (3 báze: 8, 9, 10).",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.4: 1. Peano Axiomy a Princip Indukce na Grafech
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "1. Peano Axiomy a Princip Matematické Indukce na Grafech", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V klasické algebře dokazujeme tvrzení pro čísla $n \\in \\mathbb{N}$. V teorii grafů představuje induktivní proměnná **velikost grafové struktury**:",
      { y }
    );

    y = renderDocList(slide, [
      "**Počet vrcholů n = |V|:** Počet atomů v molekule, proteinů v PPI síti, routerů na síti.",
      "**Počet hran m = |E|:** Počet chemických vazeb, metabolických reakcí, síťových spojení."
    ], { y });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Formální zápis silné indukce (neučte se nazpaměť!):",
      text: "(P(n₀) ∧ ∀k ≥ n₀ : (⋀ᵢ=n₀ᵏ P(i) ⇒ P(k+1))) ⇒ ∀n ≥ n₀ : P(n). Velký symbol ⋀ je jen konjunkce AND pro všechny mezistavy od n₀ do k (stejně jako ∑ je velký součet).",
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Klíčový rozdíl při aplikaci na grafy:",
      text: "Číslo n+1 vznikne prostým přičtením jedničky (n + 1). Ale graf o n+1 vrcholech má obrovské množství různých topologií! Proto u grafů musíme postupovat dekonstrukcí shora!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.5: 2. CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční Indukce
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "2. 🚨 CRITICAL EXAM TRAP: Redukční vs. Dekonstrukční Indukce", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Toto je vůbec **nejčastější důvod pro udělení 0 bodů** u zkouškových důkazů z AG1 na FIT ČVUT!",
      { y }
    );

    y = renderDocHeading(pres, slide, "❌ Špatný postup (Tzv. Redukční / Konstrukční past):", { level: 3, y });

    y = renderDocCallout(pres, slide, {
      type: "warning",
      title: "Typická fatální chyba studenta:",
      text: "„Předpokládejme, že tvrzení platí pro graf Gₙ s n vrcholy. Nyní sestrojíme nový graf Gₙ₊₁ tak, že k Gₙ přidáme jeden nový vrchol v a připojíme ho hranami k nějakým vrcholům...“",
      y,
    });

    y = renderDocHeading(pres, slide, "💥 Proč vyučující udělují okamžitých 0 bodů?", { level: 4, y, showUnderline: false });

    y = renderDocParagraph(slide,
      "Pokud začnete od grafu $G_n$ a **přidáte** nový prvek, dokázali jste tvrzení **POUZE pro ty grafy o n+1 vrcholech, které lze vytvořit tímto konkrétním přidáním**! Neověřili jste, zda každý obecný graf s n+1 vrcholy lze takto vybudovat. Opomněli jste celou třídu grafů! Váš důkaz neplatí pro všechny platné grafy.",
      { y }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 5.6: ✅ Správný postup: Dekonstrukční Indukce z Podgrafů
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "✅ Správný postup: Dekonstrukční Indukce z Podgrafů", { level: 3, y });

    y = renderDocCallout(pres, slide, {
      type: "tip",
      title: "Zlatá formulace pro zkoušku z AG1:",
      text: "„Vezměme LIBOVOLNÝ ZADANÝ graf G = (V, E) o n+1 vrcholech splňující předpoklady. Najdeme v něm vhodný prvek (list či uzel min stupně), odebereme ho a získáme podgraf G' o n vrcholech. Ověříme, že G' stále splňuje předpoklady. Použijeme Indukční předpoklad (IP) na G'. Nakonec prvek vrátíme a dokážeme platnost pro původní G.“",
      y,
    });

    // ASCII myšlenkový tok
    const boxW = 11.0;
    const boxH = 2.2;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.166,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F0FDF4" },
      line: { color: "BBF7D0", width: 1.5 },
    });
    slide.addText(
      "┌──────────────────────────────────────────────────────────┐\n│ LIBOVOLNÝ Graf G o velikosti (n+1)                       │ ◄─── ZAČÍNÁME ZDE! (Libovolný objekt)\n└────────────────────────────┬─────────────────────────────┘\n                             │ 1. Odebereme prvek / list / hranu\n                             ▼\n┌──────────────────────────────────────────────────────────┐\n│ Podgraf G' o velikosti (n)                               │ ◄─── APLIKUJEME INDUKČNÍ PŘEDPOKLAD!\n└────────────────────────────┬─────────────────────────────┘\n                             │ 2. Dle IP tvrzení na G' platí\n                             ▼\n┌──────────────────────────────────────────────────────────┐\n│ Vrátíme odebraný prvek a dokážeme platnost pro původní G │ ◄─── ZÁVĚR pro G(n+1)\n└──────────────────────────────────────────────────────────┘",
      {
        x: 1.366,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: "047857",
        lineSpacingMultiple: 1.15,
      }
    );
    y += boxH + 0.15;

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Rozdíl v jednom slově:",
      text: "Konstrukce = zdola nahoru (chyba, 0 b). Dekonstrukce = shora dolů z libovolného zadaného objektu (správně, 100 % b)!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.7: 3. Růst Počtu Hran při Dekonstrukci Sítě: Vrcholy Stupně 3
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "3. Růst Počtu Hran při Dekonstrukci Sítě: Vrcholy Stupně 3", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V biologických a chemických sítích často pracujeme s uzly, které mají fixní valenci: $sp^2$ uhlíkové atomy v aromatických kruzích a grafenu se vážou právě se **3 sousedy** ($\\deg(v) = 3$). V informatice se sítím, kde má každý uzel stupeň 3, říká **kubické sítě**.",
      { y }
    );

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Tvrzení (Rekurentní vztah pro počet hran):",
      text: "Nechť G = (V, E) obsahuje vrchol v se stupněm deg(v) = 3. Pokud vrchol v odebereme, získáme podgraf G' = G \\ {v} o n - 1 vrcholech. Mezi počtem hran platí přesný vztah:\nE(n) = E(n-1) + 3",
      y,
    });

    // ASCII schéma dekonstrukce
    const boxW = 10.0;
    const boxH = 1.8;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.666,
      y,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: "F8FAFC" },
      line: { color: colors.borderSubtle, width: 1 },
    });
    slide.addText(
      "       (u₁)                                        (u₁)\n      /                                             \n   (v) ──── (u₂)    ═══ Odebrání vrcholu v ═══>          (u₂)\n      \\             (zaniknou přesně 3 hrany)       \n       (u₃)                                        (u₃)\n ┌──────────────────────┐                     ┌────────────────────────┐\n │ Graf G o n vrcholech │                     │ Podgraf G' o n-1 vrch. │\n └──────────────────────┘                     └────────────────────────┘",
      {
        x: 1.866,
        y: y + 0.15,
        w: boxW - 0.4,
        h: boxH - 0.3,
        fontFace: "Courier New",
        fontSize: fs(9),
        color: colors.textPrimary,
        lineSpacingMultiple: 1.15,
      }
    );
  }

  // --------------------------------------------------------------------------
  // Slide 5.8: Zlaté pravidlo teorie grafů: E(n) = E(n-1) + deg(v)
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "Zlaté Pravidlo Teorie Grafů: E(n) = E(n-1) + deg(v)", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "Tento vztah vám okamžitě odemkne celou teorii grafů a sjednotí všechny zdánlivě různé vzorce:",
      { y }
    );

    y = renderDocTable(slide, {
      headers: ["Typ grafu / uzlu", "Co odebíráme při dekonstrukci", "Rekurence pro počet hran", "Výsledný vzorec"],
      rows: [
        ["Strom", "List (stupeň deg(v) = 1)", "E(n) = E(n-1) + 1", "m = n - 1"],
        ["Cesta / Kružnice", "Běžný uzel (stupeň deg(v) = 2)", "E(n) = E(n-1) + 2", "m = n (pro kružnici)"],
        ["Kubická síť (3-regulární)", "Uzel se 3 vazbami (deg(v) = 3)", "E(n) = E(n-1) + 3", "Roste o +3 na každý uzel"]
      ],
      colWidths: [3.0, 3.4, 3.2, 2.133],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Univerzální princip dekonstrukce:",
      text: "Kolik hran má odebíraný vrchol deg(v), o tolik se liší počet hran mezi grafem o n vrcholech a jeho podgrafem o n - 1 vrcholech. U stromu je to +1, u cyklu +2, u trojvazné sítě +3. Všechny tyto důkazy mají identickou strukturu!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.9: 4. Stromy v Letní Přípravě: Proč má strom m = n - 1 hran
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "4. Stromy v Letní Přípravě: Proč má strom m = n - 1 hran", { level: 2, y, showUnderline: true });

    y = renderDocCallout(pres, slide, {
      type: "note",
      title: "Základní intuitivní definice:",
      text: "Strom je souvislý graf, který neobsahuje žádné cykly. Koncovým vrcholům se stupněm deg(v) = 1 říkáme listy. Každý strom s alespoň 2 vrcholy má minimálně dva listy.",
      y,
    });

    y = renderDocHeading(pres, slide, "✍️ Důkaz dekonstrukcí shora:", { level: 3, y });

    y = renderDocList(slide, [
      "1. **Začátek (Dekonstrukce shora):** Vezměme libovolný strom $T$ s $n$ vrcholy ($n \\ge 2$).",
      "2. **Odebrání listu:** Najdeme koncový list $v$ (který má $\\deg(v) = 1$) a odebereme ho i s jeho jedinou hranou.",
      "3. **Co se stane s grafem:**",
      "   • Počet vrcholů klesne o 1: $n \\to n - 1$.",
      "   • Počet hran klesne přesně o 1: $m \\to m - 1$ (podle pravidla $E(n) = E(n-1) + 1$).",
      "   • Zbytek je stále souvislý strom bez cyklů!",
      "4. **Závěr:** Budeme-li listy odebírat dál a dál, v každém kroku ubude 1 vrchol a 1 hrana, až nám zbude **1 vrchol a 0 hran**. Proto má strom vždy o 1 hranu méně než vrcholů: **m = n - 1**."
    ], { y });
  }

  // --------------------------------------------------------------------------
  // Slide 5.10: 5 Ekvivalentních definic stromu & Tree Leaf Lemma
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "🎓 Pro zájemce do AG1: 5 Ekvivalentních Definic Stromu", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V kurzu AG1 dostanete těchto 5 vlastností jako hotové věty. Pro libovolný konečný graf $G = (V, E)$ s $n = |V|$ vrcholy jsou následující tvrzení **zcela ekvivalentní**:",
      { y }
    );

    y = renderDocList(slide, [
      "1. G je **strom** (je souvislý a nemá cykly).",
      "2. G je **acyklický** a má přesně **m = n - 1** hran.",
      "3. G je **souvislý** a má přesně **m = n - 1** hran.",
      "4. Mezi každou dvojicí různých vrcholů existuje **právě jedna jednoduchá cesta**.",
      "5. G je **minimální souvislý graf** (odebráním libovolné hrany se graf rozpadne na dvě komponenty)."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "🍃 Důkaz existence listu (Tree Leaf Lemma):",
      text: "Zvolme ve stromu nejdelší cestu P = (v₀, v₁, …, vₖ). Koncový vrchol vₖ nemůže mít souseda mimo cestu (spor s maximalitou P) ani jiného souseda na cestě (jinak cyklus!). Jediným sousedem vₖ je tedy vₖ₋₁, což znamená deg(vₖ) = 1 — uzel vₖ je list! Strom má alespoň 2 listy (v₀ a vₖ).",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.11: 5. Orientované Sítě bez Cyklů (DAGy) a Topologické Uspořádání
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "5. Propojení s Bioinformatikou: Orientované Sítě bez Cyklů (DAGy)", { level: 2, y, showUnderline: true });

    y = renderDocParagraph(slide,
      "V bioinformatice studujeme procesy, které tečou jedním směrem (metabolické dráhy, signální kaskády). Pokud v nich nedochází ke zpětným smyčkám, nazýváme je **DAG** (*Directed Acyclic Graph*):",
      { y }
    );

    y = renderDocList(slide, [
      "**1. Zdroj (Source):** Počáteční metabolit, do kterého žádná reakce nevstupuje ($\\text{deg}^-(u) = 0$, např. vstupní glukóza).",
      "**2. Výtok (Sink):** Finální metabolit, ze kterého už žádná reakce nepokračuje ($\\text{deg}^+(w) = 0$, např. finální odpadní produkt / pyruvát).",
      "**3. Topologické uspořádání:** Díky absenci cyklů lze celou metabolickou dráhu **seřadit v čase zleva doprava** tak, že všechny reakční šipky míří výhradně doprava."
    ], { y });

    renderDocCallout(pres, slide, {
      type: "note",
      title: "Důkaz existence Topologického řazení dekonstrukční indukcí:",
      text: "Vezmeme libovolný DAG G o n+1 vrcholech. Najdeme zdroj u (deg⁻(u) = 0), odebereme ho a zbylý DAG G' o n vrcholech seřadíme dle IP. Zdroj u předřadíme na 1. místo. Protože do u nic nevstupovalo, všechny jeho hrany vedou doprava. Řazení je hotové!",
      y,
    });
  }

  // --------------------------------------------------------------------------
  // Slide 5.12: Bonusové úlohy & Shrnutí modulu
  // --------------------------------------------------------------------------
  {
    const slide = createDocSlide(pres, { breadcrumb });
    let y = 0.85;

    y = renderDocHeading(pres, slide, "6. Přehled: Co je Základ Letní Přípravy pro AG1", { level: 2, y, showUnderline: true });

    y = renderDocTable(slide, {
      headers: ["Dovednost pro letní přípravu", "Status"],
      rows: [
        ["Rozdíl mezi dekonstrukcí (shora dolů) a konstrukcí (zdola nahoru)", "✅ Zvládáte (vyhnete se 0 bodům)"],
        ["Velikost báze podle kroku odebírání (krok o 3 ➔ 3 báze; krok o 6 ➔ 6 bází)", "✅ Zvládáte"],
        ["Pravidlo růstu hran při dekonstrukci: E(n) = E(n-1) + deg(v)", "✅ Zvládáte"],
        ["Proč má strom m = n - 1 hran (odebírání listů stupně 1)", "✅ Zvládáte"]
      ],
      colWidths: [8.5, 3.233],
      y,
    });

    renderDocCallout(pres, slide, {
      type: "tip",
      title: "Bonusové procvičovací úlohy:",
      items: [
        "Úloha 1 (Bipartitnost stromů): Každý strom lze 2-obarvit. Důkaz dekonstrukcí: odebereme list v, obarvíme zbytek dle IP, list v vrátíme a dáme mu opačnou barvu než má soused.",
        "Úloha 2 (Počet hran v lese): Les s n vrcholy a c stromy má m = n - c hran. Důkaz indukcí podle hran: odebráním hrany se jedna komponenta rozpadne na dvě (c' = c + 1)."
      ],
      y,
    });
  }
}
