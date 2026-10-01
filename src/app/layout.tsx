import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/space-mono/400.css";
import "./globals.css";
import { siteConfig as site } from "@/config/site";
export const metadata: Metadata = {
  ...(site.siteUrl
    ? { metadataBase: new URL(site.siteUrl), alternates: { canonical: "/" } }
    : {}),
  title: `${site.brandName} | ${site.slogan}`,
  description: site.description,
  openGraph: {
    title: `${site.brandName} — ${site.brandSubtitle}`,
    description: site.description,
    locale: "pt_BR",
    type: "website",
    ...(site.siteUrl ? { url: site.siteUrl, images: [site.socialImage] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brandName} — ${site.slogan}`,
    description: site.description,
    ...(site.siteUrl ? { images: [site.socialImage] } : {}),
  },
  icons: { icon: "/favicon.svg" },
  robots: { index: !site.demo, follow: !site.demo },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.brandName,
    description: site.description,
    telephone: site.phone,
    servesCuisine: "Hambúrguer artesanal",
    priceRange: "$$",
    ...(site.siteUrl
      ? {
          url: site.siteUrl,
          image: new URL(site.socialImage, site.siteUrl).href,
        }
      : {}),
    ...(site.address.street
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.street,
            addressLocality: site.address.city,
            addressRegion: site.address.region,
            postalCode: site.address.postalCode,
            addressCountry: site.address.country,
          },
        }
      : {}),
    ...(site.coordinates
      ? { geo: { "@type": "GeoCoordinates", ...site.coordinates } }
      : {}),
    ...(site.instagram ? { sameAs: [site.instagram] } : {}),
    ...(site.openingHours.length
      ? { openingHours: site.openingHours.map((day) => day.schema) }
      : {}),
  };
  return (
    <html
      lang="pt-BR"
      style={
        {
          "--accent": site.colors.accent,
          "--background": site.colors.background,
          "--foreground": site.colors.foreground,
        } as CSSProperties
      }
    >
      <body>
        <a className="skip-link" href="#cardapio">
          Pular para o cardápio
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
