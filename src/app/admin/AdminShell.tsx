"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  {
    href: "/admin",
    label: "控制台",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "产品管理",
    icon: Package,
  },
  {
    href: "/admin/blog",
    label: "博客管理",
    icon: FileText,
  },
  {
    href: "/admin/messages",
    label: "消息管理",
    icon: MessageSquare,
  },
  {
    href: "/admin/subscribers",
    label: "订阅管理",
    icon: Bell,
  },
  {
    href: "/admin/settings",
    label: "系统设置",
    icon: Settings,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handle退出登录 = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary text-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin" className="font-display text-xl font-bold">
            HONGTEX CMS
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/60 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Globe size={18} />
            查看网站
          </Link>
          <button
            onClick={handle退出登录}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-white px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-text-muted hover:text-text lg:hidden"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            className="hidden items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:bg-bg-alt sm:flex"
          >
            <Globe size={16} />
            查看网站
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
