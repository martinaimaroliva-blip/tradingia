import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { bots, indicators, signals } from "@/lib/products";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const staticPaths = [
    "",
    "/bots",
    "/indicators",
    "/signals",
    "/exness",
    "/referrals",
    "/contact",
    "/legal/terms",
    "/legal/privacy",
    "/legal/refund",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const b of bots) {
      entries.push({ url: `${base}/${locale}/bots/${b.slug}`, priority: 0.8 });
    }
    for (const i of indicators) {
      entries.push({
        url: `${base}/${locale}/indicators/${i.slug}`,
        priority: 0.8,
      });
    }
    for (const s of signals) {
      entries.push({
        url: `${base}/${locale}/signals/${s.slug}`,
        priority: 0.8,
      });
    }
  }

  return entries;
}
