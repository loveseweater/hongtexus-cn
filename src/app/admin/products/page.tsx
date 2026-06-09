"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  category: string;
  images: string[];
  specs: { label: string; value: string }[];
  featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    category: "cotton-fabrics",
    featured: false,
    specs: [{ label: "", value: "" }],
  });

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
    p.slug.toLowerCase().includes(search.toLowerCase())
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

    await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditing(null);
    setForm({ slug: "", category: "cotton-fabrics", featured: false, specs: [{ label: "", value: "" }] });
    loadProducts();
  };

  const startEdit = (product: Product) => {
    setForm({
      slug: product.slug,
      category: product.category,
      featured: product.featured,
      specs: product.specs.length > 0 ? product.specs : [{ label: "", value: "" }],
    });
    setEditing(product);
    setShowForm(true);
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
            setForm({ slug: "", category: "cotton-fabrics", featured: false, specs: [{ label: "", value: "" }] });
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
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold text-primary">
              {editing ? "编辑产品" : "添加产品"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">产品标识（Slug）</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="premium-cotton-fabric"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text">分类</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="cotton-fabrics">棉织物</option>
                  <option value="linen-fabrics">麻织物</option>
                  <option value="silk-fabrics">丝织物</option>
                  <option value="polyester-fabrics">涤纶织物</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="rounded border-border"
                />
                <label htmlFor="featured" className="text-sm text-text">
                  设为推荐产品
                </label>
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
                        placeholder="名称（如：重量）"
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateSpec(i, "value", e.target.value)}
                        placeholder="值（如：180 gsm）"
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
                  {editing ? "更新" : "创建"}
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
              <th className="px-4 py-3 text-center font-medium text-text-muted hidden sm:table-cell">推荐</th>
              <th className="px-4 py-3 text-right font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-text-muted">
                  暂无产品。
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-bg-alt/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary capitalize">
                      {product.slug.replace(/-/g, " ")}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{product.specs.length} 个规格</div>
                  </td>
                  <td className="px-4 py-3 text-text-muted capitalize hidden md:table-cell">
                    {product.category.replace("-", " ")}
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
