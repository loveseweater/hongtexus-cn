export const runtime = "edge";

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import { ArrowRight, ShieldCheck, Heart, Lightbulb, Leaf } from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} — Hongtexus`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://hongtexus.cn/${locale}/about`,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  const timeline = [
    { year: "2010", event: t("timeline.events.2010") },
    { year: "2013", event: t("timeline.events.2013") },
    { year: "2016", event: t("timeline.events.2016") },
    { year: "2019", event: t("timeline.events.2019") },
    { year: "2022", event: t("timeline.events.2022") },
    { year: "2025", event: t("timeline.events.2025") },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: t("values.quality"),
      desc: t("values.qualityDesc"),
    },
    {
      icon: Heart,
      title: t("values.integrity"),
      desc: t("values.integrityDesc"),
    },
    {
      icon: Lightbulb,
      title: t("values.innovation"),
      desc: t("values.innovationDesc"),
    },
    {
      icon: Leaf,
      title: t("values.sustainability"),
      desc: t("values.sustainabilityDesc"),
    },
  ];

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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title">{t("story.title")}</h2>
            <p className="mt-6 leading-relaxed text-text-muted">
              {t("story.p1")}
            </p>
            <p className="mt-4 leading-relaxed text-text-muted">
              {t("story.p2")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "15+", label: t("stats.years") },
              { value: "500+", label: t("stats.clients") },
              { value: "2000+", label: t("stats.products") },
              { value: "50+", label: t("stats.countries") },
            ].map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <div className="font-display text-4xl font-bold md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg-alt">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-title">{t("mission.title")}</h2>
            <p className="mt-6 text-lg leading-relaxed text-text-muted">
              {t("mission.desc")}
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionTitle title={t("values.title")} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card group text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <v.icon size={28} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-primary">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-bg-alt">
        <div className="container-custom">
          <SectionTitle title={t("timeline.title")} />
          <div className="mx-auto max-w-3xl">
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-primary/20 md:left-1/2 md:-translate-x-px" />
              <div className="space-y-12">
                {timeline.map((item, i) => (
                  <div
                    key={item.year}
                    className={`relative flex items-start gap-6 md:gap-12 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-white md:left-1/2" />
                    <div
                      className={`ml-10 md:ml-0 md:w-1/2 ${
                        i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                      }`}
                    >
                      <span className="font-display text-2xl font-bold text-accent">
                        {item.year}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {item.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary text-center text-white">
        <div className="container-custom">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
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
