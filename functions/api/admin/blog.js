/**
 * Admin Blog API - Cloudflare Pages Function
 * GET /api/admin/blog - List all posts
 * POST /api/admin/blog - Create post
 * PUT /api/admin/blog - Update post
 * DELETE /api/admin/blog?id=xxx - Delete post
 */
import { getBlogPosts, saveBlogPosts, jsonResponse } from '../_kv.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const posts = await getBlogPosts(env.HONGTE_KV);
    return jsonResponse(posts);
  } catch (error) {
    console.error('Get blog posts error:', error);
    return jsonResponse({ error: 'Failed to fetch posts' }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const posts = await getBlogPosts(env.HONGTE_KV);

    const newPost = {
      ...body,
      id: Date.now().toString(),
      tags: body.tags || [],
    };

    posts.push(newPost);
    await saveBlogPosts(env.HONGTE_KV, posts);

    return jsonResponse(newPost, 201);
  } catch (error) {
    console.error('Create blog post error:', error);
    return jsonResponse({ error: 'Failed to create post' }, 500);
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { id, ...updates } = body;
    const posts = await getBlogPosts(env.HONGTE_KV);

    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      return jsonResponse({ error: 'Post not found' }, 404);
    }

    posts[index] = { ...posts[index], ...updates };
    await saveBlogPosts(env.HONGTE_KV, posts);

    return jsonResponse(posts[index]);
  } catch (error) {
    console.error('Update blog post error:', error);
    return jsonResponse({ error: 'Failed to update post' }, 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Post ID required' }, 400);
    }

    const posts = await getBlogPosts(env.HONGTE_KV);
    const filtered = posts.filter(p => p.id !== id);
    await saveBlogPosts(env.HONGTE_KV, filtered);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete blog post error:', error);
    return jsonResponse({ error: 'Failed to delete post' }, 500);
  }
}
