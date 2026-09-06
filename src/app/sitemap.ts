import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://barberhouse.example.com";
  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/agendar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
