"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, Smartphone, Eye } from "lucide-react";

interface MobileNavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  order: number;
}

const ICON_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "package", label: "Products" },
  { value: "filetext", label: "Blog/Text" },
  { value: "messagesquare", label: "Contact" },
  { value: "phone", label: "Phone" },
  { value: "shoppingbag", label: "Shop" },
  { value: "info", label: "About" },
  { value: "image", label: "Gallery" },
  { value: "mail", label: "Email" },
  { value: "mappin", label: "Location" },
  { value: "globe", label: "Global" },
  { value: "bookopen", label: "Catalog" },
  { value: "newspaper", label: "News" },
  { value: "users", label: "Team" },
  { value: "star", label: "Featured" },
  { value: "shield", label: "Privacy" },
  { value: "helpcircle", label: "FAQ" },
];

export default function AdminMobileNavPage() {
  const [items, setItems] = useState<MobileNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [previewLocale, setPreviewLocale] = useState("en");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.mobileNavItems && Array.isArray(data.mobileNavItems)) {
          setItems(data.mobileNavItems.sort((a: MobileNavItem, b: MobileNavItem) => a.order - b.order));
        } else {
          // Default items
          setItems([
            { id: "1", label: "Home", href: "/", icon: "home", order: 0 },
            { id: "2", label: "Products", href: "/products", icon: "package", order: 1 },
            { id: "3", label: "Blog", href: "/blog", icon: "filetext", order: 2 },
            { id: "4", label: "Contact", href: "/contact", icon: "messagesquare", order: 3 },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const settings = await res.json();
      settings.mobileNavItems = items.map((item, i) => ({ ...item, order: i }));
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

  const addItem = () => {
    const newId = Date.now().toString();
    setItems([...items, { id: newId, label: "", href: "/", icon: "home", order: items.length }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, dir: "up" | "down") => {
    const arr = [...items];
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= arr.length) return;
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    setItems(arr);
  };

  const updateItem = (index: number, field: "label" | "href" | "icon", value: string) => {
    const arr = [...items];
    arr[index] = { ...arr[index], [field]: value };
    setItems(arr);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">
            <Smartphone size={24} className="inline mr-2" />
            移动端导航管理
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            管理手机端底部导航栏的菜单项。最多显示 4 个主菜单，超出部分会折叠到"更多"抽屉中。
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} /> {saved ? "已保存" : "保存更改"}
        </button>
      </div>

      {/* Mobile Preview */}
      <div className="mb-6 rounded-xl border border-border bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={16} className="text-text-muted" />
          <span className="text-sm font-medium text-text">手机端预览</span>
        </div>
        <div className="mx-auto max-w-[320px] rounded-2xl border-2 border-border overflow-hidden shadow-lg">
          {/* Fake phone top */}
          <div className="bg-primary-dark px-4 py-3 text-center text-xs text-white/60">
            <span className="font-medium text-white">HONGTEX</span>
          </div>
          {/* Fake content area */}
          <div className="h-24 bg-gray-50 flex items-center justify-center">
            <p className="text-xs text-text-muted">页面内容区域</p>
          </div>
          {/* Bottom nav preview */}
          <div className="flex items-center justify-around border-t border-border bg-white px-2 py-1.5">
            {items.slice(0, 4).map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-0.5 px-2 py-1 text-primary">
                <div className="h-5 w-5 rounded bg-primary/10" />
                <span className="text-[9px] font-medium truncate max-w-[48px]">{item.label || "..."}</span>
              </div>
            ))}
            {items.length > 4 && (
              <div className="flex flex-col items-center gap-0.5 px-2 py-1 text-text-muted">
                <div className="flex -space-x-1">
                  <div className="h-4 w-4 rounded bg-gray-200" />
                  <div className="h-4 w-4 rounded bg-gray-200" />
                </div>
                <span className="text-[9px]">More</span>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-text-muted text-center">
          仅显示前 4 项，{items.length > 4 ? `${items.length - 4} 项在"更多"中` : "超出部分自动折叠"}
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5 text-text-muted">
                <button onClick={() => moveItem(i, "up")} disabled={i === 0} className="disabled:opacity-30 hover:text-primary">
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => moveItem(i, "down")} disabled={i === items.length - 1} className="disabled:opacity-30 hover:text-primary">
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Smartphone size={18} />
              </div>

              <div className="flex-1 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">菜单名称</label>
                  <input type="text" value={item.label} onChange={(e) => updateItem(i, "label", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="Home" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">链接地址</label>
                  <input type="text" value={item.href} onChange={(e) => updateItem(i, "href", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="/products" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">图标</label>
                  <select value={item.icon} onChange={(e) => updateItem(i, "icon", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={() => removeItem(i)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>

            {/* Order badge */}
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-bg-alt px-2.5 py-0.5 text-xs text-text-muted">
                位置 #{i + 1}
                {i < 4 ? " (主菜单)" : " (更多)"}
              </span>
            </div>
          </div>
        ))}

        <button onClick={addItem} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm text-text-muted transition-colors hover:border-primary/50 hover:text-primary">
          <Plus size={16} /> 添加导航项
        </button>
      </div>

      {/* Info card */}
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-700 mb-2">使用说明</h3>
        <ul className="space-y-1 text-sm text-blue-600">
          <li>• 底部导航仅显示在手机端（屏幕宽度 &lt; 768px）</li>
          <li>• 最多显示 <strong>4 个</strong>主菜单项，超出部分自动折叠到"更多"抽屉</li>
          <li>• 支持自定义图标、名称和链接地址</li>
          <li>• 通过上下箭头调整菜单项的顺序</li>
        </ul>
      </div>
    </div>
  );
}
