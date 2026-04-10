import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

const pdfPath = path.resolve(process.cwd(), "revisao.pdf");
const outPath = path.resolve(process.cwd(), "revisao.txt");

const parser = new PDFParse({ verbosity: 0, url: pdfPath });
await parser.load();
const parsed = await parser.getText();

const text =
  parsed && Array.isArray(parsed.pages)
    ? parsed.pages
        .map((p, idx) => `-- ${idx + 1} of ${parsed.pages.length} --\n\n${p.text ?? ""}`)
        .join("\n\n")
    : "";

fs.writeFileSync(outPath, text ?? "", "utf8");
console.log(`OK: wrote ${outPath}`);
