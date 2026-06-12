"use client";

import { useState, useEffect } from "react";
import { Save, Image, Type, FileText, ChevronUp, ChevronDown, Trash2, Plus, Globe } from "lucide-react";

type Settings = {
  siteName: string;
  siteDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  aboutContent: {
    story: string;
    mission: string;
    stats: {
      years: string;
      clients: string;
      products: string;
      countries: string;
    };
  };
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
  socialLinkedin: string;
  socialFacebook: string;
  socialInstagram: string;
};

const defaultSettings: Settings = {
  siteName: "HONGTEX",
  siteDescription: "Premium Knitwear & Textile Solutions",
  heroTitle: "Premium Textile Solutions for Global Markets",
  heroSubtitle: "From raw fabrics to finished products — Hongtexus delivers quality textiles tailored to your business needs.",
  heroImages: [
    "/images/product-knit-fabric.jpg",
    "/images/product-tshirt.jpg",
    "/images/product-hoodie.jpg",
    "/images/product-gloves.jpg",
    "/images/product-hat.jpg",
    "/images/product-socks.jpg",
    "/images/product-legwarmers.jpg",
  ],
  aboutContent: {
    story: "Hongtexus is a leading textile supplier dedicated to providing high-quality fabrics and textile products to global markets.",
    mission: "To deliver premium textile solutions that empower businesses worldwide.",
    stats: { years: "15+", clients: "500+", products: "2000+", countries: "50+" },
  },
  contactEmail: "info@hongtexus.cn",
  contactPhone: "+86-769-8888-8888",
  contactWhatsapp: "+8612345678901",
  contactAddress: "Dongguan, Guangdong, China",
  socialLinkedin: "https://www.linkedin.com/company/hongtexus",
  socialFacebook: "https://www.facebook.com/hongtexus",
  socialInstagram: "https://www.instagram.com/hongtexus",
};

export default function AdminPagesPage() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "contact">("hero");
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings({
            ...defaultSettings,
            ...data,
            heroImages: data.heroImages || defaultSettings.heroImages,
            aboutContent: { ...defaultSettings.aboutContent, ...(data.aboutContent || {}) },
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("保存失败");
    }
  };

  const addHeroImage = () => {
    if (newImageUrl.trim()) {
      setSettings({
        ...settings,
        heroImages: [...settings.heroImages, newImageUrl.trim()],
      });
      setNewImageUrl("");
    }
  };

  const removeHeroImage = (index: number) => {
    setSettings({
      ...settings,
      heroImages: settings.heroImages.filter((_, i) => i !== index),
    });
  };

  const moveHeroImage = (index: number, direction: "up" | "down") => {
    const images = [...settings.heroImages];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [images[index], images[newIndex]] = [images[newIndex], images[index]];
    setSettings({ ...settings, heroImages: images });
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;
  }

  const tabs = [
    { id: "hero" as const, label: "首页轮播", icon: Image },
    { id: "about" as const, label: "关于我们", icon: FileText },
    { id: "contact" as const, label: "联系信息", icon: Globe },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">页面管理</h1>
          <p className="mt-1 text-sm text-text-muted">管理所有前台页面的内容和图片</p>
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} />
          {saved ? "已保存" : "保存更改"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Carousel Tab */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-primary">轮播图片管理</h2>
            <p className="mt-1 text-sm text-text-muted">
              管理首页 Hero 区域的轮播背景图片。支持 JPG、PNG、WebP 格式的图片 URL。
            </p>

            {/* Add new image */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="输入图片 URL 或 /images/xxx.jpg"
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && addHeroImage()}
              />
              <button onClick={addHeroImage} className="btn-outline inline-flex items-center gap-1 text-sm">
                <Plus size={14} /> 添加
              </button>
            </div>

            {/* Image list */}
            <div className="mt-4 space-y-3">
              {settings.heroImages.map((img, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-border bg-gray-50 p-3">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-gray-200">
                    <img
                      src={img}
                      alt={`Slide ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/product-knit-fabric.jpg"; }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{img}</p>
                    <p className="text-xs text-text-muted">轮播图 {index + 1}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveHeroImage(index, "up")}
                      disabled={index === 0}
                      className="rounded p-1 text-text-muted hover:bg-gray-200 disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => moveHeroImage(index, "down")}
                      disabled={index === settings.heroImages.length - 1}
                      className="rounded p-1 text-text-muted hover:bg-gray-200 disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() => removeHeroImage(index)}
                      className="rounded p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Text */}
          <div className="rounded-xl border border-border bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-primary">首页文字内容</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">大标题 (Hero Title)</label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">副标题 (Hero Subtitle)</label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Page Tab */}
      {activeTab === "about" && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-primary">关于我们页面</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text">公司故事</label>
              <textarea
                rows={5}
                value={settings.aboutContent.story}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutContent: { ...settings.aboutContent, story: e.target.value },
                })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">使命宣言</label>
              <textarea
                rows={3}
                value={settings.aboutContent.mission}
                onChange={(e) => setSettings({
                  ...settings,
                  aboutContent: { ...settings.aboutContent, mission: e.target.value },
                })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-text">数据统计</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                {Object.entries(settings.aboutContent.stats).map(([key, val]) => (
                  <div key={key}>
                    <label className="block text-xs text-text-muted capitalize">{key}</label>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => setSettings({
                        ...settings,
                        aboutContent: {
                          ...settings.aboutContent,
                          stats: { ...settings.aboutContent.stats, [key]: e.target.value },
                        },
                      })}
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === "contact" && (
        <div className="rounded-xl border border-border bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-primary">联系信息</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text">地址</label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">电话</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">邮箱</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">WhatsApp 号码</label>
              <input
                type="text"
                value={settings.contactWhatsapp}
                onChange={(e) => setSettings({ ...settings, contactWhatsapp: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">LinkedIn</label>
              <input
                type="url"
                value={settings.socialLinkedin}
                onChange={(e) => setSettings({ ...settings, socialLinkedin: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">Facebook</label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) => setSettings({ ...settings, socialFacebook: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">Instagram</label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) => setSettings({ ...settings, socialInstagram: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
