import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luma Studio — A considered space for beauty",
  description: "A premium salon website concept built with Menuun Sites.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Luma Studio — A considered space for beauty",
    description: "Thoughtful treatments, expert hands, and time that belongs entirely to you.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
