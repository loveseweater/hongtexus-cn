"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, MessageCircle, Globe, Youtube, Twitter, CheckCircle, Send } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: MessageCircle,
  pinterest: Globe,
  wechat: MessageCircle,
  whatsapp: MessageCircle,
  custom: Globe,
};

const defaultSettings = {
  contactPhone: "+86-769-8888-8888",
  contactWhatsapp: "+8612345678901",
  contactEmail: "info@hongtexus.cn",
  contactAddress: "Dongguan, Guangdong, China",
  socialLinks: [
    { platform: "LinkedIn", url: "https://www.linkedin.com/company/hongtexus", icon: "linkedin", order: 0 },
    { platform: "Facebook", url: "https://www.facebook.com/hongtexus", icon: "facebook", order: 1 },
    { platform: "Instagram", url: "https://www.instagram.com/hongtexus", icon: "instagram", order: 2 },
  ],
};

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  const [settings, setSettings] = useState(defaultSettings);
  const [year] = useState(new Date().getFullYear());
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subMsg, setSubMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const socialLinks = settings.socialLinks || [];

  return (
    <footer className="border-t border-border bg-primary-dark text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10 bg-primary-dark/95">
        <div className="container-custom py-8">
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white/5 px-6 py-6 md:flex-row md:px-10">
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {t("newsletterTitle")}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {t("newsletterDesc")}
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[400px]">
              {subStatus === "success" ? (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  <CheckCircle size={18} />
                  <span>{t("newsletterSuccess")}</span>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!subEmail.trim()) return;
                  setSubStatus("loading");
                  try {
                    const res = await fetch("/api/subscribe", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: subEmail.trim() }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setSubStatus("success");
                    } else {
                      setSubStatus("error");
                      setSubMsg(data.message || t("newsletterError"));
                    }
                  } catch {
                    setSubStatus("error");
                    setSubMsg(t("newsletterNetworkError"));
                  }
                }} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder={t("newsletterPlaceholder")}
                    className="flex-1 min-w-0 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
                    disabled={subStatus === "loading"}
                  />
                  <button
                    type="submit"
                    disabled={subStatus === "loading"}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent/80 disabled:opacity-50"
                  >
                    <Send size={16} />
                    {subStatus === "loading" ? "..." : t("newsletterButton")}
                  </button>
                </form>
              )}
              {subStatus === "error" && (
                <p className="mt-1 text-xs text-red-400">{subMsg}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="HONGTEX"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {t("description")}
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((link: any, i: number) => {
                const IconComp = ICON_MAP[link.icon?.toLowerCase()] || Globe;
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                    title={link.platform}
                  >
                    <IconComp size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">{t("quickLinks")}</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href={`/${locale}/products`} className="text-sm text-gray-300 transition-colors hover:text-accent">{t("products")}</Link></li>
              <li><Link href={`/${locale}/blog`} className="text-sm text-gray-300 transition-colors hover:text-accent">{t("blog")}</Link></li>
              <li><Link href={`/${locale}/about`} className="text-sm text-gray-300 transition-colors hover:text-accent">{t("about")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="text-sm text-gray-300 transition-colors hover:text-accent">{t("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">{t("products")}</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href={`/${locale}/products?category=knit-fabrics`} className="text-sm text-gray-300 transition-colors hover:text-accent">Knit Fabrics</Link></li>
              <li><Link href={`/${locale}/products?category=t-shirts`} className="text-sm text-gray-300 transition-colors hover:text-accent">T-Shirts</Link></li>
              <li><Link href={`/${locale}/products?category=hoodies`} className="text-sm text-gray-300 transition-colors hover:text-accent">Hoodies</Link></li>
              <li><Link href={`/${locale}/products?category=leg-warmers`} className="text-sm text-gray-300 transition-colors hover:text-accent">Leg Warmers</Link></li>
              <li><Link href={`/${locale}/products?category=hats`} className="text-sm text-gray-300 transition-colors hover:text-accent">Hats</Link></li>
              <li><Link href={`/${locale}/products?category=gloves`} className="text-sm text-gray-300 transition-colors hover:text-accent">Gloves</Link></li>
              <li><Link href={`/${locale}/products?category=socks`} className="text-sm text-gray-300 transition-colors hover:text-accent">Socks</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">{t("contact")}</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>{settings.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={16} className="shrink-0 text-accent" />
                <a href={`tel:${settings.contactPhone?.replace(/[^0-9+]/g, "")}`} className="hover:text-accent transition-colors">{settings.contactPhone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={16} className="shrink-0 text-accent" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-accent transition-colors">{settings.contactEmail}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {year} HONGTEX. {t("copyright")}
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="transition-colors hover:text-accent">{t("privacy")}</a>
            <a href="#" className="transition-colors hover:text-accent">{t("terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
