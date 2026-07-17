from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def restore_micro_data() -> None:
    pairs = [
        (
            ROOT / ".old/src/features/microbiology/data/zastupci.ts",
            ROOT / "src/features/microbiology/data/zastupci.ts",
        ),
        (
            ROOT / ".old/src/features/microbiology/data/emojis.ts",
            ROOT / "src/features/microbiology/data/emojis.ts",
        ),
    ]
    for src, dst in pairs:
        text = src.read_text(encoding="utf-8-sig")
        text = text.replace("from '../../../types'", "from '../types'")
        text = text.replace('from "../../../types"', 'from "../types"')
        dst.write_text(text, encoding="utf-8", newline="\n")
        print(f"Restored {dst.relative_to(ROOT)} ({dst.stat().st_size} bytes)")
        for line in text.splitlines():
            if any(ord(c) > 127 for c in line):
                print(f"  sample: {line[:100]}")
                break


def scan_mojibake() -> list[Path]:
    markers = [
        "├",
        "┼",
        "≡ƒ",
        "Ã¡",
        "Ã­",
        "Ã©",
        "Ã½",
        "Ãº",
        "Ä›",
        "Å™",
        "Å¡",
        "bunÄ",
        "gramnegativnÃ",
        "stÄ›n",
    ]
    bad: list[Path] = []
    for p in (ROOT / "src").rglob("*"):
        if p.suffix.lower() not in {
            ".ts",
            ".tsx",
            ".js",
            ".jsx",
            ".json",
            ".css",
            ".md",
            ".html",
        }:
            continue
        text = p.read_text(encoding="utf-8")
        if any(m in text for m in markers):
            bad.append(p)
            for line in text.splitlines():
                if any(m in line for m in markers):
                    print(f"BAD {p.relative_to(ROOT)}")
                    print(f"  {line[:120]}")
                    break
    return bad


if __name__ == "__main__":
    restore_micro_data()
    # also re-restore prazdniny from git if needed — already fixed
    bad = scan_mojibake()
    print("Remaining bad:", [str(p.relative_to(ROOT)) for p in bad] or "NONE")
