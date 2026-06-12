"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Globe, Mail, Phone, MapPin, MessageCircle, Image, FileText, Plus, Trash2, Linkedin, Facebook, Instagram, Youtube, Twitter, Send, Upload } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  order: number;
}

const PLATFORM_ICONS: Record<string, any> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: Send,
};

const PLATFORM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter / X" },
  { value: "tiktok", label: "TikTok" },
  { value: "pinterest", label: "Pinterest" },
  { value: "wechat", label: "WeChat" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "custom", label: "自定义" },
];

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState<any>({});
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newSocialPlatform, setNewSocialPlatform] = useState("linkedin");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setForm({
            ...data,
            socialLinks: data.socialLinks || [],
            blogCategories: data.blogCategories || [],
            emailService: data.emailService || { provider: "", apiKey: "", fromEmail: "info@hongtexus.cn", fromName: "HONGTEX" },
          });
        }
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

  // Logo upload
  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm({ ...form, siteLogo: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Social links
  const addSocialLink = () => {
    if (!newSocialUrl.trim()) return;
    const links = [...(form.socialLinks || [])];
    links.push({
      platform: PLATFORM_OPTIONS.find(p => p.value === newSocialPlatform)?.label || newSocialPlatform,
      url: newSocialUrl.trim(),
      icon: newSocialPlatform,
      order: links.length,
    });
    setForm({ ...form, socialLinks: links });
    setNewSocialUrl("");
  };

  const removeSocialLink = (index: number) => {
    const links = [...(form.socialLinks || [])];
    links.splice(index, 1);
    setForm({ ...form, socialLinks: links });
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const links = [...(form.socialLinks || [])];
    links[index] = { ...links[index], [field]: value };
    if (field === "icon") {
      links[index].platform = PLATFORM_OPTIONS.find(p => p.value === value)?.label || value;
    }
    setForm({ ...form, socialLinks: links });
  };

  // Blog categories
  const addBlogCategory = () => {
    if (!newCatName.trim() || !newCatSlug.trim()) return;
    setForm({
      ...form,
      blogCategories: [...(form.blogCategories || []), { id: Date.now().toString(), name: newCatName.trim(), slug: newCatSlug.trim() }],
    });
    setNewCatName("");
    setNewCatSlug("");
  };

  const removeBlogCategory = (id: string) => {
    setForm({ ...form, blogCategories: (form.blogCategories || []).filter((c: any) => c.id !== id) });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;
  }

  const tabs = [
    { id: "general", label: "基本设置" },
    { id: "social", label: "社交媒体" },
    { id: "email", label: "邮件服务" },
    { id: "blog-cats", label: "博客分类" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">系统设置</h1>
          <p className="mt-1 text-sm text-text-muted">管理网站配置、Logo、社媒、邮件服务等</p>
        </div>
        <button onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} /> {saved ? "已保存！" : "保存所有设置"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* === TAB: General === */}
        {activeTab === "general" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-primary">网站信息</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text">网站名称</label>
                  <input type="text" value={form.siteName || ""} onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">网站描述</label>
                  <textarea rows={3} value={form.siteDescription || ""} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-primary">Logo 设置</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-border bg-bg-alt">
                    <img src={form.siteLogo || "/images/logo.png"} alt="Logo" className="h-full w-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23f3f4f6' width='80' height='80'/%3E%3Ctext x='40' y='45' font-size='10' text-anchor='middle' fill='%239ca3af'%3ELogo%3C/text%3E%3C/svg%3E"; }} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs text-text-muted mb-1">上传新 Logo</label>
                      <input type="file" ref={logoInputRef} accept="image/png,image/jpeg,image/svg+xml,image/webp" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
                      <button type="button" onClick={() => logoInputRef.current?.click()}
                        className="btn-outline inline-flex items-center gap-2 text-sm">
                        <Upload size={14} /> 选择图片上传
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs text-text-muted mb-1">或输入图片 URL</label>
                      <input type="text" value={form.siteLogo || ""} onChange={(e) => setForm({ ...form, siteLogo: e.target.value })}
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="/images/logo.png" />
                    </div>
                    <p className="text-xs text-text-muted">支持 PNG、JPG、SVG、WebP 格式，建议尺寸 200x60px</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-primary">首页 Hero 区域</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text">大标题</label>
                  <input type="text" value={form.heroTitle || ""} onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">副标题</label>
                  <textarea rows={2} value={form.heroSubtitle || ""} onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-border bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-primary">联系信息</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text"><Mail size={14} className="inline mr-1" />联系邮箱</label>
                  <input type="email" value={form.contactEmail || ""} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text"><Phone size={14} className="inline mr-1" />联系电话</label>
                  <input type="text" value={form.contactPhone || ""} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text"><MessageCircle size={14} className="inline mr-1 text-green-500" />WhatsApp</label>
                  <input type="text" value={form.contactWhatsapp || ""} onChange={(e) => setForm({ ...form, contactWhatsapp: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="+8617825536228" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text"><MapPin size={14} className="inline mr-1" />地址</label>
                  <input type="text" value={form.contactAddress || ""} onChange={(e) => setForm({ ...form, contactAddress: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === TAB: Social Media === */}
        {activeTab === "social" && (
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-primary">社交媒体链接</h2>
            <p className="mt-1 text-sm text-text-muted">管理网站显示的所有社交媒体图标和链接，支持添加任意平台</p>

            {/* Add new */}
            <div className="mt-6 flex flex-wrap gap-3">
              <select value={newSocialPlatform} onChange={(e) => setNewSocialPlatform(e.target.value)}
                className="rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none">
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <input type="url" value={newSocialUrl} onChange={(e) => setNewSocialUrl(e.target.value)}
                placeholder="https://www.example.com/your-page"
                className="flex-1 min-w-[200px] rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              <button type="button" onClick={addSocialLink} className="btn-primary inline-flex items-center gap-1 text-sm">
                <Plus size={14} /> 添加
              </button>
            </div>

            {/* List */}
            <div className="mt-6 space-y-3">
              {(form.socialLinks || []).length === 0 ? (
                <p className="text-sm text-text-muted py-4 text-center">暂无社交媒体链接，请添加</p>
              ) : (
                (form.socialLinks || []).map((link: SocialLink, i: number) => {
                  const IconComp = PLATFORM_ICONS[link.icon?.toLowerCase()] || Globe;
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-gray-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComp size={18} />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <select value={link.icon} onChange={(e) => updateSocialLink(i, "icon", e.target.value)}
                          className="rounded-lg border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none">
                          {PLATFORM_OPTIONS.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                        <input type="url" value={link.url} onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                          className="rounded-lg border border-border px-2 py-1.5 text-sm focus:border-primary focus:outline-none" />
                      </div>
                      <button type="button" onClick={() => removeSocialLink(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* === TAB: Email Service === */}
        {activeTab === "email" && (
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-primary">邮件服务配置</h2>
            <p className="mt-1 text-sm text-text-muted">
              配置邮件发送服务，用于向订阅用户发送产品更新和博客通知。需要第三方邮件服务商（如 Resend、SendGrid、Mailgun）。
            </p>
            <div className="mt-6 space-y-4 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-text">邮件服务商</label>
                <select value={form.emailService?.provider || ""} onChange={(e) => setForm({ ...form, emailService: { ...form.emailService, provider: e.target.value } })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="">-- 选择服务商 --</option>
                  <option value="resend">Resend</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="smtp">SMTP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text">API Key</label>
                <input type="password" value={form.emailService?.apiKey || ""} onChange={(e) => setForm({ ...form, emailService: { ...form.emailService, apiKey: e.target.value } })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="sk_..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">发件人邮箱</label>
                <input type="email" value={form.emailService?.fromEmail || ""} onChange={(e) => setForm({ ...form, emailService: { ...form.emailService, fromEmail: e.target.value } })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="info@hongtexus.cn" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">发件人名称</label>
                <input type="text" value={form.emailService?.fromName || ""} onChange={(e) => setForm({ ...form, emailService: { ...form.emailService, fromName: e.target.value } })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="HONGTEX" />
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm text-blue-700">
                <strong>提示：</strong>配置邮件服务后，创建或更新产品/博客时系统会自动向所有订阅用户发送通知邮件。
                目前支持 Resend（推荐）、SendGrid、Mailgun 服务商。
              </div>
            </div>
          </div>
        )}

        {/* === TAB: Blog Categories === */}
        {activeTab === "blog-cats" && (
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-primary">博客分类</h2>
            <p className="mt-1 text-sm text-text-muted">管理博客文章的分类标签</p>
            <div className="mt-6 flex gap-2 max-w-lg">
              <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="分类名称"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              <input type="text" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} placeholder="标识 slug"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              <button type="button" onClick={addBlogCategory} className="btn-outline inline-flex items-center gap-1 text-sm whitespace-nowrap">
                <Plus size={14} /> 添加
              </button>
            </div>
            <div className="mt-4 space-y-2 max-w-lg">
              {(form.blogCategories || []).length === 0 ? (
                <p className="text-sm text-text-muted">暂无博客分类</p>
              ) : (
                (form.blogCategories || []).map((cat: any) => (
                  <div key={cat.id} className="flex items-center justify-between rounded-lg border border-border bg-gray-50 px-3 py-2">
                    <div>
                      <span className="text-sm font-medium text-text">{cat.name}</span>
                      <span className="ml-2 text-xs text-text-muted">/{cat.slug}</span>
                    </div>
                    <button type="button" onClick={() => removeBlogCategory(cat.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
