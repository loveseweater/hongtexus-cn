"use client";

import { useEffect, useState } from "react";
import { Trash2, Mail, Phone, Building, Calendar } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条消息吗？")) return;
    await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    load();
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
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-primary">
          消息管理
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          联系表单提交记录（共 {submissions.length} 条）
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-border bg-white py-20 text-center">
          <Mail size={40} className="mx-auto text-text-muted/40" />
          <p className="mt-4 text-text-muted">暂无消息。</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* List */}
          <div className="lg:col-span-1 space-y-2">
            {submissions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelected(sub)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selected?.id === sub.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-white hover:border-primary/30"
                }`}
              >
                <div className="font-medium text-primary text-sm">{sub.name}</div>
                <div className="mt-1 text-xs text-text-muted truncate">{sub.email}</div>
                <div className="mt-1 text-xs text-text-muted">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="rounded-xl border border-border bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-primary">
                      {selected.name}
                    </h2>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Mail size={14} />
                        <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                          {selected.email}
                        </a>
                      </div>
                      {selected.phone && (
                        <div className="flex items-center gap-2 text-text-muted">
                          <Phone size={14} />
                          {selected.phone}
                        </div>
                      )}
                      {selected.company && (
                        <div className="flex items-center gap-2 text-text-muted">
                          <Building size={14} />
                          {selected.company}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-text-muted">
                        <Calendar size={14} />
                        {new Date(selected.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="rounded-lg p-2 text-text-muted hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-6 rounded-lg bg-bg-alt p-4">
                  <p className="text-sm leading-relaxed text-text whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-border bg-white py-20">
                <p className="text-text-muted">选择一条消息查看详情</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
