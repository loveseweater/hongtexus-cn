"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Save } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentId: string | null;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", image: "", parentId: "" });

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const resetForm = () => setForm({ name: "", slug: "", image: "", parentId: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setShowForm(false);
    setEditing(null);
    resetForm();
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个分类吗？产品将被保留但分类关联会断开。")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    loadCategories();
  };

  const startEdit = (cat: Category) => {
    setForm({ name: cat.name, slug: cat.slug, image: cat.image, parentId: cat.parentId || "" });
    setEditing(cat);
    setShowForm(true);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><p className="text-text-muted">加载中...</p></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">产品分类管理</h1>
          <p className="mt-1 text-sm text-text-muted">管理产品分类，支持新增、编辑、删除</p>
        </div>
        <button onClick={() => { setEditing(null); resetForm(); setShowForm(true); }} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> 添加分类
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold text-primary">{editing ? "编辑分类" : "添加分类"}</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">分类名称 *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="如：Knit Fabrics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">标识（Slug）</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="knit-fabrics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">图片 URL</label>
                <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none" placeholder="/images/category.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text">父级分类（可选）</label>
                <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option value="">无（顶级分类）</option>
                  {categories.filter(c => c.id !== editing?.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">{editing ? "更新" : "创建"}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-text-muted hover:bg-bg-alt">取消</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-border bg-white p-4">
            <div className="flex items-start gap-3">
              {cat.image && (
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img src={cat.image} alt={cat.name} className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-primary">{cat.name}</h3>
                <p className="text-xs text-text-muted">/{cat.slug}</p>
                {cat.parentId && <p className="text-xs text-accent">子分类</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(cat)} className="rounded p-1.5 text-text-muted hover:bg-bg-alt hover:text-primary"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(cat.id)} className="rounded p-1.5 text-text-muted hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
