/**
 * Localized data helper.
 * Reads product and blog content from translation files instead of hardcoded English data.
 */

import { getTranslations } from "next-intl/server";
import { products as staticProducts } from "./data/products";
import { blogPosts as staticBlogPosts } from "./data/blog";
import { getKvProducts, getKvProductBySlug, getKvBlogPosts } from "./kv";

export async function getLocalizedProducts(locale: string) {
  const t = await getTranslations({ locale, namespace: "products_data" });
  const kvProducts = await getKvProducts();
  
  return kvProducts.map((product: any) => {
    const localized = t.raw(product.slug);
    return {
      ...product,
      title: localized?.title || product.title,
      description: localized?.desc || product.description,
    };
  });
}

export async function getLocalizedProductBySlug(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "products_data" });
  const product = await getKvProductBySlug(slug);
  
  if (!product) return null;
  
  const localized = t.raw(product.slug);
  return {
    ...product,
    title: localized?.title || product.title,
    description: localized?.desc || product.description,
  };
}

export async function getLocalizedBlogPosts(locale: string) {
  const t = await getTranslations({ locale, namespace: "blogs_data" });
  const posts = await getKvBlogPosts();
  
  return posts.map((post: any) => {
    const localized = t.raw(post.slug);
    return {
      ...post,
      title: localized?.title || post.title,
      excerpt: localized?.excerpt || post.excerpt,
    };
  });
}

export async function getLocalizedBlogPostBySlug(locale: string, slug: string) {
  const t = await getTranslations({ locale, namespace: "blogs_data" });
  const posts = await getKvBlogPosts();
  const post = posts.find((p: any) => p.slug === slug);
  
  if (!post) return null;
  
  const localized = t.raw(post.slug);
  return {
    ...post,
    title: localized?.title || post.title,
    excerpt: localized?.excerpt || post.excerpt,
  };
}
