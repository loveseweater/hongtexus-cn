"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, ChevronDown, Linkedin, Facebook, Instagram, Youtube, Twitter, Globe, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

const locales: Record<string, string> = {
  en: "EN",
  zh: "中文",
  es: "ES",
  fr: "FR",
  de: "DE",
};

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children: NavChild[];
}

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("8612345678901");
  const [siteLogo, setSiteLogo] = useState("/images/logo.png");
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<{platform: string; url: string; icon: string}[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.contactWhatsapp) {
            setWhatsapp(data.contactWhatsapp.replace(/[^0-9]/g, ""));
          }
          if (data.siteLogo) {
            setSiteLogo(data.siteLogo);
          }
          if (data.navLinks && Array.isArray(data.navLinks)) {
            setNavLinks(data.navLinks);
          }
          if (data.socialLinks && Array.isArray(data.socialLinks)) {
            setSocialLinks(data.socialLinks);
          }
        }
      })
      .catch(() => {});
  }, []);

  const locale = pathname.split("/")[1] || "en";

  // Build nav links: standard pages always use translations, KV navLinks are appended as custom pages
  const standardNavLinks: NavLink[] = [
    { label: t("home"), href: `/${locale}`, children: [] },
    { label: t("products"), href: `/${locale}/products`, children: [
      { label: tc("viewAll"), href: `/${locale}/products` },
      { label: "Knit Fabrics", href: `/${locale}/products?category=knit-fabrics` },
      { label: "T-Shirts", href: `/${locale}/products?category=t-shirts` },
      { label: "Hoodies", href: `/${locale}/products?category=hoodies` },
      { label: "Leg Warmers", href: `/${locale}/products?category=leg-warmers` },
      { label: "Hats", href: `/${locale}/products?category=hats` },
      { label: "Gloves", href: `/${locale}/products?category=gloves` },
      { label: "Socks", href: `/${locale}/products?category=socks` },
    ]},
    { label: t("blog"), href: `/${locale}/blog`, children: [] },
    { label: t("about"), href: `/${locale}/about`, children: [] },
    { label: t("contact"), href: `/${locale}/contact`, children: [] },
  ];
  // Append custom nav links from KV (only non-standard pages)
  const customNavLinks = navLinks.filter((nl) => {
    const href = nl.href.replace(`/${locale}`, "") || "/";
    return !["/", "/products", "/blog", "/about", "/contact"].includes(href);
  });
  const defaultNavLinks = [...standardNavLinks, ...customNavLinks];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === href;
    return pathname.startsWith(href);
  };

  // Resolve href: if starts with /, prefix locale
  const resolveHref = (href: string) => {
    if (href.startsWith("/")) return `/${locale}${href === "/" ? "" : href}`;
    return href;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3"
        >
          <img
            src={siteLogo}
            alt="HONGTEX"
            className="h-10 w-auto"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/logo.png"; }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {defaultNavLinks.map((link) => {
            const href = resolveHref(link.href);
            if (link.children && link.children.length > 0) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive(href)
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:bg-bg-alt hover:text-text"
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform",
                        productsOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {productsOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-border bg-white py-2 shadow-lg">
                      {link.children.map((child, ci) => {
                        const childHref = resolveHref(child.href);
                        return (
                          <Link
                            key={ci}
                            href={childHref}
                            className="block px-4 py-2 text-sm text-text-muted hover:bg-bg-alt hover:text-primary"
                            onClick={() => setProductsOpen(false)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-bg-alt hover:text-text"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Social Media Icons - Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {socialLinks.map((link, i) => {
              const iconMap: Record<string, any> = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: MessageCircle, whatsapp: MessageCircle, custom: Globe };
              const IconComp = iconMap[link.icon?.toLowerCase()] || Globe;
              return (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-alt hover:text-primary"
                  title={link.platform}>
                  <IconComp size={16} />
                </a>
              );
            })}
          </div>

          <LanguageSwitcher />

          <Link
            href={`/${locale}/contact`}
            className="hidden rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-light md:inline-flex"
          >
            {t("getQuote")}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-text-muted hover:bg-bg-alt md:hidden"
            aria-label={t("home")}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <div className="container-custom space-y-1 py-4">
            {defaultNavLinks.map((link) => {
              const href = resolveHref(link.href);
              if (link.children && link.children.length > 0) {
                return (
                  <div key={link.href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive(href)
                          ? "bg-primary/10 text-primary"
                          : "text-text-muted hover:bg-bg-alt hover:text-text"
                      )}
                    >
                      {link.label}
                    </Link>
                    <div className="ml-4 space-y-1 pb-2">
                      {link.children.map((child, ci) => {
                        const childHref = resolveHref(child.href);
                        return (
                          <Link
                            key={ci}
                            href={childHref}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg px-4 py-2 text-sm text-text-muted hover:bg-bg-alt hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive(href)
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:bg-bg-alt hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Social Media Icons - Mobile */}
            <div className="mt-4 flex items-center justify-center gap-4 border-t border-border pt-4">
              {socialLinks.map((link, i) => {
                const iconMap: Record<string, any> = { linkedin: Linkedin, facebook: Facebook, instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: MessageCircle, whatsapp: MessageCircle, custom: Globe };
                const IconComp = iconMap[link.icon?.toLowerCase()] || Globe;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt text-text-muted transition-colors hover:bg-primary hover:text-white"
                    title={link.platform}>
                    <IconComp size={16} />
                  </a>
                );
              })}
            </div>

            <Link
              href={`/${locale}/contact`}
              onClick={() => setMobileOpen(false)}
              className="mt-4 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t("getQuote")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
