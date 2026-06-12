"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Mail, CheckCircle } from "lucide-react";

export default function SubscribePopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const locale = pathname?.split("/")[1] || "en";
  const isZh = locale === "zh";

  useEffect(() => {
    // Check if user has already subscribed or dismissed
    const dismissed = localStorage.getItem("subscribe_dismissed");
    const subscribed = localStorage.getItem("subscribe_subscribed");
    if (dismissed || subscribed) return;

    // Show popup after 3 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("subscribe_dismissed", "true");
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(isZh ? "感谢订阅！我们会及时向您发送最新资讯。" : "Thank you! You'll receive the latest updates from us.");
        localStorage.setItem("subscribe_subscribed", "true");
        setTimeout(() => setVisible(false), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || (isZh ? "订阅失败，请重试。" : "Subscription failed, please try again."));
      }
    } catch {
      setStatus("error");
      setMessage(isZh ? "网络错误，请稍后重试。" : "Network error, please try again later.");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-alt hover:text-text"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail size={32} className="text-primary" />
        </div>

        {/* Title */}
        <h3 className="mt-5 text-center font-display text-xl font-bold text-primary">
          {isZh ? "订阅我们的资讯" : "Stay Updated"}
        </h3>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
          {isZh
            ? "获取最新的产品信息、行业趋势和独家优惠，第一时间送达您的邮箱。"
            : "Get the latest products, industry trends and exclusive offers delivered to your inbox."}
        </p>

        {status === "success" ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl bg-green-50 p-4">
            <CheckCircle size={32} className="text-green-500" />
            <p className="text-sm font-medium text-green-700">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isZh ? "请输入您的邮箱地址" : "Enter your email address"}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light disabled:opacity-50"
            >
              {status === "loading"
                ? (isZh ? "提交中..." : "Submitting...")
                : (isZh ? "立即订阅" : "Subscribe Now")}
            </button>
            {status === "error" && (
              <p className="text-center text-sm text-red-500">{message}</p>
            )}
            <p className="text-center text-xs text-text-muted">
              {isZh ? "我们尊重您的隐私，随时可以退订。" : "We respect your privacy. Unsubscribe anytime."}
            </p>
          </form>
        )}

        {/* Skip link */}
        {status !== "success" && (
          <button
            onClick={handleDismiss}
            className="mt-4 block w-full text-center text-xs text-text-muted hover:text-text"
          >
            {isZh ? "暂时不需要" : "Not now"}
          </button>
        )}
      </div>
    </div>
  );
}
