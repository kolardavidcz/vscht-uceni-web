import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const dataFilePath = path.join(
  ROOT,
  "src/features/bioinformatics/data/materialsData.ts"
);

// Map of E-learning chapter & leaf topic IDs to their URLs on courses.fit.cvut.cz
const elearningUrlMap = {
  // Chapter Headers
  "el-ch01": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/oop.html",
    cleanTitle: "Kapitola 01: Třídy a objekty",
    linkedTitle: "Kapitola 01: [Třídy a objekty](https://courses.fit.cvut.cz/BI-PA2/elearning/oop.html)",
  },
  "el-ch02": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/oopbasic.html",
    cleanTitle: "Kapitola 02: Základní pojmy objektově orientovaného programování",
    linkedTitle: "Kapitola 02: [Základní pojmy objektově orientovaného programování](https://courses.fit.cvut.cz/BI-PA2/elearning/oopbasic.html)",
  },
  "el-ch03": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/index.html",
    cleanTitle: "Kapitola 03: Rozšíření C → C++",
    linkedTitle: "Kapitola 03: [Rozšíření C → C++](https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/index.html)",
  },
  "el-ch04": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/progstyle/index.html",
    cleanTitle: "Kapitola 04: Programátorský styl",
    linkedTitle: "Kapitola 04: [Programátorský styl](https://courses.fit.cvut.cz/BI-PA2/elearning/progstyle/index.html)",
  },
  "el-ch05": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/index.html",
    cleanTitle: "Kapitola 05: Třídy a objekty",
    linkedTitle: "Kapitola 05: [Třídy a objekty](https://courses.fit.cvut.cz/BI-PA2/elearning/classes/index.html)",
  },
  "el-ch06": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/index.html",
    cleanTitle: "Kapitola 06: Přetěžování operátorů, třída Zlomek, uživatelská konverze",
    linkedTitle: "Kapitola 06: [Přetěžování operátorů, třída Zlomek, uživatelská konverze](https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/index.html)",
  },
  "el-ch07": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/index.html",
    cleanTitle: "Kapitola 07: Přiřazení, mělká a hluboká kopie",
    linkedTitle: "Kapitola 07: [Přiřazení, mělká a hluboká kopie](https://courses.fit.cvut.cz/BI-PA2/elearning/copy/index.html)",
  },
  "el-ch08": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/string/index.html",
    cleanTitle: "Kapitola 08: Znakové řetězce libovolné délky - třída std::string",
    linkedTitle: "Kapitola 08: [Znakové řetězce libovolné délky - třída std::string](https://courses.fit.cvut.cz/BI-PA2/elearning/string/index.html)",
  },
  "el-ch09": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/errors/index.html",
    cleanTitle: "Kapitola 09: Ošetření chyb, výjimky",
    linkedTitle: "Kapitola 09: [Ošetření chyb, výjimky](https://courses.fit.cvut.cz/BI-PA2/elearning/errors/index.html)",
  },
  "el-ch10": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/template/index.html",
    cleanTitle: "Kapitola 10: Šablony - template",
    linkedTitle: "Kapitola 10: [Šablony - template](https://courses.fit.cvut.cz/BI-PA2/elearning/template/index.html)",
  },
  "el-ch11-pt1": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/index.html",
    cleanTitle: "Kapitola 11: Abstraktní datové typy, standardní knihovna",
    linkedTitle: "Kapitola 11: [Abstraktní datové typy, standardní knihovna](https://courses.fit.cvut.cz/BI-PA2/elearning/adt/index.html)",
  },
  "el-ch11-pt2": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/index.html",
    cleanTitle: "Kapitola 11 - část 2: Abstraktní datové typy, standardní knihovna",
    linkedTitle: "Kapitola 11 - část 2: [Abstraktní datové typy, standardní knihovna](https://courses.fit.cvut.cz/BI-PA2/elearning/adt/index.html)",
  },
  "el-ch12": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/trees/index.html",
    cleanTitle: "Kapitola 12: Stromy",
    linkedTitle: "Kapitola 12: [Stromy](https://courses.fit.cvut.cz/BI-PA2/elearning/trees/index.html)",
  },
  "el-ch13": {
    url: "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/index.html",
    cleanTitle: "Kapitola 13: Dědičnost (inheritance), dynamicky vázané metody, polymorfizmus",
    linkedTitle: "Kapitola 13: [Dědičnost (inheritance), dynamicky vázané metody, polymorfizmus](https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/index.html)",
  },

  // Chapter 03 (Rozšíření C → C++)
  "el-ch03-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/intro.html",
  "el-ch03-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/namespace.html",
  "el-ch03-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/bool.html",
  "el-ch03-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/stdio.html",
  "el-ch03-5": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/omanip.html",
  "el-ch03-6": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/imanip.html",
  "el-ch03-7": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/reference.html",
  "el-ch03-8": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/const.html",
  "el-ch03-9": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/constref.html",
  "el-ch03-10": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/constptr.html",
  "el-ch03-11": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/declaration.html",
  "el-ch03-12": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/struct.html",
  "el-ch03-13": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/dynvar.html",
  "el-ch03-14": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/inline.html",
  "el-ch03-15": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/implicitparams.html",
  "el-ch03-16": "https://courses.fit.cvut.cz/BI-PA2/elearning/extensions/funcoverload.html",

  // Chapter 04 (Programátorský styl)
  "el-ch04-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/progstyle/naive.html",
  "el-ch04-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/progstyle/proc.html",
  "el-ch04-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/progstyle/class.html",
  "el-ch04-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/progstyle/stack.html",

  // Chapter 05 (Třídy a objekty)
  "el-ch05-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/declaration.html",
  "el-ch05-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/define.html",
  "el-ch05-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/shadow.html",
  "el-ch05-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/inline.html",
  "el-ch05-5": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/struct.html",
  "el-ch05-6": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/objects.html",
  "el-ch05-7": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/const.html",
  "el-ch05-8": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/constrcall.html",
  "el-ch05-9": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/array.html",
  "el-ch05-10": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/implic.html",
  "el-ch05-11": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/init.html",
  "el-ch05-12": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/localdecl.html",
  "el-ch05-13": "https://courses.fit.cvut.cz/BI-PA2/elearning/classes/static.html",

  // Chapter 06 (Přetěžování operátorů)
  "el-ch06-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/arifce.html",
  "el-ch06-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/arimet.html",
  "el-ch06-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/operfce.html",
  "el-ch06-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/opermet.html",
  "el-ch06-5": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/operfriend.html",
  "el-ch06-6": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/userconv.html",
  "el-ch06-7": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/surveybin.html",
  "el-ch06-8": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/surveyunary.html",
  "el-ch06-9": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/indexop.html",
  "el-ch06-10": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/funccall.html",
  "el-ch06-11": "https://courses.fit.cvut.cz/BI-PA2/elearning/operatoroverload/smartpoi.html",

  // Chapter 07 (Přiřazení, mělká a hluboká kopie)
  "el-ch07-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/deepcopy.html",
  "el-ch07-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/copyconstr.html",
  "el-ch07-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/shallowcopy.html",
  "el-ch07-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/rvalueref.html",
  "el-ch07-5": "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/moveconstructor.html",
  "el-ch07-6": "https://courses.fit.cvut.cz/BI-PA2/elearning/copy/moveopassign.html",

  // Chapter 08 (std::string)
  "el-ch08-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/string/index.html",

  // Chapter 09 (Ošetření chyb, výjimky)
  "el-ch09-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/errors/cerr.html",
  "el-ch09-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/errors/exceptions.html",

  // Chapter 10 (Šablony)
  "el-ch10-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/template/templfce.html",
  "el-ch10-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/template/templclass.html",

  // Chapter 11 (ADT, standardní knihovna)
  "el-ch11-pt1-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/stdlib.html",
  "el-ch11-pt1-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/iterator.html",
  "el-ch11-pt1-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/vector.html",
  "el-ch11-pt1-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/array.html",
  "el-ch11-pt2-5": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/deque.html",
  "el-ch11-pt2-6": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/list.html",
  "el-ch11-pt2-7": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/forwardlist.html",
  "el-ch11-pt2-8": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/stack.html",
  "el-ch11-pt2-9": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/queue.html",
  "el-ch11-pt2-10": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/priorqueue.html",
  "el-ch11-pt2-11": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/set.html",
  "el-ch11-pt2-12": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/bitset.html",
  "el-ch11-pt2-13": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/multiset.html",
  "el-ch11-pt2-14": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/map.html",
  "el-ch11-pt2-15": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/multimap.html",
  "el-ch11-pt2-16": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/unordered_set.html",
  "el-ch11-pt2-17": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/unordered_multiset.html",
  "el-ch11-pt2-18": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/unordered_map.html",
  "el-ch11-pt2-19": "https://courses.fit.cvut.cz/BI-PA2/elearning/adt/unordered_multimap.html",

  // Chapter 12 (Stromy)
  "el-ch12-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/trees/intro.html",
  "el-ch12-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/trees/bst.html",

  // Chapter 13 (Dědičnost & Polymorfismus)
  "el-ch13-1": "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/intro.html",
  "el-ch13-2": "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/latebinding.html",
  "el-ch13-3": "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/abstrclass.html",
  "el-ch13-4": "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/polymorphism.html",
  "el-ch13-5": "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/rtti.html",
  "el-ch13-6": "https://courses.fit.cvut.cz/BI-PA2/elearning/inheritance/castsurvey.html",
};

