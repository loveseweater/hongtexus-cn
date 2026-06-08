import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from "lucide-react";

type Props = {
  locale: string;
};

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "footer" });

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary-dark text-white">
      <div className="container-custom py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <span className="text-2xl">H</span>
              <span>ongtexus</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              {t("description")}
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent">
                <Linkedin size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent">
                <Facebook size={18} />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href={`/${locale}/products`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Blog
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              {t("products")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href={`/${locale}/products?category=cotton-fabrics`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Cotton Fabrics
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=linen-fabrics`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Linen Fabrics
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=silk-fabrics`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Silk Fabrics
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=polyester-fabrics`} className="text-sm text-gray-300 transition-colors hover:text-accent">
                  Polyester Fabrics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold text-white">
              {t("contact")}
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                <span>Dongguan, Guangdong, China</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={16} className="shrink-0 text-accent" />
                <span>+86-769-8888-8888</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={16} className="shrink-0 text-accent" />
                <span>info@hongtexus.cn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} Hongtexus. {t("copyright")}
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="transition-colors hover:text-accent">
              {t("privacy")}
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
