import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { blogPosts } from "@/lib/data/blog";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

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

      <section className="section-padding">
        <div className="container-custom">
          {blogPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group card overflow-hidden p-0"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-4xl font-bold text-primary/10">
                        {post.slug.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{post.date}</span>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent/10 px-2 py-0.5 text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-primary capitalize group-hover:text-primary-light">
                      {post.slug.replace(/-/g, " ")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-3">
                      Industry insights and updates from Hongtexus team.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      {t("readMore")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-text-muted">{t("noPosts")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
