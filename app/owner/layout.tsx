import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "مساحة المالك", robots: { index: false, follow: false } };
export default async function OwnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 const supabase = await createSupabaseServerClient();
 const { data: { user }, error } = await supabase.auth.getUser();
 if (error || !user) redirect("/login/?next=%2Fowner%2F");
 return children;
}