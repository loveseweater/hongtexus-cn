export const runtime = "edge";

import { getStore } from "@/lib/kv";

const CATEGORIES_KEY = "product_categories";

const defaultCategories = [
  { id: "knit-fabrics", name: "Knit Fabrics", slug: "knit-fabrics", image: "/images/product-knit-fabric.jpg", parentId: null },
  { id: "t-shirts", name: "T-Shirts", slug: "t-shirts", image: "/images/product-tshirt.jpg", parentId: null },
  { id: "hoodies", name: "Hoodies", slug: "hoodies", image: "/images/product-hoodie.jpg", parentId: null },
  { id: "leg-warmers", name: "Leg Warmers", slug: "leg-warmers", image: "/images/product-legwarmers.jpg", parentId: null },
  { id: "hats", name: "Hats", slug: "hats", image: "/images/product-hat.jpg", parentId: null },
  { id: "gloves", name: "Gloves", slug: "gloves", image: "/images/product-gloves.jpg", parentId: null },
  { id: "socks", name: "Socks", slug: "socks", image: "/images/product-socks.jpg", parentId: null },
];

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  parentId: string | null;
}

export async function GET() {
  try {
    const store = getStore();
    const categories = await store.get(CATEGORIES_KEY);
    return Response.json(categories || defaultCategories);
  } catch (error) {
    return Response.json(defaultCategories);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const store = getStore();
    const categories = (await store.get(CATEGORIES_KEY)) || defaultCategories;
    const newCategory: ProductCategory = {
      id: Date.now().toString(),
      name: body.name,
      slug: body.slug,
      image: body.image || "",
      parentId: body.parentId || null,
    };
    categories.push(newCategory);
    await store.put(CATEGORIES_KEY, categories);
    return Response.json({ success: true, category: newCategory });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const store = getStore();
    const categories = (await store.get(CATEGORIES_KEY)) || defaultCategories;
    const index = categories.findIndex((c: ProductCategory) => c.id === body.id);
    if (index === -1) {
      return Response.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    categories[index] = { ...categories[index], ...body };
    await store.put(CATEGORIES_KEY, categories);
    return Response.json({ success: true, category: categories[index] });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const store = getStore();
    const categories = (await store.get(CATEGORIES_KEY)) || defaultCategories;
    const filtered = categories.filter((c: ProductCategory) => c.id !== id);
    await store.put(CATEGORIES_KEY, filtered);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
