export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
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
    id: "knit-fabrics",
    slug: "knit-fabrics",
    image: "/images/product-knit-fabric.jpg",
  },
  {
    id: "t-shirts",
    slug: "t-shirts",
    image: "/images/product-tshirt.jpg",
  },
  {
    id: "hoodies",
    slug: "hoodies",
    image: "/images/product-hoodie.jpg",
  },
  {
    id: "leg-warmers",
    slug: "leg-warmers",
    image: "/images/product-legwarmers.jpg",
  },
  {
    id: "hats",
    slug: "hats",
    image: "/images/product-hat.jpg",
  },
  {
    id: "gloves",
    slug: "gloves",
    image: "/images/product-gloves.jpg",
  },
  {
    id: "socks",
    slug: "socks",
    image: "/images/product-socks.jpg",
  },
];

export const products: Product[] = [
  // ===== Knit Fabrics =====
  {
    id: "1",
    slug: "premium-cotton-jersey-fabric",
    title: "Premium Cotton Jersey Fabric",
    description: "Our premium cotton jersey fabric is crafted from 100% combed cotton with a smooth surface and excellent drape. Perfect for T-shirts, dresses, and lightweight apparel, this single jersey knit offers superior breathability and comfort for everyday wear.",
    category: "knit-fabrics",
    images: ["/images/product-knit-fabric.jpg"],
    specs: [
      { label: "Weight", value: "180 gsm" },
      { label: "Width", value: "160 cm" },
      { label: "Composition", value: "100% Combed Cotton" },
      { label: "Type", value: "Single Jersey" },
      { label: "MOQ", value: "200 kg" },
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "rib-knit-fabric",
    title: "Rib Knit Fabric",
    description: "High-quality 1x1 rib knit fabric with excellent stretch and recovery. The cotton-spandex blend provides a comfortable fit that maintains its shape wear after wear. Ideal for cuffs, collars, form-fitting garments, and accessories.",
    category: "knit-fabrics",
    images: ["/images/product-knit-fabric.jpg"],
    specs: [
      { label: "Weight", value: "220 gsm" },
      { label: "Width", value: "150 cm" },
      { label: "Composition", value: "95% Cotton, 5% Spandex" },
      { label: "Type", value: "1x1 Rib Knit" },
      { label: "MOQ", value: "200 kg" },
    ],
    featured: true,
  },
  {
    id: "3",
    slug: "french-terry-fabric",
    title: "French Terry Fabric",
    description: "Our organic French Terry fabric combines sustainability with comfort. The looped back construction offers excellent moisture absorption while the smooth face provides a clean finish. Perfect for hoodies, loungewear, and casual jackets.",
    category: "knit-fabrics",
    images: ["/images/product-knit-fabric.jpg"],
    specs: [
      { label: "Weight", value: "260 gsm" },
      { label: "Width", value: "170 cm" },
      { label: "Composition", value: "100% Organic Cotton" },
      { label: "Type", value: "French Terry" },
      { label: "MOQ", value: "150 kg" },
    ],
    featured: true,
  },
  {
    id: "4",
    slug: "fleece-fabric",
    title: "Brushed Fleece Fabric",
    description: "Warm and cozy brushed fleece fabric made from a cotton-polyester blend. The brushed interior provides exceptional warmth and softness, making it the ideal choice for hoodies, sweatshirts, and cold-weather apparel.",
    category: "knit-fabrics",
    images: ["/images/product-knit-fabric.jpg"],
    specs: [
      { label: "Weight", value: "300 gsm" },
      { label: "Width", value: "180 cm" },
      { label: "Composition", value: "80% Cotton, 20% Polyester" },
      { label: "Type", value: "Brushed Fleece" },
      { label: "MOQ", value: "150 kg" },
    ],
    featured: false,
  },

  // ===== T-Shirts =====
  {
    id: "5",
    slug: "classic-cotton-t-shirt",
    title: "Classic Cotton T-Shirt",
    description: "A timeless essential crafted from 180gsm 100% combed cotton jersey. This classic T-shirt offers exceptional comfort, breathability, and durability. Available in 20+ colors with sizes from XS to 5XL, perfect for wholesale and custom branding.",
    category: "t-shirts",
    images: ["/images/product-tshirt.jpg"],
    specs: [
      { label: "Weight", value: "180 gsm" },
      { label: "Fabric", value: "100% Combed Cotton Jersey" },
      { label: "Sizes", value: "XS - 5XL" },
      { label: "Colors", value: "20+ colors available" },
      { label: "MOQ", value: "500 pcs" },
    ],
    featured: true,
  },
  {
    id: "6",
    slug: "premium-heavyweight-t-shirt",
    title: "Premium Heavyweight T-Shirt",
    description: "A substantial 240gsm heavyweight T-shirt made from 100% ringspun cotton. This premium garment offers a structured fit and superior durability while maintaining exceptional softness. Ideal for high-end brands and custom printing.",
    category: "t-shirts",
    images: ["/images/product-tshirt.jpg"],
    specs: [
      { label: "Weight", value: "240 gsm" },
      { label: "Fabric", value: "100% Ringspun Cotton" },
      { label: "Sizes", value: "XS - 5XL" },
      { label: "Colors", value: "15+ colors available" },
      { label: "MOQ", value: "300 pcs" },
    ],
    featured: true,
  },

  // ===== Hoodies =====
  {
    id: "7",
    slug: "classic-pullover-hoodie",
    title: "Classic Pullover Hoodie",
    description: "A comfortable pullover hoodie crafted from 300gsm cotton-polyester fleece. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs. Perfect for casual wear, streetwear brands, and custom apparel lines.",
    category: "hoodies",
    images: ["/images/product-hoodie.jpg"],
    specs: [
      { label: "Weight", value: "300 gsm" },
      { label: "Fabric", value: "80% Cotton, 20% Polyester Fleece" },
      { label: "Sizes", value: "XS - 5XL" },
      { label: "Colors", value: "12+ colors available" },
      { label: "MOQ", value: "300 pcs" },
    ],
    featured: true,
  },
  {
    id: "8",
    slug: "zip-up-hoodie",
    title: "Zip-Up Hoodie",
    description: "A versatile zip-up hoodie made from 320gsm 100% cotton French terry. Features a full-length YKK zipper, side pockets, and a lined hood. Ideal for layering and suitable for both casual and sportswear applications.",
    category: "hoodies",
    images: ["/images/product-hoodie.jpg"],
    specs: [
      { label: "Weight", value: "320 gsm" },
      { label: "Fabric", value: "100% Cotton French Terry" },
      { label: "Sizes", value: "XS - 5XL" },
      { label: "Colors", value: "10+ colors available" },
      { label: "MOQ", value: "300 pcs" },
    ],
    featured: false,
  },

  // ===== Leg Warmers =====
  {
    id: "9",
    slug: "knit-leg-warmers",
    title: "Knit Leg Warmers",
    description: "Cozy and stylish knit leg warmers made from 100% acrylic knit. These stretch-fit leg warmers offer excellent warmth and comfort for dance, yoga, or everyday fashion. Available in 10+ colors with a one-size stretch design.",
    category: "leg-warmers",
    images: ["/images/product-legwarmers.jpg"],
    specs: [
      { label: "Length", value: "40 cm" },
      { label: "Fabric", value: "100% Acrylic Knit" },
      { label: "Sizes", value: "One Size (Stretch Fit)" },
      { label: "Colors", value: "10+ colors available" },
      { label: "MOQ", value: "500 pairs" },
    ],
    featured: true,
  },
  {
    id: "10",
    slug: "cable-knit-leg-warmers",
    title: "Cable Knit Leg Warmers",
    description: "Premium cable knit leg warmers crafted from a warm wool blend. The classic cable pattern adds a timeless aesthetic while the wool blend provides natural insulation. Perfect for winter fashion and cold-weather accessories.",
    category: "leg-warmers",
    images: ["/images/product-legwarmers.jpg"],
    specs: [
      { label: "Length", value: "45 cm" },
      { label: "Fabric", value: "100% Wool Blend" },
      { label: "Pattern", value: "Cable Knit" },
      { label: "Colors", value: "8+ colors available" },
      { label: "MOQ", value: "300 pairs" },
    ],
    featured: false,
  },

  // ===== Hats =====
  {
    id: "11",
    slug: "classic-beanie-hat",
    title: "Classic Beanie Hat",
    description: "A classic knit beanie hat made from 200gsm 100% acrylic knit. Features a comfortable stretch fit, fold-up brim, and seamless construction. Available in 15+ colors, perfect for wholesale, branding, and winter accessories.",
    category: "hats",
    images: ["/images/product-hat.jpg"],
    specs: [
      { label: "Weight", value: "200 gsm" },
      { label: "Fabric", value: "100% Acrylic Knit" },
      { label: "Sizes", value: "One Size (Stretch Fit)" },
      { label: "Colors", value: "15+ colors available" },
      { label: "MOQ", value: "500 pcs" },
    ],
    featured: true,
  },
  {
    id: "12",
    slug: "wool-blend-beanie",
    title: "Wool Blend Beanie",
    description: "A premium wool blend beanie combining natural warmth with durability. The 50% wool, 50% acrylic blend offers superior insulation while maintaining softness and shape retention. Ideal for cold climates and premium winter collections.",
    category: "hats",
    images: ["/images/product-hat.jpg"],
    specs: [
      { label: "Weight", value: "240 gsm" },
      { label: "Fabric", value: "50% Wool, 50% Acrylic" },
      { label: "Sizes", value: "One Size (Stretch Fit)" },
      { label: "Colors", value: "10+ colors available" },
      { label: "MOQ", value: "300 pcs" },
    ],
    featured: true,
  },

  // ===== Gloves =====
  {
    id: "13",
    slug: "knit-gloves",
    title: "Knit Gloves",
    description: "Warm and comfortable knit gloves made from 180gsm 100% acrylic knit. These stretch-fit gloves offer excellent dexterity and warmth for everyday winter wear. Available in 10+ colors with sizes S, M, and L.",
    category: "gloves",
    images: ["/images/product-gloves.jpg"],
    specs: [
      { label: "Weight", value: "180 gsm" },
      { label: "Fabric", value: "100% Acrylic Knit" },
      { label: "Sizes", value: "S / M / L" },
      { label: "Colors", value: "10+ colors available" },
      { label: "MOQ", value: "500 pairs" },
    ],
    featured: true,
  },
  {
    id: "14",
    slug: "touchscreen-knit-gloves",
    title: "Touchscreen Knit Gloves",
    description: "Smart knit gloves with conductive yarn technology for touchscreen compatibility. Made from 200gsm acrylic blend, these gloves keep your hands warm while allowing you to use smartphones and tablets without removing them.",
    category: "gloves",
    images: ["/images/product-gloves.jpg"],
    specs: [
      { label: "Weight", value: "200 gsm" },
      { label: "Fabric", value: "95% Acrylic, 5% Conductive Yarn" },
      { label: "Sizes", value: "S / M / L" },
      { label: "Colors", value: "6+ colors available" },
      { label: "MOQ", value: "500 pairs" },
    ],
    featured: false,
  },

  // ===== Socks =====
  {
    id: "15",
    slug: "crew-knit-socks",
    title: "Crew Knit Socks",
    description: "Comfortable crew-length knit socks made from a soft cotton-polyester-spandex blend. Features reinforced heel and toe for durability, with a cushioned sole for all-day comfort. Available in 12+ colors for men and women.",
    category: "socks",
    images: ["/images/product-socks.jpg"],
    specs: [
      { label: "Length", value: "Crew (15 cm)" },
      { label: "Fabric", value: "80% Cotton, 18% Polyester, 2% Spandex" },
      { label: "Sizes", value: "One Size (Men/Women)" },
      { label: "Colors", value: "12+ colors available" },
      { label: "MOQ", value: "1000 pairs" },
    ],
    featured: true,
  },
  {
    id: "16",
    slug: "wool-knit-socks",
    title: "Wool Knit Socks",
    description: "Premium knee-high wool knit socks offering natural warmth and moisture management. The wool-nylon-spandex blend provides durability, fit retention, and comfort. Perfect for cold weather, outdoor activities, and winter fashion.",
    category: "socks",
    images: ["/images/product-socks.jpg"],
    specs: [
      { label: "Length", value: "Knee High (35 cm)" },
      { label: "Fabric", value: "60% Wool, 30% Nylon, 10% Spandex" },
      { label: "Sizes", value: "S / M / L" },
      { label: "Colors", value: "8+ colors available" },
      { label: "MOQ", value: "500 pairs" },
    ],
    featured: true,
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
