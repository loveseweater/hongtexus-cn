export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { name, email, phone, company, message } = body;
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const kv = env.HONGTE_KV;
    if (kv) {
      let submissions = [];
      const data = await kv.get('submissions', 'text');
      if (data) { try { submissions = JSON.parse(data); } catch {} }
      submissions.push({ name, email, phone: phone || '', company: company || '', message, id: Date.now().toString(), createdAt: new Date().toISOString() });
      await kv.put('submissions', JSON.stringify(submissions));
    }
    return new Response(JSON.stringify({ success: true, message: 'Message received' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Contact error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
