/**
 * Subscribe API - Cloudflare Pages Function
 * POST /api/subscribe
 */
export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, message: '请输入有效的邮箱地址' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const kv = env.HONGTE_KV;
    let subscribers = [];
    if (kv) {
      const data = await kv.get('subscribers', 'text');
      if (data) {
        try { subscribers = JSON.parse(data); } catch {}
      }
    }

    const exists = subscribers.find(s => s.email === email);
    if (exists) {
      return new Response(
        JSON.stringify({ success: false, message: '该邮箱已订阅' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    subscribers.push({
      email,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });

    if (kv) {
      await kv.put('subscribers', JSON.stringify(subscribers));
    }

    return new Response(
      JSON.stringify({ success: true, message: '订阅成功' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ success: false, message: '订阅失败，请稍后重试' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
