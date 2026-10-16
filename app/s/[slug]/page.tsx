import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./public-salon.module.css";
import SalonQrShare from "./qr-share";
import { getMenuunPublicOrigin } from "@/lib/public-origin";
import PublicBookingForm from "./booking-form";
import SalonImage from "./salon-image";
import LocaleCookieSync from "./locale-cookie-sync";
import { resolveSalonBrandNames } from "./salon-branding";
import { BARBER_IMAGE_FALLBACKS, DEMO_CONTACT, DEMO_SERVICES, GROOM_PACKAGE, HERO_IMAGE_FALLBACK as HERO_FALLBACK, LOCATION_IMAGES, OUR_WORK_IMAGES, SERVICE_IMAGE_FALLBACKS, THEME_IDENTITIES } from "./salon-demo-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Salon = { id:string; slug:string; name_ar:string; name_en:string|null; tagline_ar:string|null; description_ar:string|null; logo_url:string|null; phone:string|null; whatsapp:string|null; address_ar:string|null; city:string|null; timezone:string; currency_code:string; primary_color:string; accent_color:string; template_key:string; hero_mode?:string; instagram_url:string|null; tiktok_url:string|null; snapchat_url:string|null; facebook_url:string|null; google_maps_url:string|null; website_url:string|null };
type Service = { id:string; name_ar:string; name_en?:string|null; description_ar:string|null; description_en?:string|null; price_sar:number; duration_minutes:number; sort_order:number; image_url:string|null };
type Barber = { id:string; display_name:string; display_name_en?:string|null; title_ar?:string|null; title_en?:string|null; bio_ar:string|null; bio_en?:string|null; specialties_ar?:string|null; specialties_en?:string|null; availability_ar?:string|null; availability_en?:string|null; booking_url?:string|null; image_url:string|null; sort_order:number };
type Hours = { weekday:number; opens_at:string|null; closes_at:string|null; is_closed:boolean };
type Media = { id:string; kind:string; public_url:string|null; alt_ar:string|null; alt_en?:string|null; sort_order:number };
const weekdays = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const money = (value:number,currency:string) => new Intl.NumberFormat("ar-SA",{style:"currency",currency,maximumFractionDigits:0}).format(value);
const time = (value:string|null) => value ? value.slice(0,5) : "—";
const isUnfinishedCopy = (value:string|null|undefined) => /صورة\s*(إرشادية|استرشادية)|يرجى استبدالها|ملف تجريبي|بيانات تجريبية|بانتظار الإعداد|أضف (اسم|خدمات|السعر)|نموذج استرشادي|placeholder|add (your|a) (barber|service|photo)/i.test(value || "");
async function getSalon(slug:string) {
  const db = await createSupabaseServerClient();
  const legacySalonColumns = "id,slug,name_ar,name_en,tagline_ar,description_ar,logo_url,phone,whatsapp,address_ar,city,timezone,currency_code,primary_color,accent_color,is_active,is_published";
  let salon:any,error:any;
  ({data:salon,error}=await db.from("salons").select(legacySalonColumns+",template_key,hero_mode,instagram_url,tiktok_url,snapchat_url,facebook_url,google_maps_url,website_url").eq("slug",slug).eq("is_active",true).eq("is_published",true).maybeSingle());
  if (error && /template_key|instagram_url|tiktok_url|snapchat_url|facebook_url|google_maps_url|website_url|hero_mode/.test(error.message||"")) {
    const hasTemplateColumn = !/template_key/.test(error.message||"");
    const select = legacySalonColumns + (hasTemplateColumn ? ",template_key" : "");
    const fallback = await db.from("salons").select(select).eq("slug",slug).eq("is_active",true).eq("is_published",true).maybeSingle();
    const fallbackRow = fallback.data as any;
    salon = fallbackRow ? { ...fallbackRow, template_key: fallbackRow.template_key || "atelier", hero_mode:"image", instagram_url:null, tiktok_url:null, snapchat_url:null, facebook_url:null, google_maps_url:null, website_url:null } : null;
    error = fallback.error;
  }
  if (error || !salon) return null;
  let sr:any = await db.from("services").select("id,name_ar,name_en,description_ar,description_en,price_sar,duration_minutes,sort_order,image_url").eq("salon_id",salon.id).eq("is_active",true).order("sort_order");
  if (sr.error && /image_url/.test(sr.error.message||"")) {
    sr = await db.from("services").select("id,name_ar,name_en,description_ar,description_en,price_sar,duration_minutes,sort_order").eq("salon_id",salon.id).eq("is_active",true).order("sort_order");
    sr.data = (sr.data || []).map((service:any)=>({...service,image_url:null}));
  }
  const [br,hr,mr] = await Promise.all([
    db.from("barbers").select("id,display_name,display_name_en,title_ar,title_en,bio_ar,bio_en,specialties_ar,specialties_en,availability_ar,availability_en,booking_url,image_url,sort_order").eq("salon_id",salon.id).eq("is_active",true).order("sort_order"),
    db.from("business_hours").select("weekday,opens_at,closes_at,is_closed").eq("salon_id",salon.id).order("weekday"),
    db.from("media_assets").select("id,kind,public_url,alt_ar,alt_en,sort_order").eq("salon_id",salon.id).eq("is_public",true).eq("is_active",true).order("sort_order")
  ]);
  if (sr.error || br.error || hr.error || mr.error) return null;
  return {salon:salon as Salon,services:(sr.data||[]) as Service[],barbers:(br.data||[]) as Barber[],hours:(hr.data||[]) as Hours[],media:(mr.data||[]) as Media[]};
}

