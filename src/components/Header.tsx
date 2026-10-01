"use client";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { FlameIcon } from "./Icons";
import { OrderButton } from "./OrderButton";
const links = [
  { href: "#inicio", label: "Início" },
  { href: "#o-burger", label: "O burger" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#sobre", label: "Nossa essência" },
  { href: "#contato", label: "Contato" },
];
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#inicio"
      aria-label={`${siteConfig.brandName} — início`}
    >
      <FlameIcon />
      <span>
        <strong>{siteConfig.brandName}</strong>
        <small>{siteConfig.brandSubtitle}</small>
      </span>
    </a>
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = nav.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab") {
        const items = [
          toggle.current,
          ...Array.from(nav.current?.querySelectorAll<HTMLElement>("a") || []),
        ].filter(Boolean) as HTMLElement[];
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    };
    const resize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    document.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  return (
    <header
      className={`header ${scrolled ? "scrolled" : ""} ${open ? "menu-open" : ""}`}
    >
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <OrderButton className="header-order" />
        <button
          className="menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          ref={toggle}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav
        id="mobile-navigation"
        ref={nav}
        className="mobile-nav"
        aria-label="Navegação móvel"
        inert={!open}
      >
        {links.map((link, index) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            <small>0{index + 1}</small>
            {link.label}
          </a>
        ))}
        <OrderButton />
      </nav>
    </header>
  );
}
