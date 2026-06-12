export const runtime = "edge";

import { getStore } from "@/lib/kv";

const SETTINGS_KEY = "site_settings";
const SUBSCRIBERS_KEY = "subscribers";

export async function POST(request: Request) {
  try {
    const { type, title, slug, excerpt } = await request.json();
    const store = getStore();

    // Get settings for email config
    const settings = await store.get(SETTINGS_KEY);
    const emailService = settings?.emailService;

    if (!emailService?.provider || !emailService?.apiKey) {
      return Response.json({ success: false, message: "邮件服务未配置" });
    }

    // Get subscribers
    const subscribers = await store.get(SUBSCRIBERS_KEY);
    if (!subscribers || subscribers.length === 0) {
      return Response.json({ success: false, message: "暂无订阅用户" });
    }

    const siteUrl = "https://hongtexus.cn";
    const typeLabel = type === "product" ? "新产品" : "新博客文章";
    const url = type === "product"
      ? `${siteUrl}/en/products`
      : `${siteUrl}/en/blog/${slug}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 30px; text-align: center;">
          <h1 style="color: #c8a96e; margin: 0; font-size: 24px;">HONGTEX</h1>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #1a1a2e; margin-top: 0;">${typeLabel}更新</h2>
          <h3 style="color: #333;">${title}</h3>
          ${excerpt ? `<p style="color: #666; line-height: 1.6;">${excerpt}</p>` : ""}
          <div style="margin: 30px 0;">
            <a href="${url}" style="background: #c8a96e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              查看详情
            </a>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            您收到此邮件是因为您订阅了 HONGTEX 的更新通知。<br>
            如果您不想再收到此类邮件，请回复告知我们。
          </p>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
          &copy; ${new Date().getFullYear()} HONGTEX. All rights reserved.
        </div>
      </div>
    `;

    const textContent = `${typeLabel}更新\n\n${title}\n\n${excerpt || ""}\n\n查看详情: ${url}`;

    // Send via configured provider
    const results: any[] = [];
    const batchSize = 50;
    const emailList = subscribers.map((s: any) => s.email);

    for (let i = 0; i < emailList.length; i += batchSize) {
      const batch = emailList.slice(i, i + batchSize);

      if (emailService.provider === "resend") {
        for (const email of batch) {
          try {
            const res = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${emailService.apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: `${emailService.fromName || "HONGTEX"} <${emailService.fromEmail || "info@hongtexus.cn"}>`,
                to: email,
                subject: `[HONGTEX] ${typeLabel}: ${title}`,
                html: htmlContent,
                text: textContent,
              }),
            });
            const result = await res.json();
            results.push({ email, status: res.ok ? "sent" : "failed", error: result });
          } catch (err: any) {
            results.push({ email, status: "failed", error: err.message });
          }
        }
      } else if (emailService.provider === "sendgrid") {
        try {
          const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${emailService.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              personalizations: batch.map((email: string) => ({ to: [{ email }] })),
              from: { email: emailService.fromEmail || "info@hongtexus.cn", name: emailService.fromName || "HONGTEX" },
              subject: `[HONGTEX] ${typeLabel}: ${title}`,
              content: [
                { type: "text/plain", value: textContent },
                { type: "text/html", value: htmlContent },
              ],
            }),
          });
          results.push({ batch, status: res.ok ? "sent" : "failed" });
        } catch (err: any) {
          results.push({ batch, status: "failed", error: err.message });
        }
      } else {
        results.push({ error: `不支持的邮件服务商: ${emailService.provider}` });
      }
    }

    const sentCount = results.filter((r: any) => r.status === "sent").length;

    return Response.json({
      success: true,
      sent: sentCount,
      total: emailList.length,
      results,
    });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
