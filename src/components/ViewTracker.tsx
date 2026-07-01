"use client";

import { useEffect } from "react";

type Props = {
  slug: string;
};

export default function ViewTracker({ slug }: Props) {
  useEffect(() => {
    // Increment view count once when the page is viewed
    fetch(`/api/blog/views/${slug}`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
