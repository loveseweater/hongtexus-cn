"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { X, Mail, CheckCircle } from "lucide-react";

export default function SubscribePopup() {
  const pathname = usePathname();
  const t = useTranslations("footer");
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const dismissed = localStorage.getItem("subscribe_dismissed");
    const subscribed = localStorage.getItem("subscribe_subscribed");
    if (dismissed || subscribed) return;

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
        setMessage(t("newsletterPopupSuccess"));
        localStorage.setItem("subscribe_subscribed", "true");
        setTimeout(() => setVisible(false), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || t("newsletterPopupError"));
      }
    } catch {
      setStatus("error");
      setMessage(t("newsletterPopupNetworkError"));
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-alt hover:text-text"
        >
          <X size={20} />
        </button>

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail size={32} className="text-primary" />
        </div>

        <h3 className="mt-5 text-center font-display text-xl font-bold text-primary">
          {t("newsletterPopupTitle")}
        </h3>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">
          {t("newsletterPopupDesc")}
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
                placeholder={t("newsletterPlaceholder")}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={status === "loading"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-light disabled:opacity-50"
            >
              {status === "loading" ? "..." : t("newsletterPopupButton")}
            </button>
            {status === "error" && (
              <p className="text-center text-sm text-red-500">{message}</p>
            )}
            <p className="text-center text-xs text-text-muted">
              {t("newsletterPopupPrivacy")}
            </p>
          </form>
        )}

        {status !== "success" && (
          <button
            onClick={handleDismiss}
            className="mt-4 block w-full text-center text-xs text-text-muted hover:text-text"
          >
            {t("newsletterNotNow")}
          </button>
        )}
      </div>
    </div>
  );
}
