export const runtime = "edge";

import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SubscribePopup from "@/components/SubscribePopup";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: "HONGTEX — Premium Knitwear & Textile Solutions",
    description: t("home"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
          <SubscribePopup />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
