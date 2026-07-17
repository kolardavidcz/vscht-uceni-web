import { WorksheetItem } from '../types';

// The worksheet data - correctEmojis are HIDDEN from students
export const worksheetData: WorksheetItem[] = [
  {
    "id": "gneg-header",
    "name": "A) Bakterie s buněčnou stěnou gramnegativního typu",
    "correctEmojis": [
      "\u{1F534}"
    ]
  },
  {
    "id": "aquificota",
    "name": "Kmen Aquificota (dříve Aquificales/Aquifex)",
    "type": "Kmen",
    "description": "Jedná se o evolučně nejstarší bakteriální kmen. Malá koncentrace ribozomálních proteinů, glycerol diethery v membráně, odlišné mastné kyseliny.",
    "correctEmojis": [
      "\u{1F534}",
      "\u{1F32D}",
      "\u{1F525}",
      "\u{1F4A8}",
      "\u{1F9EA}",
      "\u{1FAA8}",
      "\u{1F3C3}",
      "\u{1F4A7}"
    ],
    "children": [
      {
        "id": "aquifex",
        "name": "Rod Aquifex",
        "type": "Rod",
        "correctEmojis": [
          "\u{1F534}",
          "\u{1F32D}",
          "\u{1F525}",
          "\u{1F4A8}",
          "\u{1F9EA}",
          "\u{1FAA8}",
          "\u{1F3C3}",
          "\u{1F4A7}"
        ]
      }
    ]
  },
  {
    "id": "thermotogota",
    "name": "Kmen Thermotogota (dříve Thermotogae)",
    "type": "Kmen",
    "description": "Charakteristické vnější obaly připomínající 'tógu'. Běžně získávané z hlubinných mořských hydrotermálních průduchů. Využívají Embden-Meyerhofovu dráhu, obsahují etherové vazby v lipidech.",
    "correctEmojis": [
      "\u{1F534}",
      "\u{1F32D}",
      "\u{1F525}",
      "\u{1F6AB}\u{1F4A8}",
      "\u{1F36C}",
      "\u{1F4A7}"
    ],
    "children": []
  },
  {
    "id": "pseudomonadota",
    "name": "Kmen Pseudomonadota (dříve Proteobacteria)",
    "type": "Kmen",
    "description": "Fylogeneticky i metabolicky enormně rozmanitá skupina bakterií. Dělí se do 6 tříd: Alpha-, Beta-, Gamma-, Delta-, Zeta- a Epsilonproteobacteria.",
    "correctEmojis": [
      "\u{1F534}"
    ],
    "children": [
      {
        "id": "alpha",
        "name": "Třída Alphaproteobacteria",
        "type": "Třída",
        "description": "Třída zahrnující významné symbionty, parazity, ale i metanotrofní a nitrifikační organismy.",
        "correctEmojis": [],
        "children": [
          {
            "id": "acetobacter",
            "name": "Rod Acetobacter",
            "type": "Rod",
            "description": "Zásadní rod pro průmyslovou přeměnu etanolu. Často se přirozeně vyskytují na květech nebo na zkvašeném ovoci.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F9EA}",
              "\u{1F331}",
              "\u{1F95B}"
            ]
          },
          {
            "id": "rickettsia",
            "name": "Rod Rickettsia",
            "type": "Rod",
            "description": "Původci závažných horečnatých infekcí (např. skvrnitý tyfus). Množí se výhradně v cytoplazmě hostitelských buněk, zejména v endotelu cév.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F9DB}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F577}\uFE0F",
              "\u{1FAAB}"
            ]
          },
          {
            "id": "rhizobium",
            "name": "Rod Rhizobium",
            "type": "Rod",
            "description": "Díky enzymu nitrogenáze zajišťují fixaci atmosférického dusíku u luštěnin tvorbou kořenových hlízek. Běžně přidávány jako očkovací látka do osiva.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F3C3}",
              "\u{1F331}",
              "N",
              "\u{1F91D}"
            ]
          },
          {
            "id": "agrobacterium",
            "name": "Rod Agrobacterium",
            "type": "Rod",
            "description": "Indukují vznik nádorů u rostlin pomocí transferu Ti-plasmidu. Tohoto principu se rozsáhle využívá jako vektoru pro transgenozi v biotechnologickém průmyslu.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F3C3}",
              "\u{1F331}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F9EC}"
            ]
          },
          {
            "id": "brucella",
            "name": "Rod Brucella",
            "type": "Rod",
            "description": "Vyvolávají onemocnění s undulující horečkou zvané brucelóza. Dokážou přežívat a množit se uvnitř buněk retikuloendoteliálního systému.",
            "correctEmojis": [
              "\u{1F534}",
              "\u26AA",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F404}",
              "\u{1F9D1}",
              "\u{1F9DB}",
              "\u{1F9A0}",
              "\u{1F912}"
            ]
          }
        ]
      },
      {
        "id": "beta",
        "name": "Třída Betaproteobacteria",
        "type": "Třída",
        "correctEmojis": [],
        "children": [
          {
            "id": "neisseria",
            "name": "Rod Neisseria",
            "type": "Rod",
            "description": "Typicky osídlují sliznice savců. Patogenní zástupci vyvolávají těžké hnisavé záněty mozkových blan nebo sexuálně přenosnou kapavku.",
            "correctEmojis": [
              "\u{1F534}",
              "\u26AA",
              "\u{1F4A8}",
              "\u{1F9EA}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F937}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1FAC1}",
              "\u{1F9E0}"
            ]
          },
          {
            "id": "spirillum",
            "name": "Rod Spirillum",
            "type": "Rod",
            "description": "Zástupci tohoto rodu preferují stagnující prostředí bohaté na organický materiál, soli organických kyselin jsou jejich hlavním zdrojem uhlíku.",
            "correctEmojis": [
              "\u{1F534}",
              "\u3030\uFE0F",
              "\u2601\uFE0F",
              "\u{1F3C3}",
              "\u{1F4A7}"
            ]
          }
        ]
      },
      {
        "id": "delta",
        "name": "Třída Deltaproteobacteria",
        "type": "Třída",
        "correctEmojis": [],
        "children": [
          {
            "id": "bdellovibrio",
            "name": "Rod Bdellovibrio",
            "type": "Rod",
            "description": "Životní cyklus se skládá z fáze rychlého pohybu za účelem nalezení kořisti a následného proniknutí do periplazmy jiné bakterie, kde tvoří tzv. bdeloplast.",
            "correctEmojis": [
              "\u{1F534}",
              "\u3030\uFE0F",
              "\u{1F4A8}",
              "\u{1F3C3}",
              "\u{1F331}",
              "\u{1F4A7}",
              "\u{1F988}"
            ]
          }
        ]
      },
      {
        "id": "gamma-skupina1",
        "name": "Skupina I (Enterobacteriaceae, Vibrionaceae)",
        "type": "Skupina",
        "description": "Využívají Embden-Meyerhofovu glykolýzu a pentosový cyklus k degradaci cukrů.",
        "correctEmojis": [
          "\u{1F36C}",
          "\u{1F317}"
        ],
        "children": [
          {
            "id": "enterobacteriaceae",
            "name": "Čeleď Enterobacteriaceae",
            "type": "Čeleď",
            "description": "Velmi významná skupina klinicky důležitých bakterií. Oxidáza negativní, běžně osídlují trávicí trakty živočichů.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F317}",
              "\u{1F36C}",
              "\u{1F3C3}",
              "\u{1F6AB}\u{1F3C3}"
            ],
            "children": [
              {
                "id": "escherichia",
                "name": "Rod Escherichia",
                "type": "Rod",
                "description": "Klíčový indikátor fekálního znečištění vody. Určité kmeny (EHEC, ETEC, atd.) však produkují enterotoxiny vyvolávající těžké průjmy.",
                "correctEmojis": [
                  "\u{1F534}",
                  "\u{1F32D}",
                  "\u{1F317}",
                  "\u{1F36C}",
                  "\u{1F3C3}",
                  "\u{1F9D1}",
                  "\u{1F91D}",
                  "\u{1F9A0}",
                  "\u{1F912}",
                  "\u{1F922}"
                ]
              },
              {
                "id": "salmonella",
                "name": "Rod Salmonella",
                "type": "Rod",
                "description": "Způsobuje záněty žaludku a střev, případně závažnější břišní tyfus či septikémie. Běžná kontaminace potravin drůbežího a vaječného původu.",
                "correctEmojis": [
                  "\u{1F534}",
                  "\u{1F32D}",
                  "\u{1F317}",
                  "\u{1F36C}",
                  "\u{1F3C3}",
                  "\u{1F404}",
                  "\u{1F9D1}",
                  "\u{1F9A0}",
                  "\u{1F912}",
                  "\u{1F922}"
                ]
              },
              {
                "id": "yersinia",
                "name": "Rod Yersinia",
                "type": "Rod",
                "description": "Historicky zodpovědná za masivní pandemie dýmějového moru vlivem produkce silných toxinů s využitím T3SS systému.",
                "correctEmojis": [
                  "\u{1F534}",
                  "\u{1F32D}",
                  "\u{1F317}",
                  "\u{1F36C}",
                  "\u{1F3C3}",
                  "\u{1F6AB}\u{1F3C3}",
                  "\u{1F404}",
                  "\u{1F9D1}",
                  "\u{1F577}\uFE0F",
                  "\u{1F9A0}",
                  "\u{1F912}",
                  "\u2620\uFE0F"
                ]
              }
            ]
          },
          {
            "id": "vibrionaceae",
            "name": "Čeleď Vibrionaceae",
            "type": "Čeleď",
            "description": "Polárně bičíkaté bakterie. Původce těžkých infekcí spojených s masivními ztrátami vody z těla přes specifický AB toxin.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F317}",
              "\u{1F4A1}",
              "\u{1F36C}",
              "\u{1F3C3}",
              "\u{1F4A7}",
              "\u{1F9D1}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F922}",
              "\u2620\uFE0F"
            ]
          }
        ]
      },
      {
        "id": "gamma-skupina2",
        "name": "Skupina II (Pseudomonaceae, Azotobacteriaceae aj.)",
        "type": "Skupina",
        "description": "Využívají Entner-Doudoroffovu dráhu, postrádají enzym fosfofruktokinázu.",
        "correctEmojis": [
          "\u{1F4A8}"
        ],
        "children": [
          {
            "id": "pseudomonas",
            "name": "Rod Pseudomonas",
            "type": "Rod",
            "description": "Produkuje typické exopigmenty (např. modrý pyocyanin, zelený pyoverdin). Významný oportunní patogen v nemocnicích komplikující popáleniny a léčbu cystické fibrózy. Akumuluje polymery jako zásobárnu uhlíku.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F9EA}",
              "\u{1F976}",
              "\u{1F3C3}",
              "\u{1F331}",
              "\u{1F4A7}",
              "\u{1F9D1}",
              "\u267B\uFE0F",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1FAC1}",
              "\u2620\uFE0F"
            ]
          },
          {
            "id": "azotobacter",
            "name": "Rod Azotobacter",
            "type": "Rod",
            "description": "Výjimečné tvorbou velkých klidových stádií (cyst). Zásadní volně žijící organismy uplatňující se v koloběhu dusíku v půdě.",
            "correctEmojis": [
              "\u{1F534}",
              "\u26AA",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F3C3}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F6E1}\uFE0F",
              "\u{1F331}",
              "N",
              "\u267B\uFE0F"
            ]
          },
          {
            "id": "legionella",
            "name": "Rod Legionella",
            "type": "Rod",
            "description": "Přirozeně parazituje na vodních prvocích, odkud je adaptována pro inhibici destrukce uvnitř makrofágů lidských plic. Přenáší se převážně inhalací z klimatizací.",
            "correctEmojis": [
              "\u{1F534}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F9EA}",
              "\u{1F3C3}",
              "\u{1F4A7}",
              "\u{1F9D1}",
              "\u{1F9DB}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1FAC1}"
            ]
          }
        ]
      },
      {
        "id": "epsilon",
        "name": "Třída Epsilonproteobacteria (Kmen Campylobacterota)",
        "type": "Třída",
        "correctEmojis": [],
        "children": [
          {
            "id": "campylobacter",
            "name": "Rod Campylobacter",
            "type": "Rod",
            "description": "Využívají charakteristický rotační vývrtkový pohyb. Přední celosvětový původce alimentárních infekcí z kontaminované drůbeže.",
            "correctEmojis": [
              "\u{1F534}",
              "\u3030\uFE0F",
              "\u2601\uFE0F",
              "\u{1F9EA}",
              "\u{1F3C3}",
              "\u{1F404}",
              "\u{1F9D1}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F922}"
            ]
          },
          {
            "id": "helicobacter",
            "name": "Rod Helicobacter",
            "type": "Rod",
            "description": "Přežívají masivně nízké pH tvorbou bariéry z produkované ureázy, poškozují epitely a podílí se na kancerogenezi i vzniku vředů.",
            "correctEmojis": [
              "\u{1F534}",
              "\u3030\uFE0F",
              "\u2601\uFE0F",
              "\u{1F9EA}",
              "\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F922}",
              "\u2620\uFE0F"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "chlamydiota",
    "name": "Kmen Chlamydiota (dříve Chlamydiae)",
    "type": "Kmen",
    "description": "Energetičtí paraziti neschopní syntézy vlastního ATP. Procházejí dvěma fázemi (infekční elementární a proliferační retikulární tělíska). Vyvolávají specifické pohlavní či dýchací choroby.",
    "correctEmojis": [
      "\u{1F534}",
      "\u26AA",
      "\u{1F6AB}\u{1F3C3}",
      "\u{1F9D1}",
      "\u{1F9DB}",
      "\u{1F9A0}",
      "\u{1F912}",
      "\u{1FAC1}",
      "\u{1FAAB}"
    ],
    "children": [
      {
        "id": "chlamydia",
        "name": "Rod Chlamydia",
        "type": "Rod",
        "correctEmojis": [
          "\u{1F534}",
          "\u26AA",
          "\u{1F6AB}\u{1F3C3}",
          "\u{1F9D1}",
          "\u{1F9DB}",
          "\u{1F9A0}",
          "\u{1F912}",
          "\u{1FAC1}",
          "\u{1FAAB}"
        ]
      }
    ]
  },
  {
    "id": "spirochaetota",
    "name": "Kmen Spirochaetota (dříve Spirochaetes)",
    "type": "Kmen",
    "description": "Vyznačují se uložením bičíků přímo do periplazmatického prostoru jakožto axiálních vláken. Pohyb napomáhá penetraci viskózním prostředím a tkáněmi.",
    "correctEmojis": [
      "\u{1F534}",
      "\u3030\uFE0F",
      "\u{1F3C3}",
      "\u{1F4A7}"
    ],
    "children": [
      {
        "id": "borrelia",
        "name": "Rod Borrelia",
        "type": "Rod",
        "description": "Původce zoonózy projevující se po kousnutí klíštětem prvotním erythema migrans, a následným napadením kloubů i močových či neurologických drah.",
        "correctEmojis": [
          "\u{1F534}",
          "\u3030\uFE0F",
          "\u2601\uFE0F",
          "\u{1F9EA}",
          "\u{1F3C3}",
          "\u{1F577}\uFE0F",
          "\u{1F9D1}",
          "\u{1F9A0}",
          "\u{1F912}",
          "\u{1F9E0}"
        ]
      },
      {
        "id": "treponema",
        "name": "Rod Treponema",
        "type": "Rod",
        "description": "Nebezpečné patogeny poškozující stěny cév, srdce i centrální NS během několika projevujících se fází. Přenos je primárně pohlavní stykem nebo z matky na plod.",
        "correctEmojis": [
          "\u{1F534}",
          "\u3030\uFE0F",
          "\u{1F6AB}\u{1F4A8}",
          "\u2601\uFE0F",
          "\u{1F9EA}",
          "\u{1F3C3}",
          "\u{1F9D1}",
          "\u{1F9A0}",
          "\u{1F912}",
          "\u{1F9E0}"
        ]
      },
      {
        "id": "leptospira",
        "name": "Rod Leptospira",
        "type": "Rod",
        "description": "Bakterie se zahnutými konci ve tvaru pastýřské hole. Rezervoárem bývají hlodavci vylučující bakterie močí, což vede k nákaze po kontaktu se znečištěným prostředím.",
        "correctEmojis": [
          "\u{1F534}",
          "\u3030\uFE0F",
          "\u{1F4A8}",
          "\u{1F9EA}",
          "\u{1F3C3}",
          "\u{1F331}",
          "\u{1F4A7}",
          "\u{1F404}",
          "\u{1F9D1}",
          "\u{1F9A0}",
          "\u{1F912}"
        ]
      }
    ]
  },
  {
    "id": "cyanobacteriota",
    "name": "Kmen Cyanobacteriota (dříve Cyanobacteria)",
    "type": "Kmen",
    "description": "Zásadně se podílejí na primární produkci a jsou pramatkami plastidů. Při jejich přemnožení hrozí únik nebezpečných cyanotoxinů do stojatých vod (tzv. vodní květ).",
    "correctEmojis": [
      "\u{1F534}",
      "\u2600\uFE0F",
      "\u{1F4A7}",
      "\u{1F331}",
      "\u2620\uFE0F"
    ],
    "children": []
  },
  {
    "id": "gpos-header",
    "name": "B) Bakterie s buněčnou stěnou grampozitivního typu",
    "correctEmojis": [
      "\u{1F535}"
    ]
  },
  {
    "id": "bacillota",
    "name": "Kmen Bacillota (dříve Firmicutes)",
    "type": "Kmen",
    "description": "Skupina G+ bakterií s relativně nízkým podílem bází G a C v genomu (< 50%).",
    "correctEmojis": [
      "\u{1F535}"
    ],
    "children": [
      {
        "id": "bacilli-class",
        "name": "Třída Bacilli",
        "type": "Třída",
        "correctEmojis": [],
        "children": [
          {
            "id": "bacillus",
            "name": "Rod Bacillus",
            "type": "Rod",
            "description": "Rozmanitá skupina od neškodných dekompozitorů až po bioteroristické hrozby (původce sněti slezinné). Zástupci se také používají v zemědělství jako bioinsekticidy narušující trávicí ústrojí škůdců.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F317}",
              "\u{1F6E1}\uFE0F",
              "\u{1F3C3}",
              "\u{1F331}",
              "\u267B\uFE0F",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u2620\uFE0F",
              "\u{1F41B}"
            ]
          },
          {
            "id": "listeria",
            "name": "Rod Listeria",
            "type": "Rod",
            "description": "Nebezpečné kontaminanty chladírenských výrobků s tendencí pronikat skrze bariéry u těhotných a oslabených jedinců s afinitou k CNS novorozenců.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F32D}",
              "\u{1F317}",
              "\u{1F36C}",
              "\u{1F976}",
              "\u{1F3C3}",
              "\u{1F404}",
              "\u{1F9D1}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F922}",
              "\u{1F9E0}",
              "\u2620\uFE0F"
            ]
          },
          {
            "id": "staphylococcus",
            "name": "Rod Staphylococcus",
            "type": "Rod",
            "description": "Významní producenti koaguláz a silných enterotoxinů způsobujících těžké otravy z potravin. Často kolonizují kůži a sliznice jako komenzálové, v ranných infekcích tvoří MRSA kmeny závažný zdravotnický problém.",
            "correctEmojis": [
              "\u{1F535}",
              "\u26AA",
              "\u{1F347}",
              "\u{1F317}",
              "\u{1F36C}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F937}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u2620\uFE0F"
            ]
          },
          {
            "id": "lactobacillus",
            "name": "Rod Lactobacillus",
            "type": "Rod",
            "description": "Klíčový ochranný prvek poševní sliznice vlivem snižování pH. Esenciální startovací kultury při zpracování kyselého zelí, sýrů, jogurtů či probiotik.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F32D}",
              "\u2601\uFE0F",
              "\u{1F6AB}\u{1F4A8}",
              "\u{1F36C}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F91D}",
              "\u{1F95B}"
            ]
          },
          {
            "id": "leuconostoc",
            "name": "Rod Leuconostoc",
            "type": "Rod",
            "description": "Buňky sférické nebo ovoidní, uspořádány po dvou nebo v řetízcích. Fakultativně anaerobní, chemoorganotrofní. Hojné na rostlinách a v mléčných produktech.",
            "correctEmojis": [
              "\u{1F535}",
              "\u26AA",
              "\u26D3\uFE0F",
              "\u{1F317}",
              "\u{1F36C}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F95B}"
            ]
          },
          {
            "id": "streptococcus",
            "name": "Rod Streptococcus",
            "type": "Rod",
            "description": "Běžně děleni dle typu hemolýzy. Častí původci angín, zubního kazu, zánětů středouší nebo novorozeneckých infekcí vlivem širokého arsenálu extracelulárních toxinů.",
            "correctEmojis": [
              "\u{1F535}",
              "\u26AA",
              "\u26D3\uFE0F",
              "\u{1F317}",
              "\u{1F36C}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F937}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1FAC1}",
              "\u2620\uFE0F"
            ]
          }
        ]
      },
      {
        "id": "clostridia-class",
        "name": "Třída Clostridia",
        "type": "Třída",
        "correctEmojis": [],
        "children": [
          {
            "id": "clostridium",
            "name": "Rod Clostridium",
            "type": "Rod",
            "description": "Zásadní producenti nejsilnějších popsaných biologických jedů narušujících nervosvalovou ploténku, nebo histotoxik vyvolávajících rychle se šířící plynaté gangrény.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F32D}",
              "\u{1F6AB}\u{1F4A8}",
              "\u{1F36C}",
              "\u{1F6E1}\uFE0F",
              "\u{1F3C3}",
              "\u{1F331}",
              "\u{1F9D1}",
              "\u267B\uFE0F",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1F922}",
              "\u{1F9E0}",
              "\u2620\uFE0F"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "actinomycetota",
    "name": "Kmen Actinomycetota (dříve Actinobacteria)",
    "type": "Kmen",
    "description": "Skupina G+ bakterií s vysokým podílem bází G a C v genomu (> 50%).",
    "correctEmojis": [
      "\u{1F535}"
    ],
    "children": [
      {
        "id": "actinobacteria-class",
        "name": "Třída Actinobacteria",
        "type": "Třída",
        "correctEmojis": [],
        "children": [
          {
            "id": "corynebacterium",
            "name": "Rod Corynebacterium",
            "type": "Rod",
            "description": "Netvoří spory, často jsou uspořádány do klastrů připomínajících písmena V, Y nebo rozsypaný čaj. Typický zástupce produkuje silný AB toxin blokující proteosyntézu buněk hostitele.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F32D}",
              "\u{1F317}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F937}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1FAC1}",
              "\u2620\uFE0F"
            ]
          },
          {
            "id": "mycobacterium",
            "name": "Rod Mycobacterium",
            "type": "Rod",
            "description": "Odlišují se unikátní stavbou buněčné stěny s vysokým podílem mykolových kyselin, odolávají tím jak odbarvení v kyselinách, tak i standardním typům fagozytózy. Generační doba může být i týdny.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F32D}",
              "\u{1F4A8}",
              "\u{1F9EA}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F9D1}",
              "\u{1F9DB}",
              "\u{1F9A0}",
              "\u{1F912}",
              "\u{1FAC1}"
            ]
          },
          {
            "id": "streptomyces",
            "name": "Rod Streptomyces",
            "type": "Rod",
            "description": "Výrazný pleomorfismus v podobě hyf a mycelia, makroskopicky budící dojem plísní. Esenciální průmyslová složka – zdroj nadpoloviční většiny dnešních přirozeně odvozených antimikrobiálních látek.",
            "correctEmojis": [
              "\u{1F535}",
              "\u{1F33F}",
              "\u{1F4A8}",
              "\u{1F6E1}\uFE0F",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F331}",
              "\u267B\uFE0F",
              "\u{1F48A}"
            ]
          },
          {
            "id": "micrococcus",
            "name": "Rod Micrococcus",
            "type": "Rod",
            "description": "Zástupci tohoto rodu patří mezi převažující neškodné druhy na kůži. Uplatňují se také ve fermentaci uzenin díky své proteolytické a lipolytické aktivitě.",
            "correctEmojis": [
              "\u{1F535}",
              "\u26AA",
              "\u{1F4A8}",
              "\u{1F9EA}",
              "\u{1F6AB}\u{1F3C3}",
              "\u{1F331}",
              "\u{1F4A7}",
              "\u{1F9D1}",
              "\u{1F937}"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "nowall-header",
    "name": "C) Bakterie bez buněčné stěny",
    "correctEmojis": [
      "\u{1F9F1}\u274C"
    ]
  },
  {
    "id": "mycoplasmatota",
    "name": "Kmen Mycoplasmatota (dříve Tenericutes)",
    "type": "Kmen",
    "description": "Třída Mollicutes reprezentuje absolutní genetické minimum organismu schopného samostatné replikace. Primární patogeny způsobující záněty plic chráněné steroly ve své vnější membráně, čímž odolávají lékům cíleným na stěnu.",
    "correctEmojis": [
      "\u{1F9F1}\u274C",
      "\u26AA",
      "\u{1F4A8}",
      "\u{1F317}",
      "\u{1F6AB}\u{1F3C3}",
      "\u{1F9D1}",
      "\u{1F9DB}",
      "\u{1F9A0}",
      "\u{1F912}",
      "\u{1FAC1}"
    ],
    "children": [
      {
        "id": "mycoplasma",
        "name": "Rod Mycoplasma",
        "type": "Rod",
        "correctEmojis": [
          "\u{1F9F1}\u274C",
          "\u26AA",
          "\u{1F4A8}",
          "\u{1F317}",
          "\u{1F6AB}\u{1F3C3}",
          "\u{1F9D1}",
          "\u{1F9DB}",
          "\u{1F9A0}",
          "\u{1F912}",
          "\u{1FAC1}"
        ]
      }
    ]
  },
  {
    "id": "bothwall-header",
    "name": "D) Bakterie s buněčnou stěnou G+ i G- typu",
    "correctEmojis": [
      "\u{1F535}\u{1F534}"
    ]
  },
  {
    "id": "denococcota",
    "name": "Kmen Denococcota (dříve Deinococcus)",
    "type": "Kmen",
    "description": "Třída Deinococcus. Tento organismus je schopen zkompletovat a slepit svůj fragmentovaný genom dohromady v řádu hodin poté, co byl kompletně rozštěpen ionizujícím zářením.",
    "correctEmojis": [
      "\u{1F535}\u{1F534}",
      "\u26AA",
      "\u{1F4A8}",
      "\u{1F6AB}\u{1F3C3}",
      "\u2622\uFE0F"
    ],
    "children": [
      {
        "id": "deinococcus",
        "name": "Rod Deinococcus",
        "type": "Rod",
        "correctEmojis": [
          "\u{1F535}\u{1F534}",
          "\u26AA",
          "\u{1F4A8}",
          "\u{1F6AB}\u{1F3C3}",
          "\u2622\uFE0F"
        ]
      }
    ]
  }
];
