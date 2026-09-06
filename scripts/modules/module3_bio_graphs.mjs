/**
 * Module 3: Bio-Intuice & Co je Graf
 * Source: src/features/bioinformatics/content/3-semestr/pre-ag1/dml-bio-grafy.md
 * Exact 1:1 text fidelity with website markdown.
 */
import {
  createLectureDividerSlide,
  createTwoCardSlide
} from "../pptx_engine.mjs";

export function addModule3Slides(pres) {
  const breadcrumb = "3 · Bio-Intuice & Co je Graf";

  // 1. Lecture Divider
  createLectureDividerSlide(pres, {
    lectureNumber: 3,
    title: "Bio-Intuice & Co je Graf",
    goal: "Cíl kapitoly: Vybudovat neotřesitelný základ pro diskrétní matematiku a teorii grafů. Přeložíme vaši přirozenou bioinformatickou a chemickou intuici (molekulární struktury, metabolické reakční sítě, protein-proteinové interakce, fylogenetické stromy a sekvenování DNA) do srozumitelného jazyka grafů G = (V, E), abyste přesně věděli, co je vrchol, hrana, strom a cyklus ještě před první přednáškou z AG1 na FIT ČVUT.",
    topics: [
      "🗺️ Co je to vlastně graf? (Opravdu, bez vzorců)",
      "Představa mapy metra: Stanice (vrcholy) a Koleje (hrany)",
      "Grafy kolem nás: Sociální síť, metabolická dráha, internet, PPI",
      "1. Předmluva: Proč Bioinformatik Potřebuje Teoretickou Informatiku?",
      "🧬 Molekula Glukózy jako Neorientovaný Graf G = (V, E)",
      "Vrcholy V (Atomy O, C₁–C₆, OH) a Hrany E (Kovalentní vazby)",
      "⚡ Metabolická Dráha Glykolýzy jako Orientovaný Graf (DAG)",
      "Metabolity, enzymatické reakce a jednosměrnost bez cyklů",
      "2. Co je to Strom a co je to Cyklus v Grafu? [KLÍČOVÝ ROZDÍL]",
      "🌲 Strom (Fylogeneze LUCA) vs. 🔄 Cyklus (Krebsův cyklus)"
    ]
  });

  // 2. Section: Co je to vlastně graf? (Opravdu, bez vzorců)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "🗺️ Co je to Vlastně Graf? (Opravdu, bez Vzorců)",
    leftCard: {
      title: "Mapa Metra (Představa bez Vzorců)",
      badge: "INTUICE",
      type: "neutral",
      items: [
        { bold: "Nejsou to funkce ze střední školy:", text: "Ty grafy, o kterých bude celý tento kurz, nejsou grafy funkcí ze střední školy (y = x² apod.). Jsou to úplně jiná zvířata." },
        { bold: "Nejsnazší způsob představy:", text: "Mapa metra (Muzeum ── Náměstí Míru / Florenc ── Hlavní nádraží)." },
        { bold: "Stanice:", text: "= vrcholy (uzly) grafu." },
        { bold: "Koleje mezi stanicemi:", text: "= hrany grafu." },
        { bold: "Podstata:", text: "To je vše. Graf = věci + spojení mezi nimi." }
      ]
    },
    rightCard: {
      title: "Jakmile Tohle Pochopíš, Uvidíš Grafy Všude",
      badge: "PŘÍKLADY",
      type: "warm",
      items: [
        { bold: "Sociální síť:", text: "lidé = vrcholy, přátelství = hrany." },
        { bold: "Metabolická dráha:", text: "metabolity = vrcholy, enzymatické reakce = hrany." },
        { bold: "Internet:", text: "routery = vrcholy, kabely = hrany." },
        { bold: "Protein-proteinová interakce:", text: "proteiny = vrcholy, fyzická vazba = hrana." },
        { bold: "Intuice bez vzorce:", text: "Graf je způsob, jak zakreslit, co je s čím spojeno. Matematický jazyk nám pak umožní o těchto spojeních přesně uvažovat a dokazovat věci." }
      ]
    }
  });

  // 3. Section 1: Proč Bioinformatik Potřebuje Teoretickou Informatiku?
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "1. Proč Bioinformatik Potřebuje Teoretickou Informatiku?",
    leftCard: {
      title: "Vizuální a Přírodovědný Pohled",
      badge: "BIOLOGIE & CHEMIE",
      type: "neutral",
      items: [
        { bold: "V biologii a chemii jste zvyklí:", text: "nahlížet na složité systémy vizuálně a přírodovědně." },
        { bold: "Molekula glukózy:", text: "Vidíte molekulu glukózy a chápete její prostorovou konformaci a chemické kovalentní vazby mezi atomy Uhlíku, Kyslíku a Vodíku." },
        { bold: "Metabolická dráha:", text: "Vidíte metabolickou dráhu glykolýzy a vnímáte ji jako posloupnost enzymatických přeměn jednoho substrátu v druhý." }
      ]
    },
    rightCard: {
      title: "Radikální Proměna Akademického Jazyka",
      badge: "KURZ AG1 FIT ČVUT",
      type: "warm",
      items: [
        { bold: "Vstup do kurzu AG1:", text: "Jakmile vstoupíte do kurzu AG1 (Algoritmy a Grafy 1) na FIT ČVUT, akademický jazyk se radikálně promění:" },
        { bold: "Místo chemické molekuly:", text: "pracujete s neorientovaným grafem G = (V, E)." },
        { bold: "Místo enzymatické reakce:", text: "pracujete s orientovanou hranou e = (u, v) ∈ E v orientovaném acyklickém grafu (DAG)." }
      ]
    }
  });

  // 4. Section: Molekula Glukózy jako Neorientovaný Graf
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "🧬 Molekula Glukózy jako Neorientovaný Graf",
    leftCard: {
      title: "V Chemii C₆H₁₂O₆, v Informatice G = (V, E)",
      badge: "NEORIENTOVANÝ GRAF",
      type: "warm",
      items: [
        { bold: "Vrcholy V (Atomy):", text: "Jednotlivé atomy tvoří uzly sítě (C₁, …, C₆, O_kruh, …)." },
        { bold: "Hrany E (Kovalentní vazby):", text: "Sdílený elektronový pár mezi dvěma atomy tvoří neorientovanou hranu {u, v}. Vazba působí vzájemně — nemá žádný „směr šipky“." },
        { bold: "Formální popis:", text: "Množina vrcholů V = {v₁, v₂, …, v₁₂} (atomy O, C₁–C₆ a OH), množina neorientovaných hran E = {e₁, e₂, …, e₁₂} (kovalentní vazby: e₁ = {v₁, v₂}, e₂ = {v₂, v₃}, …)." }
      ]
    },
    rightCard: {
      title: "Rozpad Vrcholů a Vazeb Molekuly",
      badge: "STRUKTURA VAZEB",
      type: "neutral",
      items: [
        { bold: "Vrchol v₁:", text: "Kruhový atom kyslíku O." },
        { bold: "Vrcholy v₂ až v₇:", text: "Uhlíky kruhu C₁ až C₆ propojené vazbami e₁ až e₇." },
        { bold: "Vrcholy v₈ až v₁₂:", text: "Hydroxylové substituenty OH napojené vazbami e₈ až e₁₂." },
        { bold: "Symetrie vazeb:", text: "Hrana {v₁, v₂} je neuspořádaná dvojice, vazba působí obousměrně." }
      ]
    }
  });

  // 5. Section: Metabolická Dráha Glykolýzy jako Orientovaný Graf (DAG)
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "⚡ Metabolická Dráha Glykolýzy jako Orientovaný Graf (DAG)",
    leftCard: {
      title: "Kaskáda Enzymatických Reakcí",
      badge: "ORIENTOVANÝ GRAF (DAG)",
      type: "emerald",
      items: [
        { bold: "Jednosměrnost reakcí:", text: "Při odbourávání cukru v buňce probíhá kaskáda enzymatických reakcí. Každá reakce je jednosměrná (spotřebovává energii či uvolňuje teplo)." },
        { bold: "Vrcholy V (Metabolity):", text: "Chemické látky v buňce (Glukóza, Glukóza-6-fosfát, Fruktóza-6-fosfát, Fruktóza-1,6-bisP, Pyruvát)." },
        { bold: "Hrany E (Enzymatické reakce):", text: "Orientované šipky (u, v) ∈ V × V. Reakce jde z výchozího substrátu u do výsledného produktu v." },
        { bold: "Acykličnost (DAG):", text: "Glykolýza je přímá energetická dráha — metabolity se v ní netočí dokola, ale směřují k pyruvátu." }
      ]
    },
    rightCard: {
      title: "Orientovaný Graf (DAG) Začátku Glykolýzy",
      badge: "FORMÁLNÍ POPIS",
      type: "neutral",
      items: [
        { bold: "Množina vrcholů:", text: "V = {v₁, v₂, v₃, v₄} (Glukóza v₁, Glukóza-6-P v₂, Fruktóza-6-P v₃, Fruktóza-1,6-bisP v₄)." },
        { bold: "Množina orientovaných hran:", text: "E = {e₁, e₂, e₃} = {(v₁, v₂), (v₂, v₃), (v₃, v₄)}." },
        { bold: "Enzymatické kroky:", text: "e₁ (Hexokináza, -1 ATP), e₂ (PGI), e₃ (PFK-1, -1 ATP)." },
        { bold: "Klíčová vlastnost:", text: "V DAGu nelze po šipkách obejít kolečko zpět!" }
      ]
    }
  });

  // 6. Section 2: Co je to Strom a co je to Cyklus v Grafu?
  createTwoCardSlide(pres, {
    breadcrumb,
    title: "2. Co je Strom a co Cyklus? [KLÍČOVÝ ROZDÍL]",
    leftCard: {
      title: "🌲 Strom (Acyklický Souvislý Graf)",
      badge: "ŽÁDNÉ SMYČKY",
      type: "emerald",
      items: [
        { bold: "Definice:", text: "Souvislý graf, který neobsahuje žádný cyklus." },
        { bold: "Unikátní vlastnost:", text: "Mezi libovolnými dvěma vrcholy existuje právě jedna jediná cesta!" },
        { bold: "Biologický příklad:", text: "Fylogenetický strom taxonů V = {v₁, …, v₇} propojených evolučními větvemi E = {e₁, …, e₆} od kořene LUCA (v₁)." },
        { bold: "Vlastnost:", text: "Žádné smyčky — větve se rozbíhají a nikdy se zpětně nespojují." }
      ]
    },
    rightCard: {
      title: "🔄 Cyklus (Uzavřený Okruh)",
      badge: "NÁVRAT DO VÝCHOZÍHO BODU",
      type: "rose",
      items: [
        { bold: "Definice:", text: "Uzavřená posloupnost hran, kde z libovolného uzlu vyrazíte a vrátíte se do něj zpět." },
        { bold: "Důsledek:", text: "Umožňuje opakování, zpětnou vazbu a oscilace. Vede k existenci více různých cest." },
        { bold: "Biologický příklad:", text: "Krebsův citrátový cyklus V = {v₁, …, v₅} (OAA, Cit, αKG, Suc, Mal) s orientovanými reakcemi E = {e₁, …, e₅} = {(v₁, v₂), (v₂, v₃), (v₃, v₄), (v₄, v₅), (v₅, v₁)}." },
        { bold: "Vlastnost:", text: "Návrat do výchozího bodu regeneruje oxalacetát pro další cyklus oxidace." }
      ]
    }
  });
}
