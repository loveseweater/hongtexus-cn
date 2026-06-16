import { createResponse } from "../_kv.js";

const ADMIN_PASSWORD = "hongtexus2026";

export async function onRequest(context) {
  const { request } = context;
  
  if (request.method !== "POST") {
    return createResponse({ error: "Method not allowed" }, 405);
  }
  
  try {
    const { password } = await request.json();
    
    if (!password) {
      return createResponse({ error: "Password is required" }, 400);
    }
    
    if (password !== ADMIN_PASSWORD) {
      return createResponse({ error: "Invalid password" }, 401);
    }
    
    const token = btoa(JSON.stringify({
      authenticated: true,
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    }));
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `admin_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`,
      },
    });
  } catch {
    return createResponse({ error: "Internal server error" }, 500);
  }
}
