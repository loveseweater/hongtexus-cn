export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getSubmissions, saveSubmissions } from "@/lib/kv";

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Submission ID required" }, { status: 400 });
    }

    const submissions = await getSubmissions();
    const filtered = submissions.filter((s: any) => s.id !== id);
    await saveSubmissions(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete submission error:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
