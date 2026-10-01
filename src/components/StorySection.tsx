"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function StorySection() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 901px)",
      () => {
        gsap.fromTo(
          ".story-photo img",
          { yPercent: -5, scale: 1.12 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      },
      root,
    );
    return () => media.revert();
  }, []);
  return (
    <section className="story-section section-pad" id="sobre" ref={root}>
      <div className="story-photo">
        <img
          src="/assets/sequence/sear.webp"
          alt="Textura da crosta de carne artesanal caramelizada na chapa"
          width="1024"
          height="1200"
          loading="lazy"
        />
        <span className="photo-label">FIG. 01 — ONDE O SABOR ACONTECE</span>
        <span className="photo-corner">230°C</span>
      </div>
      <div className="story-copy">
        <p className="eyebrow">
          <span /> NOSSA ESSÊNCIA
        </p>
        <h2>
          SIMPLES.
          <br />
          QUENTE.
          <br />
          <em>
            BRUTALMENTE
            <br />
            BOM.
          </em>
        </h2>
        <p>
          Não tem fórmula secreta. Tem carne fresca, chapa quente e gente que se
          importa com cada detalhe.
        </p>
        <p>
          A gente prensa, cria a crosta e deixa o cheddar abraçar a carne. O pão
          é tostado. O molho é da casa. O resto é com você.
        </p>
        <div className="story-signature">
          <span>
            FEITO NA CHAPA.
            <br />
            COMIDO COM AS MÃOS.
          </span>
          <span className="signature-cross">+</span>
        </div>
      </div>
    </section>
  );
}
