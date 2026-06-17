export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { Users, MessageCircle, Globe, Star, ArrowRight, Linkedin, Mail, CheckCircle } from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community" });
  return {
    title: `${t("title")} — Hongtexus`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://hongtexus.cn/${locale}/community`,
    },
  };
}

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "community" });

  const benefits = [
    { icon: Users, title: t("benefits.network.title"), desc: t("benefits.network.desc") },
    { icon: MessageCircle, title: t("benefits.discussion.title"), desc: t("benefits.discussion.desc") },
    { icon: Globe, title: t("benefits.sourcing.title"), desc: t("benefits.sourcing.desc") },
    { icon: Star, title: t("benefits.insights.title"), desc: t("benefits.insights.desc") },
  ];

  const topics = [
    t("topics.0"),
    t("topics.1"),
    t("topics.2"),
    t("topics.3"),
    t("topics.4"),
    t("topics.5"),
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
        <div className="absolute inset-0 bg-[url('/images/community-cover.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative container-custom py-20 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/30 bg-white/10 shadow-xl backdrop-blur-sm">
            <img src="/images/community-avatar.jpg" alt="KnitConnect" className="h-20 w-20 rounded-full object-cover" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold text-white md:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-200">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#join" className="btn-accent inline-flex items-center gap-2 text-base">
              {t("joinButton")} <ArrowRight size={18} />
            </a>
            <a href="#about" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10">
              {t("learnMore")}
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="section-padding">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTitle title={t("aboutTitle")} />
            <p className="mt-6 leading-relaxed text-text-muted">
              {t("aboutP1")}
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              {t("aboutP2")}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-bg-alt">
        <div className="container-custom">
          <SectionTitle title={t("benefitsTitle")} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="card group text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <b.icon size={28} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-primary">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle title={t("topicsTitle")} />
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-white p-5">
                  <CheckCircle size={20} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-sm text-text-muted">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "500+", label: t("stats.members") },
              { value: "50+", label: t("stats.countries") },
              { value: "200+", label: t("stats.companies") },
              { value: "1000+", label: t("stats.posts") },
            ].map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <div className="font-display text-4xl font-bold md:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join */}
      <section id="join" className="section-padding bg-bg-alt">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 text-center shadow-lg md:p-12">
            <Users size={40} className="mx-auto text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold text-primary">{t("joinTitle")}</h2>
            <p className="mt-3 text-sm text-text-muted">{t("joinDesc")}</p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a href="https://www.linkedin.com/groups/" target="_blank" rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2">
                <Linkedin size={18} /> {t("joinLinkedin")}
              </a>
              <a href="mailto:community@hongtexus.cn"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-text transition-all hover:bg-bg-alt">
                <Mail size={18} /> {t("joinEmail")}
              </a>
            </div>
            <p className="mt-6 text-xs text-text-muted">{t("joinNote")}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary text-center text-white">
        <div className="container-custom">
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t("cta.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-200">{t("cta.subtitle")}</p>
          <Link href={`/${locale}/contact`} className="btn-accent mt-8 inline-flex text-base">
            {t("cta.button")} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
