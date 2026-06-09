"use client";

import { useState } from "react";
import { Save, Globe, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    siteName: "HONGTEX",
    siteDescription: "Premium Knitwear & Textile Solutions",
    contactEmail: "info@hongtexus.cn",
    adminPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">
          系统设置
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          管理您的网站配置
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Site Settings */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Globe size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-primary">
              网站设置
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">网站名称</label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">网站描述</label>
              <textarea
                rows={3}
                value={form.siteDescription}
                onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button type="submit" className="btn-primary inline-flex items-center gap-2">
              <Save size={16} />
              {saved ? "已保存！" : "保存设置"}
            </button>
          </form>
        </div>

        {/* Contact & Email */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600">
              <Mail size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-primary">
              邮箱与联系
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">联系邮箱</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">
                管理员密码 <span className="text-text-muted">（通过 ADMIN_PASSWORD 环境变量设置）</span>
              </label>
              <input
                type="password"
                value={form.adminPassword}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="留空则保持当前密码"
              />
            </div>

            <button type="submit" className="btn-primary inline-flex items-center gap-2">
              <Save size={16} />
              {saved ? "Saved!" : "Save Settings"}
            </button>
          </form>
        </div>



        {/* Deployment Info */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
              <Globe size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-primary">
              部署信息
            </h2>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">平台</span>
              <span className="text-text">Cloudflare Pages</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">域名</span>
              <a href="https://hongtexus.cn" target="_blank" className="text-primary hover:underline">
                hongtexus.cn
              </a>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-text-muted">后台地址</span>
              <a href="/admin" className="text-primary hover:underline">
                /admin
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
