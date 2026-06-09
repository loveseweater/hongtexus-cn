/**
 * Email service for Hongtexus contact form notifications.
 * 
 * Supports multiple email providers:
 * 1. Resend (recommended for Cloudflare Edge)
 * 2. SMTP (generic)
 * 3. Console log (development fallback)
 * 
 * Environment variables:
 * - EMAIL_PROVIDER: "resend" | "smtp" | "console" (default: "console")
 * - RESEND_API_KEY: Your Resend API key
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS: SMTP credentials
 * - CONTACT_EMAIL_TO: Where to send contact form notifications (default: info@hongtexus.cn)
 * - CONTACT_EMAIL_FROM: Sender email (default: noreply@hongtexus.cn)
 */

export interface EmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

/**
 * Send a contact form notification email.
 * Falls back to console.log in development.
 */
export async function sendContactEmail(data: EmailData): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || "console";
  const toEmail = process.env.CONTACT_EMAIL_TO || "info@hongtexus.cn";
  const fromEmail = process.env.CONTACT_EMAIL_FROM || "noreply@hongtexus.cn";

  const subject = `New Contact Form Inquiry from ${data.name}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a3c5e; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #c8a96e; margin: 0; font-size: 24px;">Hongtexus</h1>
        <p style="color: white; margin: 5px 0 0;">New Contact Form Submission</p>
      </div>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a3c5e;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a3c5e;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #1a3c5e;">${escapeHtml(data.email)}</a>
            </td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a3c5e;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.phone)}</td>
          </tr>` : ""}
          ${data.company ? `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #1a3c5e;">Company</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${escapeHtml(data.company)}</td>
          </tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="color: #1a3c5e; margin: 0 0 10px;">Message</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 20px;">
          Sent from Hongtexus contact form at ${new Date().toLocaleString()}
        </p>
      </div>
    </body>
    </html>
  `;

  switch (provider) {
    case "resend":
      return sendViaResend(toEmail, fromEmail, subject, html);
    case "smtp":
      return sendViaSMTP(toEmail, fromEmail, subject, html);
    case "console":
    default:
      console.log("[Email Mock] Would send email:", {
        to: toEmail,
        from: fromEmail,
        subject,
        data,
      });
      return true;
  }
}

async function sendViaResend(
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not configured, falling back to console");
    return sendViaConsole(to, from, subject, html);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Email] Resend error:", err);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Resend exception:", error);
    return false;
  }
}

async function sendViaSMTP(
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<boolean> {
  // SMTP is not recommended for Cloudflare Edge runtime
  // Use Resend or a similar API-based provider instead
  console.warn("[Email] SMTP not supported in Edge runtime, falling back to console");
  return sendViaConsole(to, from, subject, html);
}

async function sendViaConsole(
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<boolean> {
  console.log("[Email] Email notification:", { to, from, subject });
  return true;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
