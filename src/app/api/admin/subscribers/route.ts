export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getSubscribers } from "@/lib/kv";

export async function GET() {
  try {
    const subscribers = await getSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Get subscribers error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
