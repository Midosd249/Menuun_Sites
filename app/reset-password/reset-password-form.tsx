"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const ar = lang === "ar";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(""); setNotice("");
    if (password.length < 8) {
      setError(ar ? "استخدم 8 أحرف على الأقل." : "Use at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError(ar ? "كلمتا المرور غير متطابقتين." : "Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setNotice(ar ? "تم تحديث كلمة المرور. جارٍ فتح مساحة العمل…" : "Password updated. Opening your workspace…");
      router.replace("/owner/");
      router.refresh();
    } catch {
      setError(ar ? "انتهت صلاحية رابط الاستعادة أو أنه غير صالح. اطلب رابطاً جديداً." : "This recovery link is invalid or expired. Request a new one.");
    } finally { setBusy(false); }
  }

  return <main dir={ar ? "rtl" : "ltr"} lang={lang} style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f6f1", color: "#20221c" }}>
    <section style={{ width: "min(100%, 430px)", border: "1px solid #e4e2d9", borderRadius: 20, padding: 28, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none", fontWeight: 700, letterSpacing: ".12em" }}>MENUUN</Link>
        <button type="button" onClick={() => setLang(ar ? "en" : "ar")} style={{ border: "1px solid #ddd", borderRadius: 8, padding: "7px 10px", background: "white", cursor: "pointer" }}>{ar ? "English" : "العربية"}</button>
      </div>
      <h1 style={{ margin: "28px 0 8px", fontSize: 28 }}>{ar ? "تعيين كلمة مرور جديدة" : "Choose a new password"}</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 20 }}>
        <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{ar ? "كلمة المرور الجديدة" : "New password"}
          <input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
        </label>
        <label style={{ display: "grid", gap: 7, fontSize: 13 }}>{ar ? "تأكيد كلمة المرور" : "Confirm password"}
          <input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #d7d8cf", borderRadius: 10, padding: 12 }} />
        </label>
        {error && <p role="alert" style={{ color: "#a82f25", fontSize: 13 }}>{error}</p>}
        {notice && <p role="status" style={{ color: "#355c38", fontSize: 13 }}>{notice}</p>}
        <button type="submit" disabled={busy} style={{ border: 0, borderRadius: 10, padding: 13, background: "#d3f36b", fontWeight: 700, cursor: busy ? "wait" : "pointer" }}>{busy ? (ar ? "جارٍ الحفظ…" : "Saving…") : (ar ? "حفظ كلمة المرور" : "Save password")}</button>
      </form>
    </section>
  </main>;
}
