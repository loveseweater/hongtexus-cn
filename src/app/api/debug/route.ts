export const runtime = "edge";

import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export async function GET() {
  const info: Record<string, any> = {
    nodeEnv: process.env.NODE_ENV,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
  };

  try {
    const ctx = getOptionalRequestContext();
    if (ctx) {
      info.hasContext = true;
      const env = ctx.env as any;
      info.envKeys = Object.keys(env || {});
      info.hasHONGTE_KV = !!(env && env.HONGTE_KV);
      
      // Try to read from KV
      if (env && env.HONGTE_KV) {
        try {
          const val = await env.HONGTE_KV.get("site_settings");
          info.kvValue = val ? val.substring(0, 200) : null;
        } catch (e: any) {
          info.kvError = e.message;
        }
      }
    } else {
      info.hasContext = false;
    }
  } catch (e: any) {
    info.error = e.message;
  }

  return Response.json(info);
}
