import sharp from "sharp";
import { mkdir, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.argv[2] || "D:/Importante/Codex/brasa-film-assets";
const out = "public/assets/film";
await mkdir(out, { recursive: true });
const sources = [
  ["raw", "raw.png"],
  ["patty", "patty.png"],
  ["press", "press.png"],
  ["bun-top", "assembly.png", { left: 0, top: 0, width: 1536, height: 338 }],
  [
    "bun-bottom",
    "assembly.png",
    { left: 0, top: 594, width: 1536, height: 430 },
  ],
  ["cheese", "../brasa-generated/cheddar.png"],
  ["griddle", "griddle.png"],
];
const manifest = {};
for (const [name, source, crop] of sources) {
  let input = sharp(path.resolve(root, source));
  if (crop) input = sharp(await input.extract(crop).png().toBuffer());
  if (name !== "griddle") input = input.trim({ threshold: 16 });
  const png = await input.png().toBuffer();
  const meta = await sharp(png).metadata();
  manifest[name] = {
    width: meta.width,
    height: meta.height,
    alpha: meta.hasAlpha,
  };
  for (const mobile of [false, true]) {
    await sharp(png)
      .resize({
        width: name === "griddle" ? (mobile ? 900 : 1536) : mobile ? 640 : 1200,
        withoutEnlargement: true,
      })
      .webp({ quality: mobile ? 83 : 90, alphaQuality: 95, effort: 6 })
      .toFile(`${out}/${name}${mobile ? "-mobile" : ""}.webp`);
  }
}
await copyFile(path.join(root, "prompts.json"), "docs/film-image-prompts.json");
await writeFile("docs/film-assets.json", JSON.stringify(manifest, null, 2));
console.log(manifest);
