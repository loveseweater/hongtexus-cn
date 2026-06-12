"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, FileText, MessageSquare, TrendingUp, Eye, Mail, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blogPosts: 0,
    messages: 0,
    subscribers: 0,
    visits: { total: 0, today: 0, pages: {} as Record<string, number> },
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    {
      label: "产品",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "博客文章",
      value: stats.blogPosts,
      icon: FileText,
      href: "/admin/blog",
      color: "text-green-600 bg-green-100",
    },
    {
      label: "消息",
      value: stats.messages,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "订阅用户",
      value: stats.subscribers,
      icon: Mail,
      href: "/admin/subscribers",
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const topPages = Object.entries(stats.visits.pages || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-primary">控制台</h1>
        <p className="mt-1 text-sm text-text-muted">欢迎使用 HONGTEX 内容管理系统</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}
            className="rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${card.color}`}><card.icon size={24} /></div>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-primary">{card.value}</p>
              <p className="mt-1 text-sm text-text-muted">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-100 p-2.5 text-indigo-600"><Eye size={20} /></div>
            <h2 className="font-display text-lg font-semibold text-primary">访问统计</h2>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-bg-alt p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.visits.total || 0}</p>
              <p className="mt-1 text-xs text-text-muted">总访问量</p>
            </div>
            <div className="rounded-lg bg-bg-alt p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.visits.today || 0}</p>
              <p className="mt-1 text-xs text-text-muted">今日访问</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600"><BarChart3 size={20} /></div>
            <h2 className="font-display text-lg font-semibold text-primary">热门页面</h2>
          </div>
          <div className="mt-4 space-y-2">
            {topPages.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">暂无访问数据</p>
            ) : (
              topPages.map(([path, count], i) => (
                <div key={path} className="flex items-center justify-between rounded-lg bg-bg-alt px-4 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-text-muted w-5">#{i + 1}</span>
                    <span className="text-sm text-text truncate">{path}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap ml-2">{count} 次</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-primary">快捷操作</h2>
          <div className="mt-4 space-y-3">
            <Link href="/admin/products" className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary">
              <Package size={18} /> 管理产品
            </Link>
            <Link href="/admin/blog" className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary">
              <FileText size={18} /> 管理博客文章
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-3 rounded-lg border border-border p-4 text-sm text-text-muted transition-colors hover:border-primary hover:text-primary">
              <MessageSquare size={18} /> 查看消息
            </Link>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-primary">站点信息</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">网站</span>
              <a href="https://hongtexus.cn" target="_blank" className="text-primary hover:underline">hongtexus.cn</a>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">语言</span>
              <span className="text-text">EN / ZH / ES / FR / DE</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">部署平台</span>
              <span className="text-text">Cloudflare Pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
