export const runtime = "edge";

import { getStore } from "@/lib/kv";

const PAGES_KEY = "custom_pages";

export async function GET() {
  try {
    const store = getStore();
    const pages = await store.get(PAGES_KEY);
    if (!pages) return Response.json([]);
    // Only return published pages
    const published = pages.filter((p: any) => p.published !== false);
    return Response.json(published.map((p: any) => ({
      title: p.title,
      slug: p.slug,
      content: p.content,
      order: p.order,
    })));
  } catch (error) {
    return Response.json([]);
  }
}
