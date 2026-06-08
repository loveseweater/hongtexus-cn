import { getTranslations } from "next-intl/server";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { products, categories } from "@/lib/data/products";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: "products" });

  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

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
                {cat.slug.replace("-", " ")}
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