export async function generateMetadata({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string;template?:string}>}):Promise<Metadata> {
  const [{slug},search,cookieStore] = await Promise.all([params,searchParams,cookies()]);
  const result = await getSalon(slug);
  if (!result) return {title:"الصفحة غير متاحة",robots:{index:false,follow:false}};
  const metadataNames = resolveSalonBrandNames(result.salon, /^(atelier|oasis|rose)(-|$)/i.test(result.salon.slug));
  const locale = search.lang === "en" || (!search.lang && cookieStore.get("menuun-locale")?.value === "en") ? "en" : "ar";
  const salonName = locale === "en" ? metadataNames.nameEn : metadataNames.nameAr;
  const title = salonName;
  const rawDescription = result.salon.description_ar;
  const topServices = result.services.slice(0, 3).map(service => service.name_ar).filter(Boolean);
  const neutralDescription = [`خدمات ${salonName}`, result.salon.city ? `في ${result.salon.city}` : null, topServices.length ? `تشمل ${topServices.join("، ")}` : "للعناية الشخصية والحجز والتواصل"].filter(Boolean).join("، ") + ".";
  const description = isUnfinishedCopy(rawDescription) || !rawDescription?.trim() ? neutralDescription : rawDescription.trim();
  return {title,description,alternates:{canonical:"/s/"+result.salon.slug},openGraph:{type:"website",title,description,url:"/s/"+result.salon.slug},robots:{index:true,follow:true}};
}

