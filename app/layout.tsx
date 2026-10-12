import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.menuun.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Menuun — تجربة رقمية أفضل لأعمال الخدمات",
    template: "%s | Menuun"
  },
  description: "Menuun منصة رقمية تساعد أعمال الخدمات على بناء حضور احترافي وتقديم تجربة أوضح لعملائها.",
  applicationName: "Menuun",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Menuun",
    title: "Menuun — تجربة رقمية أفضل لأعمال الخدمات",
    description: "حضور رقمي أنيق وتجربة أوضح لأعمال الخدمات.",
    locale: "ar_SA",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Menuun — تجربة رقمية أفضل لأعمال الخدمات",
    description: "حضور رقمي أنيق وتجربة أوضح لأعمال الخدمات."
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#183d31"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
