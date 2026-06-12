"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Globe, Linkedin, Facebook, Instagram, Youtube, Twitter, Send, MessageCircle } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  order: number;
}

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

const ICON_MAP: Record<string, any> = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  tiktok: Send,
  pinterest: Globe,
  wechat: MessageCircle,
  whatsapp: MessageCircle,
  custom: Globe,
};

export default function AdminSocialPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newPlatform, setNewPlatform] = useState("linkedin");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSocialLinks(data.socialLinks || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const settings = await res.json();
      settings.socialLinks = socialLinks;
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("保存失败");
    }
  };

  const addLink = () => {
    if (!newUrl.trim()) return;
    setSocialLinks([
      ...socialLinks,
      {
        platform: PLATFORM_OPTIONS.find((p) => p.value === newPlatform)?.label || newPlatform,
        url: newUrl.trim(),
        icon: newPlatform,
        order: socialLinks.length,
      },
    ]);
    setNewUrl("");
  };

  const removeLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: string, value: string) => {
    const items = [...socialLinks];
    items[index] = { ...items[index], [field]: value };
    if (field === "icon") {
      items[index].platform = PLATFORM_OPTIONS.find((p) => p.value === value)?.label || value;
    }
    setSocialLinks(items);
  };

  const moveLink = (index: number, dir: "up" | "down") => {
    const items = [...socialLinks];
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    setSocialLinks(items);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">社交媒体管理</h1>
          <p className="mt-1 text-sm text-text-muted">管理网站底部和导航栏显示的社交媒体图标与链接</p>
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} /> {saved ? "已保存！" : "保存更改"}
        </button>
      </div>

      {/* Add new */}
      <div className="mb-8 rounded-xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-primary mb-4">添加社交媒体链接</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://www.example.com/your-page"
            className="flex-1 min-w-[250px] rounded-lg border border-border px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          <button type="button" onClick={addLink} className="btn-primary inline-flex items-center gap-1 text-sm">
            <Plus size={16} /> 添加
          </button>
        </div>
      </div>

      {/* Social links list */}
      <div className="rounded-xl border border-border bg-white">
        {socialLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-muted">
            <Globe size={48} className="mb-3 opacity-30" />
            <p className="text-sm">暂无社交媒体链接</p>
            <p className="text-xs mt-1">请在上方添加社交媒体链接</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {socialLinks.map((link, i) => {
              const IconComp = ICON_MAP[link.icon?.toLowerCase()] || Globe;
              return (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Drag handle / Order */}
                  <div className="flex flex-col gap-0.5 text-text-muted">
                    <button onClick={() => moveLink(i, "up")} disabled={i === 0}
                      className="disabled:opacity-20 hover:text-primary"><span className="text-xs">▲</span></button>
                    <button onClick={() => moveLink(i, "down")} disabled={i === socialLinks.length - 1}
                      className="disabled:opacity-20 hover:text-primary"><span className="text-xs">▼</span></button>
                  </div>

                  {/* Icon preview */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <IconComp size={22} />
                  </div>

                  {/* Fields */}
                  <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <select
                      value={link.icon}
                      onChange={(e) => updateLink(i, "icon", e.target.value)}
                      className="rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    >
                      {PLATFORM_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      className="rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Preview link */}
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 transition-colors">
                    <Globe size={12} /> 预览
                  </a>

                  {/* Delete */}
                  <button onClick={() => removeLink(i)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview section */}
      <div className="mt-8 rounded-xl border border-border bg-white p-6">
        <h2 className="font-display text-base font-semibold text-primary mb-2">前台预览效果</h2>
        <p className="text-sm text-text-muted mb-4">社交媒体图标将显示在网站底部和导航栏</p>
        <div className="flex items-center gap-3 rounded-lg bg-primary-dark p-4">
          {socialLinks.map((link, i) => {
            const IconComp = ICON_MAP[link.icon?.toLowerCase()] || Globe;
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent"
                title={link.platform}>
                <IconComp size={18} />
              </a>
            );
          })}
          {socialLinks.length === 0 && (
            <span className="text-sm text-white/50">添加社媒链接后在此预览</span>
          )}
        </div>
      </div>
    </div>
  );
}
