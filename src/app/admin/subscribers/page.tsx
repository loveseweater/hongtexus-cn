"use client";

import { useEffect, useState } from "react";
import { Search, Mail, Calendar, Trash2 } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">
          订阅管理
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          管理邮件订阅用户（共 {subscribers.length} 个订阅）
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索邮箱..."
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Subscribers Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="px-4 py-3 text-left font-medium text-text-muted">邮箱</th>
              <th className="px-4 py-3 text-left font-medium text-text-muted hidden md:table-cell">订阅时间</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-12 text-center text-text-muted">
                  暂无订阅用户。
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-bg-alt/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-text-muted" />
                      <span className="font-medium text-primary">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleString("zh-CN") : "-"}
                    </span>
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
