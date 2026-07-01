"use client";

import { MessageSquare, Send, User } from "lucide-react";
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

type Props = {
  slug: string;
};

export default function CommentSection({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/blog/comments/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.comments) setComments(data.comments);
      })
      .catch(() => {});
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`/api/blog/comments/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), content: content.trim() }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setName("");
        setContent("");
        setMessage("Comment submitted successfully!");
      } else {
        const err = await res.json();
        setMessage(err.error || "Failed to submit comment");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-primary">
        <MessageSquare size={20} />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
          className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          required
          rows={4}
          className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{content.length}/1000</span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <Send size={14} />
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </div>
        {message && (
          <p className="text-sm text-accent">{message}</p>
        )}
      </form>

      {/* Comments List */}
      <div className="mt-8 space-y-5">
        {comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            Be the first to leave a comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-border bg-bg p-5"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <User size={14} />
                </span>
                <div>
                  <p className="text-sm font-medium text-primary">
                    {comment.name}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
