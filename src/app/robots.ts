import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(siteConfig.demo ? { disallow: "/" } : { allow: "/" }),
    },
    ...(siteConfig.siteUrl
      ? { sitemap: `${siteConfig.siteUrl}/sitemap.xml` }
      : {}),
  };
}
