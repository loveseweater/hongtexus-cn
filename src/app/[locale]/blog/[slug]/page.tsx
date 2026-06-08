import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/data/blog";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="border-b border-border bg-bg-alt">
        <div className="container-custom flex items-center gap-2 py-4 text-sm text-text-muted">
          <Link href={`/${locale}`} className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href={`/${locale}/blog`} className="hover:text-primary">
            {t("title")}
          </Link>
          <span>/</span>
          <span className="text-primary capitalize">
            {post.slug.replace(/-/g, " ")}
          </span>
        </div>
      </section>

      <article className="section-padding">
        <div className="container-custom">
          <Link
            href={`/${locale}/blog`}
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary"
          >
            <ArrowLeft size={16} />
            {t("backToBlog")}
          </Link>

          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {post.date}
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-primary capitalize md:text-4xl">
                {post.slug.replace(/-/g, " ")}
              </h1>
            </div>

            <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-6xl font-bold text-primary/10">
                  {post.slug.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-lg leading-relaxed text-text-muted">
                This is a sample blog post about {post.slug.replace(/-/g, " ")}. 
                In a production environment, this content would be managed through 
                a CMS or Markdown files with full article content including images, 
                headings, and rich text formatting.
              </p>

              <h2 className="mt-10 font-display text-2xl font-bold text-primary">
                Introduction
              </h2>
              <p className="mt-4 leading-relaxed text-text-muted">
                The textile industry continues to evolve rapidly, with new technologies 
                and sustainable practices shaping the future of fabric manufacturing. 
                At Hongtexus, we stay at the forefront of these developments to provide 
                our clients with the best possible products and services.
              </p>

              <h2 className="mt-8 font-display text-2xl font-bold text-primary">
                Key Insights
              </h2>
              <p className="mt-4 leading-relaxed text-text-muted">
                Understanding market trends and consumer preferences is essential for 
                making informed decisions in textile sourcing. Our team of experts 
                continuously monitors industry developments to bring you the most 
                relevant and up-to-date information.
              </p>

              <div className="mt-8 rounded-xl border border-border bg-bg-alt p-6">
                <h3 className="font-display text-lg font-semibold text-primary">
                  Key Takeaways
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Stay informed about the latest industry trends and innovations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Quality control remains a critical factor in textile manufacturing
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    Sustainable practices are becoming increasingly important
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
