import pptxgen from "pptxgenjs";
import { addModule2Slides } from "./modules_doc/module2_doc.mjs";
import { addModule3Slides } from "./modules_doc/module3_doc.mjs";
import { addModule4Slides } from "./modules_doc/module4_doc.mjs";
import { addModule5Slides } from "./modules_doc/module5_doc.mjs";
import { addModule6Slides } from "./modules_doc/module6_doc.mjs";
import { addModule7Slides } from "./modules_doc/module7_doc.mjs";
import { addModule8Slides } from "./modules_doc/module8_doc.mjs";
import { createDocMasterTitleSlide, FONT_SCALE, FONT_DELTA } from "./pptx_document_engine.mjs";

const pres = new pptxgen();
pres.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pres.layout = "WIDESCREEN_16_9";

const modules = [
  { name: "Master Title", fn: (p) => createDocMasterTitleSlide(p) },
  { name: "Module 2", fn: addModule2Slides },
  { name: "Module 3", fn: addModule3Slides },
  { name: "Module 4", fn: addModule4Slides },
  { name: "Module 5", fn: addModule5Slides },
  { name: "Module 6", fn: addModule6Slides },
  { name: "Module 7", fn: addModule7Slides },
  { name: "Module 8", fn: addModule8Slides },
];

let overflows = 0;
const maxYAllowed = 7.15;
let globalSlideIdx = 1;

modules.forEach(m => {
  const pres = new pptxgen();
  pres.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
  pres.layout = "WIDESCREEN_16_9";
  m.fn(pres);

  pres.slides.forEach((slide, idx) => {
    const objects = slide._slideObjects || [];
    let maxBottom = 0;
    let heading = "Untitled";

    objects.forEach(obj => {
      const textVal = obj.text || (obj._textObjects && obj._textObjects[0]?.text) || "";
      const textStr = Array.isArray(textVal) ? textVal.map(r => r.text || "").join("") : String(textVal);
      if (heading === "Untitled" && textStr && !textStr.startsWith("MODUL") && !textStr.startsWith("VŠCHT")) {
        heading = textStr.slice(0, 50).replace(/\n/g, " ");
      }

      if (obj.options && obj.options.y < 7.1) {
        const bottom = (obj.options.y || 0) + (obj.options.h || 0);
        if (bottom > maxBottom) {
          maxBottom = bottom;
        }
      }
    });

    if (maxBottom > maxYAllowed) {
      console.log(`[OVERFLOW] ${m.name} Slide ${idx + 1} (Global ${globalSlideIdx}): bottom = ${maxBottom.toFixed(2)}" (exceeds ${maxYAllowed}") -> "${heading}"`);
      overflows++;
    }
    globalSlideIdx++;
  });
});

if (overflows === 0) {
  console.log("SUCCESS: All slides fit comfortably inside the 7.5\" canvas without overlapping the footer!");
} else {
  console.log(`WARNING: Found ${overflows} overflowing slides!`);
}
