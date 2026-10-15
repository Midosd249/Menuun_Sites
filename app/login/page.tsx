import type { Metadata } from "next";
import { safeRedirectPath } from "@/lib/auth/redirect.mjs";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول | Menuun",
  description: "سجّل الدخول إلى مساحة Menuun الخاصة بك.",
  robots: { index: false, follow: false },
};

type LoginSearchParams = { next?: string | string[]; error?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginSearchParams>;
}) {
  const params = await searchParams;
  const candidate = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = safeRedirectPath(candidate, "/owner/");
  return <LoginForm nextPath={nextPath} initialError={params.error || ""} />;
}
