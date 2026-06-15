export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { categories } from "@/lib/data/products";
import { getLocalizedProducts } from "@/lib/localized-data";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return {
    title: `${t("title")} — Hongtexus`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://hongtexus.cn/${locale}/products`,
    },
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: "products" });

  const allProducts = await getLocalizedProducts(locale);
  const filteredProducts = category
    ? allProducts.filter((p: any) => p.category === category)
    : allProducts;

  return (
    <>
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

      <section className="border-b border-border bg-bg-alt">
        <div className="container-custom overflow-x-auto">
          <div className="flex gap-2 py-4">
            <Link
              href={`/${locale}/products`}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !category
                  ? "bg-primary text-white"
                  : "bg-white text-text-muted hover:bg-white/80"
              }`}
            >
              {t("all")}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/products?category=${cat.slug}`}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium capitalize transition-colors ${
                  category === cat.slug
                    ? "bg-primary text-white"
                    : "bg-white text-text-muted hover:bg-white/80"
                }`}
              >
                {t(`categories.${cat.slug}`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="group card overflow-hidden p-0"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-bg-alt">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-accent">
                      {t(`categories.${product.category}`)}
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold text-primary group-hover:text-primary-light">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-xs text-text-muted">
                      {product.specs[0]?.value} &middot; {product.specs[1]?.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-text-muted">{t("noProducts")}</p>
              <Link href={`/${locale}/products`} className="btn-primary mt-6 inline-flex">
                {t("all")}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
