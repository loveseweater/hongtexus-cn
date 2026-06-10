/**
 * Admin Settings API - Cloudflare Pages Function
 * GET /api/admin/settings - Get settings
 * PUT /api/admin/settings - Update settings
 */
import { getSettings, saveSettings, jsonResponse } from '../_kv.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const settings = await getSettings(env.HONGTE_KV);
    return jsonResponse(settings);
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch settings' }, 500);
  }
}

export async function onRequestPut(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    await saveSettings(env.HONGTE_KV, body);
    return jsonResponse({ success: true, settings: body });
  } catch (error) {
    return jsonResponse({ error: 'Failed to save settings' }, 500);
  }
}
