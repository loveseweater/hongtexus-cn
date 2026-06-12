export const runtime = "edge";

import { getStore } from "@/lib/kv";

const SETTINGS_KEY = "site_settings";

const defaultSettings = {
  siteName: "HONGTEX",
  siteDescription: "Premium Knitwear & Textile Solutions",
  // Logo
  siteLogo: "/images/logo.png",
  // Social links (dynamic array)
  socialLinks: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/hongtexus", icon: "linkedin", order: 0 },
    { platform: "Facebook", url: "https://www.facebook.com/hongtexus", icon: "facebook", order: 1 },
    { platform: "Instagram", url: "https://www.instagram.com/hongtexus", icon: "instagram", order: 2 },
  ],
  // Email service config
  emailService: {
    provider: "", // "resend" | "mailgun" | "sendgrid"
    apiKey: "",
    fromEmail: "info@hongtexus.cn",
    fromName: "HONGTEX",
  },
  // Navigation links
  navLinks: [
    { label: "Home", href: "/", children: [] },
    { label: "Products", href: "/products", children: [
      { label: "All Products", href: "/products" },
      { label: "Knit Fabrics", href: "/products?category=knit-fabrics" },
      { label: "T-Shirts", href: "/products?category=t-shirts" },
      { label: "Hoodies", href: "/products?category=hoodies" },
      { label: "Leg Warmers", href: "/products?category=leg-warmers" },
      { label: "Hats", href: "/products?category=hats" },
      { label: "Gloves", href: "/products?category=gloves" },
      { label: "Socks", href: "/products?category=socks" },
    ]},
    { label: "Blog", href: "/blog", children: [] },
    { label: "About", href: "/about", children: [] },
    { label: "Contact", href: "/contact", children: [] },
  ],
  // Blog categories
  blogCategories: [
    { id: "trends", name: "Trends", slug: "trends" },
    { id: "guide", name: "Guides", slug: "guide" },
    { id: "sustainability", name: "Sustainability", slug: "sustainability" },
    { id: "production", name: "Production", slug: "production" },
    { id: "quality", name: "Quality", slug: "quality" },
  ],
  heroTitle: "Premium Textile Solutions for Global Markets",
  heroSubtitle: "From raw fabrics to finished products — Hongtexus delivers quality textiles tailored to your business needs.",
  contactEmail: "info@hongtexus.cn",
  contactPhone: "+86-769-8888-8888",
  contactWhatsapp: "+8612345678901",
  contactAddress: "Dongguan, Guangdong, China",
  // Hero carousel images
  heroImages: [
    "/images/product-knit-fabric.jpg",
    "/images/product-tshirt.jpg",
    "/images/product-hoodie.jpg",
    "/images/product-gloves.jpg",
    "/images/product-hat.jpg",
    "/images/product-socks.jpg",
    "/images/product-legwarmers.jpg",
  ],
  // About page content
  aboutContent: {
    story: "Hongtexus is a leading textile supplier dedicated to providing high-quality fabrics and textile products to global markets. With advanced manufacturing facilities and a professional team, we serve clients across various industries.",
    mission: "To deliver premium textile solutions that empower businesses worldwide through quality, innovation, and reliability.",
    stats: {
      years: "15+",
      clients: "500+",
      products: "2000+",
      countries: "50+",
    },
  },
};

export async function GET() {
  try {
    const store = getStore();
    const settings = await store.get(SETTINGS_KEY);
    return Response.json(settings || defaultSettings);
  } catch (error) {
    return Response.json(defaultSettings);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const store = getStore();
    await store.put(SETTINGS_KEY, body);
    return Response.json({ success: true, settings: body });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
