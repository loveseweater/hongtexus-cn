export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { categories, getFeaturedProducts } from "@/lib/data/products";
import { blogPosts } from "@/lib/data/blog";
import {
  ShieldCheck,
  Truck,
  Settings2,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: "HONGTEX — Premium Knitwear & Textile Solutions",
    description: t("hero.subtitle"),
    openGraph: {
      title: "HONGTEX — Premium Knitwear & Textile Solutions",
      description: t("hero.subtitle"),
      url: `https://hongtexus.cn/${locale}`,
      siteName: "Hongtexus",
      locale: locale === "zh" ? "zh_CN" : locale === "es" ? "es_ES" : locale === "fr" ? "fr_FR" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: `https://hongtexus.cn/${locale}`,
      languages: {
        en: "https://hongtexus.cn/en",
        zh: "https://hongtexus.cn/zh",
        es: "https://hongtexus.cn/es",
        fr: "https://hongtexus.cn/fr",
        de: "https://hongtexus.cn/de",
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const c = await getTranslations({ locale, namespace: "common" });

  const featuredProducts = getFeaturedProducts();
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <>
      {/* ===== Hero Section ===== */}
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
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
              {t("hero.subtitle")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/products`}
                className="btn-accent text-base"
              >
                {t("hero.cta")}
                <ArrowRight size={18} />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 text-base font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ===== Categories Section ===== */}
      <section className="section-padding bg-bg-alt">
        <div className="container-custom">
          <SectionTitle
            title={t("categories.title")}
            subtitle={t("categories.subtitle")}
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mb-3 text-4xl font-display font-bold text-primary/20">
                        {cat.slug.split("-")[0].charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-primary capitalize">
                    {cat.slug.replace("-", " ")}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted capitalize">
                    {cat.slug.split("-")[0]} textiles
                  </p>
                </div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle title={t("features.title")} />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: t("features.quality.title"),
                desc: t("features.quality.desc"),
              },
              {
                icon: Truck,
                title: t("features.delivery.title"),
                desc: t("features.delivery.desc"),
              },
              {
                icon: Settings2,
                title: t("features.customization.title"),
                desc: t("features.customization.desc"),
              },
              {
                icon: BarChart3,
                title: t("features.experience.title"),
                desc: t("features.experience.desc"),
              },
            ].map((feature) => (
              <div key={feature.title} className="card group text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <feature.icon size={28} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-primary">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products Section ===== */}
      <section className="section-padding bg-bg-alt">
        <div className="container-custom">
          <SectionTitle
            title={t("featured.title")}
            subtitle={t("featured.subtitle")}
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${locale}/products/${product.slug}`}
                className="group card overflow-hidden p-0"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-5xl font-bold text-primary/10">
                      {product.slug.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-accent">
                    {product.category.replace("-", " ")}
                  </span>
                  <h3 className="mt-1 font-display text-base font-semibold text-primary capitalize group-hover:text-primary-light">
                    {product.slug.replace(/-/g, " ")}
                  </h3>
                  <p className="mt-2 text-xs text-text-muted">
                    {product.specs[0]?.value} &middot; {product.specs[1]?.value}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href={`/${locale}/products`} className="btn-outline">
              {c("viewAll")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== About Summary ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="section-title">{t("about.title")}</h2>
              <p className="mt-6 leading-relaxed text-text-muted">
                {t("about.desc")}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6">
                {[
                  { value: "15+", label: t("about.stats.years") },
                  { value: "500+", label: t("about.stats.clients") },
                  { value: "2000+", label: t("about.stats.products") },
                  { value: "50+", label: t("about.stats.countries") },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="font-display text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-text-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href={`/${locale}/about`}
                className="btn-primary mt-8 inline-flex"
              >
                {t("about.cta")}
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-8xl font-bold text-primary/10">
                      H
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-accent/30" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Blog Preview ===== */}
      <section className="section-padding bg-bg-alt">
        <div className="container-custom">
          <SectionTitle
            title={t("blog.title")}
            subtitle={t("blog.subtitle")}
          />

          <div className="grid gap-8 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group card overflow-hidden p-0"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-3xl font-bold text-primary/10">
                      {post.slug.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{post.date}</span>
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                      {post.tags[0]}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold text-primary capitalize group-hover:text-primary-light">
                    {post.slug.replace(/-/g, " ")}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted line-clamp-2">
                    {c("learnMore")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href={`/${locale}/blog`} className="btn-outline">
              {t("blog.cta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="section-padding relative overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(200,169,110,0.4) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="container-custom relative text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-200">
            {t("cta.subtitle")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-accent mt-8 inline-flex text-base"
          >
            {t("cta.button")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
