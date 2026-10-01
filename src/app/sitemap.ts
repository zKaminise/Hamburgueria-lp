import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteConfig.siteUrl
    ? [{ url: siteConfig.siteUrl, changeFrequency: "monthly", priority: 1 }]
    : [];
}
