/**
 * Localized data helper.
 * Reads product and blog content from KV translations field.
 * Falls back to translation files for backward compatibility.
 */

import { getTranslations } from "next-intl/server";
import { getKvProducts, getKvProductBySlug, getKvBlogPosts, getKvBlogPostBySlug } from "./kv";

export async function getLocalizedProducts(locale: string) {
  const kvProducts = await getKvProducts();
  
  return kvProducts.map((product: any) => {
    // Try KV translations first
    if (product.translations && product.translations[locale]) {
      const t = product.translations[locale];
      return {
        ...product,
        title: t.title || product.title,
        description: t.desc || product.description,
      };
    }
    // Fallback to translation file
    return product;
  });
}

export async function getLocalizedProductBySlug(locale: string, slug: string) {
  const product = await getKvProductBySlug(slug);
  
  if (!product) return null;
  
  // Try KV translations first
  if (product.translations && product.translations[locale]) {
    const t = product.translations[locale];
    return {
      ...product,
      title: t.title || product.title,
      description: t.desc || product.description,
    };
  }
  
  return product;
}

export async function getLocalizedBlogPosts(locale: string) {
  const posts = await getKvBlogPosts();
  
  return posts.map((post: any) => {
    // Try KV translations first
    if (post.translations && post.translations[locale]) {
      const t = post.translations[locale];
      return {
        ...post,
        title: t.title || post.title,
        excerpt: t.excerpt || post.excerpt,
      };
    }
    return post;
  });
}

export async function getLocalizedBlogPostBySlug(locale: string, slug: string) {
  const post = await getKvBlogPostBySlug(slug);
  
  if (!post) return null;
  
  // Try KV translations first
  if (post.translations && post.translations[locale]) {
    const t = post.translations[locale];
    return {
      ...post,
      title: t.title || post.title,
      excerpt: t.excerpt || post.excerpt,
    };
  }
  
  return post;
}
