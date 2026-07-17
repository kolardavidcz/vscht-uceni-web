from pathlib import Path
import re

# JS-style \u{1F534} is not Python; use chr
print("runtime emoji:", chr(0x1F534), hex(0x1F534))

em = Path("src/features/microbiology/data/emojis.ts").read_text(encoding="utf-8")
z = Path("src/features/microbiology/data/zastupci.ts").read_text(encoding="utf-8")

print("emojis.ts first option line:")
for line in em.splitlines():
    if "emoji:" in line:
        print(" ", line.strip())
        break

print("category labels:")
for line in em.splitlines():
    if "key:" in line and "label:" in line:
        print(" ", line.strip())

print("zastupci sample correctEmojis:")
m = re.search(r'"correctEmojis":\s*\[[^\]]+\]', z)
print(" ", m.group(0)[:200] if m else "none")

print("escaped count emojis.ts:", em.count("\\u"))
print("escaped count zastupci.ts:", z.count("\\u"))
print("raw high unicode remaining emojis.ts:", sum(1 for c in em if ord(c) > 0x2000))
print("raw high unicode remaining zastupci.ts:", sum(1 for c in z if ord(c) > 0x2000))
