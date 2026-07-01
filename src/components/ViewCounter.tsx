"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  slug: string;
};

export default function ViewCounter({ slug }: Props) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Increment view count and fetch updated value
    fetch(`/api/blog/views/${slug}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        if (data.views !== undefined) {
          setViews(data.views);
        }
      })
      .catch(() => {
        // Fallback: just fetch without incrementing
        fetch(`/api/blog/views/${slug}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.views !== undefined) {
              setViews(data.views);
            }
          })
          .catch(() => {});
      });
  }, [slug]);

  return (
    <span className="flex items-center gap-1.5 text-xs text-text-muted">
      <Eye size={14} />
      {views !== null ? (
        <span>{views.toLocaleString()} views</span>
      ) : (
        <span>-- views</span>
      )}
    </span>
  );
}
