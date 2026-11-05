import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Vercel previews and local builds must never be indexed (architecture §6).
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
