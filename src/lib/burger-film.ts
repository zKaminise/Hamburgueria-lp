/** A single photographic set. Every pose is a pure function of scroll time.
 * There are no scene-sized image swaps, playback clocks or autoplay loops.
 */
export const filmAssets = [
  "raw",
  "patty",
  "press",
  "bun-top-v2",
  "bun-bottom",
  "cheese",
  "patty-cheese-v2",
  "griddle",
] as const;
export type FilmAsset = (typeof filmAssets)[number];
export type FilmImages = Record<FilmAsset, HTMLImageElement>;
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const range = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const smooth = (v: number) => v * v * (3 - 2 * v);
const between = (t: number, a: number, b: number) => smooth(range(t, a, b));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export function drawBurgerFilm(
  ctx: CanvasRenderingContext2D,
  images: FilmImages,
  width: number,
  height: number,
  time: number,
) {
  const mobile = width <= 600;
  const tablet = width <= 1000 && !mobile;
  const cx = width * (mobile || tablet ? 0.5 : 0.66);
  const floor = height * (mobile ? 0.77 : 0.78);
  const size = mobile
    ? width * (height < 700 ? 0.62 : 0.78)
    : Math.min(
        width * (tablet ? 0.68 : 0.42),
        height * (tablet ? 0.5 : 0.62),
        1120,
      );
  const compression = between(time, 2.12, 2.83);
  const cooked = between(time, 2.46, 2.84);
  const cheeseFall = between(time, 4.03, 4.58);
  const melt = between(time, 4.45, 4.96);
  const lift = between(time, 5.02, 5.48);
  const breadSlide = between(time, 5.12, 5.72);
  const close = between(time, 5.78, 6.48);
  const zoom =
    1 +
    0.12 * between(time, 3.05, 3.85) * (1 - between(time, 4.75, 5.4)) +
    0.025 * between(time, 6.45, 7);
  const settle = between(time, 6.3, 6.52);
  const pattyFloor = floor - lift * size * 0.255 + settle * size * 0.012;
  const drop = range(time, 1.02, 1.65);
  const rawFloor = floor - (1 - drop * drop) * size * 0.64;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#080908";
  ctx.fillRect(0, 0, width, height);
  const backdrop = images.griddle;
  const bgScale =
    Math.max(width / backdrop.naturalWidth, height / backdrop.naturalHeight) *
    (1.015 + compression * 0.01);
  ctx.globalAlpha = 0.7;
  ctx.drawImage(
    backdrop,
    (width - backdrop.naturalWidth * bgScale) / 2,
    (height - backdrop.naturalHeight * bgScale) / 2,
    backdrop.naturalWidth * bgScale,
    backdrop.naturalHeight * bgScale,
  );
  ctx.globalAlpha = 1;
  ctx.save();
  ctx.translate(cx, floor);
  ctx.scale(zoom, zoom);
  ctx.translate(-cx, -floor);

  ctx.save();
  ctx.translate(cx, floor - size * 0.015);
  ctx.scale(size * lerp(0.3, 0.56, drop), size * 0.075);
  const shadow = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
  shadow.addColorStop(0, `rgba(0,0,0,${lerp(0.12, 0.6, drop)})`);
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shadow;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();

  function sprite(
    key: FilmAsset,
    bottom: number,
    w: number,
    h: number,
    opacity = 1,
    angle = 0,
    x = cx,
  ) {
    if (opacity <= 0.001) return;
    const img = images[key];
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x, bottom - h / 2);
    ctx.rotate(angle);
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  // The whole lower bun slides across the griddle beneath the raised patty.
  if (time > 5.12) {
    sprite(
      "bun-bottom",
      floor,
      size,
      size * 0.32,
      between(time, 5.12, 5.3),
      0,
      cx + (1 - breadSlide) * (width - cx + size * 0.55),
    );
  }

  if (cooked < 1) {
    const rawW = lerp(size * 0.49, size, compression);
    const rawH = lerp(size * 0.39, size * 0.25, compression);
    sprite("raw", rawFloor, rawW, rawH, 1 - cooked, (1 - drop) * -0.11);
  }
  sprite("patty", pattyFloor, size, size * 0.25, cooked * (1 - melt));

  // Keep the photographed draped corners intact as the cheese settles.
  if (time > 3.98 && melt < 1) {
    const cheeseW = size * lerp(0.98, 1.02, melt);
    const cheeseH = size * lerp(0.28, 0.21, melt);
    const cheeseBottom =
      pattyFloor - size * 0.07 - (1 - cheeseFall) * size * 0.69;
    sprite(
      "cheese",
      cheeseBottom,
      cheeseW,
      cheeseH,
      between(time, 3.98, 4.08) * (1 - melt),
    );
  }
  sprite("patty-cheese-v2", pattyFloor, size, size * 0.3, melt);

  // The real metal press follows the contact point, then leaves the stage.
  if (time > 1.72 && time < 3.5) {
    const enter = between(time, 1.72, 2.12);
    const leave = between(time, 2.94, 3.5);
    const contact = floor - lerp(size * 0.3, size * 0.115, compression);
    const bottom =
      lerp(floor - size * 1.8, contact, enter) - leave * size * 1.6;
    const pressW = size * 1.2;
    const pressH =
      (pressW * images.press.naturalHeight) / images.press.naturalWidth;
    sprite(
      "press",
      bottom,
      pressW,
      pressH,
      between(time, 1.72, 1.9) * (1 - between(time, 3.38, 3.5)),
    );
  }

  // Closing the same assembly avoids a dissolve into a different finished burger.
  if (time > 5.62) {
    const topW = size * 0.99;
    const topH = size * 0.34;
    const topBottom =
      floor - size * 0.435 - (1 - close) * size * 0.52 + settle * size * 0.012;
    sprite(
      "bun-top-v2",
      topBottom,
      topW,
      topH,
      between(time, 5.62, 5.8),
      (1 - close) * -0.025,
    );
  }
  ctx.restore();
}
