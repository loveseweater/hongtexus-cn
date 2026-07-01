/**
 * Cloudflare KV data store abstraction layer.
 * In production (Cloudflare Pages), uses KV bindings via getRequestContext.
 * Falls back to in-memory store for development.
 */

import { getOptionalRequestContext } from "@cloudflare/next-on-pages";
import { products as staticProducts } from "./data/products";
import { blogPosts as staticBlogPosts } from "./data/blog";

// In-memory fallback for development
let memoryStore: Record<string, any> = {};

type KVStore = {
  get: (key: string) => Promise<any>;
  put: (key: string, value: any) => Promise<void>;
  delete: (key: string) => Promise<void>;
  list: (prefix?: string) => Promise<string[]>;
};

/**
 * Try to get the KV binding from the Cloudflare Pages runtime.
 * Uses getOptionalRequestContext from @cloudflare/next-on-pages.
 */
function getKvBinding(): any {
  try {
    const ctx = getOptionalRequestContext();
    if (ctx) {
      const env = ctx.env as any;
      if (env.HONGTE_KV) {
        return env.HONGTE_KV;
      }
    }
  } catch {}
  return null;
}

function createMemoryStore(): KVStore {
  return {
    async get(key: string) {
      const val = memoryStore[key];
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    },
    async put(key: string, value: any) {
      memoryStore[key] = typeof value === "string" ? value : JSON.stringify(value);
    },
    async delete(key: string) {
      delete memoryStore[key];
    },
    async list(prefix?: string) {
      return Object.keys(memoryStore).filter((k) =>
        prefix ? k.startsWith(prefix) : true
      );
    },
  };
}

function createCloudflareKVStore(binding: any): KVStore {
  return {
    async get(key: string) {
      const val = await binding.get(key);
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    },
    async put(key: string, value: any) {
      const str = typeof value === "string" ? value : JSON.stringify(value);
      await binding.put(key, str);
    },
    async delete(key: string) {
      await binding.delete(key);
    },
    async list(prefix?: string) {
      const result = await binding.list(prefix ? { prefix } : undefined);
      return result.keys.map((k: any) => k.name);
    },
  };
}

export function getStore(): KVStore {
  const binding = getKvBinding();
  if (binding) {
    return createCloudflareKVStore(binding);
  }
  return createMemoryStore();
}

// ---- Data Access Functions ----

const PRODUCTS_KEY = "products";
const BLOG_KEY = "blog";
const MESSAGES_KEY = "messages";
const SUBMISSIONS_KEY = "submissions";
const SUBSCRIBERS_KEY = "subscribers";

export async function getProducts() {
  const store = getStore();
  const data = await store.get(PRODUCTS_KEY);
  return data || staticProducts;
}

export async function saveProducts(products: any[]) {
  const store = getStore();
  await store.put(PRODUCTS_KEY, products);
}

export async function getBlogPosts() {
  const store = getStore();
  const data = await store.get(BLOG_KEY);
  return data || staticBlogPosts;
}

export async function saveBlogPosts(posts: any[]) {
  const store = getStore();
  await store.put(BLOG_KEY, posts);
}

export async function getMessages() {
  const store = getStore();
  return await store.get(MESSAGES_KEY);
}

export async function saveSubmissions(submissions: any) {
  const store = getStore();
  await store.put(SUBMISSIONS_KEY, submissions);
}

export async function getSubmissions() {
  const store = getStore();
  const data = await store.get(SUBMISSIONS_KEY);
  return data || [];
}

export async function saveSubmission(submission: any) {
  const store = getStore();
  const submissions = await getSubmissions();
  submissions.push({
    ...submission,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
  await store.put(SUBMISSIONS_KEY, submissions);
  return submission;
}

export async function getSubscribers() {
  const store = getStore();
  const data = await store.get(SUBSCRIBERS_KEY);
  return data || [];
}

export async function saveSubscriber(email: string) {
  const store = getStore();
  const subscribers = await getSubscribers();
  // Check if already subscribed
  const exists = subscribers.find((s: any) => s.email === email);
  if (exists) return { success: false, message: "Already subscribed" };
  subscribers.push({
    email,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  });
  await store.put(SUBSCRIBERS_KEY, subscribers);
  return { success: true };
}

// ---- KV-based Data Helpers (for front-end pages) ----
// These read from KV first, fall back to static data

export async function getKvProducts() {
  const store = getStore();
  const data = await store.get(PRODUCTS_KEY);
  return data || staticProducts;
}

export async function getKvProductBySlug(slug: string) {
  const products = await getKvProducts();
  return products.find((p: any) => p.slug === slug) || null;
}

export async function getKvFeaturedProducts() {
  const products = await getKvProducts();
  return products.filter((p: any) => p.featured);
}

export async function getKvBlogPosts() {
  const store = getStore();
  const data = await store.get(BLOG_KEY);
  return data || staticBlogPosts;
}

export async function getKvBlogPostBySlug(slug: string) {
  const posts = await getKvBlogPosts();
  return posts.find((p: any) => p.slug === slug) || null;
}

// ---- Blog View Counts ----

const VIEWS_KEY = "blog_views";

export async function getBlogViewCounts(): Promise<Record<string, number>> {
  const store = getStore();
  const data = await store.get(VIEWS_KEY);
  return data || {};
}

export async function incrementBlogView(slug: string): Promise<number> {
  const store = getStore();
  const views = await getBlogViewCounts();
  views[slug] = (views[slug] || 0) + 1;
  await store.put(VIEWS_KEY, views);
  return views[slug];
}

export async function getBlogView(slug: string): Promise<number> {
  const views = await getBlogViewCounts();
  return views[slug] || 0;
}

// ---- Blog Comments ----

const COMMENTS_KEY = "blog_comments";

export async function getBlogComments(slug: string): Promise<any[]> {
  const store = getStore();
  const all = await store.get(COMMENTS_KEY);
  return (all && all[slug]) || [];
}

export async function addBlogComment(slug: string, data: { name: string; content: string }): Promise<any> {
  const store = getStore();
  const all = (await store.get(COMMENTS_KEY)) || {};
  if (!all[slug]) all[slug] = [];
  const comment = {
    id: Date.now().toString(),
    name: data.name,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  all[slug].unshift(comment);
  await store.put(COMMENTS_KEY, all);
  return comment;
}
