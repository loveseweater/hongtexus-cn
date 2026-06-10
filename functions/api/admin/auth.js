/**
 * Admin Auth API - Cloudflare Pages Function
 * POST /api/admin/auth
 */
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { password } = body;

    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'hongtexus2026';

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a simple session token
    const token = btoa(
      JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      })
    );

    const response = new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    response.headers.append(
      'Set-Cookie',
      `admin_token=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`
    );

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
