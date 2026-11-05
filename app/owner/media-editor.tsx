"use client";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Facebook, Globe, ImagePlus, Instagram, MapPin, Trash2, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "salon-public-media";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/avif";
type MediaAsset = { id: string; kind: string; storage_path: string; public_url: string | null; alt_ar: string | null; alt_en: string | null; sort_order: number };
type ServiceAsset = { id: string; name_ar: string; image_url: string | null; price_sar: number; duration_minutes: number };
type BarberAsset = { id: string; display_name: string; image_url: string | null; bio_ar: string | null };
type SocialLinks = { instagram_url: string; tiktok_url: string; snapchat_url: string; facebook_url: string; google_maps_url: string; website_url: string };
const EMPTY_LINKS: SocialLinks = { instagram_url: "", tiktok_url: "", snapchat_url: "", facebook_url: "", google_maps_url: "", website_url: "" };

function safeName(name: string) { return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(-90) || "image"; }
function validateImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) throw new Error("استخدم صورة بصيغة JPG أو PNG أو WebP أو AVIF.");
  if (file.size > MAX_FILE_SIZE) throw new Error("الحد الأقصى لحجم الصورة 10 ميجابايت.");
}
function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : "https://" + trimmed;
  let parsed: URL;
  try { parsed = new URL(candidate); } catch { throw new Error("أحد الروابط غير صالح."); }
  if (parsed.protocol !== "https:" || !parsed.hostname.includes(".")) throw new Error("استخدم روابط آمنة تبدأ بـ https://.");
  return parsed.toString();
}
function normalizeInstagramUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const handle = trimmed.replace(/^@/, "");
  if (/^[A-Za-z0-9._]{1,30}$/.test(handle) && !/^https?:\/\//i.test(trimmed)) {
    return "https://instagram.com/" + handle;
  }
  return normalizeUrl(trimmed);
}
function pathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/object/public/" + BUCKET + "/";
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length).split("?")[0]) : null;
}

