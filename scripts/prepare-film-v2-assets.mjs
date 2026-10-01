import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = process.argv[2] || "D:/Importante/Codex/brasa-film-v2";
const manifest = JSON.parse(await readFile("docs/film-v2-assets.json", "utf8"));
for (const [name, entry] of Object.entries(manifest)) {
  const input = await sharp(path.join(root, `${name}.png`))
    .extract(entry.crop)
    .png()
    .toBuffer();
  for (const mobile of [false, true]) {
    await sharp(input)
      .resize({ width: mobile ? 640 : 1200 })
      .webp({ quality: mobile ? 86 : 92, alphaQuality: 100, effort: 6 })
      .toFile(`public/assets/film/${name}${mobile ? "-mobile" : ""}.webp`);
  }
}
