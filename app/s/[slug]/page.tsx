import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./public-salon.module.css";
import SalonQrShare from "./qr-share";
import PublicBookingForm from "./booking-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Salon = { id:string; slug:string; name_ar:string; name_en:string|null; tagline_ar:string|null; description_ar:string|null; logo_url:string|null; phone:string|null; whatsapp:string|null; address_ar:string|null; city:string|null; timezone:string; currency_code:string; primary_color:string; accent_color:string; template_key:string; instagram_url:string|null; tiktok_url:string|null; snapchat_url:string|null; facebook_url:string|null; google_maps_url:string|null; website_url:string|null };
type Service = { id:string; name_ar:string; description_ar:string|null; price_sar:number; duration_minutes:number; sort_order:number; image_url:string|null };
type Barber = { id:string; display_name:string; bio_ar:string|null; image_url:string|null; sort_order:number };
type Hours = { weekday:number; opens_at:string|null; closes_at:string|null; is_closed:boolean };
type Media = { id:string; kind:string; public_url:string|null; alt_ar:string|null; sort_order:number };
const weekdays = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const money = (value:number,currency:string) => new Intl.NumberFormat("ar-SA",{style:"currency",currency,maximumFractionDigits:0}).format(value);
const time = (value:string|null) => value ? value.slice(0,5) : "—";
const HERO_FALLBACK = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1500&q=85";
const SERVICE_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80"
];
const BARBER_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=700&q=80"
];

