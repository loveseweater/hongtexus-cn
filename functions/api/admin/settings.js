import { getSettings, saveSettings, jsonResponse } from '../_kv.js';
export async function onRequestGet(c) { try { return jsonResponse(await getSettings(c.env.HONGTE_KV)); } catch(e) { return jsonResponse({error:'Failed'},500); } }
export async function onRequestPut(c) { try { const b = await c.request.json(); await saveSettings(c.env.HONGTE_KV,b); return jsonResponse({success:true,settings:b}); } catch(e) { return jsonResponse({error:'Failed'},500); } }
