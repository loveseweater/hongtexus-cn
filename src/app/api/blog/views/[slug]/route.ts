export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getBlogView, incrementBlogView } from "@/lib/kv";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const views = await getBlogView(slug);
    return NextResponse.json({ slug, views });
  } catch (error) {
    console.error("Get blog views error:", error);
    return NextResponse.json({ error: "Failed to get views" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;
    const views = await incrementBlogView(slug);
    return NextResponse.json({ slug, views });
  } catch (error) {
    console.error("Increment blog views error:", error);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
