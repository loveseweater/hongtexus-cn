export const runtime = "edge";

import { getStore } from "@/lib/kv";

const NOTIFICATIONS_KEY = "pending_notifications";

export async function GET() {
  try {
    const store = getStore();
    const notifications = await store.get(NOTIFICATIONS_KEY);
    return Response.json(notifications || []);
  } catch {
    return Response.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getStore();
    const notifications = (await store.get(NOTIFICATIONS_KEY)) || [];

    notifications.push({
      id: Date.now().toString(),
      type: body.type, // "product" | "blog"
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || "",
      createdAt: new Date().toISOString(),
      sent: false,
    });

    await store.put(NOTIFICATIONS_KEY, notifications);
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id } = await request.json();
    const store = getStore();
    const notifications = (await store.get(NOTIFICATIONS_KEY)) || [];
    const idx = notifications.findIndex((n: any) => n.id === id);
    if (idx !== -1) {
      notifications[idx].sent = true;
      await store.put(NOTIFICATIONS_KEY, notifications);
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
