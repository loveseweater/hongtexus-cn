/**
 * KV Helper - Shared utilities for Cloudflare Pages Functions
 */
const PRODUCTS_KEY = 'products';
const BLOG_KEY = 'blog';
const SUBMISSIONS_KEY = 'submissions';
const SUBSCRIBERS_KEY = 'subscribers';
const SETTINGS_KEY = 'site_settings';
const defaultSettings = {
  siteName: 'HONGTEX',
  siteDescription: 'Premium Knitwear & Textile Solutions',
  heroTitle: 'Premium Textile Solutions for Global Markets',
  heroSubtitle: 'From raw fabrics to finished products \u2014 Hongtexus delivers quality textiles tailored to your business needs.',
  contactEmail: 'info@hongtexus.cn',
  contactPhone: '+86-769-8888-8888',
  contactWhatsapp: '+8612345678901',
  contactAddress: 'Dongguan, Guangdong, China',
  socialLinkedin: 'https://www.linkedin.com/company/hongtexus',
  socialFacebook: 'https://www.facebook.com/hongtexus',
  socialInstagram: 'https://www.instagram.com/hongtexus',
};
export async function kvGet(kv, key) {
  if (!kv) return null;
  const data = await kv.get(key, 'text');
  if (!data) return null;
  try { return JSON.parse(data); } catch { return null; }
}
export async function kvPut(kv, key, value) {
  if (!kv) return;
  await kv.put(key, JSON.stringify(value));
}
export async function getProducts(kv) { const d = await kvGet(kv, PRODUCTS_KEY); return d || []; }
export async function saveProducts(kv, p) { await kvPut(kv, PRODUCTS_KEY, p); }
export async function getBlogPosts(kv) { const d = await kvGet(kv, BLOG_KEY); return d || []; }
export async function saveBlogPosts(kv, p) { await kvPut(kv, BLOG_KEY, p); }
export async function getSubmissions(kv) { const d = await kvGet(kv, SUBMISSIONS_KEY); return d || []; }
export async function saveSubmissions(kv, s) { await kvPut(kv, SUBMISSIONS_KEY, s); }
export async function getSubscribers(kv) { const d = await kvGet(kv, SUBSCRIBERS_KEY); return d || []; }
export async function getSettings(kv) { const d = await kvGet(kv, SETTINGS_KEY); return d || defaultSettings; }
export async function saveSettings(kv, s) { await kvPut(kv, SETTINGS_KEY, s); }
export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
