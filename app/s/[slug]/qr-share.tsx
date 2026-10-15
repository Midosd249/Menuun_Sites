"use client";
import { useState } from "react";
import styles from "./public-salon.module.css";

export default function SalonQrShare({slug,salonName,templateName,publicOrigin}:{slug:string;salonName:string;templateName:string;publicOrigin:string}) {
  const [open,setOpen] = useState(false);
  const publicUrl = publicOrigin.replace(/\/+$/, "") + "/s/" + encodeURIComponent(slug);
  const [copied,setCopied] = useState(false);
  const qrUrl = publicUrl ? "https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&format=png&data="+encodeURIComponent(publicUrl) : "";
  async function copyLink() {
    try { await navigator.clipboard.writeText(publicUrl); setCopied(true); window.setTimeout(()=>setCopied(false),1800); }
    catch { setCopied(false); }
  }
  return <div className={styles.shareWrap}>
    <button type="button" className={styles.shareButton} onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-controls="salon-qr-panel">مشاركة الصفحة ↗</button>
    {open && <div className={styles.qrPanel} id="salon-qr-panel">
      <strong>رابط {salonName}</strong>
      <p>القالب: {templateName}</p>
      <p>امسح الرمز لفتح صفحة الصالون مباشرة.</p>
      {qrUrl && <img src={qrUrl} alt={"رمز QR لصفحة "+salonName} width="180" height="180"/>}
      <a className={styles.qrDownload} href={qrUrl} target="_blank" rel="noreferrer" download>فتح / تنزيل رمز QR</a>
      <button type="button" className={styles.copyButton} onClick={copyLink}>{copied ? "تم نسخ الرابط ✓" : "نسخ رابط الصفحة"}</button>
      <small>{publicUrl}</small>
    </div>}
  </div>;
}
