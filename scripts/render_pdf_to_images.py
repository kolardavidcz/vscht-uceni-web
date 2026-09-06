import sys
from pathlib import Path
import pypdfium2 as pdfium

pdf_path = Path(sys.argv[1] if len(sys.argv) > 1 else "test-slides-23-24.pdf")
out_prefix = sys.argv[2] if len(sys.argv) > 2 else "preview-slide"

if not pdf_path.exists():
    print(f"PDF not found: {pdf_path}")
    sys.exit(1)

doc = pdfium.PdfDocument(str(pdf_path))
print(f"Loaded {pdf_path.name} with {len(doc)} pages.")

for i, page in enumerate(doc):
    image = page.render(scale=150/72).to_pil()
    out_file = Path(f"{out_prefix}-{i+1}.png")
    image.save(out_file)
    print(f"Saved {out_file.resolve()}")
