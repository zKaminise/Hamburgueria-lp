// Personalize a marca, os produtos e TODOS os destinos de conversão aqui.
const whatsappNumber = "5534998275292";
const orderMessage = "Olá! Vim pelo site e gostaria de fazer um pedido.";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderMessage)}`;

export const siteConfig = {
  brandName: "BRASA",
  brandSubtitle: "SMASH BURGER",
  slogan: "Carne. Fogo. Sem atalhos.",
  description:
    "Carne fresca, crosta intensa e cheddar no ponto. Conheça o processo e os burgers artesanais da BRASA. Peça pelo WhatsApp.",
  // Ao receber o domínio real, preencha para habilitar canonical, sitemap e URLs absolutas.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
  orderUrl: whatsappUrl,
  whatsapp: whatsappUrl,
  phone: "+55 34 99827-5292",
  menuUrl: "#cardapio",
  // Campos não fornecidos ficam vazios; o site não inventa perfis ou localização.
  instagram: "",
  instagramHandle: "",
  address: { street: "", city: "", region: "", postalCode: "", country: "BR" },
  coordinates: null as { latitude: number; longitude: number } | null,
  openingHours: [] as { days: string; hours: string; schema: string }[],
  socialImage: "/assets/burger/hero.webp",
  colors: { accent: "#f56a28", background: "#0b0c0b", foreground: "#f2eee5" },
  // Valores demonstrativos. Ajuste para o cardápio do cliente antes de publicar.
  demo: true,
  burgers: [
    {
      id: "classic",
      number: "01",
      name: "THE CLASSIC",
      tag: "O ORIGINAL",
      price: 32.9,
      description:
        "Brioche tostado, blend artesanal, cheddar derretido, picles e molho da casa.",
      detail: "180 g de carne · cheddar · picles",
      image: "/assets/burger/hero.webp",
      alt: "Burger artesanal com brioche, carne de crosta dourada, cheddar e picles",
    },
    {
      id: "double",
      number: "02",
      name: "DOUBLE FIRE",
      tag: "DOSE DUPLA",
      price: 42.9,
      description:
        "Dois smash, cheddar duplo, bacon crocante, cebola caramelizada e molho da casa.",
      detail: "2 smash · cheddar duplo · bacon",
      image: "/assets/burger/double.webp",
      alt: "Double Fire com duas carnes, cheddar derretido e bacon crocante no brioche",
    },
    {
      id: "bacon",
      number: "03",
      name: "BACON MELT",
      tag: "CROCÂNCIA PURA",
      price: 38.9,
      description:
        "Smash artesanal, cheddar no ponto, bacon bem crocante e maionese feita aqui.",
      detail: "180 g de carne · bacon · maionese",
      image: "/assets/burger/bacon.webp",
      alt: "Bacon Melt com carne artesanal, cheddar, tiras de bacon e maionese",
    },
  ],
};

export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
