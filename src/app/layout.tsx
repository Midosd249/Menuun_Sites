import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سِمت | SIMT Barber House — تجربة حلاقة مختلفة",
  description: "تجربة موقع تجريبية لصالون حلاقة رجالي: خدمات واضحة، فريق متخصص، وحجز تفاعلي يدعم العربية والإنجليزية.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "سِمت | SIMT Barber House",
    description: "تفاصيل محسوبة. تجربة مختلفة.",
    type: "website",
    locale: "ar_SA",
  },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
