import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic", "latin"], display: "swap", preload: true, variable: "--font-cairo" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.menuun.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await cookies()).get("menuun-locale")?.value === "en" ? "en" : "ar";
  const copy = locale === "en"
    ? {
        title: "Menuun — Salon management and branded salon websites",
        description: "Manage salon services, your team and appointments, then publish a bilingual salon page that reflects your brand.",
        socialTitle: "Menuun — Run your salon and its digital presence",
        socialDescription: "One owner workspace for salon operations and a branded public page for customers.",
        locale: "en_US"
      }
    : {
        title: "Menuun — إدارة الصالونات وصفحاتها الرقمية",
        description: "أدر خدمات الصالون وفريق العمل والمواعيد، وانشر صفحة رقمية ثنائية اللغة تحمل هوية صالونك.",
        socialTitle: "Menuun — إدارة صالونك وحضوره الرقمي",
        socialDescription: "مساحة واحدة لإدارة الصالون وصفحة عامة تحمل هويته وتخدم عملاءه.",
        locale: "ar_SA"
      };

  return {
    metadataBase: new URL(siteUrl),
    title: { default: copy.title, template: "%s | Menuun" },
    description: copy.description,
    applicationName: "Menuun",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: "Menuun",
      title: copy.socialTitle,
      description: copy.socialDescription,
      locale: copy.locale,
      url: "/"
    },
    twitter: {
      card: "summary_large_image",
      title: copy.socialTitle,
      description: copy.socialDescription
    },
    robots: { index: true, follow: true }
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#183d31"
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await cookies()).get("menuun-locale")?.value === "en" ? "en" : "ar";
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={cairo.variable}>{children}</body>
    </html>
  );
}
