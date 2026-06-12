"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, ImageUp, X } from "lucide-react";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  tags: string[];
  category?: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
    tags: "",
    category: "",
  });
  const [blogCategories, setBlogCategories] = useState<{id: string; name: string; slug: string}[]>([]);

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
    // Load blog categories from settings
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        if (data && data.blogCategories) {
          setBlogCategories(data.blogCategories);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = posts.filter((p) =>
    p.slug.toLowerCase().includes(search.toLowerCase()) ||
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇博客文章吗？")) return;
    await fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" });
    loadPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const body = editing
      ? { ...form, id: editing.id, tags }
      : { ...form, tags, image: form.image || "/images/blog-placeholder.jpg" };

    await fetch("/api/admin/blog", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setShowForm(false);
    setEditing(null);
    setForm({ slug: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0], image: "", tags: "", category: "" });
    loadPosts();
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      slug: post.slug,
      title: post.title || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      date: post.date,
      image: post.image || "",
      tags: post.tags.join(", "),
      category: post.category || "",
    });
    setEditing(post);
    setShowForm(true);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm({ ...form, image: e.target?.result as string });
    };
    reader.readAsDataURL(file);
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
            setForm({ slug: "", title: "", excerpt: "", content: "", date: new Date().toISOString().split("T")[0], image: "", tags: "", category: "" });
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
          <div className="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-primary">
                {editing ? "编辑文章" : "添加文章"}
              </h2>
              <button onClick={() => setShowForm(false)} className="rounded-lg p-1.5 text-text-muted hover:bg-bg-alt">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              {/* Title & Slug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">文章标题 *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="如：Sustainable Textile Trends 2026"
                  />
                </div>
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
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-text">文章摘要 *</label>
                <textarea
                  required
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="文章简介，会显示在博客列表页..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-text">
                  文章内容 *
                  <span className="ml-2 text-xs text-text-muted">支持 Markdown 格式（## 标题、### 子标题、- 列表、**加粗**）</span>
                </label>
                <textarea
                  required
                  rows={12}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm font-mono leading-relaxed focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder={`## 文章标题

在此输入文章内容...

### 子标题

- 列表项 1
- 列表项 2

**加粗文字** 和普通文字`}
                />
              </div>

              {/* Date & Tags */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-text">分类</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="">无分类</option>
                    {blogCategories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
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
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-text">封面图片</label>
                <div className="mt-2">
                  {form.image ? (
                    <div className="relative inline-block">
                      <img
                        src={form.image}
                        alt="封面预览"
                        className="h-40 w-72 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='10' text-anchor='middle' fill='%239ca3af'%3E加载失败%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: "" })}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-3 text-sm text-text-muted transition-colors hover:border-primary/50 hover:text-primary">
                        <ImageUp size={18} />
                        上传封面图片
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </label>
                      <span className="text-xs text-text-muted">或</span>
                      <input
                        type="text"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="粘贴图片URL"
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editing ? "更新文章" : "创建文章"}
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
                    <div className="font-medium text-primary">
                      {post.title || post.slug.replace(/-/g, " ")}
                    </div>
                    <div className="mt-0.5 text-xs text-text-muted line-clamp-1">
                      {post.excerpt || post.slug}
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
