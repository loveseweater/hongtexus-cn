import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react";

type Props = {
  locale: string;
};

// Default settings (used when API is unavailable at build time)
const defaultSettings = {
  contactPhone: "+86-769-8888-8888",
  contactWhatsapp: "+8612345678901",
  contactEmail: "info@hongtexus.cn",
  contactAddress: "Dongguan, Guangdong, China",
  socialLinkedin: "https://www.linkedin.com/company/hongtexus",
  socialFacebook: "https://www.facebook.com/hongtexus",
  socialInstagram: "https://www.instagram.com/hongtexus",
};

async function getSettings() {
  try {
    const { getStore } = await import("@/lib/kv");
    const store = getStore();
    const settings = await store.get("site_settings");
    return settings || defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const settings = await getSettings();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary-dark text-white">
      <div className="container-custom py-16">
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
              <a
                href={settings.socialLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                title="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`https://wa.me/${settings.contactWhatsapp?.replace(/\+/g, "") || "8612345678901"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-green-500"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href={`/${locale}/products`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              {t("products")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href={`/${locale}/products?category=knit-fabrics`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Knit Fabrics
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=t-shirts`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=hoodies`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=leg-warmers`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Leg Warmers
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=hats`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Hats
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=gloves`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Gloves
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=socks`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Socks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              {t("contact")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>{settings.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={16} className="shrink-0 text-accent" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={16} className="shrink-0 text-accent" />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} HONGTEX. {t("copyright")}
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="transition-colors hover:text-accent">
              {t("privacy")}
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
