"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Language = "ar" | "en";
const copy = {
  ar: {
    title: "تسجيل الدخول", subtitle: "أدخل بيانات حسابك للمتابعة إلى مساحة العمل.",
    email: "البريد الإلكتروني", password: "كلمة المرور", submit: "تسجيل الدخول",
    busy: "جارٍ تسجيل الدخول…", signup: "إنشاء حساب", forgot: "نسيت كلمة المرور؟",
    toggle: "English", invalid: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    unconfirmed: "أكد بريدك الإلكتروني من الرسالة التي أرسلناها إليك أولاً.",
    throttled: "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً.",
    unavailable: "تعذر تسجيل الدخول الآن. تحقق من الاتصال والإعدادات وحاول مجدداً.",
    auth_unavailable: "خدمة تسجيل الدخول غير مهيأة في هذه البيئة.",
    callback_failed: "تعذر تأكيد جلسة الحساب. اطلب رابط تأكيد جديداً.",
    missing_code: "رابط التأكيد غير مكتمل أو منتهي الصلاحية.",
  },
  en: {
    title: "Sign in", subtitle: "Enter your account details to continue to your workspace.",
    email: "Email address", password: "Password", submit: "Sign in",
    busy: "Signing in…", signup: "Create an account", forgot: "Forgot password?",
    toggle: "العربية", invalid: "The email or password is incorrect.",
    unconfirmed: "Confirm your email using the message we sent you first.",
    throttled: "Too many attempts. Wait a moment and try again.",
    unavailable: "Sign-in is unavailable. Check your connection and configuration.",
    auth_unavailable: "Authentication is not configured in this environment.",
    callback_failed: "We couldn't confirm your session. Request a new confirmation link.",
    missing_code: "The confirmation link is incomplete or expired.",
  },
} as const;

function messageFor(error: unknown, lang: Language): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  const c = copy[lang];
  if (/invalid login credentials|invalid email or password/.test(message)) return c.invalid;
  if (/email not confirmed|email_not_confirmed/.test(message)) return c.unconfirmed;
  if (/rate limit|too many requests|over_email_send_rate_limit/.test(message)) return c.throttled;
  if (/auth_unavailable/.test(message)) return c.auth_unavailable;
  if (/callback_failed/.test(message)) return c.callback_failed;
  if (/missing_code/.test(message)) return c.missing_code;
  return c.unavailable;
}

export default function LoginForm({ nextPath, initialError = "" }: { nextPath: string; initialError?: string }) {
  const router = useRouter();
  const [lang, setLang] = useState<Language>("ar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError ? messageFor(new Error(initialError), "ar") : "");
  const c = copy[lang];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) throw authError;
      router.replace(nextPath);
      router.refresh();
    } catch (reason) {
      setError(messageFor(reason, lang));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f6f1", color: "#20221c" }}>
      <section style={{ width: "min(100%, 430px)", border: "1px solid #e4e2d9", borderRadius: 20, padding: 28, background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <Link href="/" aria-label="Menuun home" style={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: ".12em" }}>MENUUN</Link>
          <button type="button" onClick={() => { setLang(lang === "ar" ? "en" : "ar"); setError(initialError ? messageFor(new Error(initialError), lang === "ar" ? "en" : "ar") : ""); }} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "7px 10px", background: "white", cursor: "pointer" }}>{c.toggle}</button>
        </div>
        <h1 style={{ margin: "28px 0 8px", fontSize: 28 }}>{c.title}</h1>
        <p style={{ color: "#66695f", lineHeight: 1.8, fontSize: 14 }}>{c.subtitle}</p>
        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{c.email}
            <input autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
          </label>
          <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{c.password}
            <input autoComplete="current-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
          </label>
          {error && <p role="alert" style={{ color: "#a82f25", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ border: 0, borderRadius: 10, padding: 13, background: busy ? "#aebd86" : "#d3f36b", color: "#171815", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}>{busy ? c.busy : c.submit}</button>
        </form>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 18, fontSize: 13 }}>
          <Link href="/forgot-password" style={{ color: "#485d3c" }}>{c.forgot}</Link>
          <Link href="/signup" style={{ color: "#485d3c" }}>{c.signup}</Link>
        </div>
      </section>
    </main>
  );
}
