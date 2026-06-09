export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getProducts, getBlogPosts, getSubmissions } from "@/lib/kv";

export async function GET(request: NextRequest) {
  try {
    const [products, blogPosts, submissions] = await Promise.all([
      getProducts(),
      getBlogPosts(),
      getSubmissions(),
    ]);

    return NextResponse.json({
      products: Array.isArray(products) ? products.length : 0,
      blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
      messages: Array.isArray(submissions) ? submissions.length : 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { products: 0, blogPosts: 0, messages: 0 },
      { status: 200 }
    );
  }
}
