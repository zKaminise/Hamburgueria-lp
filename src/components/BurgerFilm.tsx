"use client";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { drawBurgerFilm, filmAssets, type FilmImages } from "@/lib/burger-film";

export type BurgerFilmHandle = { seek: (time: number) => void };
export const BurgerFilm = forwardRef<
  BurgerFilmHandle,
  { enabled: boolean; onReady: (ready: boolean) => void }
>(function BurgerFilm({ enabled, onReady }, ref) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<FilmImages | null>(null);
  const time = useRef(0);
  const render = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);
  useImperativeHandle(
    ref,
    () => ({
      seek: (next) => {
        time.current = next;
        render.current();
      },
    }),
    [],
  );

  useEffect(() => {
    setReady(false);
    onReady(false);
    if (!enabled || !canvas.current) return;
    const element = canvas.current;
    const context = element.getContext("2d", { alpha: false });
    if (!context) return;
    let disposed = false;
    let width = 0;
    let height = 0;
    const paint = () => {
      if (disposed || !images.current || width === 0 || height === 0) return;
      const frame = Math.round(time.current * 60);
      drawBurgerFilm(context, images.current, width, height, time.current);
      element.dataset.frame = String(frame);
      element.dataset.time = time.current.toFixed(6);
    };
    // GSAP already calls seek during its animation frame. A second RAF adds lag.
    render.current = paint;
    const resize = () => {
      const rect = element.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      // Cap the pixel budget on ultrawide/4K while retaining crisp mobile sprites.
      const ratio = Math.min(
        window.devicePixelRatio || 1,
        1.5,
        2300 / Math.max(width, 1),
      );
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      render.current();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    const mobile = window.innerWidth <= 600;
    const load = async () => {
      const pairs = await Promise.all(
        filmAssets.map(async (name) => {
          const img = new Image();
          img.decoding = "async";
          img.src = `/assets/film/${name}${mobile ? "-mobile" : ""}.webp`;
          await img.decode();
          return [name, img] as const;
        }),
      );
      if (disposed) return;
      images.current = Object.fromEntries(pairs) as FilmImages;
      paint();
      setReady(true);
      onReady(true);
    };
    load().catch(() => {
      if (!disposed) {
        setReady(false);
        onReady(false);
      }
    });
    return () => {
      disposed = true;
      observer.disconnect();
      render.current = () => {};
      images.current = null;
    };
  }, [enabled, onReady]);

  return (
    <div
      className={`continuous-film ${ready && enabled ? "is-ready" : ""}`}
      aria-hidden="true"
    >
      <canvas ref={canvas} data-frame="0" />
      <div className="film-vignette" />
    </div>
  );
});
