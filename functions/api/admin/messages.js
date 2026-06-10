/**
 * Admin Messages API - Cloudflare Pages Function
 * GET /api/admin/messages - List all messages/submissions
 * DELETE /api/admin/messages?id=xxx - Delete a message
 */
import { getSubmissions, saveSubmissions, jsonResponse } from '../_kv.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const submissions = await getSubmissions(env.HONGTE_KV);
    return jsonResponse(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    return jsonResponse({ error: 'Failed to fetch submissions' }, 500);
  }
}

export async function onRequestDelete(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'Submission ID required' }, 400);
    }

    const submissions = await getSubmissions(env.HONGTE_KV);
    const filtered = submissions.filter(s => s.id !== id);
    await saveSubmissions(env.HONGTE_KV, filtered);

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete submission error:', error);
    return jsonResponse({ error: 'Failed to delete submission' }, 500);
  }
}
