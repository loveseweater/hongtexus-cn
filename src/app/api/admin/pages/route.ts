export const runtime = "edge";

import { getStore } from "@/lib/kv";

const PAGES_KEY = "custom_pages";

const defaultPages: CustomPage[] = [
  {
    id: "about",
    title: "About Us",
    slug: "about",
    content: "<h2>About Hongtexus</h2><p>Hongtexus is a leading textile supplier...</p>",
    published: true,
    order: 0,
  },
];

export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  order: number;
}

export async function GET() {
  try {
    const store = getStore();
    const pages = await store.get(PAGES_KEY);
    return Response.json(pages || defaultPages);
  } catch (error) {
    return Response.json(defaultPages);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getStore();
    const existing = (await store.get(PAGES_KEY)) || defaultPages;
    const newPage: CustomPage = {
      id: Date.now().toString(),
      title: body.title,
      slug: body.slug,
      content: body.content || "",
      published: body.published !== false,
      order: existing.length,
    };
    existing.push(newPage);
    await store.put(PAGES_KEY, existing);
    return Response.json({ success: true, page: newPage });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create page" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const store = getStore();
    const pages = (await store.get(PAGES_KEY)) || defaultPages;
    const index = pages.findIndex((p: CustomPage) => p.id === body.id);
    if (index === -1) {
      return Response.json({ success: false, error: "Page not found" }, { status: 404 });
    }
    pages[index] = { ...pages[index], ...body };
    await store.put(PAGES_KEY, pages);
    return Response.json({ success: true, page: pages[index] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update page" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const store = getStore();
    const pages = (await store.get(PAGES_KEY)) || defaultPages;
    const filtered = pages.filter((p: CustomPage) => p.id !== id);
    await store.put(PAGES_KEY, filtered);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete page" }, { status: 500 });
  }
}
