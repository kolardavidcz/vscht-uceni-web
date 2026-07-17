export const PYTHON_SCRIPT = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bioinformatická analýza sekvence DNA/RNA
Autor: VSCHT Bioinf
"""

def analyze_sequence(seq):
    seq = seq.upper().strip()
    seq = "".join([c for c in seq if c in "ATCGU"])
    
    length = len(seq)
    if length == 0:
        print("Chyba: Prázdná sekvence!")
        return
        
    counts = {n: seq.count(n) for n in "ATCGU"}
    gc_content = ((counts['G'] + counts['C']) / length) * 100
    
    print("=" * 40)
    print(" VÝSLEDKY BIOINFORMATICKÉ ANALÝZY")
    print("=" * 40)
    print(f"Délka sekvence: {length} bp")
    print(f"Obsah GC:        {gc_content:.2f} %")
    print("-" * 40)
    print("Frekvence nukleotidu:")
    for n, count in counts.items():
        if count > 0 or n in "ATCG":
            pct = (count / length) * 100
            print(f"  {n}: {count:5d} ({pct:6.2f} %)")
            
    rna = seq.replace("T", "U")
    print("-" * 40)
    print(f"RNA transkript (prvních 60 bp):\n  {rna[:60]}")
    
    codon_table = {
        'AUG': 'M', 'UUU': 'F', 'UUC': 'F', 'UUA': 'L', 'UUG': 'L', 'UCU': 'S', 'UCC': 'S', 'UCA': 'S', 'UCG': 'S',
        'UAU': 'Y', 'UAC': 'Y', 'UAA': '*', 'UAG': '*', 'UGU': 'C', 'UGC': 'C', 'UGA': '*', 'UGG': 'W', 'CUU': 'L',
        'CUC': 'L', 'CUA': 'L', 'CUG': 'L', 'CCU': 'P', 'CCC': 'P', 'CCA': 'P', 'CCG': 'P', 'CAU': 'H', 'CAC': 'H',
        'CAA': 'Q', 'CAG': 'Q', 'CGU': 'R', 'CGC': 'R', 'CGA': 'R', 'CGG': 'R', 'AUU': 'I', 'AUC': 'I', 'AUA': 'I',
        'ACU': 'T', 'ACC': 'T', 'ACA': 'T', 'ACG': 'T', 'AAU': 'N', 'AAC': 'N', 'AAA': 'K', 'AAG': 'K', 'AGU': 'S',
        'AGC': 'S', 'AGA': 'R', 'AGG': 'R', 'GUU': 'V', 'GUC': 'V', 'GUA': 'V', 'GUG': 'V', 'GCU': 'A', 'GCC': 'A',
        'GCA': 'A', 'GCG': 'A', 'GAU': 'D', 'GAC': 'D', 'GAA': 'E', 'GAG': 'E', 'GGU': 'G', 'GGC': 'G', 'GGA': 'G',
        'GGG': 'G'
    }
    
    protein = []
    for i in range(0, len(rna) - 2, 3):
        codon = rna[i:i+3]
        protein.append(codon_table.get(codon, "?"))
        
    print(f"Proteinový preklad (prvních 20 AA):\n  {''.join(protein[:20])}")
    print("=" * 40)

if __name__ == "__main__":
    test_dna = "ATGCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATC"
    analyze_sequence(test_dna)
`;

export const MOCK_OUTPUT = `> python analyze_sequence.py
========================================
 VÝSLEDKY BIOINFORMATICKÉ ANALÝZY
========================================
Délka sekvence: 44 bp
Obsah GC:        45.45 %
----------------------------------------
Frekvence nukleotidu:
  A:    11 ( 25.00 %)
  T:    13 ( 29.55 %)
  C:     8 ( 18.18 %)
  G:    12 ( 27.27 %)
----------------------------------------
RNA transkript (prvních 60 bp):
  AUGCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUCGAUC
Proteinový preklad (prvních 20 AA):
  MRSID*IRSID*IRSID*IR
========================================`;
