"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Pencil, Trash2, Search, ImageUp, X } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  specs: { label: string; value: string }[];
  featured: boolean;
}

const MAX_IMAGES = 5;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    category: "knit-fabrics",
    featured: false,
    images: ["", "", "", "", ""] as string[],
    specs: [{ label: "", value: "" }],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个产品吗？")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    loadProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;

    // Filter out empty images
    const cleanImages = form.images.filter((img) => img.trim() !== "");
    const payload = { ...body, images: cleanImages };

    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!editing && res.ok) {
      fetch("/api/admin/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          title: form.title,
          slug: form.slug,
          excerpt: form.description?.substring(0, 200),
        }),
      }).then(r => r.json()).then(data => {
        if (data.success) console.log("通知已发送");
      }).catch(() => {});
    }

    setShowForm(false);
    setEditing(null);
    resetForm();
    loadProducts();
  };

  const resetForm = () => {
    setForm({
      slug: "",
      title: "",
      description: "",
      category: "knit-fabrics",
      featured: false,
      images: ["", "", "", "", ""],
      specs: [{ label: "", value: "" }],
    });
  };

  const startEdit = (product: Product) => {
    const images = [...product.images];
    while (images.length < MAX_IMAGES) images.push("");
    setForm({
      slug: product.slug,
      title: product.title || "",
      description: product.description || "",
      category: product.category,
      featured: product.featured,
      images: images.slice(0, MAX_IMAGES),
      specs: product.specs.length > 0 ? product.specs : [{ label: "", value: "" }],
    });
    setEditing(product);
    setShowForm(true);
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const images = [...form.images];
      images[index] = dataUrl;
      setForm({ ...form, images });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const images = [...form.images];
    images[index] = "";
    setForm({ ...form, images });
  };

  const addSpec = () => {
    setForm({ ...form, specs: [...form.specs, { label: "", value: "" }] });
  };

  const updateSpec = (index: number, field: "label" | "value", val: string) => {
    const specs = [...form.specs];
    specs[index] = { ...specs[index], [field]: val };
    setForm({ ...form, specs });
  };

  const removeSpec = (index: number) => {
    setForm({ ...form, specs: form.specs.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">
            产品管理
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            管理您的产品目录（共 {products.length} 个产品）
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          添加产品
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索产品..."
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary">
                {editing ? "编辑产品" : "添加产品"}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-text-muted hover:bg-bg-alt">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              {/* Basic Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">产品名称 *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="如：Premium Cotton T-Shirt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">产品标识（Slug）</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="premium-cotton-tshirt"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text">产品描述 *</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="详细描述产品材质、特点、适用场景等..."
                />
              </div>

              {/* Category & Featured */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="knit-fabrics">针织布料</option>
                    <option value="t-shirts">T恤</option>
                    <option value="hoodies">卫衣</option>
                    <option value="leg-warmers">腿套</option>
                    <option value="hats">帽子</option>
                    <option value="gloves">手套</option>
                    <option value="socks">袜子</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-text">设为推荐产品（首页展示）</span>
                  </label>
                </div>
              </div>

              {/* Images - 5 slots */}
              <div>
                <label className="block text-sm font-medium text-text">
                  产品图片 <span className="text-text-muted">（最多 5 张，支持上传或粘贴图片URL）</span>
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      {img ? (
                        <div className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-bg-alt">
                          <img
                            src={img}
                            alt={`产品图片 ${i + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='10' text-anchor='middle' fill='%239ca3af'%3E加载失败%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-bg-alt p-3 transition-colors hover:border-primary/50">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id={`img-upload-${i}`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(i, file);
                            }}
                          />
                          <input
                            type="text"
                            value={img}
                            onChange={(e) => {
                              const images = [...form.images];
                              images[i] = e.target.value;
                              setForm({ ...form, images });
                            }}
                            placeholder="粘贴图片URL"
                            className="w-full rounded border border-border px-2 py-1 text-xs text-center focus:border-primary focus:outline-none"
                          />
                          <label
                            htmlFor={`img-upload-${i}`}
                            className="cursor-pointer rounded bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20"
                          >
                            <ImageUp size={14} className="inline" /> 上传
                          </label>
                          <span className="text-[10px] text-text-muted">图片 {i + 1}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text">规格参数</label>
                  <button type="button" onClick={addSpec} className="text-xs text-primary hover:underline">
                    + 添加规格
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {form.specs.map((spec, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => updateSpec(i, "label", e.target.value)}
                        placeholder="名称（如：材质）"
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        placeholder="值（如：100% 棉）"
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                      {form.specs.length > 1 && (
                        <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editing ? "更新产品" : "创建产品"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-text-muted hover:bg-bg-alt"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="px-4 py-3 text-left font-medium text-text-muted">产品</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted hidden md:table-cell">分类</th>
              <th className="px-4 py-3 text-center font-medium text-text-muted hidden sm:table-cell">图片</th>
              <th className="px-4 py-3 text-center font-medium text-text-muted hidden sm:table-cell">推荐</th>
              <th className="px-4 py-3 text-right font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-text-muted">
                  暂无产品。
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-bg-alt/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">
                      {product.title || product.slug.replace(/-/g, " ")}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted line-clamp-1">
                      {product.description || product.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted capitalize hidden md:table-cell">
                    {product.category.replace("-", " ")}
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="text-xs text-text-muted">
                      {product.images?.length || 0} 张
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {product.featured ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        是
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        否
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="rounded-lg p-2 text-text-muted hover:bg-bg-alt hover:text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
