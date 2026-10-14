"use client";
import { useEffect, useState, type ChangeEvent } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "salon-public-media";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
type MediaAsset = { id: string; kind: string; storage_path: string; public_url: string | null; alt_ar: string | null; sort_order: number };

function safeName(name: string) { return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-90) || "image"; }
function validateImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) throw new Error("استخدم صورة بصيغة JPG أو PNG أو WebP أو AVIF.");
  if (file.size > MAX_FILE_SIZE) throw new Error("الحد الأقصى لحجم الصورة 10 ميجابايت.");
}

export default function SalonMediaEditor({ salonId, initialLogoUrl }: { salonId: string; initialLogoUrl: string | null }) {
  const [db] = useState(() => createSupabaseBrowserClient());
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    const { data, error } = await db.from("media_assets").select("id,kind,storage_path,public_url,alt_ar,sort_order").eq("salon_id", salonId).eq("kind", "gallery").order("sort_order");
    if (error) throw error;
    setMedia((data || []) as MediaAsset[]);
  }
  useEffect(() => { setLogoUrl(initialLogoUrl); let live = true; load().catch(e => live && setNotice(e?.message || "تعذر تحميل الصور.")); return () => { live = false; }; }, [salonId, initialLogoUrl]);

  async function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget, file = input.files?.[0]; input.value = "";
    if (!file) return;
    setBusy(true); setNotice("");
    let path = "";
    try {
      validateImage(file);
      path = salonId + "/logo/" + crypto.randomUUID() + "-" + safeName(file.name);
      const { error: uploadError } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const url = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const { data, error } = await db.from("salons").update({ logo_url: url }).eq("id", salonId).select("id").maybeSingle();
      if (error || !data) { await db.storage.from(BUCKET).remove([path]); if (error) throw error; throw new Error("لا توجد صلاحية لتعديل هذا الصالون."); }
      setLogoUrl(url); setNotice("تم تحديث شعار الصالون.");
    } catch (e: any) { setNotice(e?.message || "تعذر رفع الشعار."); }
    finally { setBusy(false); }
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget, files = Array.from(input.files || []).slice(0, 8); input.value = "";
    if (!files.length) return;
    setBusy(true); setNotice("");
    try {
      for (const file of files) validateImage(file);
      const { data: { user } } = await db.auth.getUser();
      for (const [index, file] of files.entries()) {
        validateImage(file);
        const path = salonId + "/gallery/" + crypto.randomUUID() + "-" + safeName(file.name);
        const { error: uploadError } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        const { error } = await db.from("media_assets").insert({ salon_id: salonId, kind: "gallery", storage_path: path, public_url: publicUrl, mime_type: file.type, byte_size: file.size, alt_ar: file.name.replace(/\.[^.]+$/, "").slice(0, 160), sort_order: media.length + index, is_active: true, is_public: true, created_by: user?.id || null });
        if (error) { await db.storage.from(BUCKET).remove([path]); throw error; }
      }
      await load(); setNotice("تم رفع الصور وإضافتها إلى معرض الصالون.");
    } catch (e: any) { setNotice(e?.message || "تعذر رفع الصور."); }
    finally { setBusy(false); }
  }

  async function removeImage(item: MediaAsset) {
    if (busy || !window.confirm("هل تريد حذف هذه الصورة من معرض الصالون؟")) return;
    setBusy(true); setNotice("");
    try {
      const { data, error } = await db.from("media_assets").delete().eq("id", item.id).eq("salon_id", salonId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("لا توجد صلاحية لحذف هذه الصورة.");
      const { error: storageError } = await db.storage.from(BUCKET).remove([item.storage_path]);
      await load();
      setNotice(storageError ? "أزيلت الصورة من الصفحة، لكن تعذر تنظيف ملف التخزين." : "تم حذف الصورة.");
    } catch (e: any) { setNotice(e?.message || "تعذر حذف الصورة."); }
    finally { setBusy(false); }
  }

  return <section className="owner-panel">
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><ImagePlus size={19}/><h2 style={{margin:0}}>صور وهوية الصالون</h2></div>
    <p style={{fontSize:12,color:"#697469",lineHeight:1.9,marginTop:0}}>ارفع شعارًا وصورًا حقيقية للمكان والأعمال. الصور التي ترفعها هنا ستكون متاحة للعرض العام في صفحة الصالون.</p>
    <div className="menuun-media-logo">{logoUrl?<img src={logoUrl} alt="شعار الصالون الحالي"/>:<div className="menuun-media-placeholder">لا يوجد شعار بعد</div>}<div><strong>شعار الصالون</strong><small>JPG أو PNG أو WebP أو AVIF — حتى 10 ميجابايت</small><label className="owner-small-primary menuun-upload-button"><Upload size={14}/>{busy?"جارٍ العمل…":"رفع / استبدال الشعار"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={uploadLogo}/></label></div></div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginTop:24,marginBottom:12,flexWrap:"wrap"}}><h3 style={{margin:0,fontSize:15}}>معرض الصور ({media.length})</h3><label className="owner-primary menuun-upload-button"><ImagePlus size={15}/>إضافة صور<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={uploadGallery}/></label></div>
    <div className="menuun-gallery-grid">{media.map(item=><article className="menuun-gallery-item" key={item.id}>{item.public_url&&<img src={item.public_url} alt={item.alt_ar||"صورة من الصالون"}/>}<span>{item.alt_ar||"صورة الصالون"}</span><button type="button" className="owner-small-danger" disabled={busy} onClick={()=>removeImage(item)} aria-label="حذف الصورة"><Trash2 size={14}/> حذف</button></article>)}</div>
    {notice&&<p role="status" className="owner-notice" style={{marginTop:14}}>{notice}</p>}
  </section>;
}
