"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [email, setEmail] = useState("");
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
      });
      if (resetError) throw resetError;
      setNotice(ar
        ? "إذا كان الحساب موجوداً، ستصلك رسالة تحتوي على رابط آمن لإعادة تعيين كلمة المرور."
        : "If an account exists for this address, you'll receive a secure password-reset link.");
    } catch {
      setError(ar ? "تعذر إرسال رسالة الاستعادة. تحقق من إعدادات البريد وحاول لاحقاً." : "Could not send the recovery email. Check email configuration and try again.");
    } finally { setBusy(false); }
  }

  return <main dir={ar ? "rtl" : "ltr"} lang={lang} style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f6f1", color: "#20221c" }}>
    <section style={{ width: "min(100%, 430px)", border: "1px solid #e4e2d9", borderRadius: 20, padding: 28, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: ".12em" }}>MENUUN</Link>
        <button type="button" onClick={() => setLang(ar ? "en" : "ar")} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "7px 10px", background: "white", cursor: "pointer" }}>{ar ? "English" : "العربية"}</button>
      </div>
      <h1 style={{ margin: "28px 0 8px", fontSize: 28 }}>{ar ? "استعادة كلمة المرور" : "Reset your password"}</h1>
      <p style={{ color: "#66695f", lineHeight: 1.8, fontSize: 14 }}>{ar ? "سنرسل رابط الاستعادة إلى بريدك الإلكتروني إذا كان الحساب موجوداً." : "We'll email a recovery link if an account exists."}</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
        <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{ar ? "البريد الإلكتروني" : "Email address"}
          <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
        </label>
        {error && <p role="alert" style={{ color: "#a82f25", fontSize: 13 }}>{error}</p>}
        {notice && <p role="status" style={{ color: "#355c38", fontSize: 13, lineHeight: 1.8 }}>{notice}</p>}
        <button type="submit" disabled={busy} style={{ border: 0, borderRadius: 10, padding: 13, background: "#d3f36b", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}>{busy ? (ar ? "جارٍ الإرسال…" : "Sending…") : (ar ? "إرسال رابط الاستعادة" : "Send recovery link")}</button>
      </form>
      <p style={{ marginTop: 18, fontSize: 13 }}><Link href="/login" style={{ color: "#485d3c" }}>{ar ? "العودة لتسجيل الدخول" : "Back to sign in"}</Link></p>
    </section>
  </main>;
}
