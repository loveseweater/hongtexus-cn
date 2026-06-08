"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

// @ts-ignore - params unused but required by Next.js convention

type Props = {
  params: Promise<{ locale: string }>;
};

export default function ContactPage() {
  const t = useTranslations("contact");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Send size={28} className="text-green-600" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-green-800">
                    {t("form.success")}
                  </h3>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-primary mt-6"
                  >
                    {t("form.submit")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-text">
                        {t("form.name")} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t("form.name")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text">
                        {t("form.email")} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t("form.email")}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-text">
                        {t("form.phone")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t("form.phone")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text">
                        {t("form.company")}
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formState.company}
                        onChange={handleChange}
                        className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder={t("form.company")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text">
                      {t("form.message")} *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      className="mt-1.5 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder={t("form.placeholder")}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500">{t("form.error")}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? "Sending..." : t("form.submit")}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-primary">
                {t("info.title")}
              </h2>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{t("info.address")}</h4>
                    <p className="mt-1 text-sm text-text-muted">
                      Dongguan, Guangdong, China
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{t("info.phone")}</h4>
                    <p className="mt-1 text-sm text-text-muted">
                      +86-769-8888-8888
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{t("info.email")}</h4>
                    <p className="mt-1 text-sm text-text-muted">
                      info@hongtexus.cn
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{t("info.hours")}</h4>
                    <p className="mt-1 text-sm text-text-muted">
                      {t("info.hoursValue")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-10 aspect-[16/9] rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto text-accent" />
                    <p className="mt-2 text-sm text-text-muted">
                      Dongguan, Guangdong, China
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
