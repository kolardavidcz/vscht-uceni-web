import { describe, expect, it } from "vitest";
import { latexToUnicode } from "./latexToUnicode";

describe("latexToUnicode", () => {
  it("converts basic logic symbols", () => {
    expect(latexToUnicode("\\forall x \\in V : P(x)")).toBe("∀x ∈ V : P(x)");
    expect(latexToUnicode("\\exists x \\in V : P(x)")).toBe("∃x ∈ V : P(x)");
    expect(latexToUnicode("A \\land B")).toBe("A ∧ B");
    expect(latexToUnicode("A \\lor B")).toBe("A ∨ B");
    expect(latexToUnicode("A \\implies B")).toBe("A ⇒ B");
    expect(latexToUnicode("A \\iff B")).toBe("A ⇔ B");
    expect(latexToUnicode("\\neg A")).toBe("¬A");
    expect(latexToUnicode("E \\models F")).toBe("E ⊨ F");
    expect(latexToUnicode("E \\equiv F")).toBe("E ≡ F");
    expect(latexToUnicode("\\top")).toBe("⊤");
    expect(latexToUnicode("\\bot")).toBe("⊥");
  });

  it("converts sets, operations, and number sets", () => {
    expect(latexToUnicode("V \\times V")).toBe("V × V");
    expect(latexToUnicode("A \\subseteq B")).toBe("A ⊆ B");
    expect(latexToUnicode("A \\cap B")).toBe("A ∩ B");
    expect(latexToUnicode("A \\cup B")).toBe("A ∪ B");
    expect(latexToUnicode("\\mathbb{N}")).toBe("ℕ");
    expect(latexToUnicode("\\mathbb{R}")).toBe("ℝ");
  });

  it("converts exponents and powers", () => {
    expect(latexToUnicode("x^n")).toBe("xⁿ");
    expect(latexToUnicode("x^2")).toBe("x²");
    expect(latexToUnicode("(x^{n/2})^2")).toBe("(x^(n/2))²");
    expect(latexToUnicode("x^{16}")).toBe("x¹⁶");
  });

  it("converts sums and products", () => {
    expect(latexToUnicode("\\sum_{v \\in V} \\deg(v) = 2|E|")).toContain("∑");
    expect(latexToUnicode("n! = \\prod_{k=1}^n k")).toContain("∏");
  });

  it("cleans delimiting dollars and display math brackets", () => {
    expect(latexToUnicode("$\\forall x$")).toBe("∀x");
    expect(latexToUnicode("$$\\exists y$$")).toBe("∃y");
  });
});
