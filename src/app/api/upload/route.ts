export const runtime = "edge";

import { getStore } from "@/lib/kv";

const IMAGES_KEY = "uploaded_images";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "logo";

    if (!file) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Read file as base64
    const buffer = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Store in KV
    const store = getStore();
    const images = (await store.get(IMAGES_KEY)) || {};
    const imageId = `${type}_${Date.now()}`;
    images[imageId] = { type, mimeType, data: base64, filename: file.name };
    await store.put(IMAGES_KEY, images);

    // Also update settings with the new logo URL
    if (type === "logo") {
      const settingsKey = "site_settings";
      const settings = await store.get(settingsKey);
      if (settings) {
        settings.siteLogo = `/api/images/${imageId}`;
        await store.put(settingsKey, settings);
      }
    }

    return Response.json({
      success: true,
      url: `/api/images/${imageId}`,
      imageId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
