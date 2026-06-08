import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { getProductBySlug, getProductsByCategory } from "@/lib/data/products";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getProductsByCategory(product.category).filter(
    (p) => p.id !== product.id
  );

  return (
    <>
      <section className="border-b border-border bg-bg-alt">
        <div className="container-custom flex items-center gap-2 py-4 text-sm text-text-muted">
          <Link href={`/${locale}`} className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-primary">
            {t("title")}
          </Link>
          <span>/</span>
          <span className="text-primary capitalize">
            {product.slug.replace(/-/g, " ")}
          </span>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <Link
            href={`/${locale}/products`}
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary"
          >
            <ArrowLeft size={16} />
            {t("title")}
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-8xl font-bold text-primary/10">
                  {product.slug.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm font-medium uppercase tracking-wider text-accent">
                {product.category.replace("-", " ")}
              </span>
              <h1 className="mt-2 font-display text-3xl font-bold text-primary capitalize md:text-4xl">
                {product.slug.replace(/-/g, " ")}
              </h1>

              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-primary">
                  {t("specs")}
                </h3>
                <div className="mt-4 divide-y divide-border rounded-xl border border-border">
                  {product.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-center justify-between px-5 py-3"
                    >
                      <span className="text-sm font-medium text-text-muted">
                        {spec.label}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Premium quality materials",
                  "International standards compliant",
                  "Custom specifications available",
                  "Fast worldwide shipping",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle size={18} className="shrink-0 text-accent" />
                    <span className="text-sm text-text-muted">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/${locale}/contact`}
                className="btn-primary mt-8 inline-flex"
              >
                {t("inquiry")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-padding bg-bg-alt">
          <div className="container-custom">
            <h2 className="section-title">{t("related")}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.slice(0, 3).map((rp) => (
                <Link
                  key={rp.id}
                  href={`/${locale}/products/${rp.slug}`}
                  className="group card overflow-hidden p-0"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-4xl font-bold text-primary/10">
                        {rp.slug.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-semibold text-primary capitalize group-hover:text-primary-light">
                      {rp.slug.replace(/-/g, " ")}
                    </h3>
                    <p className="mt-1 text-xs text-text-muted">
                      {rp.specs[0]?.value}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
