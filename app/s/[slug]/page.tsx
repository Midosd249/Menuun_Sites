import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./public-salon.module.css";
import SalonQrShare from "./qr-share";
import PublicBookingForm from "./booking-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Salon = { id:string; slug:string; name_ar:string; name_en:string|null; tagline_ar:string|null; description_ar:string|null; logo_url:string|null; phone:string|null; whatsapp:string|null; address_ar:string|null; city:string|null; timezone:string; currency_code:string; primary_color:string; accent_color:string };
type Service = { id:string; name_ar:string; description_ar:string|null; price_sar:number; duration_minutes:number; sort_order:number };
type Barber = { id:string; display_name:string; bio_ar:string|null; image_url:string|null; sort_order:number };
type Hours = { weekday:number; opens_at:string|null; closes_at:string|null; is_closed:boolean };
type Media = { id:string; kind:string; public_url:string|null; alt_ar:string|null; sort_order:number };
const weekdays = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const money = (value:number,currency:string) => new Intl.NumberFormat("ar-SA",{style:"currency",currency,maximumFractionDigits:0}).format(value);
const time = (value:string|null) => value ? value.slice(0,5) : "—";

async function getSalon(slug:string) {
  const db = await createSupabaseServerClient();
  const {data: salon,error} = await db.from("salons").select("id,slug,name_ar,name_en,tagline_ar,description_ar,logo_url,phone,whatsapp,address_ar,city,timezone,currency_code,primary_color,accent_color,is_active,is_published").eq("slug",slug).eq("is_active",true).eq("is_published",true).maybeSingle();
  if (error || !salon) return null;
  const [sr,br,hr,mr] = await Promise.all([
    db.from("services").select("id,name_ar,description_ar,price_sar,duration_minutes,sort_order").eq("salon_id",salon.id).eq("is_active",true).order("sort_order"),
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

export default async function PublicSalonPage({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const result = await getSalon(slug);
  if (!result) notFound();
  const {salon,services,barbers,hours,media} = result;
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://www.menuun.com";
  const publicUrl = new URL("/s/"+salon.slug,origin).toString();
  const wa = (salon.whatsapp || salon.phone || "").replace(/[^0-9]/g,"");
  const location = [salon.address_ar,salon.city].filter(Boolean).join("، ");
  const gallery = media.filter(x=>x.kind==="gallery" && x.public_url);
  const heroImage = gallery.length ? gallery[0] : null;
  const hero = heroImage?.public_url || null;
  const waHref = (message:string) => "https://wa.me/"+wa+"?text="+encodeURIComponent(message);
  return <main className={styles.site} style={{"--salon-ink":salon.primary_color,"--salon-accent":salon.accent_color} as CSSProperties} dir="rtl" lang="ar">
    <div className={styles.topline}><span>تجربة صالونك، بتفاصيله</span><span>صفحة رسمية عبر Menuun</span></div>
    <header className={styles.header}>
      <a className={styles.brand} href="#home" aria-label={salon.name_ar}>{salon.logo_url ? <img src={salon.logo_url} alt="" /> : <span className={styles.brandMark}>✳</span>}<span><strong>{salon.name_ar}</strong><small>{salon.name_en || "SALON EXPERIENCE"}</small></span></a>
      <nav aria-label="التنقل الرئيسي"><a href="#services">الخدمات</a><a href="#team">الفريق</a><a href="#hours">أوقات العمل</a></nav>
      <SalonQrShare publicUrl={publicUrl} salonName={salon.name_ar} />
    </header>
    <section className={styles.hero} id="home">
      <div className={styles.heroCopy}><p className={styles.eyebrow}>مساحتك للعناية والتجديد</p><h1>{salon.tagline_ar || "تفاصيل صغيرة، تجربة مختلفة."}</h1><p className={styles.description}>{salon.description_ar || "أهلًا بك في "+salon.name_ar+". اكتشف خدماتنا واختر ما يناسبك، وتواصل معنا لتنسيق موعدك."}</p>
        <div className={styles.heroActions}><a className={styles.primaryButton} href={wa ? waHref("مرحبًا، أرغب في حجز موعد لدى "+salon.name_ar) : "#services"} target={wa ? "_blank" : undefined} rel={wa ? "noreferrer" : undefined}>{wa ? "احجز عبر واتساب" : "اكتشف الخدمات"} ↙</a><a className={styles.secondaryButton} href="#services">تصفّح الخدمات</a></div>
        <div className={styles.quickFacts}>{location && <span>⌖ {location}</span>}{salon.phone && <a href={"tel:"+salon.phone}>☎ {salon.phone}</a>}</div>
      </div>
      <div className={styles.heroVisual}>{hero ? <img className={styles.heroImage} src={hero} alt={heroImage?.alt_ar || "صور "+salon.name_ar} /> : <div className={styles.artCard}><span className={styles.artNumber}>01 / MENUUN</span><span className={styles.artGlyph}>✳</span><strong>{salon.name_ar}</strong><small>CARE • CRAFT • DETAIL</small></div>}<div className={styles.visualCaption}><span>مساحة مصممة حولك</span><span>01 — 04</span></div></div>
    </section>
    <section className={styles.section} id="services"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>قائمة الخدمات</p><h2>اختر تجربتك القادمة.</h2></div><p>خدمات واضحة، أسعار معلنة، ووقت تعرفه قبل أن تبدأ.</p></div>
      {services.length ? <div className={styles.services}>{services.map((service,index)=><article className={styles.service} key={service.id}><span className={styles.serviceIndex}>{String(index+1).padStart(2,"0")}</span><div className={styles.serviceInfo}><h3>{service.name_ar}</h3>{service.description_ar && <p>{service.description_ar}</p>}<span>◷ {service.duration_minutes} دقيقة</span></div><strong className={styles.price}>{money(Number(service.price_sar),salon.currency_code)}</strong>{wa && <a className={styles.serviceAction} target="_blank" rel="noreferrer" href={waHref("مرحبًا، أرغب في حجز خدمة "+service.name_ar+" لدى "+salon.name_ar)} aria-label={"طلب حجز خدمة "+service.name_ar+" عبر واتساب"}>احجز ↗</a>}</article>)}</div> : <p className={styles.empty}>ستظهر الخدمات هنا بعد إضافتها من مساحة الصالون.</p>}
    </section>
    <PublicBookingForm slug={salon.slug} services={services} barbers={barbers} timezone={salon.timezone} />
    {barbers.length>0 && <section className={styles.teamSection} id="team"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>الأشخاص وراء التجربة</p><h2>تعرف على فريقنا.</h2></div><p>خبرة واهتمام بالتفاصيل في كل زيارة.</p></div><div className={styles.teamGrid}>{barbers.map((b,i)=><article className={styles.person} key={b.id}><div className={styles.personImage}>{b.image_url ? <img src={b.image_url} alt={b.display_name}/> : <span>{String(i+1).padStart(2,"0")}</span>}</div><h3>{b.display_name}</h3>{b.bio_ar && <p>{b.bio_ar}</p>}</article>)}</div></section>}
    {gallery.length>1 && <section className={styles.gallerySection}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>من أجواء المكان</p><h2>لمحات من عالمنا.</h2></div></div><div className={styles.gallery}>{gallery.slice(1,4).map(image=><img key={image.id} src={image.public_url!} alt={image.alt_ar||""}/>)}</div></section>}
    <section className={styles.infoSection} id="hours"><div className={styles.infoIntro}><p className={styles.eyebrow}>خطوتك التالية</p><h2>نرتب زيارتك بكل سهولة.</h2><p>تواصل معنا للاستفسار عن الخدمة المناسبة أو لتنسيق موعدك القادم.</p>{wa && <a className={styles.primaryButton} target="_blank" rel="noreferrer" href={waHref("مرحبًا، أرغب في الاستفسار عن "+salon.name_ar)}>تواصل عبر واتساب ↗</a>}{salon.phone && <a className={styles.phoneLink} href={"tel:"+salon.phone}>{salon.phone}</a>}</div>
      <div className={styles.hoursCard}><h3>أوقات العمل</h3>{hours.length ? hours.map(day=><div className={styles.hoursRow} key={day.weekday}><span>{weekdays[day.weekday]}</span><strong>{day.is_closed ? "مغلق" : time(day.opens_at)+" — "+time(day.closes_at)}</strong></div>) : <p className={styles.empty}>تواصل معنا لمعرفة أوقات العمل.</p>}{location && <p className={styles.location}>⌖ {location}</p>}</div></section>
    <footer className={styles.footer}><a className={styles.footerBrand} href="#home">{salon.name_ar} <span>✳</span></a><span>صفحة الصالون عبر Menuun</span><a href="#home">العودة للأعلى ↑</a></footer>
  </main>;
}