// Trainer Map for Lessons and Specific Modules
const trainerUrlMap = {
  // Lessons
  "tr-w01-l2": "https://trainer.ksi.fit.cvut.cz/lessons/581",
  "tr-w01-l3": "https://trainer.ksi.fit.cvut.cz",

  // Week 1, Lesson 581 Modules
  "tr-w01-l2-s1": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/330",
  "tr-w01-l2-s2": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/331",
  "tr-w01-l2-s3": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/332",
  "tr-w01-l2-s5": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/334",
  "tr-w01-l2-s7": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/336",
  "tr-w01-l2-s9": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/338",
  "tr-w01-l2-s10": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/339",
  "tr-w01-l2-s11": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/340",
  "tr-w01-l2-s12": "https://trainer.ksi.fit.cvut.cz/lessons/581/modules/341",
};

const TRAINER_BASE = "https://trainer.ksi.fit.cvut.cz";

function stripMd(s) {
  return String(s || "")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\s*\(Trainer\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function linkify(text, url) {
  const clean = stripMd(text);
  return `[${clean}](${url})`;
}

// Read raw materialsData.ts
let rawContent = fs.readFileSync(dataFilePath, "utf8");

// Parse the JSON array inside export const materialsData: SchoolMaterial[] = [...]
const jsonMatch = rawContent.match(
  /export const materialsData:\s*SchoolMaterial\[\]\s*=\s*([\s\S]*);/
);
if (!jsonMatch) {
  console.error("Could not find materialsData array in materialsData.ts");
  process.exit(1);
}

const data = JSON.parse(jsonMatch[1]);

let elearningLinkedCount = 0;
let trainerLinkedCount = 0;

for (const cat of data) {
  if (cat.category === "E-learning") {
    // Chapter link
    const chInfo = elearningUrlMap[cat.id];
    if (chInfo?.url) {
      cat.name = chInfo.linkedTitle;
      elearningLinkedCount++;
    }
    // Children links
    if (Array.isArray(cat.children)) {
      for (const child of cat.children) {
        const leafUrl = elearningUrlMap[child.id];
        if (leafUrl) {
          child.name = linkify(child.name, leafUrl);
          elearningLinkedCount++;
        }
      }
    }
  } else if (cat.category === "Trainer") {
    // Week header link
    cat.name = `${stripMd(cat.name)} [(Trainer)](${TRAINER_BASE})`;
    trainerLinkedCount++;

    if (Array.isArray(cat.children)) {
      for (const lesson of cat.children) {
        const lessonUrl = trainerUrlMap[lesson.id] || TRAINER_BASE;
        lesson.name = linkify(lesson.name, lessonUrl);
        trainerLinkedCount++;

        if (Array.isArray(lesson.children)) {
          for (const mod of lesson.children) {
            const modUrl = trainerUrlMap[mod.id] || lessonUrl;
            mod.name = linkify(mod.name, modUrl);
            trainerLinkedCount++;
          }
        }
      }
    }
  }
}

const newContent =
  rawContent.slice(0, jsonMatch.index) +
  `export const materialsData: SchoolMaterial[] = ${JSON.stringify(
    data,
    null,
    2
  )};\n`;

fs.writeFileSync(dataFilePath, newContent, "utf8");
console.log(
  `Enriched materialsData.ts with ${elearningLinkedCount} E-learning links and ${trainerLinkedCount} Trainer links!`
);
