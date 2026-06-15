"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  FileText,
  MessageSquare,
  Phone,
  ShoppingBag,
  Info,
  Image,
  Mail,
  MapPin,
  Globe,
  BookOpen,
  Newspaper,
  Users,
  Star,
  Shield,
  HelpCircle,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

const ICON_MAP: Record<string, any> = {
  home: Home,
  package: Package,
  filetext: FileText,
  messagesquare: MessageSquare,
  phone: Phone,
  shoppingbag: ShoppingBag,
  info: Info,
  image: Image,
  mail: Mail,
  mappin: MapPin,
  globe: Globe,
  bookopen: BookOpen,
  newspaper: Newspaper,
  users: Users,
  star: Star,
  shield: Shield,
  helpcircle: HelpCircle,
};

const DEFAULT_ICONS = ["home", "package", "filetext", "messagesquare"];

const DEFAULT_ITEMS: MobileNavItem[] = [
  { id: "1", label: "Home", href: "/", icon: "home", order: 0 },
  { id: "2", label: "Products", href: "/products", icon: "package", order: 1 },
  { id: "3", label: "Blog", href: "/blog", icon: "filetext", order: 2 },
  { id: "4", label: "Contact", href: "/contact", icon: "messagesquare", order: 3 },
];

export default function MobileBottomNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations("footer");
  const [items, setItems] = useState<MobileNavItem[]>(DEFAULT_ITEMS);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mobileNavItems && Array.isArray(data.mobileNavItems) && data.mobileNavItems.length > 0) {
          setItems(data.mobileNavItems.sort((a: MobileNavItem, b: MobileNavItem) => a.order - b.order));
        }
      })
      .catch(() => {});
  }, []);

  // Only show on mobile
  const isActive = (href: string) => {
    const fullHref = `/${locale}${href === "/" ? "" : href}`;
    if (href === "/") return pathname === fullHref || pathname === `/${locale}`;
    return pathname.startsWith(fullHref);
  };

  // Max 4 items in the main bar, rest go to "more"
  const mainItems = items.slice(0, 4);
  const moreItems = items.slice(4);

  const resolveHref = (href: string) => {
    if (href.startsWith("/")) return `/${locale}${href === "/" ? "" : href}`;
    return href;
  };

  return (
    <>
      {/* Bottom Nav Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white md:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {mainItems.map((item) => {
            const IconComp = ICON_MAP[item.icon] || Home;
            const href = resolveHref(item.href);
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors min-w-0 flex-1",
                  active
                    ? "text-primary"
                    : "text-text-muted hover:text-text"
                )}
              >
                <IconComp size={20} className={cn(active && "fill-primary/10")} />
                <span className="truncate max-w-full">{item.label}</span>
              </Link>
            );
          })}

          {/* More button (if there are extra items) */}
          {moreItems.length > 0 && (
            <button
              onClick={() => setMoreOpen(true)}
              className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium text-text-muted hover:text-text min-w-0 flex-1"
            >
              <div className="relative">
                <div className="flex -space-x-1">
                  {moreItems.slice(0, 3).map((item) => {
                    const IconComp = ICON_MAP[item.icon] || Home;
                    return <IconComp key={item.id} size={16} className="text-text-muted" />;
                  })}
                </div>
              </div>
              <span>{t("mobileMore")}</span>
            </button>
          )}
        </div>
      </nav>

      {/* More Drawer */}
      {moreOpen && moreItems.length > 0 && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-6 pb-10 shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-primary">{t("mobileMoreTitle")}</h3>
              <button onClick={() => setMoreOpen(false)} className="rounded-lg p-2 text-text-muted hover:bg-bg-alt">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {moreItems.map((item) => {
                const IconComp = ICON_MAP[item.icon] || Home;
                const href = resolveHref(item.href);
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-3 transition-colors",
                      active ? "bg-primary/10 text-primary" : "text-text-muted hover:bg-bg-alt hover:text-text"
                    )}
                  >
                    <IconComp size={24} />
                    <span className="text-xs font-medium text-center">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind the nav bar */}
      <div className="h-16 md:hidden" />
    </>
  );
}
