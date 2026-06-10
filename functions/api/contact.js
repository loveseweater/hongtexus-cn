/**
 * Contact API - Cloudflare Pages Function
 * POST /api/contact - Submit contact form
 */
import { jsonResponse } from './_kv.js';

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return jsonResponse(
        { error: 'Name, email, and message are required' },
        400
      );
    }

    // Save to KV store
    const kv = env.HONGTE_KV;
    if (kv) {
      let submissions = [];
      const data = await kv.get('submissions', 'text');
      if (data) {
        try { submissions = JSON.parse(data); } catch {}
      }
      submissions.push({
        name,
        email,
        phone: phone || '',
        company: company || '',
        message,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
      await kv.put('submissions', JSON.stringify(submissions));
    }

    console.log('[Contact] Form submission saved:', { name, email, timestamp: new Date().toISOString() });

    return jsonResponse({ success: true, message: 'Message received' });
  } catch (error) {
    console.error('[Contact] Form error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
