"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  date: string;
  image: string;
  tags: string[];
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    slug: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
  });

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filtered = posts.filter((p) =>
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇博客文章吗？")) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    loadPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const body = editing
      ? { ...form, id: editing.id, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) }
      : { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), image: "/images/blog-placeholder.jpg" };

    await fetch("/api/admin/blog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditing(null);
    setForm({ slug: "", date: new Date().toISOString().split("T")[0], tags: "" });
    loadPosts();
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      slug: post.slug,
      date: post.date,
      tags: post.tags.join(", "),
    });
    setEditing(post);
    setShowForm(true);
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
            博客管理
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            管理您的博客文章（共 {posts.length} 篇）
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ slug: "", date: new Date().toISOString().split("T")[0], tags: "" });
            setShowForm(true);
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={16} />
          添加文章
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文章..."
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="font-display text-lg font-semibold text-primary">
              {editing ? "编辑文章" : "添加文章"}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">文章标识（Slug）</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="sustainable-textile-trends"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text">日期</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text">
                  标签 <span className="text-text-muted">（英文逗号分隔）</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="sustainability, trends, fabric"
                />
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

      {/* Posts Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="px-4 py-3 text-left font-medium text-text-muted">文章</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted hidden md:table-cell">日期</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted hidden sm:table-cell">标签</th>
              <th className="px-4 py-3 text-right font-medium text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-text-muted">
                  暂无文章。
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-bg-alt/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary capitalize">
                      {post.slug.replace(/-/g, " ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">{post.date}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="rounded-lg p-2 text-text-muted hover:bg-bg-alt hover:text-primary"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
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
