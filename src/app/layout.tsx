import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hongtexus — Premium Textile Solutions",
  description:
    "Hongtexus is a leading textile supplier providing high-quality fabrics and textile products to global markets.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
