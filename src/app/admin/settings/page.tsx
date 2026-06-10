"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Mail, Phone, Linkedin, Facebook, Instagram, MapPin, MessageCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    siteName: "HONGTEX",
    siteDescription: "Premium Knitwear & Textile Solutions",
    heroTitle: "Premium Textile Solutions for Global Markets",
    heroSubtitle: "From raw fabrics to finished products — Hongtexus delivers quality textiles tailored to your business needs.",
    contactEmail: "info@hongtexus.cn",
    contactPhone: "+86-769-8888-8888",
    contactWhatsapp: "+8612345678901",
    contactAddress: "Dongguan, Guangdong, China",
    socialLinkedin: "https://www.linkedin.com/company/hongtexus",
    socialFacebook: "https://www.facebook.com/hongtexus",
    socialInstagram: "https://www.instagram.com/hongtexus",
  });

  // Load settings on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("保存失败，请重试");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">
          系统设置
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          管理您的网站配置、联系信息和社交媒体链接
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
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

          <div className="mt-6 space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-text">首页大标题 (Hero Title)</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">首页副标题 (Hero Subtitle)</label>
              <textarea
                rows={2}
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600">
              <Mail size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-primary">
              联系信息
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <Mail size={14} /> 联系邮箱
                </span>
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <Phone size={14} /> 联系电话
                </span>
              </label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-green-500" /> WhatsApp号码
                </span>
              </label>
              <input
                type="text"
                value={form.contactWhatsapp}
                onChange={(e) => setForm({ ...form, contactWhatsapp: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="+8612345678901"
              />
              <p className="mt-1 text-xs text-text-muted">输入完整号码含国家代码，如 +8612345678901</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <MapPin size={14} /> 公司地址
                </span>
              </label>
              <input
                type="text"
                value={form.contactAddress}
                onChange={(e) => setForm({ ...form, contactAddress: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
              <Linkedin size={20} />
            </div>
            <h2 className="font-display text-lg font-semibold text-primary">
              社交媒体链接
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <Linkedin size={14} /> LinkedIn
                </span>
              </label>
              <input
                type="url"
                value={form.socialLinkedin}
                onChange={(e) => setForm({ ...form, socialLinkedin: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://www.linkedin.com/company/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <Facebook size={14} /> Facebook
                </span>
              </label>
              <input
                type="url"
                value={form.socialFacebook}
                onChange={(e) => setForm({ ...form, socialFacebook: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://www.facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text">
                <span className="flex items-center gap-2">
                  <Instagram size={14} /> Instagram
                </span>
              </label>
              <input
                type="url"
                value={form.socialInstagram}
                onChange={(e) => setForm({ ...form, socialInstagram: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://www.instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Save size={16} />
            {saved ? "已保存！" : "保存所有设置"}
          </button>
        </div>

        {/* Deployment Info */}
        <div className="rounded-xl border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2.5 text-green-600">
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
      </form>
    </div>
  );
}
