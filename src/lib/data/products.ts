export interface Product {
  id: string;
  slug: string;
  category: string;
  images: string[];
  specs: { label: string; value: string }[];
  featured: boolean;
}

export interface Category {
  id: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "cotton-fabrics",
    slug: "cotton-fabrics",
    image: "/images/category-cotton.jpg",
  },
  {
    id: "linen-fabrics",
    slug: "linen-fabrics",
    image: "/images/category-linen.jpg",
  },
  {
    id: "silk-fabrics",
    slug: "silk-fabrics",
    image: "/images/category-silk.jpg",
  },
  {
    id: "polyester-fabrics",
    slug: "polyester-fabrics",
    image: "/images/category-polyester.jpg",
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "premium-egyptian-cotton",
    category: "cotton-fabrics",
    images: ["/images/product-1.jpg", "/images/product-1b.jpg"],
    specs: [
      { label: "Weight", value: "180 gsm" },
      { label: "Width", value: "150 cm" },
      { label: "Composition", value: "100% Egyptian Cotton" },
      { label: "Weave", value: "Plain" },
      { label: "MOQ", value: "500 meters" },
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "organic-cotton-jersey",
    category: "cotton-fabrics",
    images: ["/images/product-2.jpg"],
    specs: [
      { label: "Weight", value: "200 gsm" },
      { label: "Width", value: "160 cm" },
      { label: "Composition", value: "100% Organic Cotton" },
      { label: "Weave", value: "Jersey Knit" },
      { label: "MOQ", value: "300 meters" },
    ],
    featured: true,
  },
  {
    id: "3",
    slug: "french-linen-fabric",
    category: "linen-fabrics",
    images: ["/images/product-3.jpg"],
    specs: [
      { label: "Weight", value: "220 gsm" },
      { label: "Width", value: "140 cm" },
      { label: "Composition", value: "100% French Linen" },
      { label: "Weave", value: "Plain" },
      { label: "MOQ", value: "200 meters" },
    ],
    featured: true,
  },
  {
    id: "4",
    slug: "linen-cotton-blend",
    category: "linen-fabrics",
    images: ["/images/product-4.jpg"],
    specs: [
      { label: "Weight", value: "190 gsm" },
      { label: "Width", value: "150 cm" },
      { label: "Composition", value: "55% Linen, 45% Cotton" },
      { label: "Weave", value: "Twill" },
      { label: "MOQ", value: "300 meters" },
    ],
    featured: false,
  },
  {
    id: "5",
    slug: "mulberry-silk-chiffon",
    category: "silk-fabrics",
    images: ["/images/product-5.jpg"],
    specs: [
      { label: "Weight", value: "60 gsm" },
      { label: "Width", value: "114 cm" },
      { label: "Composition", value: "100% Mulberry Silk" },
      { label: "Weave", value: "Chiffon" },
      { label: "MOQ", value: "100 meters" },
    ],
    featured: true,
  },
  {
    id: "6",
    slug: "silk-satin",
    category: "silk-fabrics",
    images: ["/images/product-6.jpg"],
    specs: [
      { label: "Weight", value: "80 gsm" },
      { label: "Width", value: "140 cm" },
      { label: "Composition", value: "100% Silk" },
      { label: "Weave", value: "Satin" },
      { label: "MOQ", value: "100 meters" },
    ],
    featured: false,
  },
  {
    id: "7",
    slug: "recycled-polyester-fabric",
    category: "polyester-fabrics",
    images: ["/images/product-7.jpg"],
    specs: [
      { label: "Weight", value: "150 gsm" },
      { label: "Width", value: "160 cm" },
      { label: "Composition", value: "100% Recycled Polyester" },
      { label: "Weave", value: "Plain" },
      { label: "MOQ", value: "500 meters" },
    ],
    featured: true,
  },
  {
    id: "8",
    slug: "polyester-microfiber",
    category: "polyester-fabrics",
    images: ["/images/product-8.jpg"],
    specs: [
      { label: "Weight", value: "120 gsm" },
      { label: "Width", value: "150 cm" },
      { label: "Composition", value: "100% Polyester Microfiber" },
      { label: "Weave", value: "Plain" },
      { label: "MOQ", value: "400 meters" },
    ],
    featured: false,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
