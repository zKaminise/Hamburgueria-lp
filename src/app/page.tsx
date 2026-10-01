import { Header } from "@/components/Header";
import { HeroExperience } from "@/components/HeroExperience";
import { BurgerMenu } from "@/components/BurgerMenu";
import { StorySection } from "@/components/StorySection";
import { FinalCTA, Footer, WhatsAppButton } from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroExperience />
        <div
          className="manifesto-strip"
          aria-label="Carne fresca, chapa quente, feito à mão"
        >
          <span>CARNE FRESCA</span>
          <b>✳</b>
          <span>CHAPA QUENTE</span>
          <b>✳</b>
          <span>FEITO À MÃO</span>
          <b>✳</b>
          <span>SEM ATALHOS</span>
        </div>
        <BurgerMenu />
        <StorySection />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