export default async function PublicSalonPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{lang?:string;template?:string}>}) {
  const [{slug},search,cookieStore] = await Promise.all([params,searchParams,cookies()]);
  const english = search?.lang === "en" || (!search?.lang && cookieStore.get("menuun-locale")?.value === "en");
  const result = await getSalon(slug);
  if (!result) notFound();
  const {salon,services,barbers,hours,media} = result;
  const requestedTemplate = search?.template;
  let previewTemplate: string | undefined;
  if (requestedTemplate && ["atelier","oasis","rose"].includes(requestedTemplate)) {
    const authDb = await createSupabaseServerClient();
    const { data: authData, error: authError } = await authDb.auth.getClaims();
    const userId = !authError && typeof authData?.claims?.sub === "string" ? authData.claims.sub : null;
    if (userId) {
      const { data: membership } = await authDb.from("salon_members")
        .select("salon_id")
        .eq("salon_id", salon.id)
        .eq("user_id", userId)
        .eq("is_active", true)
        .maybeSingle();
      if (membership) previewTemplate = requestedTemplate;
    }
  }
  const activeTemplate = previewTemplate || salon.template_key || "atelier";
  const isDemoSalon = /^(atelier|oasis|rose)(-|$)/i.test(salon.slug);
  const themeIdentity = THEME_IDENTITIES[activeTemplate as keyof typeof THEME_IDENTITIES] || THEME_IDENTITIES.atelier;
  const { nameAr: displaySalonNameAr, nameEn: displaySalonNameEn } = resolveSalonBrandNames(salon, isDemoSalon);
  const displayTaglineAr = isDemoSalon ? themeIdentity.taglineAr : (isUnfinishedCopy(salon.tagline_ar) ? null : salon.tagline_ar);
  const displayDescriptionAr = isDemoSalon ? "تجربة عناية متقنة تجمع بين القص الدقيق، وراحة الزيارة، والاهتمام بالتفاصيل." : (isUnfinishedCopy(salon.description_ar) ? null : salon.description_ar);
  const displayPhone = isDemoSalon ? (salon.phone || DEMO_CONTACT.phone) : salon.phone;
  const displayWhatsapp = isDemoSalon ? (salon.whatsapp || DEMO_CONTACT.whatsapp) : (salon.whatsapp || salon.phone || "");
  const rawWa = displayWhatsapp.replace(/[^0-9]/g,"");
  const wa = rawWa.startsWith("00") ? rawWa.slice(2) : rawWa.startsWith("0") ? "966"+rawWa.slice(1) : /^[5][0-9]{8}$/.test(rawWa) ? "966"+rawWa : rawWa;
  const location = isDemoSalon ? (english ? DEMO_CONTACT.address_en : (salon.address_ar || DEMO_CONTACT.address_ar)) : [salon.address_ar,salon.city].filter(Boolean).join("، ");
  const mapHref = salon.google_maps_url || (isDemoSalon ? DEMO_CONTACT.map_url : location ? "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(location) : null);
  const bookingHref = (serviceId?:string) => { const params = new URLSearchParams(); if (previewTemplate) params.set("template", previewTemplate); if (english) params.set("lang", "en"); if (serviceId) params.set("service", serviceId); return (params.size ? "?"+params.toString() : "")+"#booking"; };
  const socialLinks = [
    { label:"Instagram", href:salon.instagram_url },
    { label:"TikTok", href:salon.tiktok_url },
    { label:"Snapchat", href:salon.snapchat_url },
    { label:"Facebook", href:salon.facebook_url },
    { label:english ? "Website" : "الموقع الإلكتروني", href:salon.website_url }
  ].filter((item):item is {label:string;href:string} => Boolean(item.href && /^https:\/\//i.test(item.href)));
  const packageServices = services.filter(service => /باقة|package/i.test(service.name_ar) || /package/i.test(service.name_en || ""));
  const packageIds = new Set(packageServices.map(service => service.id));
  const demoBaseServices:Service[] = isDemoSalon
    ? DEMO_SERVICES.map((item,index) => {
        const stored = services[index];
        return { id: stored?.id || "demo-service-"+item.key, name_ar: item.name_ar, name_en: item.name_en, description_ar: item.description_ar, description_en: item.description_en, price_sar: stored ? Number(stored.price_sar) : item.price_sar, duration_minutes: stored?.duration_minutes || item.duration_minutes, sort_order: index, image_url: stored?.image_url || item.image_url };
      })
    : [];
  const demoBaseIds = new Set(demoBaseServices.map(service => service.id));
  const displayServices:Service[] = isDemoSalon
    ? [...demoBaseServices, ...services.filter(service => !demoBaseIds.has(service.id) && !packageIds.has(service.id)).map(service => ({ ...service, name_ar: isUnfinishedCopy(service.name_ar) ? "خدمة العناية" : service.name_ar, description_ar: isUnfinishedCopy(service.description_ar) ? "تواصل مع الصالون لمعرفة تفاصيل الخدمة." : service.description_ar }))]
    : services.filter(service => !packageIds.has(service.id)).map(service => ({ ...service, name_ar: isUnfinishedCopy(service.name_ar) ? "خدمة العناية" : service.name_ar, description_ar: isUnfinishedCopy(service.description_ar) ? "تواصل مع الصالون لمعرفة تفاصيل الخدمة." : service.description_ar }));
  const displayPackages = packageServices.length ? packageServices.map((service,index) => {
    const isGroom = /العريس|groom/i.test(service.name_ar) || /groom/i.test(service.name_en || "");
    return { id:service.id, name_ar:service.name_ar, name_en:service.name_en || (isGroom ? GROOM_PACKAGE.name_en : "Premium Grooming Package"), description_ar:service.description_ar || (isGroom ? GROOM_PACKAGE.description_ar : "تجربة عناية مصممة لتناسب احتياجاتك."), description_en:service.description_en || (isGroom ? GROOM_PACKAGE.description_en : "A considered grooming experience tailored to your needs."), included_ar:isGroom ? GROOM_PACKAGE.included_ar : [], included_en:isGroom ? GROOM_PACKAGE.included_en : [], duration_minutes:service.duration_minutes, price_sar:Number(service.price_sar), image_url:service.image_url || (isGroom ? GROOM_PACKAGE.image_url : HERO_FALLBACK) };
  }) : (isDemoSalon ? [{ id:"demo-groom-package", ...GROOM_PACKAGE }] : []);
  const displayBarbers:Barber[] = barbers.length ? barbers.map((barber,index)=>({
    ...barber,
    display_name: isUnfinishedCopy(barber.display_name) ? (english ? ["Senior Barber","Grooming Specialist","Style Consultant"][index%3] : ["خبير القص","متخصص العناية","خبير التصفيف"][index%3]) : barber.display_name,
    bio_ar: isUnfinishedCopy(barber.bio_ar) ? (english ? ["Precision cuts and considered finishing details.","Thoughtful beard shaping and classic grooming.","Contemporary styling tailored to your look."][index%3] : ["قصات دقيقة واهتمام بالتفاصيل الختامية.","عناية متقنة باللحية وتفاصيل الحلاقة الكلاسيكية.","تصفيف عصري يناسب إطلالتك."][index%3]) : barber.bio_ar,
    image_url: barber.image_url || (isDemoSalon ? BARBER_IMAGE_FALLBACKS[index%BARBER_IMAGE_FALLBACKS.length] : null),
  })) : (isDemoSalon ? [
    {id:"demo-barber-1",display_name:english ? "Senior Barber" : "خبير القص",bio_ar:english ? "Precision cuts and considered finishing details." : "قصات دقيقة واهتمام بالتفاصيل الختامية.",image_url:BARBER_IMAGE_FALLBACKS[0],sort_order:0},
    {id:"demo-barber-2",display_name:english ? "Grooming Specialist" : "متخصص العناية",bio_ar:english ? "Thoughtful beard shaping and classic grooming." : "عناية متقنة باللحية وتفاصيل الحلاقة الكلاسيكية.",image_url:BARBER_IMAGE_FALLBACKS[1],sort_order:1},
    {id:"demo-barber-3",display_name:english ? "Style Consultant" : "خبير التصفيف",bio_ar:english ? "Contemporary styling tailored to your look." : "تصفيف عصري يناسب إطلالتك.",image_url:BARBER_IMAGE_FALLBACKS[2],sort_order:2}
  ] : []);
  const gallery = media.filter(x=>x.kind==="gallery" && x.public_url);
  const heroImage = media.find(x=>x.kind==="hero_poster" && x.public_url) || null;
  const heroVideo = salon.hero_mode === "video" ? media.find(x=>x.kind==="hero_video" && x.public_url) || null : null;
  const hero = heroImage?.public_url || HERO_FALLBACK;
  const locationPhoto = media.find(x=>x.kind==="location_image" && x.public_url) || null;
  const locationImageConfig = LOCATION_IMAGES[activeTemplate as keyof typeof LOCATION_IMAGES] || LOCATION_IMAGES.atelier;
  const bookingServices = services.map((service,index)=>({...service,name_en:service.name_en || DEMO_SERVICES[index]?.name_en || undefined,description_en:service.description_en || DEMO_SERVICES[index]?.description_en || undefined}));

  const waHref = (message:string) => "https://wa.me/"+wa+"?text="+encodeURIComponent(message);
  const portfolio = gallery.length ? gallery.map((image,index)=>({src:image.public_url!,alt_ar:image.alt_ar || "تفاصيل من أعمال الحلاقة والعناية",alt_en:image.alt_en || "Barbering and grooming portfolio detail",category_ar:"من أعمالنا",category_en:"Our work"})) : OUR_WORK_IMAGES;
  const shownHours = hours.length ? hours.map(h=>({...h,display_day:(english?["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]:["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"])[h.weekday] || "",display_hours:h.is_closed?(english?"Closed":"مغلق"):(english?((h.opens_at||"10:00").slice(0,5)+"–"+(h.closes_at||"22:00").slice(0,5)):((h.opens_at||"10:00").slice(0,5)+"–"+(h.closes_at||"22:00").slice(0,5)))})) : (isDemoSalon ? (english ? DEMO_CONTACT.hours_en : DEMO_CONTACT.hours_ar).map((item,index)=>({weekday:index,opens_at:null,closes_at:null,is_closed:false,display_day:item.day,display_hours:item.hours})) : hours);
  return <main className={styles.site+" "+(activeTemplate==="oasis"?styles.templateOasis:activeTemplate==="rose"?styles.templateRose:styles.templateAtelier)} style={{"--salon-ink":activeTemplate==="atelier"?salon.primary_color:undefined,"--salon-accent":activeTemplate==="atelier"?salon.accent_color:undefined} as CSSProperties} dir={english ? "ltr" : "rtl"} lang={english ? "en" : "ar"}>
    <div className={styles.topline}><span>{english ? "A considered grooming experience" : "تجربة صالونك، بتفاصيله"}</span><span>{english ? displaySalonNameEn + " · A salon experience by Menuun" : displaySalonNameAr + " · تجربة صالون عبر Menuun"}</span></div>
    <header className={styles.header}>
      <a className={styles.brand} href="#home" aria-label={displaySalonNameAr}>{salon.logo_url ? <img src={salon.logo_url} alt={english ? displaySalonNameEn : displaySalonNameAr} /> : <span className={styles.brandMark}>✳</span>}<span><strong>{english ? (displaySalonNameEn) : displaySalonNameAr}</strong><small>{displaySalonNameEn || "SALON EXPERIENCE"}</small></span></a>
      <nav aria-label={english ? "Main navigation" : "التنقل الرئيسي"}><a href="#services">{english ? "Services" : "الخدمات"}</a><a href="#booking">{english ? "Booking" : "الحجز"}</a><a href="#work">{english ? "Our work" : "أعمالنا"}</a><a href="#hours">{english ? "Visit us" : "معلومات الزيارة"}</a></nav><a className={styles.languageToggle} href={"?"+(previewTemplate?"template="+encodeURIComponent(previewTemplate)+"&":"")+"lang="+(english?"ar":"en")} lang={english?"ar":"en"}>{english ? "العربية" : "English"}</a>
      <SalonQrShare slug={salon.slug} salonName={english ? displaySalonNameEn : displaySalonNameAr} templateName={english ? "Salon website" : "موقع الصالون"} publicOrigin={getMenuunPublicOrigin()} />
    </header>
    <section className={styles.hero} id="home">
      <div className={styles.heroCopy}><p className={styles.eyebrow}>{english ? "YOUR GROOMING RITUAL" : "مساحتك للعناية والتجديد"}</p><h1>{english ? "Good grooming. Thoughtful details." : (displayTaglineAr || "تفاصيل صغيرة، تجربة مختلفة.")}</h1>{!english && activeTemplate === "atelier" && displayPhone && <a className={styles.atelierPhone} href={"tel:"+displayPhone}>☎ {displayPhone}</a>}<p className={styles.description}>{english ? "A considered grooming experience built around precision, comfort and personal style." : (displayDescriptionAr || "أهلًا بك في "+displaySalonNameAr+". اكتشف خدماتنا واختر ما يناسبك، وتواصل معنا لتنسيق موعدك.")}</p>
        <div className={styles.heroActions}><a className={styles.primaryButton} href={services.length ? "#booking" : wa ? waHref(english ? "Hello, I would like to book an appointment at "+displaySalonNameEn : "مرحبًا، أرغب في حجز موعد لدى "+displaySalonNameAr) : "#services"} target={!services.length && wa ? "_blank" : undefined} rel={!services.length && wa ? "noreferrer" : undefined}>{english ? "Book an appointment" : "احجز موعدك"} ↙</a>{wa && <a className={styles.secondaryButton} href={waHref(english ? "Hello, I would like to book an appointment at "+(displaySalonNameEn) : "مرحبًا، أرغب في حجز موعد لدى "+displaySalonNameAr)} target="_blank" rel="noopener noreferrer">{english ? "Book on WhatsApp" : "احجز عبر واتساب"} ↗</a>}<a className={styles.secondaryButton} href="#services">{english ? "Explore services" : "تصفّح الخدمات"}</a></div>
        <div className={styles.quickFacts}>{location && <span>⌖ {location}</span>}{displayPhone && (english || activeTemplate !== "atelier") && <a href={"tel:"+displayPhone}>{english ? "" : "☎ "}{displayPhone}</a>}</div>
      </div>
      <div className={styles.heroVisual}>{heroVideo?.public_url?<video className={styles.heroImage} src={heroVideo.public_url} poster={hero} autoPlay muted loop playsInline aria-label={english?(heroVideo.alt_en||"Hero video"):(heroVideo.alt_ar||"فيديو الواجهة الرئيسية")} />:<SalonImage className={styles.heroImage} src={hero} fallbackSrc={HERO_FALLBACK} alt={english ? (heroImage?.alt_en || "Contemporary men's grooming salon interior") : (heroImage?.alt_ar || "أجواء صالون رجالي معاصر للعناية والتصفيف")} fetchPriority="high" loading="eager" />}<div className={styles.visualCaption}><span>{english ? "A space designed around you" : "مساحة مصممة حولك"}</span><span>01 — 04</span></div></div>
    </section>
    <section className={styles.section} id="services"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{english ? "THE SERVICE MENU" : "قائمة الخدمات"}</p><h2>{english ? "Choose your next ritual." : "اختر تجربتك القادمة."}</h2></div><p>{english ? "Thoughtful services, clear starting prices and time estimates." : "خدمات واضحة، أسعار معلنة، ووقت تعرفه قبل أن تبدأ."}</p></div>
      <div className={styles.services}>{displayServices.map((service,index)=>{const label=english&&isDemoSalon?(service.name_en || DEMO_SERVICES[index]?.name_en || service.name_ar):service.name_ar;const description=english&&isDemoSalon?(service.description_en || DEMO_SERVICES[index]?.description_en || service.description_ar):service.description_ar;const price=isDemoSalon?((english?"From ":"ابتداءً من ")+Number(service.price_sar)+(english?" SAR":" ر.س.")):Number(service.price_sar)>0?money(Number(service.price_sar),salon.currency_code):(english?"Ask for price":"تواصل لمعرفة السعر");const isStored=services.some(item=>item.id===service.id);return <article className={styles.service} key={service.id}><div className={styles.serviceImage}><SalonImage src={service.image_url || SERVICE_IMAGE_FALLBACKS[index % SERVICE_IMAGE_FALLBACKS.length]} fallbackSrc={SERVICE_IMAGE_FALLBACKS[(index+1) % SERVICE_IMAGE_FALLBACKS.length]} alt={label} loading="lazy" /></div><span className={styles.serviceIndex}>{String(index+1).padStart(2,"0")}</span><div className={styles.serviceInfo}><h3>{label}</h3>{description && <p>{description}</p>}<span>◷ {service.duration_minutes} {english?"min":"دقيقة"}</span></div><strong className={styles.price}>{price}</strong><div className={styles.serviceActions}>{isStored ? <a className={styles.serviceAction} href={bookingHref(service.id)} aria-label={(english?"Book service ":"حجز خدمة ")+label}>{english?"Book this service":"احجز الخدمة"} ↗</a> : wa && <a className={styles.serviceAction} target="_blank" rel="noopener noreferrer" href={waHref((english?"Hello, I would like to book ":"مرحبًا، أرغب في حجز خدمة ")+label+(english?" at ":" لدى ")+(english?(displaySalonNameEn):displaySalonNameAr))} aria-label={(english?"Book service ":"حجز خدمة ")+label}>{english?"Book this service":"احجز الخدمة"} ↗</a>}</div></article>})}</div>
      {displayPackages.map((groomPackage,index)=><article className={styles.groomPackage} key={groomPackage.id}><div className={styles.groomImage}><SalonImage src={groomPackage.image_url} fallbackSrc={HERO_FALLBACK} alt={english?groomPackage.name_en:groomPackage.name_ar} loading="lazy"/></div><div className={styles.groomCopy}><p className={styles.eyebrow}>{english?"THE PREMIUM RITUAL":"تجربة مميزة"}</p><h3>{english?groomPackage.name_en:groomPackage.name_ar}</h3><p>{english?groomPackage.description_en:groomPackage.description_ar}</p>{(english?groomPackage.included_en:groomPackage.included_ar).length>0&&<ul>{(english?groomPackage.included_en:groomPackage.included_ar).map(item=><li key={item}>{item}</li>)}</ul>}<div className={styles.groomMeta}><span>◷ {groomPackage.duration_minutes} {english?"min":"دقيقة"}</span><strong>{english?("From "+groomPackage.price_sar+" SAR"):("ابتداءً من "+groomPackage.price_sar+" ر.س.")}</strong></div><div className={styles.serviceActions}>{services.some(service=>service.id===groomPackage.id) ? <a className={styles.serviceAction} href={bookingHref(groomPackage.id)}>{english?"Book this service":"احجز الخدمة"} ↗</a> : wa && <a className={styles.serviceAction} target="_blank" rel="noopener noreferrer" href={waHref((english?"Hello, I would like to enquire about ":"مرحبًا، أرغب في الاستفسار عن ")+groomPackage.name_ar+" "+(english?"at ":"لدى ")+displaySalonNameAr)}>{english?"Book this service":"احجز الخدمة"} ↗</a>}</div></div></article>)}
    </section>
    <PublicBookingForm slug={salon.slug} services={bookingServices} barbers={barbers} timezone={salon.timezone} language={english ? "en" : "ar"} />
    <section className={styles.teamSection} id="team"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{english ? "THE PEOPLE BEHIND THE CRAFT" : "الأشخاص وراء التجربة"}</p><h2>{english ? "Meet the team." : "تعرف على فريقنا."}</h2></div><p>{english ? "Care, craft and attention to detail in every visit." : "خبرة واهتمام بالتفاصيل في كل زيارة."}</p></div><div className={styles.teamGrid}>{displayBarbers.map((b,i)=><article className={styles.person} key={b.id}><div className={styles.personImage}><SalonImage src={b.image_url || BARBER_IMAGE_FALLBACKS[i % BARBER_IMAGE_FALLBACKS.length]} alt={english ? b.display_name : b.display_name+" — صورة احترافية لفريق العناية"} loading="lazy" /></div><h3>{english?(b.display_name_en||b.display_name):b.display_name}</h3>{(english?b.title_en||b.title_ar:b.title_ar)&&<p className={styles.personTitle}>{english?b.title_en||b.title_ar:b.title_ar}</p>}{(english?b.bio_en||b.bio_ar:b.bio_ar)&&<p>{english?b.bio_en||b.bio_ar:b.bio_ar}</p>}{(english?b.specialties_en||b.specialties_ar:b.specialties_ar)&&<p className={styles.personSpecialties}><strong>{english?"Specialties":"التخصصات"}: </strong>{english?b.specialties_en||b.specialties_ar:b.specialties_ar}</p>}{(english?b.availability_en||b.availability_ar:b.availability_ar)&&<p>{english?"Availability":"التوفر"}: {english?b.availability_en||b.availability_ar:b.availability_ar}</p>}{b.booking_url&&/^https:\/\//i.test(b.booking_url)&&<a className={styles.serviceAction} href={b.booking_url} target="_blank" rel="noopener noreferrer">{english?"Book with this barber":"احجز مع الحلاق"} ↗</a>}</article>)}</div></section>
    <section className={styles.gallerySection} id="work"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{english?"THE PORTFOLIO":"معرض العناية والتصفيف"}</p><h2>{english?"Our work, in detail.":"أعمالنا، بتفاصيلها."}</h2></div><p>{english?"A portfolio of fades, classic cuts, beard work and polished occasion looks.":"نماذج من التدرّجات والقصات الكلاسيكية وتهذيب اللحية والإطلالات المميزة."}</p></div><div className={styles.workGallery}>{portfolio.map((image,index)=><figure className={styles.workItem} key={image.src}><SalonImage src={image.src} fallbackSrc={HERO_FALLBACK} alt={english?image.alt_en:image.alt_ar} loading="lazy" style={{aspectRatio:"4 / 5",objectFit:"cover"}}/><figcaption><span>{english?image.category_en:image.category_ar}</span><span>{String(index+1).padStart(2,"0")}</span></figcaption></figure>)}</div></section>
    <section className={styles.infoSection} id="hours"><div className={styles.infoIntro}><p className={styles.eyebrow}>{english ? "PLAN YOUR VISIT" : "خطوتك التالية"}</p><h2>{english ? "Your next visit, made easy." : "نرتب زيارتك بكل سهولة."}</h2><p>{english ? "Ask us about a service or arrange your next appointment." : "تواصل معنا للاستفسار عن الخدمة المناسبة أو لتنسيق موعدك القادم."}</p>{wa && <a className={styles.primaryButton} target="_blank" rel="noopener noreferrer" href={waHref(english ? "Hello, I would like to ask about your salon services." : "مرحبًا، أرغب في الاستفسار عن "+displaySalonNameAr)}>{english ? "Chat on WhatsApp" : "تواصل عبر واتساب"} ↗</a>}</div>
      <div className={styles.hoursCard}><h3>{english ? "Opening hours" : "أوقات العمل"}</h3>{shownHours.length ? shownHours.map((day:any)=><div className={styles.hoursRow} key={day.weekday}><span>{"display_day" in day ? day.display_day : (english?["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day.weekday]:weekdays[day.weekday])}</span><strong>{"display_hours" in day ? day.display_hours : (day.is_closed ? (english?"Closed":"مغلق") : time(day.opens_at)+" — "+time(day.closes_at))}</strong></div>) : <p className={styles.empty}>{english?"Contact us for current opening hours.":"تواصل معنا لمعرفة أوقات العمل."}</p>}{location && <p className={styles.location}>⌖ {mapHref ? <a href={mapHref} target="_blank" rel="noopener noreferrer">{location} — {english ? "Open in Google Maps" : "الاتجاهات"} ↗</a> : location}</p>}{socialLinks.length>0 && <div className={styles.socialLinks} aria-label="روابط التواصل الاجتماعي">{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>}</div></section>
    <section className={styles.locationFeature}><div className={styles.locationPhoto}><SalonImage src={locationPhoto?.public_url || locationImageConfig.src} fallbackSrc={HERO_FALLBACK} alt={english?(locationPhoto?.alt_en || locationImageConfig.alt_en):(locationPhoto?.alt_ar || locationImageConfig.alt_ar)} style={{objectPosition:locationImageConfig.objectPosition}} loading="lazy"/></div><div className={styles.locationFeatureCopy}><p className={styles.eyebrow}>{english?"FIND YOUR WAY":"موقعنا"}</p><h2>{english?"A place for your next reset.":"مساحة تستحق زيارتك القادمة."}</h2><p>{location}</p><div className={styles.heroActions}>{mapHref&&<a className={styles.primaryButton} href={mapHref} target="_blank" rel="noopener noreferrer">{english?"Open in Google Maps":"افتح الموقع على خرائط Google"} ↗</a>}{displayPhone&&<a className={styles.secondaryButton} href={"tel:"+displayPhone}>{english?"Call the salon":"اتصل بالصالون"} ↗</a>}{wa&&<a className={styles.secondaryButton} href={waHref(english?"Hello, I would like to book an appointment.":"مرحبًا، أرغب في حجز موعد.")} target="_blank" rel="noopener noreferrer">{english?"WhatsApp":"واتساب"} ↗</a>}</div></div></section>
    <footer className={styles.footer}><a className={styles.footerBrand} href="#home">{english ? displaySalonNameEn : displaySalonNameAr} <span>✳</span></a>{socialLinks.length>0 && <nav className={styles.footerSocials} aria-label={english ? "Social links" : "روابط التواصل"}>{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</nav>}<span>{english ? displaySalonNameEn + " · A salon experience by Menuun" : displaySalonNameAr + " · تجربة صالون عبر Menuun"}</span><a href="#home">{english ? "Back to top" : "العودة للأعلى"} ↑</a></footer>
  </main></>;
}