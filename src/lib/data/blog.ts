export interface BlogPost {
  id: string;
  slug: string;
  date: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "sustainable-textile-trends-2026",
    date: "2026-05-15",
    image: "/images/blog-1.jpg",
    tags: ["trends", "sustainability"],
  },
  {
    id: "2",
    slug: "choosing-right-fabric-for-garments",
    date: "2026-04-28",
    image: "/images/blog-2.jpg",
    tags: ["guide", "fabrics"],
  },
  {
    id: "3",
    slug: "textile-manufacturing-innovation",
    date: "2026-04-10",
    image: "/images/blog-3.jpg",
    tags: ["technology", "manufacturing"],
  },
  {
    id: "4",
    slug: "global-textile-market-outlook",
    date: "2026-03-22",
    image: "/images/blog-4.jpg",
    tags: ["market", "trends"],
  },
  {
    id: "5",
    slug: "quality-control-in-textile-production",
    date: "2026-03-05",
    image: "/images/blog-5.jpg",
    tags: ["quality", "manufacturing"],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
