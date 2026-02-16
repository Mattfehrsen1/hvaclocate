import type { MetadataRoute } from "next";
import { US_STATES } from "@/lib/states";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://hvaclocate.com";

  const statePages = US_STATES.map((state) => ({
    url: `${baseUrl}/${state.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...statePages,
  ];
}
