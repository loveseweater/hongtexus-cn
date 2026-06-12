// KV helper for Pages Functions
// HONGTE_KV is available as context.env.HONGTE_KV

const SETTINGS_KEY = "site_settings";

const defaultSettings = {
  siteName: "HONGTEX",
  siteDescription: "Premium Knitwear & Textile Solutions",
  heroTitle: "Premium Textile Solutions for Global Markets",
  heroSubtitle: "From raw fabrics to finished products — Hongtexus delivers quality textiles tailored to your business needs.",
  contactEmail: "info@hongtexus.cn",
  contactPhone: "+86-769-8888-8888",
  contactWhatsapp: "+8612345678901",
  contactAddress: "Dongguan, Guangdong, China",
  socialLinkedin: "https://www.linkedin.com/company/hongtexus",
  socialFacebook: "https://www.facebook.com/hongtexus",
  socialInstagram: "https://www.instagram.com/hongtexus",
};

export async function getSettings(context) {
  try {
    const kv = context.env.HONGTE_KV;
    if (!kv) return defaultSettings;
    const val = await kv.get(SETTINGS_KEY);
    if (!val) return defaultSettings;
    return JSON.parse(val);
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(context, settings) {
  try {
    const kv = context.env.HONGTE_KV;
    if (!kv) return { success: false, error: "KV not available" };
    await kv.put(SETTINGS_KEY, JSON.stringify(settings));
    return { success: true, settings };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
