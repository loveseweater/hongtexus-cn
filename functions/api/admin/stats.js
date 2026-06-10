/**
 * Admin Stats API - Cloudflare Pages Function
 * GET /api/admin/stats - Get dashboard statistics
 */
import { getProducts, getBlogPosts, getSubmissions, jsonResponse } from '../_kv.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const kv = env.HONGTE_KV;
    const [products, blogPosts, submissions] = await Promise.all([
      getProducts(kv),
      getBlogPosts(kv),
      getSubmissions(kv),
    ]);

    return jsonResponse({
      products: Array.isArray(products) ? products.length : 0,
      blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
      messages: Array.isArray(submissions) ? submissions.length : 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return jsonResponse({ products: 0, blogPosts: 0, messages: 0 });
  }
}
