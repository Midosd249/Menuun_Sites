import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PublicOriginProvider } from "./public-origin-provider";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "مساحة المالك", robots: { index: false, follow: false } };

function canonicalPublicOrigin() {
  const fallback = "https://menuun-sites.vercel.app";
  const configured = process.env.MENUUN_PUBLIC_ORIGIN?.trim();
  if (!configured) return fallback;
  try {
    const parsed = new URL(configured);
    if (parsed.protocol !== "https:" || parsed.pathname !== "/" || parsed.search || parsed.hash) return fallback;
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export default async function OwnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login/?next=%2Fowner%2F");
  return <PublicOriginProvider origin={canonicalPublicOrigin()}>{children}</PublicOriginProvider>;
}
