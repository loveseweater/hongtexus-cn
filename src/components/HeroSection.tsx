"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

const defaultImages = [
  "/images/product-knit-fabric.jpg",
  "/images/product-tshirt.jpg",
  "/images/product-hoodie.jpg",
  "/images/product-gloves.jpg",
  "/images/product-hat.jpg",
  "/images/product-socks.jpg",
  "/images/product-legwarmers.jpg",
];

export default function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations("home.hero");
  const [heroImages, setHeroImages] = useState(defaultImages);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.heroImages && Array.isArray(data.heroImages) && data.heroImages.length > 0) {
          setHeroImages(data.heroImages);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-rotate background images
  useEffect(() => {
    if (heroImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  if (heroImages.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Background image carousel */}
      {heroImages.map((img, index) => (
        <div
          key={img + index}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: index === currentImage ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60" />

      {/* Decorative gradient accents */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(200,169,110,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Carousel dots */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImage
                  ? "w-8 bg-accent"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="container-custom relative py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            {t("subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/products`}
              className="btn-accent text-base"
            >
              {t("cta")}
              <ArrowRight size={18} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
