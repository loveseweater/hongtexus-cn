export const runtime = "edge";

import { getStore } from "@/lib/kv";

const IMAGES_KEY = "uploaded_images";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const store = getStore();
    const images = (await store.get(IMAGES_KEY)) || {};
    const image = images[params.id];

    if (!image) {
      return new Response("Image not found", { status: 404 });
    }

    const decoded = Uint8Array.from(atob(image.data), (c) => c.charCodeAt(0));
    return new Response(decoded, {
      headers: {
        "Content-Type": image.mimeType || "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Image not found", { status: 404 });
  }
}
