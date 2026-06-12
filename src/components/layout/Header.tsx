"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, ChevronDown, Linkedin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";

const locales: Record<string, string> = {
  en: "EN",
  zh: "中文",
  es: "ES",
  fr: "FR",
  de: "DE",
};

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("8612345678901");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contactWhatsapp) {
          setWhatsapp(data.contactWhatsapp.replace(/[^0-9]/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  const locale = pathname.split("/")[1] || "en";

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/products`, label: t("products") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const productCategories = [
    { href: `/${locale}/products?category=knit-fabrics`, label: "Knit Fabrics" },
    { href: `/${locale}/products?category=t-shirts`, label: "T-Shirts" },
    { href: `/${locale}/products?category=hoodies`, label: "Hoodies" },
    { href: `/${locale}/products?category=leg-warmers`, label: "Leg Warmers" },
    { href: `/${locale}/products?category=hats`, label: "Hats" },
    { href: `/${locale}/products?category=gloves`, label: "Gloves" },
    { href: `/${locale}/products?category=socks`, label: "Socks" },
  ];

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3"
        >
          <img
            src="/images/logo.png"
            alt="HONGTEX"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            if (link.href.includes("/products")) {
              return (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
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
                      <Link
                        href={`/${locale}/products`}
                        className="block px-4 py-2 text-sm font-medium text-text-muted hover:bg-bg-alt hover:text-primary"
                        onClick={() => setProductsOpen(false)}
                      >
                        All Products
                      </Link>
                      <div className="mx-3 my-1 border-t border-border" />
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        Knit Fabrics
                      </div>
                      <Link
                        href={`/${locale}/products?category=knit-fabrics`}
                        className="block px-4 py-1.5 text-sm text-text-muted hover:bg-bg-alt hover:text-primary"
                        onClick={() => setProductsOpen(false)}
                      >
                        Knit Fabrics
                      </Link>
                      <div className="mx-3 my-1 border-t border-border" />
                      <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        Finished Products
                      </div>
                      {productCategories.slice(1).map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="block px-4 py-1.5 text-sm text-text-muted hover:bg-bg-alt hover:text-primary"
                          onClick={() => setProductsOpen(false)}
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
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
            <a
              href="https://www.linkedin.com/company/hongtexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-alt hover:text-primary"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href="https://www.facebook.com/hongtexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-alt hover:text-primary"
              title="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/hongtexus"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-alt hover:text-primary"
              title="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-green-50 hover:text-green-600"
              title="WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
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
            {navLinks.map((link) => {
              if (link.href.includes("/products")) {
                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-text-muted hover:bg-bg-alt hover:text-text"
                      )}
                    >
                      {link.label}
                    </Link>
                    <div className="ml-4 space-y-1 pb-2">
                      <div className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        Knit Fabrics
                      </div>
                      <Link
                        href={`/${locale}/products?category=knit-fabrics`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-4 py-2 text-sm text-text-muted hover:bg-bg-alt hover:text-primary"
                      >
                        Knit Fabrics
                      </Link>
                      <div className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                        Finished Products
                      </div>
                      {productCategories.slice(1).map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setMobileOpen(false)}
                          className="block rounded-lg px-4 py-2 text-sm text-text-muted hover:bg-bg-alt hover:text-primary"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive(link.href)
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
              <a
                href="https://www.linkedin.com/company/hongtexus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt text-text-muted transition-colors hover:bg-primary hover:text-white"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://www.facebook.com/hongtexus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt text-text-muted transition-colors hover:bg-primary hover:text-white"
                title="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/hongtexus"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt text-text-muted transition-colors hover:bg-primary hover:text-white"
                title="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-alt text-text-muted transition-colors hover:bg-green-500 hover:text-white"
                title="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
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
