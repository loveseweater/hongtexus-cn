export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { saveSubmission } from "@/lib/kv";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Save to KV store
    await saveSubmission({
      name,
      email,
      phone: phone || "",
      company: company || "",
      message,
    });

    // Send email notification (non-blocking)
    sendContactEmail({
      name,
      email,
      phone: phone || "",
      company: company || "",
      message,
    }).catch((err) => {
      console.error("[Contact] Email notification failed:", err);
    });

    console.log("[Contact] Form submission saved:", {
      name,
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Message received" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact] Form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
