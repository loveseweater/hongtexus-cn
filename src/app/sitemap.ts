import { products } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blog";
import type { MetadataRoute } from "next";

const locales = ["en", "zh", "es", "fr", "de"];
const BASE_URL = "https://hongtexus.cn";

// HONGTEX brand - Premium Knitwear & Textile Solutions

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = ["", "/products", "/blog", "/about", "/contact"];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Product pages
  for (const product of products) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/products/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Blog pages
  for (const post of blogPosts) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
