import { getSettings, saveSettings, createResponse } from "../_kv.js";

const ADMIN_PASSWORD = "hongtexus2026";

function checkAuth(request) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/admin_token=([^;]+)/);
  if (!match) return false;
  try {
    const decoded = JSON.parse(atob(match[1]));
    return decoded.authenticated && decoded.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  if (request.method === "GET") {
    const settings = await getSettings(context);
    return createResponse(settings);
  }
  
  if (request.method === "PUT") {
    if (!checkAuth(request)) {
      return createResponse({ error: "Unauthorized" }, 401);
    }
    const body = await request.json();
    const result = await saveSettings(context, body);
    return createResponse(result, result.success ? 200 : 500);
  }
  
  return createResponse({ error: "Method not allowed" }, 405);
}
