import { getSubscribers, jsonResponse } from '../_kv.js';

export async function onRequestGet(context) {
  try {
    const { env } = context;
    const subscribers = await getSubscribers(env.HONGTE_KV);
    return jsonResponse(subscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    return jsonResponse({ error: 'Failed to fetch subscribers' }, 500);
  }
}
