export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { email } = body;
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ success: false, message: '\u8bf7\u8f93\u5165\u6709\u6548\u7684\u90ae\u7bb1\u5730\u5740' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const kv = env.HONGTE_KV;
    let subscribers = [];
    if (kv) {
      const data = await kv.get('subscribers', 'text');
      if (data) { try { subscribers = JSON.parse(data); } catch {} }
    }
    const exists = subscribers.find(s => s.email === email);
    if (exists) {
      return new Response(JSON.stringify({ success: false, message: '\u8be5\u90ae\u7bb1\u5df2\u8ba2\u9605' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    subscribers.push({ email, id: Date.now().toString(), createdAt: new Date().toISOString() });
    if (kv) { await kv.put('subscribers', JSON.stringify(subscribers)); }
    return new Response(JSON.stringify({ success: true, message: '\u8ba2\u9605\u6210\u529f' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(JSON.stringify({ success: false, message: '\u8ba2\u9605\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
