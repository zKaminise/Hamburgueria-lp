"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scenes } from "@/config/scenes";
import { siteConfig } from "@/config/site";
import { ArrowIcon } from "./Icons";
import { OrderButton } from "./OrderButton";
import { BurgerFilm, type BurgerFilmHandle } from "./BurgerFilm";

gsap.registerPlugin(ScrollTrigger);
export function HeroExperience() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const renderer = useRef<BurgerFilmHandle>(null);
  const [filmReady, setFilmReady] = useState(false);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const handleFilmReady = useCallback((ready: boolean) => {
    if (ready) {
      // Restored scroll can seek GSAP before the canvas assets finish decoding.
      const time = ScrollTrigger.getById("burger-film")?.animation?.time() ?? 0;
      renderer.current?.seek(time);
      setActive(Math.min(6, Math.floor(time + 0.05)));
    }
    setFilmReady(ready);
  }, []);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      {
        motion:
          "(prefers-reduced-motion: no-preference) and (min-height: 620px)",
        reduce: "(prefers-reduced-motion: reduce), (max-height: 619px)",
      },
      (context) => {
        const reduce = Boolean(context.conditions?.reduce);
        setReduced(reduce);
        if (reduce) return;
        const panels = gsap.utils.toArray<HTMLElement>(
          ".film-panel",
          root.current,
        );
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        gsap.set(".continuous-film", { autoAlpha: 0 });
        const playhead = { time: 0 };
        let currentScene = -1;
        const film = gsap.timeline({
          scrollTrigger: {
            id: "burger-film",
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar.current)
                bar.current.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        film.to(
          playhead,
          {
            time: 7,
            duration: 7,
            ease: "none",
            onUpdate: () => {
              renderer.current?.seek(playhead.time);
              const index = Math.min(6, Math.floor(playhead.time + 0.05));
              if (index !== currentScene) {
                currentScene = index;
                setActive(index);
              }
            },
          },
          0,
        );
        film.to(".continuous-film", { autoAlpha: 1, duration: 0.32 }, 0.82);
        panels.forEach((panel, index) => {
          const visual = panel.querySelector(".scene-visual");
          const copy = panel.querySelector(".scene-copy");
          if (index > 0) {
            film.to(
              panels[index - 1],
              { autoAlpha: 0, duration: 0.16, ease: "power1.inOut" },
              index - 0.22,
            );
            film.to(
              panel,
              { autoAlpha: 1, duration: 0.2, ease: "power1.inOut" },
              index - 0.04,
            );
            if (copy)
              film.fromTo(
                copy.children,
                { y: 12 },
                { y: 0, duration: 0.38, stagger: 0.015, ease: "power2.out" },
                index - 0.04,
              );
          }
          if (index === 0)
            film.fromTo(
              visual,
              { scale: 1, yPercent: 2 },
              {
                scale: 1.08,
                yPercent: -2,
                duration: 1.2,
                ease: "none",
              },
              Math.max(0, index - 0.2),
            );
        });
        const stage = root.current?.querySelector<HTMLElement>(".film-stage");
        const hero = root.current?.querySelector(".hero-visual > picture");
        const xTo = gsap.quickTo(hero || [], "x", {
          duration: 0.8,
          ease: "power2.out",
        });
        const yTo = gsap.quickTo(hero || [], "y", {
          duration: 0.8,
          ease: "power2.out",
        });
        const pointer = (event: PointerEvent) => {
          if (event.pointerType === "mouse") {
            xTo((event.clientX / window.innerWidth - 0.5) * 14);
            yTo((event.clientY / window.innerHeight - 0.5) * 10);
          }
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        stage?.addEventListener("pointermove", pointer);
        stage?.addEventListener("pointerleave", leave);
        const refresh = () => ScrollTrigger.refresh();
        document.fonts.ready.then(refresh);
        window.addEventListener("load", refresh, { once: true });
        return () => {
          window.removeEventListener("load", refresh);
          stage?.removeEventListener("pointermove", pointer);
          stage?.removeEventListener("pointerleave", leave);
        };
      },
      root,
    );
    return () => media.revert();
  }, []);
  const goToScene = (index: number) => {
    if (reduced) {
      document
        .getElementById(`scene-${scenes[index].id}`)
        ?.scrollIntoView({ behavior: "auto" });
      return;
    }
    const trigger = ScrollTrigger.getById("burger-film");
    const sceneTime = index === scenes.length - 1 ? 6.7 : index + 1.2;
    if (trigger)
      window.scrollTo({
        top: trigger.start + (trigger.end - trigger.start) * (sceneTime / 7),
        behavior: "smooth",
      });
  };
  return (
    <section
      ref={root}
      className={`experience ${reduced ? "reduced" : ""} ${filmReady ? "film-ready" : ""}`}
      id="inicio"
      aria-label="A experiência BRASA: da carne ao burger"
    >
      <span id="o-burger" className="burger-anchor" aria-hidden="true" />
      <div className="film-stage">
        <BurgerFilm
          ref={renderer}
          enabled={!reduced}
          onReady={handleFilmReady}
        />
        <div className="film-topline">
          <span>
            <i className="record-dot" /> FEITO NA CHAPA. SEM ATALHOS.
          </span>
          <span className="film-format">
            {siteConfig.brandName} KITCHEN — VOL. 01
          </span>
        </div>
        <div className="film-panel opening-panel">
          <div className="scene-visual hero-visual">
            <picture>
              <source
                media="(max-width: 600px)"
                srcSet="/assets/burger/hero-mobile.webp"
              />
              <img
                src="/assets/burger/hero.webp"
                width="1536"
                height="1024"
                alt="Hambúrguer artesanal com brioche dourado, carne suculenta e cheddar derretido"
                fetchPriority="high"
              />
            </picture>
          </div>
          <div className="scene-copy opening-copy">
            <p className="eyebrow">
              <span /> FOGO ALTO. PADRÃO MAIS ALTO.
            </p>
            <h1>
              CARNE.
              <br />
              FOGO.
              <br />
              <em>SEM ATALHOS.</em>
            </h1>
            <p className="opening-description">
              A crosta faz a diferença.
              <br />A primeira mordida explica o resto.
            </p>
            <div className="hero-actions">
              <OrderButton />
              <a className="text-link" href={siteConfig.menuUrl}>
                VER CARDÁPIO <ArrowIcon />
              </a>
            </div>
          </div>
          <div className="hero-spec">
            <span>O ORIGINAL</span>
            <strong>
              180<small>g</small>
            </strong>
            <span>BLEND DA CASA</span>
            <div />
            <span>
              BRIOCHE TOSTADO
              <br />
              CHEDDAR NO PONTO
              <br />
              CROSTA DE VERDADE
            </span>
          </div>
          <div className="hero-caption">
            <span>01 — THE CLASSIC</span>
            <span>FEITO À MÃO. FEITO PRA VOCÊ.</span>
          </div>
        </div>
        {scenes.map((scene, index) => (
          <article
            className={`film-panel process-panel scene-${scene.id}`}
            id={`scene-${scene.id}`}
            key={scene.id}
          >
            <div
              className={`scene-visual ${scene.id === "build" ? "assembly-visual" : ""}`}
            >
              {scene.id === "melt" && (
                <picture className="melt-base">
                  <source
                    media="(max-width: 600px)"
                    srcSet="/assets/sequence/sear-mobile.webp"
                  />
                  <img
                    src="/assets/sequence/sear.webp"
                    width="1536"
                    height="1024"
                    alt=""
                    loading="lazy"
                  />
                </picture>
              )}
              {scene.id === "build" ? (
                <div className="assembly" role="img" aria-label={scene.alt}>
                  {["top", "middle", "bottom"].map((layer) => (
                    <div
                      className={`assembly-layer assembly-${layer}`}
                      key={layer}
                    >
                      <picture>
                        <source
                          media="(max-width: 600px)"
                          srcSet="/assets/sequence/assembly-mobile.webp"
                        />
                        <img
                          src={scene.image}
                          alt=""
                          width="1536"
                          height="1024"
                          loading="lazy"
                        />
                      </picture>
                    </div>
                  ))}
                </div>
              ) : (
                <picture
                  className={scene.id === "melt" ? "melt-finished" : undefined}
                >
                  <source
                    media="(max-width: 600px)"
                    srcSet={scene.image.replace(".webp", "-mobile.webp")}
                  />
                  <img
                    src={scene.image}
                    width="1536"
                    height="1024"
                    alt={scene.alt}
                    loading="lazy"
                  />
                </picture>
              )}
              {scene.id === "melt" && (
                <picture className="cheddar-layer">
                  <source
                    media="(max-width: 600px)"
                    srcSet="/assets/sequence/cheddar-mobile.webp"
                  />
                  <img
                    src="/assets/sequence/cheddar.webp"
                    width="1536"
                    height="1024"
                    alt=""
                    loading="lazy"
                  />
                </picture>
              )}
            </div>
            <div className="scene-copy">
              <p className="eyebrow">
                <span /> 0{index + 1} / {scene.english}
              </p>
              <h2>
                {scene.title[0]}
                <br />
                <em>{scene.title[1]}</em>
              </h2>
              <p className="scene-description">{scene.description}</p>
              {scene.id === "final" && (
                <div className="hero-actions">
                  <OrderButton />
                  <a href={siteConfig.menuUrl} className="text-link">
                    VER CARDÁPIO <ArrowIcon />
                  </a>
                </div>
              )}
            </div>
            <div className="scene-spec">
              <span className="spec-cross">+</span>
              <strong>{scene.metric}</strong>
              <span>{scene.unit}</span>
              <div className="spec-rule" />
              <small>
                {scene.id === "sear"
                  ? "PONTO — SUCULENTO\nCROSTA — INTENSA"
                  : "MATÉRIA-PRIMA REAL\nPROCESSO ARTESANAL"}
              </small>
            </div>
            <div className="scene-title-bottom">
              <span>PROCESSO {siteConfig.brandName}</span>
              <span>0{index + 1} / 06</span>
            </div>
          </article>
        ))}
        <div className="film-bottom">
          <div className="scroll-cue">
            <span className="scroll-icon" />
            <span>
              ROLE PARA
              <br />
              <b>SENTIR O PROCESSO</b>
            </span>
          </div>
          <nav className="scene-navigation" aria-label="Cenas do preparo">
            {scenes.map((scene, i) => (
              <button
                key={scene.id}
                onClick={() => goToScene(i)}
                className={active === i + 1 ? "active" : ""}
                aria-current={active === i + 1 ? "step" : undefined}
                aria-label={`Ir para a cena ${i + 1}: ${scene.label}`}
              >
                <span>0{i + 1}</span>
                <b>{scene.label}</b>
              </button>
            ))}
          </nav>
          <a href="#cardapio" className="skip-film">
            PULAR PARA O CARDÁPIO <ArrowIcon />
          </a>
        </div>
        <div className="film-progress" aria-hidden="true">
          <div ref={bar} />
        </div>
      </div>
      <noscript>
        <style>{`.experience{height:auto!important}.film-stage{position:relative!important;height:auto!important}.film-panel{position:relative!important;min-height:90svh;visibility:visible!important;opacity:1!important}.film-bottom,.film-topline{display:none!important}`}</style>
      </noscript>
    </section>
  );
}
