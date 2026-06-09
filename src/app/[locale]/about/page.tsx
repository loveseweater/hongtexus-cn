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
    { year: "2010", event: "Company founded with a vision to connect global textile markets" },
    { year: "2013", event: "Expanded manufacturing facilities with advanced production lines" },
    { year: "2016", event: "Reached 200+ international clients across 30 countries" },
    { year: "2019", event: "Launched sustainable textile product line" },
    { year: "2022", event: "Opened overseas office and distribution center" },
    { year: "2025", event: "Recognized as top textile supplier in the region" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: t("values.quality"),
      desc: "We never compromise on quality. Every product undergoes rigorous testing before reaching our clients.",
    },
    {
      icon: Heart,
      title: t("values.integrity"),
      desc: "Honesty and transparency form the foundation of every relationship we build with our partners.",
    },
    {
      icon: Lightbulb,
      title: t("values.innovation"),
      desc: "We continuously invest in R&D to bring innovative textile solutions to the market.",
    },
    {
      icon: Leaf,
      title: t("values.sustainability"),
      desc: "Committed to eco-friendly practices and sustainable manufacturing processes.",
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
              { value: "15+", label: "Years of Experience" },
              { value: "500+", label: "Global Clients" },
              { value: "2000+", label: "Product Varieties" },
              { value: "50+", label: "Export Countries" },
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
            Ready to Partner with Hongtexus?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-200">
            Get in touch with our team to discuss your textile needs.
          </p>
          <Link
            href={`/${locale}/contact`}
            className="btn-accent mt-8 inline-flex text-base"
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
