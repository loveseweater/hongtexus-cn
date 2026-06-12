"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save, Eye, EyeOff } from "lucide-react";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  order: number;
}

export default function AdminCustomPagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CustomPage | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", published: true });

  const loadPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPages(); }, []);

  const resetForm = () => setForm({ title: "", slug: "", content: "", published: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch("/api/admin/pages", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    loadPages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个页面吗？")) return;
    await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
    loadPages();
  };

  const togglePublish = async (page: CustomPage) => {
    await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...page, published: !page.published }),
    });
    loadPages();
  };

  const startEdit = (page: CustomPage) => {
    setForm({ title: page.title, slug: page.slug, content: page.content, published: page.published });
    setEditing(page);
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">自定义页面</h1>
          <p className="mt-1 text-sm text-text-muted">创建和管理自定义页面，支持 HTML 内容编辑</p>
        </div>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(true); }} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> 添加页面
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold text-primary">{editing ? "编辑页面" : "添加页面"}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text">页面标题 *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="如：About Us" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">页面路径（Slug）</label>
                  <input type="text" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="about-us" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text">页面内容（HTML）</label>
                <textarea rows={15} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                  placeholder="<h2>Page Title</h2><p>Content here...</p>" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-border" />
                <span className="text-sm text-text">发布</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? "更新" : "创建"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-text-muted hover:bg-bg-alt">取消</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="rounded-xl border border-border bg-white py-12 text-center text-text-muted">暂无自定义页面</div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-primary">{page.title}</h3>
                  {page.published ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">已发布</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">草稿</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-muted">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => togglePublish(page)} className="rounded-lg p-2 text-text-muted hover:bg-bg-alt" title={page.published ? "下架" : "发布"}>
                  {page.published ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => startEdit(page)} className="rounded-lg p-2 text-text-muted hover:bg-bg-alt hover:text-primary"><Pencil size={16} /></button>
                <button onClick={() => handleDelete(page.id)} className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
