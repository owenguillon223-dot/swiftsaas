import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    { path: "/", priority: 1 },
    { path: "/login", priority: 0.3 },
    { path: "/register", priority: 0.5 },
    { path: "/legal/mentions-legales", priority: 0.1 },
    { path: "/legal/cgv", priority: 0.1 },
    { path: "/legal/confidentialite", priority: 0.1 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    priority,
  }));
}
