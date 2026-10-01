import sharp from "sharp";
import { mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
const source = process.argv[2];
if (!source) throw new Error("Informe a pasta de fotografias originais.");
const sets = {
  burger: ["hero", "double", "bacon"],
  sequence: ["beef", "smash", "sear", "melt", "assembly", "cheddar"],
};
let total = 0;
for (const [folder, names] of Object.entries(sets)) {
  const destination = path.resolve("public/assets", folder);
  await mkdir(destination, { recursive: true });
  for (const name of names) {
    for (const mobile of [false, true]) {
      const output = path.join(
        destination,
        `${name}${mobile ? "-mobile" : ""}.webp`,
      );
      await sharp(path.join(source, `${name}.png`))
        .resize({ width: mobile ? 800 : 1536, withoutEnlargement: true })
        .webp({ quality: mobile ? 80 : 87, effort: 6 })
        .toFile(output);
      total += (await stat(output)).size;
    }
  }
}
await mkdir("docs", { recursive: true });
await copyFile(path.join(source, "prompts.json"), "docs/image-prompts.json");
console.log(
  `18 assets WebP locais: ${(total / 1024 / 1024).toFixed(2)} MB no total.`,
);
