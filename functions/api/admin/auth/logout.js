export async function onRequestPost() {
  const response = new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  response.headers.append('Set-Cookie', 'admin_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0');
  return response;
}
