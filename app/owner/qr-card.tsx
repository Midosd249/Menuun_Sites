"use client";

import { useState } from "react";
import { Copy, Download, Share2 } from "lucide-react";
import { usePublicOrigin } from "./public-origin-provider";

export default function SalonQrCard({
  slug,
  salonName,
  published,
}: {
  slug: string;
  salonName: string;
  published: boolean;
}) {
  const publicOrigin = usePublicOrigin();
  const [copied, setCopied] = useState(false);
  const origin = publicOrigin.replace(/\/+$/, "");
  const url = origin && slug ? `${origin}/s/${encodeURIComponent(slug)}` : "";
  const qr = url
    ? "https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&format=png&data=" + encodeURIComponent(url)
    : "";

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function shareLink() {
    if (!url) return;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: salonName, url });
        return;
      } catch {
        return;
      }
    }
    await copyLink();
  }

  return (
    <section className="owner-panel owner-qr-card" aria-label={salonName}>
      <h2>{salonName}</h2>
      {published && url && (
        <div className="owner-qr-card-content">
          <p className="owner-qr-card-link" dir="ltr">{url}</p>
          <img
            className="owner-qr-card-image"
            src={qr}
            width="150"
            height="150"
            alt={`رمز QR لصفحة ${salonName}`}
          />
          <div className="owner-qr-card-actions">
            <button className="owner-small-primary" type="button" onClick={copyLink}>
              <Copy size={14} aria-hidden="true" />
              {copied ? "تم النسخ ✓" : "نسخ الرابط"}
            </button>
            <a className="owner-small-primary" href={qr} download={`${slug}-qr.png`}>
              <Download size={14} aria-hidden="true" />
              تنزيل QR
            </a>
            <button className="owner-small-primary" type="button" onClick={shareLink}>
              <Share2 size={14} aria-hidden="true" />
              مشاركة الرابط
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
