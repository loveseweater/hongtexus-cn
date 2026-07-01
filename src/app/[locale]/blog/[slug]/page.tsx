export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Eye, Tag } from "lucide-react";
import { getLocalizedBlogPostBySlug } from "@/lib/localized-data";
import { getBlogView } from "@/lib/kv";
import ViewTracker from "@/components/ViewTracker";
import CommentSection from "@/components/CommentSection";
import type { Metadata } from "next";
import type { ReactNode } from "react";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getLocalizedBlogPostBySlug(locale, slug);
  if (!post) {
    return { title: "Post Not Found — Hongtexus" };
  }
  return {
    title: `${post.title} — Hongtexus Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://hongtexus.cn/${locale}/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const nt = await getTranslations({ locale, namespace: "nav" });

  const post = await getLocalizedBlogPostBySlug(locale, slug);
  const views = await getBlogView(slug);

  if (!post) {
    notFound();
  }

  // Render markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: ReactNode[] = [];
    let key = 0;
    let inList = false;
    const listItems: ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={key++} className="mt-4 space-y-2">
            {listItems}
          </ul>
        );
        listItems.length = 0;
        inList = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={key++} className="mt-10 font-display text-2xl font-bold text-primary">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={key++} className="mt-6 font-display text-xl font-semibold text-primary">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- **")) {
        inList = true;
        const match = line.match(/- \*\*(.+?)\*\*(.*)/);
        if (match) {
          listItems.push(
            <li key={`li-${key++}`} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span className="text-text-muted">
                <strong className="text-primary">{match[1]}</strong>
                {match[2]}
              </span>
            </li>
          );
        }
      } else if (line.startsWith("- ")) {
        inList = true;
        listItems.push(
          <li key={`li-${key++}`} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-text-muted">{line.replace("- ", "")}</span>
          </li>
        );
      } else if (line.match(/^\d+\.\s/)) {
        inList = true;
        listItems.push(
          <li key={`li-${key++}`} className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span className="text-text-muted">{line.replace(/^\d+\.\s/, "")}</span>
          </li>
        );
      } else if (line.trim() === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={key++} className="mt-4 leading-relaxed text-text-muted">
            {line}
          </p>
        );
      }
    }
    flushList();
    return elements;
  };

  return (
    <>
      <section className="border-b border-border bg-bg-alt">
        <div className="container-custom flex items-center gap-2 py-4 text-sm text-text-muted">
          <Link href={`/${locale}`} className="hover:text-primary">
            {nt("home")}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/blog`} className="hover:text-primary">
            {t("title")}
          </Link>
          <span>/</span>
          <span className="text-primary">{post.title}</span>
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
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Eye size={14} />
                  <span>{(views || 0).toLocaleString()} views</span>
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold text-primary md:text-4xl">
                {post.title}
              </h1>
            </div>

            <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-bg-alt">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-10">
              {renderContent(post.content)}
            </div>

            <ViewTracker slug={post.slug} />

            <CommentSection slug={post.slug} />
          </div>
        </div>
      </article>
    </>
  );
}
