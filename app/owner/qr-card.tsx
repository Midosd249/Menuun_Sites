"use client";

import { useState } from "react";
import { ExternalLink, QrCode, Copy, Download } from "lucide-react";
import { usePublicOrigin } from "./public-origin-provider";

const TEMPLATE_NAMES: Record<string, string> = {
  atelier: "Atelier 09",
  oasis: "Oasis",
  rose: "Forge Men",
};

export default function SalonQrCard({
  slug,
  salonName,
  published,
  templateKey,
  templateKey,
}: {
  slug: string;
  salonName: string;
  published: boolean;
  templateKey: string;
}) {
  const publicOrigin = usePublicOrigin();
  const [copied, setCopied] = useState(false);
  const origin = publicOrigin.replace(/\/+$/, "");
  const url = origin && slug ? `${origin}/s/${encodeURIComponent(slug)}` : "";
  const templateName = TEMPLATE_NAMES[templateKey] || TEMPLATE_NAMES.atelier;
  const qr = url ? "https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&format=png&data=" + encodeURIComponent(url) : "";

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <section className="owner-panel">
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <QrCode size={19} />
      <h2 style={{ margin: 0 }}>صفحة الصالون ورمز QR</h2>
    </div>
    <p style={{ fontSize: 12, color: "#697469", lineHeight: 1.9, marginTop: 0 }}>
      القالب المحفوظ: <strong>{templateName}</strong>. رابط QR ثابت ولا يتغير بتغيّر عنوان معاينة Vercel.
    </p>
    {published ? <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 150px", gap: 18, alignItems: "center" }}>
      <div>
        <p style={{ fontSize: 12, color: "#697469", lineHeight: 1.9, marginTop: 0 }}>شارك رابط صالونك أو اطبع رمز QR وضعه على الاستقبال أو بطاقات الزيارة.</p>
        {url && <p dir="ltr" style={{ fontSize: 11, overflowWrap: "anywhere", color: "#36533d" }}>{url}</p>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="owner-small-primary" href={url || undefined} target="_blank" rel="noreferrer"><ExternalLink size={14} style={{ verticalAlign: "middle", marginInlineEnd: 5 }} />فتح الصفحة</a>
          <button className="owner-small-primary" type="button" onClick={copy}><Copy size={14} style={{ verticalAlign: "middle", marginInlineEnd: 5 }} />{copied ? "تم النسخ ✓" : "نسخ الرابط"}</button>
          {qr && <a className="owner-small-primary" href={qr} target="_blank" rel="noreferrer" download><Download size={14} style={{ verticalAlign: "middle", marginInlineEnd: 5 }} />تنزيل QR</a>}
        </div>
      </div>
      {qr && <a href={qr} target="_blank" rel="noreferrer" aria-label={"رمز QR لصفحة " + salonName}><img src={qr} width="150" height="150" alt={"رمز QR لصفحة " + salonName} style={{ display: "block", width: "100%", height: "auto", background: "#fff", borderRadius: 8, padding: 7 }} /></a>}
    </div> : <p style={{ fontSize: 12, color: "#7b8178", lineHeight: 1.9, margin: 0 }}>سيظهر رابط الصفحة ورمز QR بعد نشر صفحة الصالون. لم يتم نشر الصفحة بعد.</p>}
  </section>;
}
