// One-off logo optimizer. Resizes each client logo to a max height of ~160px
// and recompresses it as an optimized PNG, overwriting in place. Filenames are
// preserved exactly (including the two with spaces) so imports keep working.
//
// Run: node scripts/optimize-logos.mjs
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = join(__dirname, "..", "client", "src", "assets", "clients");

const files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith(".png"));

let before = 0;
let after = 0;

for (const file of files) {
  const path = join(dir, file);
  const input = await readFile(path);
  const output = await sharp(input)
    .resize({ height: 160, withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9, palette: true })
    .toBuffer();

  await writeFile(path, output);
  before += input.length;
  after += output.length;
  console.log(
    `${file}: ${(input.length / 1024).toFixed(0)} KB → ${(output.length / 1024).toFixed(0)} KB`,
  );
}

console.log(
  `\nTOTAL (${files.length} logos): ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024 / 1024).toFixed(2)} MB`,
);