async function getSalon(slug:string) {
  const db = await createSupabaseServerClient();
  const legacySalonColumns = "id,slug,name_ar,name_en,tagline_ar,description_ar,logo_url,phone,whatsapp,address_ar,city,timezone,currency_code,primary_color,accent_color,is_active,is_published";
  let salon:any,error:any;
  ({data:salon,error}=await db.from("salons").select(legacySalonColumns+",template_key,instagram_url,tiktok_url,snapchat_url,facebook_url,google_maps_url,website_url").eq("slug",slug).eq("is_active",true).eq("is_published",true).maybeSingle());
  if (error && /template_key|instagram_url|tiktok_url|snapchat_url|facebook_url|google_maps_url|website_url/.test(error.message||"")) {
    const hasTemplateColumn = !/template_key/.test(error.message||"");
    const select = legacySalonColumns + (hasTemplateColumn ? ",template_key" : "");
    const fallback = await db.from("salons").select(select).eq("slug",slug).eq("is_active",true).eq("is_published",true).maybeSingle();
    salon = fallback.data ? { ...fallback.data, template_key: fallback.data.template_key || "atelier", instagram_url:null, tiktok_url:null, snapchat_url:null, facebook_url:null, google_maps_url:null, website_url:null } : null;
    error = fallback.error;
  }
  if (error || !salon) return null;
  let sr:any;
  ({data:sr.data,error:sr.error}=await db.from("services").select("id,name_ar,description_ar,price_sar,duration_minutes,sort_order,image_url").eq("salon_id",salon.id).eq("is_active",true).order("sort_order"));
  if (sr.error && /image_url/.test(sr.error.message||"")) {
    sr = await db.from("services").select("id,name_ar,description_ar,price_sar,duration_minutes,sort_order").eq("salon_id",salon.id).eq("is_active",true).order("sort_order");
    sr.data = (sr.data || []).map((service:any)=>({...service,image_url:null}));
  }
  const [br,hr,mr] = await Promise.all([
    db.from("barbers").select("id,display_name,bio_ar,image_url,sort_order").eq("salon_id",salon.id).eq("is_active",true).order("sort_order"),
    db.from("business_hours").select("weekday,opens_at,closes_at,is_closed").eq("salon_id",salon.id).order("weekday"),
    db.from("media_assets").select("id,kind,public_url,alt_ar,sort_order").eq("salon_id",salon.id).eq("is_public",true).eq("is_active",true).order("sort_order")
  ]);
  if (sr.error || br.error || hr.error || mr.error) return null;
  return {salon:salon as Salon,services:(sr.data||[]) as Service[],barbers:(br.data||[]) as Barber[],hours:(hr.data||[]) as Hours[],media:(mr.data||[]) as Media[]};
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata> {
  const {slug} = await params;
  const result = await getSalon(slug);
  if (!result) return {title:"الصفحة غير متاحة",robots:{index:false,follow:false}};
  const description = result.salon.description_ar || "الخدمات والأسعار ومعلومات الصالون وطرق التواصل والحجز.";
  return {title:result.salon.name_ar,description,alternates:{canonical:"/s/"+result.salon.slug},openGraph:{type:"website",title:result.salon.name_ar,description,url:"/s/"+result.salon.slug},robots:{index:true,follow:true}};
}

export default async function PublicSalonPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{template?:string}>}) {
  const [{slug},search] = await Promise.all([params,searchParams]);
  const requestedTemplate = search?.template;
  const templateKey = requestedTemplate && ["atelier","oasis","rose"].includes(requestedTemplate) ? requestedTemplate : undefined;
  const result = await getSalon(slug);
  if (!result) notFound();
  const {salon,services,barbers,hours,media} = result;
  const activeTemplate = templateKey || salon.template_key || "atelier";
  const rawWa = (salon.whatsapp || salon.phone || "").replace(/[^0-9]/g,"");
  const wa = rawWa.startsWith("00") ? rawWa.slice(2) : rawWa.startsWith("0") ? "966"+rawWa.slice(1) : /^[5][0-9]{8}$/.test(rawWa) ? "966"+rawWa : rawWa;
  const location = [salon.address_ar,salon.city].filter(Boolean).join("، ");
  const mapHref = salon.google_maps_url || (location ? "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(location) : null);
  const socialLinks = [
    { label:"Instagram", href:salon.instagram_url },
    { label:"TikTok", href:salon.tiktok_url },
    { label:"Snapchat", href:salon.snapchat_url },
    { label:"Facebook", href:salon.facebook_url },
    { label:"الموقع الإلكتروني", href:salon.website_url }
  ].filter((item):item is {label:string;href:string} => Boolean(item.href && /^https:\/\//i.test(item.href)));
  const gallery = media.filter(x=>x.kind==="gallery" && x.public_url);
  const heroImage = gallery.length ? gallery[0] : null;
  const hero = heroImage?.public_url || HERO_FALLBACK;
  const waHref = (message:string) => "https://wa.me/"+wa+"?text="+encodeURIComponent(message);
  return <main className={styles.site+" "+(activeTemplate==="oasis"?styles.templateOasis:activeTemplate==="rose"?styles.templateRose:styles.templateAtelier)} style={{"--salon-ink":activeTemplate==="atelier"?salon.primary_color:undefined,"--salon-accent":activeTemplate==="atelier"?salon.accent_color:undefined} as CSSProperties} dir="rtl" lang="ar">
    <div className={styles.topline}><span>تجربة صالونك، بتفاصيله</span><span>صفحة رسمية عبر Menuun</span></div>
    <header className={styles.header}>
      <a className={styles.brand} href="#home" aria-label={salon.name_ar}>{salon.logo_url ? <img src={salon.logo_url} alt="" /> : <span className={styles.brandMark}>✳</span>}<span><strong>{salon.name_ar}</strong><small>{salon.name_en || "SALON EXPERIENCE"}</small></span></a>
      <nav aria-label="التنقل الرئيسي"><a href="#services">الخدمات</a><a href="#booking">الحجز</a><a href="#team">الفريق</a><a href="#hours">أوقات العمل</a></nav>
      <SalonQrShare slug={salon.slug} salonName={salon.name_ar} />
    </header>
    <section className={styles.hero} id="home">
      <div className={styles.heroCopy}><p className={styles.eyebrow}>مساحتك للعناية والتجديد</p><h1>{salon.tagline_ar || "تفاصيل صغيرة، تجربة مختلفة."}</h1><p className={styles.description}>{salon.description_ar || "أهلًا بك في "+salon.name_ar+". اكتشف خدماتنا واختر ما يناسبك، وتواصل معنا لتنسيق موعدك."}</p>
        <div className={styles.heroActions}><a className={styles.primaryButton} href={services.length ? "#booking" : wa ? waHref("مرحبًا، أرغب في حجز موعد لدى "+salon.name_ar) : "#services"} target={!services.length && wa ? "_blank" : undefined} rel={!services.length && wa ? "noreferrer" : undefined}>{services.length ? "احجز موعدك" : wa ? "تواصل عبر واتساب" : "اكتشف الخدمات"} ↙</a>{wa && <a className={styles.secondaryButton} href={waHref("مرحبًا، أرغب في حجز موعد لدى "+salon.name_ar)} target="_blank" rel="noreferrer">احجز عبر واتساب ↗</a>}<a className={styles.secondaryButton} href="#services">تصفّح الخدمات</a></div>
        <div className={styles.quickFacts}>{location && <span>⌖ {location}</span>}{salon.phone && <a href={"tel:"+salon.phone}>☎ {salon.phone}</a>}</div>
      </div>
      <div className={styles.heroVisual}><img className={styles.heroImage} src={hero} alt={heroImage?.alt_ar || "صورة استرشادية لأجواء الحلاقة والعناية"} fetchPriority="high" /><div className={styles.visualCaption}><span>مساحة مصممة حولك</span><span>01 — 04</span></div></div>
    </section>
    <section className={styles.section} id="services"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>قائمة الخدمات</p><h2>اختر تجربتك القادمة.</h2></div><p>خدمات واضحة، أسعار معلنة، ووقت تعرفه قبل أن تبدأ.</p></div>
      {services.length ? <div className={styles.services}>{services.map((service,index)=><article className={styles.service} key={service.id}><div className={styles.serviceImage}><img src={service.image_url || SERVICE_IMAGE_FALLBACKS[index % SERVICE_IMAGE_FALLBACKS.length]} alt={service.image_url ? service.name_ar : "صورة استرشادية لخدمة "+service.name_ar} loading="lazy"/>{!service.image_url && <span>صورة استرشادية</span>}</div><span className={styles.serviceIndex}>{String(index+1).padStart(2,"0")}</span><div className={styles.serviceInfo}><h3>{service.name_ar}</h3>{service.description_ar && <p>{service.description_ar}</p>}<span>◷ {service.duration_minutes} دقيقة</span></div><strong className={styles.price}>{money(Number(service.price_sar),salon.currency_code)}</strong>{services.length > 0 && <a className={styles.serviceAction} href="#booking" aria-label={"حجز خدمة "+service.name_ar}>احجز أونلاين ↗</a>}{wa && <a className={styles.serviceAction} target="_blank" rel="noreferrer" href={waHref("مرحبًا، أرغب في حجز خدمة "+service.name_ar+" لدى "+salon.name_ar)} aria-label={"طلب حجز خدمة "+service.name_ar+" عبر واتساب"}>واتساب ↗</a>}</article>)}</div> : <p className={styles.empty}>ستظهر الخدمات هنا بعد إضافتها من مساحة الصالون.</p>}
    </section>
    <PublicBookingForm slug={salon.slug} services={services} barbers={barbers} timezone={salon.timezone} />
    {barbers.length>0 && <section className={styles.teamSection} id="team"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>الأشخاص وراء التجربة</p><h2>تعرف على فريقنا.</h2></div><p>خبرة واهتمام بالتفاصيل في كل زيارة.</p></div><div className={styles.teamGrid}>{barbers.map((b,i)=><article className={styles.person} key={b.id}><div className={styles.personImage}><img src={b.image_url || BARBER_IMAGE_FALLBACKS[i % BARBER_IMAGE_FALLBACKS.length]} alt={b.image_url ? b.display_name : "صورة استرشادية للحلاق — يرجى استبدالها بالصورة الحقيقية"} loading="lazy"/>{!b.image_url && <span className={styles.imagePlaceholderLabel}>صورة استرشادية</span>}</div><h3>{b.display_name}</h3>{b.bio_ar && <p>{b.bio_ar}</p>}</article>)}</div></section>}
    {gallery.length>1 && <section className={styles.gallerySection}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>من أجواء المكان</p><h2>لمحات من عالمنا.</h2></div></div><div className={styles.gallery}>{gallery.slice(1,4).map(image=><img key={image.id} src={image.public_url!} alt={image.alt_ar||""}/>)}</div></section>}
    <section className={styles.infoSection} id="hours"><div className={styles.infoIntro}><p className={styles.eyebrow}>خطوتك التالية</p><h2>نرتب زيارتك بكل سهولة.</h2><p>تواصل معنا للاستفسار عن الخدمة المناسبة أو لتنسيق موعدك القادم.</p>{wa && <a className={styles.primaryButton} target="_blank" rel="noreferrer" href={waHref("مرحبًا، أرغب في الاستفسار عن "+salon.name_ar)}>تواصل عبر واتساب ↗</a>}{salon.phone && <a className={styles.phoneLink} href={"tel:"+salon.phone}>{salon.phone}</a>}</div>
      <div className={styles.hoursCard}><h3>أوقات العمل</h3>{hours.length ? hours.map(day=><div className={styles.hoursRow} key={day.weekday}><span>{weekdays[day.weekday]}</span><strong>{day.is_closed ? "مغلق" : time(day.opens_at)+" — "+time(day.closes_at)}</strong></div>) : <p className={styles.empty}>تواصل معنا لمعرفة أوقات العمل.</p>}{location && <p className={styles.location}>⌖ {mapHref ? <a href={mapHref} target="_blank" rel="noopener noreferrer">{location} — الاتجاهات ↗</a> : location}</p>}{socialLinks.length>0 && <div className={styles.socialLinks} aria-label="روابط التواصل الاجتماعي">{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>}</div></section>
    <footer className={styles.footer}><a className={styles.footerBrand} href="#home">{salon.name_ar} <span>✳</span></a>{socialLinks.length>0 && <nav className={styles.footerSocials} aria-label="روابط التواصل">{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</nav>}<span>صفحة الصالون عبر Menuun</span><a href="#home">العودة للأعلى ↑</a></footer>
  </main>;
}