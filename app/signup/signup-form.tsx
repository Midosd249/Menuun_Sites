"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupForm() {
  const router = useRouter();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const ar = lang === "ar";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/owner/")}`,
        },
      });
      if (signupError) throw signupError;
      if (data.session) {
        router.replace("/owner/");
        router.refresh();
      } else {
        setNotice(ar
          ? "إذا كان التسجيل متاحاً لهذا المشروع، ستصلك رسالة لتأكيد البريد الإلكتروني. افتح الرابط في الرسالة قبل تسجيل الدخول."
          : "If sign-up is enabled for this project, you'll receive an email confirmation link. Open it before signing in.");
      }
    } catch (reason) {
      const message = reason instanceof Error ? reason.message.toLowerCase() : "";
      if (/already registered|user already exists/.test(message)) {
        setError(ar ? "يوجد حساب بهذا البريد. جرّب تسجيل الدخول أو استعادة كلمة المرور." : "An account already uses this email. Sign in or reset your password.");
      } else if (/rate limit|too many requests/.test(message)) {
        setError(ar ? "محاولات كثيرة. انتظر قليلاً ثم حاول مجدداً." : "Too many attempts. Wait a moment and try again.");
      } else {
        setError(ar ? "تعذر إنشاء الحساب. تحقق من إعدادات التسجيل والبريد الإلكتروني وحاول مجدداً." : "Sign-up failed. Check Auth and email configuration, then try again.");
      }
    } finally { setBusy(false); }
  }

  return <main dir={ar ? "rtl" : "ltr"} lang={lang} style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f6f1", color: "#20221c" }}>
    <section style={{ width: "min(100%, 430px)", border: "1px solid #e4e2d9", borderRadius: 20, padding: 28, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: ".12em" }}>MENUUN</Link>
        <button type="button" onClick={() => setLang(ar ? "en" : "ar")} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "7px 10px", background: "white", cursor: "pointer" }}>{ar ? "English" : "العربية"}</button>
      </div>
      <h1 style={{ margin: "28px 0 8px", fontSize: 28 }}>{ar ? "إنشاء حساب" : "Create an account"}</h1>
      <p style={{ color: "#66695f", lineHeight: 1.8, fontSize: 14 }}>{ar ? "ستحتاج إلى تأكيد بريدك الإلكتروني قبل المتابعة." : "You'll need to confirm your email before continuing."}</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{ar ? "البريد الإلكتروني" : "Email address"}
          <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
        </label>
        <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{ar ? "كلمة المرور (8 أحرف على الأقل)" : "Password (at least 8 characters)"}
          <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
        </label>
        {error && <p role="alert" style={{ color: "#a82f25", fontSize: 13 }}>{error}</p>}
        {notice && <p role="status" style={{ color: "#355c38", fontSize: 13, lineHeight: 1.8 }}>{notice}</p>}
        <button type="submit" disabled={busy} style={{ border: 0, borderRadius: 10, padding: 13, background: "#d3f36b", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}>{busy ? (ar ? "جارٍ إنشاء الحساب…" : "Creating account…") : (ar ? "إنشاء الحساب" : "Create account")}</button>
      </form>
      <p style={{ marginTop: 18, fontSize: 13 }}>{ar ? "لديك حساب؟ " : "Already have an account? "}<Link href="/login" style={{ color: "#485d3c" }}>{ar ? "تسجيل الدخول" : "Sign in"}</Link></p>
    </section>
  </main>;
}
