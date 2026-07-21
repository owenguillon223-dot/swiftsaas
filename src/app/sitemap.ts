import type { MetadataRoute } from "next";
import { getAllPostsMeta } from "@/lib/blog";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = [
    { path: "/", priority: 1 },
    { path: "/blog", priority: 0.8 },
    { path: "/login", priority: 0.3 },
    { path: "/register", priority: 0.5 },
    { path: "/legal/mentions-legales", priority: 0.1 },
    { path: "/legal/cgv", priority: 0.1 },
    { path: "/legal/confidentialite", priority: 0.1 },
  ];

  const staticEntries = pages.map(({ path, priority }) => ({
    url: `${APP_URL}${path}`,
    lastModified: now,
    priority,
  }));

  const blogEntries = getAllPostsMeta().map((post) => ({
    url: `${APP_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
