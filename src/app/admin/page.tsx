"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, FileText, MessageSquare, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blogPosts: 0,
    messages: 0,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      href: "/admin/blog",
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Messages",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Welcome to HONGTEX CMS. Manage your website content from here.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${card.color}`}>
                <card.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-primary">{card.value}</p>
              <p className="mt-1 text-sm text-text-muted">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-primary">
            Quick Actions
          </h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Package size={18} />
              Manage Products
            </Link>
            <Link
              href="/admin/blog"
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <FileText size={18} />
              Manage Blog Posts
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <MessageSquare size={18} />
              View Messages
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-primary">
            Site Info
          </h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">Website</span>
              <a
                href="https://hongtexus.cn"
                target="_blank"
                className="text-primary hover:underline"
              >
                hongtexus.cn
              </a>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">Languages</span>
              <span className="text-text">EN / ZH / ES / FR / DE</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">Deployment</span>
              <span className="text-text">Cloudflare Pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
