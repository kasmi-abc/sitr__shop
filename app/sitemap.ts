import type { MetadataRoute } from "next";
import { BOOKS } from "@/lib/data";

const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "",
    "/books",
    "/bundles",
    "/authors",
    "/delivery",
    "/faq",
    "/about",
    "/terms",
    "/privacy",
    "/tracking",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.6,
  }));
  const books = BOOKS.map((b) => ({
    url: `${base}/books/${b.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...staticPages, ...books];
}
