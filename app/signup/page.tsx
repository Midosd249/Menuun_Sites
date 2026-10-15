import type { Metadata } from "next";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
  title: "إنشاء حساب | Menuun",
  description: "أنشئ حساب Menuun وأكد بريدك الإلكتروني للمتابعة.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupForm />;
}
