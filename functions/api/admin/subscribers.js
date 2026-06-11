import { getSubscribers, jsonResponse } from '../_kv.js';
export async function onRequestGet(c) { try { return jsonResponse(await getSubscribers(c.env.HONGTE_KV)); } catch(e) { return jsonResponse({error:'Failed'},500); } }
