import { money, siteConfig } from "@/config/site";
import { OrderButton } from "./OrderButton";
export function BurgerMenu() {
  return (
    <section className="menu-section section-pad" id="cardapio">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            <span /> ESCOLHA SUA PRÓXIMA MORDIDA
          </p>
          <h2>
            SEM ERRO.
            <br />
            <em>SÓ BURGER BOM.</em>
          </h2>
        </div>
        <p>
          Três personalidades.
          <br />A mesma obsessão por fazer direito.
        </p>
      </div>
      <div className="burger-menu">
        {siteConfig.burgers.map((burger) => (
          <article className="menu-item" key={burger.id}>
            <div className="menu-image">
              <span className="menu-number">/{burger.number}</span>
              <span className="menu-tag">{burger.tag}</span>
              <picture>
                <source
                  media="(max-width: 600px)"
                  srcSet={burger.image.replace(".webp", "-mobile.webp")}
                />
                <img
                  src={burger.image}
                  width="900"
                  height="700"
                  loading="lazy"
                  alt={burger.alt}
                />
              </picture>
            </div>
            <div className="menu-item-heading">
              <h3>{burger.name}</h3>
              <span>{money(burger.price)}</span>
            </div>
            <p>{burger.description}</p>
            <div className="menu-item-bottom">
              <small>{burger.detail}</small>
              <OrderButton
                className="menu-order"
                label={`Pedir ${burger.name} — abre em uma nova aba`}
              >
                PEDIR ESSE
              </OrderButton>
            </div>
          </article>
        ))}
      </div>
      {siteConfig.demo && (
        <p className="demo-note">
          Cardápio demonstrativo. Confirme preços e disponibilidade ao pedir.
        </p>
      )}
    </section>
  );
}
