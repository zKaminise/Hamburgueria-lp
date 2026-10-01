import { siteConfig } from "@/config/site";
import { Brand } from "./Header";
import { OrderButton } from "./OrderButton";
import { ArrowIcon, WhatsAppIcon } from "./Icons";
export function FinalCTA() {
  return (
    <section className="final-cta">
      <img
        src="/assets/burger/double.webp"
        alt="Burger com cheddar e bacon pronto para a primeira mordida"
        width="1536"
        height="1024"
        loading="lazy"
      />
      <div>
        <p className="eyebrow">
          <span /> JÁ DEU PRA SENTIR, NÉ?
        </p>
        <h2>
          A FOME
          <br />
          <em>NÃO ESPERA.</em>
        </h2>
        <OrderButton>RESOLVER MINHA FOME</OrderButton>
      </div>
      <span className="final-note">DA CHAPA PARA A SUA PRÓXIMA MORDIDA.</span>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="footer section-pad" id="contato">
      <div className="footer-main">
        <div>
          <Brand footer />
          <p>{siteConfig.slogan}</p>
        </div>
        <div className="footer-column">
          <h3>VEM DE CONVERSA.</h3>
          <a
            href={siteConfig.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp <ArrowIcon />
          </a>
          <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}>
            {siteConfig.phone}
          </a>
          {siteConfig.instagram && (
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.instagramHandle || "Instagram"}
              <ArrowIcon />
            </a>
          )}
        </div>
        <div className="footer-column">
          <h3>ONDE A CHAPA ESQUENTA.</h3>
          {siteConfig.address.street ? (
            <p>
              {siteConfig.address.street}
              <br />
              {siteConfig.address.city} — {siteConfig.address.region}
            </p>
          ) : (
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consulte a área de entrega <ArrowIcon />
            </a>
          )}
          {siteConfig.openingHours.length ? (
            siteConfig.openingHours.map((day) => (
              <p key={day.days}>
                {day.days} · {day.hours}
              </p>
            ))
          ) : (
            <p>Horários de atendimento pelo WhatsApp.</p>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteConfig.brandName}. TODOS OS DIREITOS
          RESERVADOS.
        </span>
        <a href="#inicio">
          DE VOLTA AO FOGO <span>↑</span>
        </a>
      </div>
    </footer>
  );
}
export function WhatsAppButton() {
  return (
    <a
      className="floating-order"
      href={siteConfig.orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fazer pedido — abre em uma nova aba"
    >
      <WhatsAppIcon />
      <span>PEDIR AGORA</span>
      <i />
    </a>
  );
}
