export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, saveBlogPosts } from "@/lib/kv";

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Get blog posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const posts = await getBlogPosts();

    const newPost = {
      ...body,
      id: Date.now().toString(),
      tags: body.tags || [],
      translations: body.translations || {}, // KV multi-language support
    };

    posts.push(newPost);
    await saveBlogPosts(posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Create blog post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const posts = await getBlogPosts();

    const index = posts.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    posts[index] = { ...posts[index], ...updates };
    await saveBlogPosts(posts);

    return NextResponse.json(posts[index]);
  } catch (error) {
    console.error("Update blog post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const posts = await getBlogPosts();
    const filtered = posts.filter((p: any) => p.id !== id);
    await saveBlogPosts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
