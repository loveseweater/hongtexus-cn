export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { saveSubscriber } from "@/lib/kv";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, message: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    const result = await saveSubscriber(email);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { success: false, message: "订阅失败，请稍后重试" },
      { status: 500 }
    );
  }
}
