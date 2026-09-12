import { describe, expect, it } from "vitest";
import {
  loadWikiMaterials,
  groupByCategory,
  groupByCategoryTree,
} from "./contentLoader";

describe("contentLoader position-based ordering", () => {
  it("loads materials with category order matching JSON key position", () => {
    const materials = loadWikiMaterials();
    expect(materials.length).toBeGreaterThan(0);

    const groups = groupByCategory(materials);
    const categoryKeys = groups.map((g) => g.key);

    // Verify categories match JSON key position
    expect(categoryKeys).toEqual([
      "obecne",
      "0-semestr",
      "1-semestr",
      "2-semestr",
      "3-semestr",
      "4-semestr",
      "5-semestr",
    ]);
  });

  it("orders nested files based on their position in config.json", () => {
    const materials = loadWikiMaterials();
    const groupsWithTree = groupByCategoryTree(materials);

    // obecne -> 3 targeted files
    const obecne = groupsWithTree.find((g) => g.key === "obecne");
    expect(obecne).toBeDefined();
    const obecneKeys = obecne?.tree.map((c) => c.key);
    expect(obecneKeys).toEqual([
      "kontakty-a-rozcestnik",
      "zacatek-semestru-prvak",
      "konec-semestru-a-zkouskove",
    ]);

    // 1-semestr -> bi-pa1 files
    const sem1 = groupsWithTree.find((g) => g.key === "1-semestr");
    expect(sem1).toBeDefined();

    const pa1Folder = sem1?.tree.find((n) => n.key === "bi-pa1");
    expect(pa1Folder).toBeDefined();
    if (pa1Folder?.type === "folder") {
      const childKeys = pa1Folder.children.map((c) => c.key);
      expect(childKeys).toEqual([
        "behem-semestru-a-pred-nim",
        "wsl-a-setup",
        "kalendar",
        "jak-to-spravit",
        "struktura-kodu",
        "progtest-a-zkouska",
      ]);
    }

    // 3-semestr -> pre-ag1 files split into coding and math
    const sem3 = groupsWithTree.find((g) => g.key === "3-semestr");
    expect(sem3).toBeDefined();

    const preAg1Folder = sem3?.tree.find((n) => n.key === "pre-ag1");
    expect(preAg1Folder).toBeDefined();
    if (preAg1Folder?.type === "folder") {
      const subfolderKeys = preAg1Folder.children.map((c) => c.key);
      expect(subfolderKeys).toEqual(["coding", "math"]);

      const codingFolder = preAg1Folder.children.find((c) => c.key === "coding");
      expect(codingFolder).toBeDefined();
      if (codingFolder?.type === "folder") {
        const codingKeys = codingFolder.children.map((c) => c.key);
        expect(codingKeys).toEqual([
          "pa2-ag1-overview",
          "pa2-ag1-cheatsheet",
          "rekurze-bro",
        ]);
      }

      const mathFolder = preAg1Folder.children.find((c) => c.key === "math");
      expect(mathFolder).toBeDefined();
      if (mathFolder?.type === "folder") {
        const mathKeys = mathFolder.children.map((c) => c.key);
        expect(mathKeys).toEqual([
          "dml",
          "dml-bio-grafy",
          "dml-logicky-zaklad",
          "dml-indukce-na-grafech",
          "dml-dukazy-sporem",
          "dml-bio-grafy-b",
          "dml-zkouskovy-workshop",
        ]);
      }
    }
  });

  it("extracts externalUrl correctly for external links", () => {
    const materials = loadWikiMaterials();

    const prepCourse = materials.find((m) => m.key === "priprav-se-programovani");
    expect(prepCourse?.externalUrl).toBe(
      "https://e-learning.vscht.cz/course/view.php?id=3521"
    );

    const pythonCourse = materials.find((m) => m.key === "python");
    expect(pythonCourse?.externalUrl).toBe("https://newpyt.vercel.app/");
  });
});
