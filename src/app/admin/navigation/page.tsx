"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children: NavChild[];
}

export default function AdminNavigationPage() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.navLinks) {
          setNavLinks(data.navLinks);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const settings = await res.json();
      settings.navLinks = navLinks;
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
    setNavLinks([...navLinks, { label: "", href: "/", children: [] }]);
  };

  const removeLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const moveLink = (index: number, dir: "up" | "down") => {
    const items = [...navLinks];
    const newIndex = dir === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    [items[index], items[newIndex]] = [items[newIndex], items[index]];
    setNavLinks(items);
  };

  const updateLink = (index: number, field: "label" | "href", value: string) => {
    const items = [...navLinks];
    items[index] = { ...items[index], [field]: value };
    setNavLinks(items);
  };

  const addChild = (parentIndex: number) => {
    const items = [...navLinks];
    items[parentIndex].children.push({ label: "", href: "" });
    setNavLinks(items);
  };

  const removeChild = (parentIndex: number, childIndex: number) => {
    const items = [...navLinks];
    items[parentIndex].children = items[parentIndex].children.filter((_, i) => i !== childIndex);
    setNavLinks(items);
  };

  const updateChild = (parentIndex: number, childIndex: number, field: "label" | "href", value: string) => {
    const items = [...navLinks];
    items[parentIndex].children[childIndex] = { ...items[parentIndex].children[childIndex], [field]: value };
    setNavLinks(items);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">导航管理</h1>
          <p className="mt-1 text-sm text-text-muted">管理网站顶部导航栏的菜单项和下拉子菜单</p>
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} /> {saved ? "已保存" : "保存更改"}
        </button>
      </div>

      <div className="space-y-4">
        {navLinks.map((link, i) => (
          <div key={i} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-0.5 text-text-muted">
                <button onClick={() => moveLink(i, "up")} disabled={i === 0} className="disabled:opacity-30 hover:text-primary"><ChevronUp size={14} /></button>
                <button onClick={() => moveLink(i, "down")} disabled={i === navLinks.length - 1} className="disabled:opacity-30 hover:text-primary"><ChevronDown size={14} /></button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-muted mb-1">菜单名称</label>
                  <input type="text" value={link.label} onChange={(e) => updateLink(i, "label", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="如：Products" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">链接地址</label>
                  <input type="text" value={link.href} onChange={(e) => updateLink(i, "href", e.target.value)}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="/products" />
                </div>
              </div>
              <button onClick={() => addChild(i)} className="rounded-lg p-2 text-text-muted hover:bg-bg-alt hover:text-primary" title="添加子菜单">
                <Plus size={16} />
              </button>
              <button onClick={() => removeLink(i)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500" title="删除菜单">
                <Trash2 size={16} />
              </button>
            </div>

            {/* Children */}
            {link.children.length > 0 && (
              <div className="mt-3 ml-8 space-y-2 border-l-2 border-border pl-4">
                {link.children.map((child, ci) => (
                  <div key={ci} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <input type="text" value={child.label} onChange={(e) => updateChild(i, ci, "label", e.target.value)}
                      className="flex-1 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="子菜单名称" />
                    <input type="text" value={child.href} onChange={(e) => updateChild(i, ci, "href", e.target.value)}
                      className="flex-1 rounded-lg border border-border px-3 py-1.5 text-sm focus:border-primary focus:outline-none" placeholder="/products?category=..." />
                    <button onClick={() => removeChild(i, ci)} className="rounded p-1 text-text-muted hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <button onClick={addLink} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm text-text-muted transition-colors hover:border-primary/50 hover:text-primary">
          <Plus size={16} /> 添加导航菜单
        </button>
      </div>
    </div>
  );
}
