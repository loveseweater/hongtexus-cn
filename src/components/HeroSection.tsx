"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const defaultHero = {
  heroTitle: "Premium Textile Solutions for Global Markets",
  heroSubtitle: "From raw fabrics to finished products — Hongtexus delivers quality textiles tailored to your business needs.",
};

export default function HeroSection({ locale }: { locale: string }) {
  const [hero, setHero] = useState(defaultHero);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.heroTitle) {
          setHero({
            heroTitle: data.heroTitle,
            heroSubtitle: data.heroSubtitle || defaultHero.heroSubtitle,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(200,169,110,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="container-custom relative py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {hero.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            {hero.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/products`}
              className="btn-accent text-base"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