export default function SalonMediaEditor({ salonId, initialLogoUrl, lang = "ar" }: { salonId: string; initialLogoUrl: string | null; lang?: "ar" | "en" }) {
  const [db] = useState(() => createSupabaseBrowserClient());
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [heroMedia, setHeroMedia] = useState<MediaAsset | null>(null);
  const [locationMedia, setLocationMedia] = useState<MediaAsset | null>(null);
  const [services, setServices] = useState<ServiceAsset[]>([]);
  const [barbers, setBarbers] = useState<BarberAsset[]>([]);
  const [links, setLinks] = useState<SocialLinks>(EMPTY_LINKS);
  const [socialLinksAvailable, setSocialLinksAvailable] = useState(true);
  const [serviceImagesAvailable, setServiceImagesAvailable] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  async function load() {
    const [mediaResult, serviceResult, barberResult, socialResult] = await Promise.all([
      db.from("media_assets").select("id,kind,storage_path,public_url,alt_ar,alt_en,sort_order").eq("salon_id", salonId).in("kind", ["gallery", "hero_poster", "location_image"]).order("sort_order"),
      db.from("services").select("id,name_ar,image_url,price_sar,duration_minutes").eq("salon_id", salonId).eq("is_active", true).order("sort_order"),
      db.from("barbers").select("id,display_name,image_url,bio_ar").eq("salon_id", salonId).eq("is_active", true).order("sort_order"),
      db.from("salons").select("id,instagram_url,tiktok_url,snapchat_url,facebook_url,google_maps_url,website_url").eq("id", salonId).maybeSingle()
    ]);
    if (mediaResult.error) throw mediaResult.error;
    if (barberResult.error) throw barberResult.error;
    const mediaRows = (mediaResult.data || []) as MediaAsset[];
    setMedia(mediaRows.filter(item => item.kind === "gallery"));
    setHeroMedia(mediaRows.find(item => item.kind === "hero_poster") || null);
    setLocationMedia(mediaRows.find(item => item.kind === "location_image") || null);
    setBarbers((barberResult.data || []) as BarberAsset[]);
    if (serviceResult.error && /image_url/.test(serviceResult.error.message || "")) {
      setServiceImagesAvailable(false);
      const legacy = await db.from("services").select("id,name_ar,price_sar,duration_minutes").eq("salon_id", salonId).eq("is_active", true).order("sort_order");
      if (legacy.error) throw legacy.error;
      setServices((legacy.data || []).map((row: any) => ({ ...row, image_url: null })) as ServiceAsset[]);
    } else {
      if (serviceResult.error) throw serviceResult.error;
      setServiceImagesAvailable(true);
      setServices((serviceResult.data || []) as ServiceAsset[]);
    }
    if (socialResult.error && /instagram_url|tiktok_url|snapchat_url|facebook_url|google_maps_url|website_url/.test(socialResult.error.message || "")) {
      setSocialLinksAvailable(false);
      setLinks(EMPTY_LINKS);
    } else {
      if (socialResult.error) throw socialResult.error;
      setSocialLinksAvailable(true);
      const row = socialResult.data as Partial<SocialLinks> | null;
      setLinks({ instagram_url: row?.instagram_url || "", tiktok_url: row?.tiktok_url || "", snapchat_url: row?.snapchat_url || "", facebook_url: row?.facebook_url || "", google_maps_url: row?.google_maps_url || "", website_url: row?.website_url || "" });
    }
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

  async function removeLogo() {
    if (busy || !logoUrl || !window.confirm("هل تريد إزالة شعار الصالون؟")) return;
    setBusy(true); setNotice("");
    try {
      const { data, error } = await db.from("salons").update({ logo_url: null }).eq("id", salonId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("لا توجد صلاحية لتعديل هذا الصالون.");
      const oldPath = pathFromPublicUrl(logoUrl);
      if (oldPath) await db.storage.from(BUCKET).remove([oldPath]);
      setLogoUrl(null); setNotice("تمت إزالة الشعار.");
    } catch (e: any) { setNotice(e?.message || "تعذر إزالة الشعار."); }
    finally { setBusy(false); }
  }

  async function removeTargetImage(kind: "services" | "barbers", item: ServiceAsset | BarberAsset) {
    if (busy || !window.confirm("هل تريد إزالة الصورة الحالية؟")) return;
    setBusy(true); setNotice("");
    try {
      const table = kind === "services" ? "services" : "barbers";
      const { data, error } = await db.from(table).update({ image_url: null }).eq("id", item.id).eq("salon_id", salonId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("لا توجد صلاحية لتعديل هذا العنصر.");
      const oldPath = pathFromPublicUrl(item.image_url);
      if (oldPath) await db.storage.from(BUCKET).remove([oldPath]);
      await load();
      setNotice("تمت إزالة الصورة وسيظهر بديل مناسب في الصفحة.");
    } catch (e: any) { setNotice(e?.message || "تعذر إزالة الصورة."); }
    finally { setBusy(false); }
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget, files = Array.from(input.files || []); input.value = "";
    if (!files.length) return;
    setBusy(true); setNotice("");
    try {
      for (const file of files) validateImage(file);
      const { data: { user } } = await db.auth.getUser();
      for (const [index, file] of files.entries()) {
        const path = salonId + "/gallery/" + crypto.randomUUID() + "-" + safeName(file.name);
        const { error: uploadError } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        const { error } = await db.from("media_assets").insert({ salon_id: salonId, kind: "gallery", storage_path: path, public_url: publicUrl, mime_type: file.type, byte_size: file.size, alt_ar: "صورة من أعمال الحلاقة والعناية", alt_en: "Men’s haircut and grooming portfolio image", sort_order: media.length + index, is_active: true, is_public: true, created_by: user?.id || null });
        if (error) { await db.storage.from(BUCKET).remove([path]); throw error; }
      }
      await load(); setNotice("تم رفع الصور وإضافتها إلى معرض الصالون.");
    } catch (e: any) { setNotice(e?.message || "تعذر رفع الصور."); }
    finally { setBusy(false); }
  }

  async function uploadTargetImage(file: File, kind: "services" | "barbers", id: string, currentUrl: string | null) {
    validateImage(file);
    if (kind === "services" && !serviceImagesAvailable) throw new Error("يلزم تطبيق تحديث قاعدة البيانات لتفعيل صور الخدمات.");
    const path = salonId + "/" + kind + "/" + id + "/" + crypto.randomUUID() + "-" + safeName(file.name);
    const { error: uploadError } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;
    const url = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    const table = kind === "services" ? "services" : "barbers";
    const { data, error } = await db.from(table).update({ image_url: url }).eq("id", id).eq("salon_id", salonId).select("id").maybeSingle();
    if (error || !data) {
      await db.storage.from(BUCKET).remove([path]);
      if (error) throw error;
      throw new Error("لا توجد صلاحية لتعديل هذا العنصر.");
    }
    const oldPath = pathFromPublicUrl(currentUrl);
    if (oldPath) await db.storage.from(BUCKET).remove([oldPath]);
  }

  async function uploadSpecialImage(event: ChangeEvent<HTMLInputElement>, kind: "hero_poster" | "location_image", current: MediaAsset | null) {
    const input = event.currentTarget, file = input.files?.[0]; input.value = "";
    if (!file) return;
    setBusy(true); setNotice("");
    let path = "";
    try {
      validateImage(file);
      const { data: { user } } = await db.auth.getUser();
      path = salonId + "/" + kind + "/" + crypto.randomUUID() + "-" + safeName(file.name);
      const { error: uploadError } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      const isHero = kind === "hero_poster";
      const { data, error } = await db.from("media_assets").insert({
        salon_id: salonId, kind, storage_path: path, public_url: publicUrl, mime_type: file.type, byte_size: file.size,
        alt_ar: isHero ? "الصورة الرئيسية لصالون فورج للعناية الرجالية" : "صورة موقع الصالون وأجوائه",
        alt_en: isHero ? "Forge Men salon hero image" : "Salon location and interior image",
        sort_order: 0, is_active: true, is_public: true, created_by: user?.id || null
      }).select("id").maybeSingle();
      if (error || !data) {
        await db.storage.from(BUCKET).remove([path]);
        if (error) throw error;
        throw new Error("لا توجد صلاحية لحفظ الصورة.");
      }
      if (current) {
        const { error: deleteError } = await db.from("media_assets").delete().eq("id", current.id).eq("salon_id", salonId);
        if (deleteError) throw deleteError;
        const oldPath = pathFromPublicUrl(current.public_url);
        if (oldPath) await db.storage.from(BUCKET).remove([oldPath]);
      }
      await load();
      setNotice(isHero ? "تم تحديث الصورة الرئيسية." : "تم تحديث صورة الموقع.");
    } catch (e: any) { setNotice(e?.message || "تعذر رفع الصورة."); }
    finally { setBusy(false); }
  }

  async function saveAltText(item: MediaAsset, field: "alt_ar" | "alt_en", value: string) {
    const { error } = await db.from("media_assets").update({ [field]: value.trim() || null }).eq("id", item.id).eq("salon_id", salonId);
    if (error) { setNotice(error.message || "تعذر حفظ النص البديل."); return; }
    await load();
    setNotice("تم حفظ النص البديل للصورة.");
  }

  async function uploadServiceImage(event: ChangeEvent<HTMLInputElement>, service: ServiceAsset) {
    const input = event.currentTarget, file = input.files?.[0]; input.value = "";
    if (!file) return;
    setBusy(true); setNotice("");
    try { await uploadTargetImage(file, "services", service.id, service.image_url); await load(); setNotice("تم تحديث صورة الخدمة: " + service.name_ar); }
    catch (e: any) { setNotice(e?.message || "تعذر رفع صورة الخدمة."); }
    finally { setBusy(false); }
  }

  async function uploadBarberImage(event: ChangeEvent<HTMLInputElement>, barber: BarberAsset) {
    const input = event.currentTarget, file = input.files?.[0]; input.value = "";
    if (!file) return;
    setBusy(true); setNotice("");
    try { await uploadTargetImage(file, "barbers", barber.id, barber.image_url); await load(); setNotice("تم تحديث صورة الحلاق: " + barber.display_name); }
    catch (e: any) { setNotice(e?.message || "تعذر رفع صورة الحلاق."); }
    finally { setBusy(false); }
  }

  async function removeImage(item: MediaAsset) {
    if (busy || !window.confirm("هل تريد حذف هذه الصورة من معرض الصالون؟")) return;
    setBusy(true); setNotice("");
    try {
      const { data, error } = await db.from("media_assets").delete().eq("id", item.id).eq("salon_id", salonId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("لا توجد صلاحية لحذف هذه الصورة.");
      const ownedPath = pathFromPublicUrl(item.public_url);
      const { error: storageError } = ownedPath ? await db.storage.from(BUCKET).remove([ownedPath]) : { error: null };
      await load();
      setNotice(storageError ? "أزيلت الصورة من الصفحة، لكن تعذر تنظيف ملف التخزين." : "تم حذف الصورة.");
    } catch (e: any) { setNotice(e?.message || "تعذر حذف الصورة."); }
    finally { setBusy(false); }
  }

  async function saveSocialLinks(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice("");
    try {
      if (!socialLinksAvailable) throw new Error("يلزم تطبيق تحديث قاعدة البيانات لتفعيل روابط التواصل.");
      const payload = {
        instagram_url: normalizeInstagramUrl(links.instagram_url),
        tiktok_url: normalizeUrl(links.tiktok_url),
        snapchat_url: normalizeUrl(links.snapchat_url),
        facebook_url: normalizeUrl(links.facebook_url),
        google_maps_url: normalizeUrl(links.google_maps_url),
        website_url: normalizeUrl(links.website_url)
      };
      const { data, error } = await db.from("salons").update(payload).eq("id", salonId).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("لا توجد صلاحية لتعديل روابط هذا الصالون.");
      await load(); setNotice("تم حفظ روابط التواصل والموقع.");
    } catch (e: any) { setNotice(e?.message || "تعذر حفظ الروابط."); }
    finally { setBusy(false); }
  }

  return <section className="owner-panel">
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><ImagePlus size={19}/><h2 style={{margin:0}}>صور وهوية الصالون</h2></div>
    <p style={{fontSize:12,color:"#697469",lineHeight:1.9,marginTop:0}}>أدر صور الهوية والخدمات والفريق ومعرض الأعمال وصورة الموقع من هنا. استخدم صورًا تملك حق استخدامها، ويمكنك استبدال أي صورة في أي وقت.</p>
    <div className="menuun-media-logo">{logoUrl?<img src={logoUrl} alt="شعار الصالون الحالي"/>:<div className="menuun-media-placeholder">لا يوجد شعار بعد</div>}<div><strong>شعار الصالون</strong><small>JPG أو PNG أو WebP أو AVIF — حتى 10 ميجابايت</small><label className="owner-small-primary menuun-upload-button"><Upload size={14}/>{busy?"جارٍ العمل…":"رفع / استبدال الشعار"}<input type="file" accept={ACCEPTED_IMAGES} disabled={busy} onChange={uploadLogo}/></label>{logoUrl&&<button type="button" className="owner-small-danger" disabled={busy} onClick={removeLogo}><Trash2 size={14}/> إزالة الشعار</button>}</div></div>

    <div className="menuun-owner-media-grid" style={{marginTop:20}}>
      {([{kind:"hero_poster",title:"الصورة الرئيسية",item:heroMedia},{kind:"location_image",title:"صورة الموقع",item:locationMedia}] as const).map(slot=><article className="menuun-owner-media-card" key={slot.kind}>
        {slot.item?.public_url?<img src={slot.item.public_url} alt={slot.item.alt_ar||slot.title}/>:<div className="menuun-media-placeholder">{slot.title}</div>}
        <div><strong>{slot.title}</strong><small>{slot.kind==="hero_poster"?"تظهر في واجهة الصالون الرئيسية.":"تظهر في نهاية الصفحة بجوار معلومات الموقع."}</small>
          <label className="owner-small-primary menuun-upload-button"><Upload size={14}/>{slot.item?"استبدال الصورة":"إضافة صورة"}<input type="file" accept={ACCEPTED_IMAGES} disabled={busy} onChange={e=>uploadSpecialImage(e,slot.kind,slot.item)}/></label>
          {slot.item&&<button type="button" className="owner-small-danger" disabled={busy} onClick={()=>removeImage(slot.item!)}><Trash2 size={14}/> حذف الصورة</button>}
          {slot.item&&<><label>النص البديل بالعربية<input defaultValue={slot.item.alt_ar||""} maxLength={250} onBlur={e=>saveAltText(slot.item!,"alt_ar",e.currentTarget.value)}/></label><label>Alt text in English<input defaultValue={slot.item.alt_en||""} maxLength={250} onBlur={e=>saveAltText(slot.item!,"alt_en",e.currentTarget.value)}/></label></>}
        </div>
      </article>)}
    </div>

    <div style={{marginTop:26}}>
      <h3 style={{fontSize:15,margin:"0 0 12px"}}>صور الخدمات</h3>
      {!serviceImagesAvailable && <p role="status" className="owner-notice">تحديث قاعدة البيانات مطلوب لحفظ صور الخدمات. الصور الاسترشادية ستبقى ظاهرة إلى حين تطبيق التحديث.</p>}
      <div className="menuun-owner-media-grid">{services.map(service=><article className="menuun-owner-media-card" key={service.id}>{service.image_url?<img src={service.image_url} alt={service.name_ar}/>:<div className="menuun-media-placeholder">صورة الخدمة<br/>{service.name_ar}</div>}<div><strong>{service.name_ar}</strong><small>{service.duration_minutes} دقيقة · {service.price_sar} ر.س</small><label className="owner-small-primary menuun-upload-button"><Upload size={14}/>{service.image_url?"تغيير الصورة":"رفع صورة الخدمة"}<input type="file" accept={ACCEPTED_IMAGES} disabled={busy||!serviceImagesAvailable} onChange={e=>uploadServiceImage(e,service)}/></label>{service.image_url&&<button type="button" className="owner-small-danger" disabled={busy} onClick={()=>removeTargetImage("services",service)}><Trash2 size={14}/> إزالة الصورة</button>}</div></article>)}</div>
      {services.length===0 && <p className="empty">أضف الخدمات أولًا، ثم ارفع صورة لكل خدمة.</p>}
    </div>

    <div style={{marginTop:26}}>
      <h3 style={{fontSize:15,margin:"0 0 12px"}}>صور الحلاقين وفريق العمل</h3>
      <div className="menuun-owner-media-grid">{barbers.map(barber=><article className="menuun-owner-media-card" key={barber.id}>{barber.image_url?<img src={barber.image_url} alt={barber.display_name}/>:<div className="menuun-media-placeholder">صورة الفريق<br/>{barber.display_name}</div>}<div><strong>{barber.display_name}</strong><small>{barber.bio_ar||"أضف نبذة عن خبرة الحلاق من إعدادات الفريق."}</small><label className="owner-small-primary menuun-upload-button"><Upload size={14}/>{barber.image_url?"تغيير الصورة":"رفع صورة الحلاق"}<input type="file" accept={ACCEPTED_IMAGES} disabled={busy} onChange={e=>uploadBarberImage(e,barber)}/></label>{barber.image_url&&<button type="button" className="owner-small-danger" disabled={busy} onClick={()=>removeTargetImage("barbers",barber)}><Trash2 size={14}/> إزالة الصورة</button>}</div></article>)}</div>
      {barbers.length===0 && <p className="empty">أضف أعضاء الفريق من تبويب «فريق العمل» ثم ارفع صورهم من هنا.</p>}
    </div>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,marginTop:28,marginBottom:12,flexWrap:"wrap"}}><h3 style={{margin:0,fontSize:15}}>معرض الصور ({media.length})</h3><label className="owner-primary menuun-upload-button"><ImagePlus size={15}/>إضافة صور<input type="file" multiple accept={ACCEPTED_IMAGES} disabled={busy} onChange={uploadGallery}/></label></div>
    <div className="menuun-gallery-grid">{media.map(item=><article className="menuun-gallery-item" key={item.id}>{item.public_url&&<img src={item.public_url} alt={item.alt_ar||"صورة من الصالون"}/>}<span>{item.alt_ar||"صورة الصالون"}</span><label>النص البديل بالعربية<input defaultValue={item.alt_ar||""} maxLength={250} onBlur={e=>saveAltText(item,"alt_ar",e.currentTarget.value)}/></label><label>Alt text in English<input defaultValue={item.alt_en||""} maxLength={250} onBlur={e=>saveAltText(item,"alt_en",e.currentTarget.value)}/></label><button type="button" className="owner-small-danger" disabled={busy} onClick={()=>removeImage(item)} aria-label="حذف الصورة"><Trash2 size={14}/> حذف</button></article>)}</div>

    <form onSubmit={saveSocialLinks} className="menuun-social-form">
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><Globe size={18}/><h3 style={{margin:0,fontSize:15}}>{lang === "ar" ? "الموقع ووسائل التواصل الاجتماعي" : "Website & social media"}</h3></div>
      <p style={{fontSize:12,color:"#697469",lineHeight:1.9,marginTop:0}}>أدخل الروابط الكاملة التي تريد عرضها للزوار. لا نعرض إلا الروابط الآمنة التي تبدأ بـ HTTPS.</p>
      {!socialLinksAvailable && <p role="status" className="owner-notice">تحديث قاعدة البيانات مطلوب لتفعيل روابط التواصل والموقع.</p>}
      <div className="menuun-social-grid">
        <label><span><Instagram size={15}/> Instagram</span><input type="url" name="instagram_url" dir="ltr" placeholder="https://instagram.com/..." value={links.instagram_url} disabled={busy||!socialLinksAvailable} onChange={e=>setLinks(v=>({...v,instagram_url:e.target.value}))}/></label>
        <label><span><span style={{fontWeight:800}}>♪</span> TikTok</span><input type="url" name="tiktok_url" dir="ltr" placeholder="https://tiktok.com/@..." value={links.tiktok_url} disabled={busy||!socialLinksAvailable} onChange={e=>setLinks(v=>({...v,tiktok_url:e.target.value}))}/></label>
        <label><span><span style={{fontWeight:800}}>S</span> Snapchat</span><input type="url" name="snapchat_url" dir="ltr" placeholder="https://snapchat.com/add/..." value={links.snapchat_url} disabled={busy||!socialLinksAvailable} onChange={e=>setLinks(v=>({...v,snapchat_url:e.target.value}))}/></label>
        <label><span><Facebook size={15}/> Facebook</span><input type="url" name="facebook_url" dir="ltr" placeholder="https://facebook.com/..." value={links.facebook_url} disabled={busy||!socialLinksAvailable} onChange={e=>setLinks(v=>({...v,facebook_url:e.target.value}))}/></label>
        <label><span><MapPin size={15}/> رابط خرائط Google</span><input type="url" name="google_maps_url" dir="ltr" placeholder="https://maps.google.com/..." value={links.google_maps_url} disabled={busy||!socialLinksAvailable} onChange={e=>setLinks(v=>({...v,google_maps_url:e.target.value}))}/></label>
        <label><span><Globe size={15}/> الموقع الإلكتروني</span><input type="url" name="website_url" dir="ltr" placeholder="https://your-salon.com" value={links.website_url} disabled={busy||!socialLinksAvailable} onChange={e=>setLinks(v=>({...v,website_url:e.target.value}))}/></label>
      </div>
      <button type="submit" className="owner-primary" disabled={busy||!socialLinksAvailable}>{busy?(lang === "ar" ? "جارٍ الحفظ…" : "Saving…"):(lang === "ar" ? "حفظ روابط التواصل" : "Save social links")}</button>
    </form>
    {notice&&<p role="status" className="owner-notice" style={{marginTop:14}}>{notice}</p>}
  </section>;
}
