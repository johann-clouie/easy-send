import type { MetadataRoute } from "next";
import { CHAINS } from "@/lib/chains";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const chainPages = Object.values(CHAINS).map((chain) => ({
    url: chain.path === "/" ? siteUrl : `${siteUrl}${chain.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: chain.path === "/" ? 1 : 0.9,
  }));

  const tools = ["/decode-bitcoin", "/decode-ethereum"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...chainPages, ...tools];
}
