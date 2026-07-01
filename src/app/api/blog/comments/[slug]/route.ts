export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getBlogComments, addBlogComment } from "@/lib/kv";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const comments = await getBlogComments(slug);
    return NextResponse.json({ slug, comments });
  } catch (error) {
    console.error("Get blog comments error:", error);
    return NextResponse.json({ error: "Failed to get comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!body.name || !body.content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    if (body.name.length > 50 || body.content.length > 1000) {
      return NextResponse.json({ error: "Name or content too long" }, { status: 400 });
    }

    const comment = await addBlogComment(slug, {
      name: body.name.trim(),
      content: body.content.trim(),
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Add blog comment error:", error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
