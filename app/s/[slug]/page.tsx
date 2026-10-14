import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./public-salon.module.css";
import SalonQrShare from "./qr-share";
import PublicBookingForm from "./booking-form";
import SalonImage from "./salon-image";
import { DEMO_CONTACT, DEMO_SERVICES, GROOM_PACKAGE, LOCATION_IMAGE, OUR_WORK_IMAGES } from "./salon-demo-content";

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
const HERO_FALLBACK = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=88";
const SERVICE_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=85"
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
    const fallbackRow = fallback.data as any;
    salon = fallbackRow ? { ...fallbackRow, template_key: fallbackRow.template_key || "atelier", instagram_url:null, tiktok_url:null, snapchat_url:null, facebook_url:null, google_maps_url:null, website_url:null } : null;
    error = fallback.error;
  }
  if (error || !salon) return null;
  let sr:any = await db.from("services").select("id,name_ar,description_ar,price_sar,duration_minutes,sort_order,image_url").eq("salon_id",salon.id).eq("is_active",true).order("sort_order");
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

export default async function PublicSalonPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{template?:string;lang?:string}>}) {
  const [{slug},search] = await Promise.all([params,searchParams]);
  const requestedTemplate = search?.template;
  const english = search?.lang === "en";
  const templateKey = requestedTemplate && ["atelier","oasis","rose"].includes(requestedTemplate) ? requestedTemplate : undefined;
  const result = await getSalon(slug);
  if (!result) notFound();
  const {salon,services,barbers,hours,media} = result;
  const activeTemplate = templateKey || salon.template_key || "atelier";
  const isDemoSalon = /^(atelier|oasis|rose)(-|$)/i.test(salon.slug);
  const displayPhone = isDemoSalon ? DEMO_CONTACT.phone : salon.phone;
  const displayWhatsapp = isDemoSalon ? DEMO_CONTACT.whatsapp : (salon.whatsapp || salon.phone || "");
  const rawWa = displayWhatsapp.replace(/[^0-9]/g,"");
  const wa = rawWa.startsWith("00") ? rawWa.slice(2) : rawWa.startsWith("0") ? "966"+rawWa.slice(1) : /^[5][0-9]{8}$/.test(rawWa) ? "966"+rawWa : rawWa;
  const location = isDemoSalon ? (english ? DEMO_CONTACT.address_en : DEMO_CONTACT.address_ar) : [salon.address_ar,salon.city].filter(Boolean).join("، ");
  const mapHref = (isDemoSalon ? DEMO_CONTACT.map_url : salon.google_maps_url) || (location ? "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(location) : null);
  const bookingHref = (serviceId?:string) => { const params = new URLSearchParams(); if (templateKey) params.set("template", templateKey); if (english) params.set("lang", "en"); if (serviceId) params.set("service", serviceId); return (params.size ? "?"+params.toString() : "")+"#booking"; };
  const socialLinks = [
    { label:"Instagram", href:salon.instagram_url },
    { label:"TikTok", href:salon.tiktok_url },
    { label:"Snapchat", href:salon.snapchat_url },
    { label:"Facebook", href:salon.facebook_url },
    { label:"الموقع الإلكتروني", href:salon.website_url }
  ].filter((item):item is {label:string;href:string} => Boolean(item.href && /^https:\/\//i.test(item.href)));
  const displayServices:Service[] = isDemoSalon
    ? DEMO_SERVICES.map((item,index) => {
        const stored = services[index];
        return { id: stored?.id || "demo-service-"+item.key, name_ar: item.name_ar, description_ar: item.description_ar, price_sar: item.price_sar, duration_minutes: item.duration_minutes, sort_order: index, image_url: stored?.image_url || item.image_url };
      })
    : services;
  const displayBarbers:Barber[] = barbers.length ? barbers : (isDemoSalon ? [
    {id:"demo-barber-1",display_name:english ? "Senior Barber" : "خبير القص",bio_ar:english ? "Precision cuts and considered finishing details." : "قصات دقيقة واهتمام بالتفاصيل الختامية.",image_url:BARBER_IMAGE_FALLBACKS[0],sort_order:0},
    {id:"demo-barber-2",display_name:english ? "Grooming Specialist" : "متخصص العناية",bio_ar:english ? "Thoughtful beard shaping and classic grooming." : "عناية متقنة باللحية وتفاصيل الحلاقة الكلاسيكية.",image_url:BARBER_IMAGE_FALLBACKS[1],sort_order:1},
    {id:"demo-barber-3",display_name:english ? "Style Consultant" : "خبير التصفيف",bio_ar:english ? "Contemporary styling tailored to your look." : "تصفيف عصري يناسب إطلالتك.",image_url:BARBER_IMAGE_FALLBACKS[2],sort_order:2}
  ] : []);
  const gallery = media.filter(x=>x.kind==="gallery" && x.public_url);
  const heroImage = gallery.length ? gallery[0] : null;
  const hero = heroImage?.public_url || HERO_FALLBACK;
  const locationPhoto = gallery.length ? gallery[gallery.length-1] : null;
  const bookingServices = isDemoSalon ? services.map((service,index)=>({...service,name_en:DEMO_SERVICES[index]?.name_en})) : services;
  const waHref = (message:string) => "https://wa.me/"+wa+"?text="+encodeURIComponent(message);
  const portfolio = [...gallery.map(image=>({src:image.public_url!,alt_ar:image.alt_ar || "تفاصيل من أعمال الحلاقة والعناية",alt_en:"Barbering and grooming portfolio detail",category_ar:"من أعمالنا",category_en:"Our work"})), ...OUR_WORK_IMAGES].filter((image,index,items)=>items.findIndex(other=>other.src===image.src)===index).slice(0,6);
  const groomService = services.find(service=>/العريس|groom/i.test(service.name_ar));
  const shownHours = isDemoSalon ? (english ? DEMO_CONTACT.hours_en : DEMO_CONTACT.hours_ar).map((item,index)=>({weekday:index,opens_at:null,closes_at:null,is_closed:false,display_day:item.day,display_hours:item.hours})) : hours;
  return <main className={styles.site+" "+(activeTemplate==="oasis"?styles.templateOasis:activeTemplate==="rose"?styles.templateRose:styles.templateAtelier)} style={{"--salon-ink":activeTemplate==="atelier"?salon.primary_color:undefined,"--salon-accent":activeTemplate==="atelier"?salon.accent_color:undefined} as CSSProperties} dir={english ? "ltr" : "rtl"} lang={english ? "en" : "ar"}>
    <div className={styles.topline}><span>{english ? "A considered grooming experience" : "تجربة صالونك، بتفاصيله"}</span><span>{english ? "A salon experience by Menuun" : "تجربة صالون عبر Menuun"}</span></div>
    <header className={styles.header}>
      <a className={styles.brand} href="#home" aria-label={salon.name_ar}>{salon.logo_url ? <img src={salon.logo_url} alt="" /> : <span className={styles.brandMark}>✳</span>}<span><strong>{salon.name_ar}</strong><small>{salon.name_en || "SALON EXPERIENCE"}</small></span></a>
      <nav aria-label={english ? "Main navigation" : "التنقل الرئيسي"}><a href="#services">{english ? "Services" : "الخدمات"}</a><a href="#booking">{english ? "Booking" : "الحجز"}</a><a href="#work">{english ? "Our work" : "أعمالنا"}</a><a href="#hours">{english ? "Visit us" : "معلومات الزيارة"}</a></nav><a className={styles.languageToggle} href={"?template="+activeTemplate+"&lang="+(english?"ar":"en")} lang={english?"ar":"en"}>{english ? "العربية" : "English"}</a>
      <SalonQrShare slug={salon.slug} salonName={salon.name_ar} />
    </header>
    <section className={styles.hero} id="home">
      <div className={styles.heroCopy}><p className={styles.eyebrow}>{english ? "YOUR GROOMING RITUAL" : "مساحتك للعناية والتجديد"}</p><h1>{english ? "Good grooming. Thoughtful details." : (salon.tagline_ar || "تفاصيل صغيرة، تجربة مختلفة.")}</h1><p className={styles.description}>{english ? "A considered grooming experience built around precision, comfort and personal style." : (salon.description_ar || "أهلًا بك في "+salon.name_ar+". اكتشف خدماتنا واختر ما يناسبك، وتواصل معنا لتنسيق موعدك.")}</p>
        <div className={styles.heroActions}><a className={styles.primaryButton} href={services.length ? "#booking" : wa ? waHref("مرحبًا، أرغب في حجز موعد لدى "+salon.name_ar) : "#services"} target={!services.length && wa ? "_blank" : undefined} rel={!services.length && wa ? "noreferrer" : undefined}>{english ? "Book an appointment" : "احجز موعدك"} ↙</a>{wa && <a className={styles.secondaryButton} href={waHref("مرحبًا، أرغب في حجز موعد لدى "+salon.name_ar)} target="_blank" rel="noreferrer">{english ? "Book on WhatsApp" : "احجز عبر واتساب"} ↗</a>}<a className={styles.secondaryButton} href="#services">{english ? "Explore services" : "تصفّح الخدمات"}</a></div>
        <div className={styles.quickFacts}>{location && <span>⌖ {location}</span>}{displayPhone && <a href={"tel:"+displayPhone}>☎ {displayPhone}</a>}</div>
      </div>
      <div className={styles.heroVisual}><SalonImage className={styles.heroImage} src={hero} alt={english ? "Contemporary men's grooming salon interior" : (heroImage?.alt_ar || "أجواء صالون رجالي معاصر للعناية والتصفيف")} fetchPriority="high" loading="eager" /><div className={styles.visualCaption}><span>{english ? "A space designed around you" : "مساحة مصممة حولك"}</span><span>01 — 04</span></div></div>
    </section>
    <section className={styles.section} id="services"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{english ? "THE SERVICE MENU" : "قائمة الخدمات"}</p><h2>{english ? "Choose your next ritual." : "اختر تجربتك القادمة."}</h2></div><p>{english ? "Thoughtful services, clear starting prices and time estimates." : "خدمات واضحة، أسعار معلنة، ووقت تعرفه قبل أن تبدأ."}</p></div>
      <div className={styles.services}>{displayServices.map((service,index)=>{const demoItem=DEMO_SERVICES[index];const label=english&&isDemoSalon?demoItem?.name_en:service.name_ar;const description=english&&isDemoSalon?demoItem?.description_en:service.description_ar;const price=isDemoSalon?((english?"From ":"ابتداءً من ")+service.price_sar+(english?" SAR":" ر.س.")):money(Number(service.price_sar),salon.currency_code);const isStored=services.some(item=>item.id===service.id);return <article className={styles.service} key={service.id}><div className={styles.serviceImage}><SalonImage src={service.image_url || SERVICE_IMAGE_FALLBACKS[index % SERVICE_IMAGE_FALLBACKS.length]} alt={english?(demoItem?.name_en||label):label} loading="lazy" /></div><span className={styles.serviceIndex}>{String(index+1).padStart(2,"0")}</span><div className={styles.serviceInfo}><h3>{label}</h3>{description && <p>{description}</p>}<span>◷ {service.duration_minutes} {english?"min":"دقيقة"}</span></div><strong className={styles.price}>{price}</strong><div className={styles.serviceActions}>{isStored ? <a className={styles.serviceAction} href={bookingHref(service.id)} aria-label={(english?"Book service ":"حجز خدمة ")+label}>{english?"Book this service":"احجز الخدمة"} ↗</a> : wa && <a className={styles.serviceAction} target="_blank" rel="noopener noreferrer" href={waHref((english?"Hello, I would like to book ":"مرحبًا، أرغب في حجز خدمة ")+label+(english?" at ":" لدى ")+salon.name_ar)} aria-label={(english?"Book service ":"حجز خدمة ")+label}>{english?"Book this service":"احجز الخدمة"} ↗</a>}</div></article>})}</div>
      <article className={styles.groomPackage}><div className={styles.groomImage}><SalonImage src={GROOM_PACKAGE.image_url} alt={english?GROOM_PACKAGE.name_en:"باقة عناية متكاملة للعريس قبل الزفاف"} loading="lazy"/></div><div className={styles.groomCopy}><p className={styles.eyebrow}>{english?"THE PREMIUM RITUAL":"تجربة مميزة"}</p><h3>{english?GROOM_PACKAGE.name_en:GROOM_PACKAGE.name_ar}</h3><p>{english?GROOM_PACKAGE.description_en:GROOM_PACKAGE.description_ar}</p><ul>{(english?GROOM_PACKAGE.included_en:GROOM_PACKAGE.included_ar).map(item=><li key={item}>{item}</li>)}</ul><div className={styles.groomMeta}><span>◷ 90 {english?"min":"دقيقة"}</span><strong>{english?"From 450 SAR":"ابتداءً من 450 ر.س."}</strong></div><div className={styles.serviceActions}>{groomService ? <a className={styles.serviceAction} href={bookingHref(groomService.id)}>{english?"Book this service":"احجز الخدمة"} ↗</a> : wa && <a className={styles.serviceAction} target="_blank" rel="noopener noreferrer" href={waHref((english?"Hello, I would like to enquire about the Groom’s Signature Package at ":"مرحبًا، أرغب في حجز باقة العريس لدى ")+salon.name_ar)}>{english?"Book the groom package":"احجز باقة العريس"} ↗</a>}</div></div></article>
    </section>
    <PublicBookingForm slug={salon.slug} services={bookingServices} barbers={barbers} timezone={salon.timezone} language={english ? "en" : "ar"} />
    <section className={styles.teamSection} id="team"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{english ? "THE PEOPLE BEHIND THE CRAFT" : "الأشخاص وراء التجربة"}</p><h2>{english ? "Meet the team." : "تعرف على فريقنا."}</h2></div><p>{english ? "Care, craft and attention to detail in every visit." : "خبرة واهتمام بالتفاصيل في كل زيارة."}</p></div><div className={styles.teamGrid}>{displayBarbers.map((b,i)=><article className={styles.person} key={b.id}><div className={styles.personImage}><SalonImage src={b.image_url || BARBER_IMAGE_FALLBACKS[i % BARBER_IMAGE_FALLBACKS.length]} alt={english ? b.display_name : b.display_name+" — صورة احترافية لفريق العناية"} loading="lazy" /></div><h3>{b.display_name}</h3>{b.bio_ar && <p>{b.bio_ar}</p>}</article>)}</div></section>
    <section className={styles.gallerySection} id="work"><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{english?"THE PORTFOLIO":"معرض العناية والتصفيف"}</p><h2>{english?"Our work, in detail.":"أعمالنا، بتفاصيلها."}</h2></div><p>{english?"A portfolio of fades, classic cuts, beard work and polished occasion looks.":"نماذج من التدرّجات والقصات الكلاسيكية وتهذيب اللحية والإطلالات المميزة."}</p></div><div className={styles.workGallery}>{portfolio.map((image,index)=><figure className={styles.workItem} key={image.src}><SalonImage src={image.src} alt={english?image.alt_en:image.alt_ar} loading="lazy"/><figcaption><span>{english?image.category_en:image.category_ar}</span><span>{String(index+1).padStart(2,"0")}</span></figcaption></figure>)}</div></section>
    <section className={styles.infoSection} id="hours"><div className={styles.infoIntro}><p className={styles.eyebrow}>{english ? "PLAN YOUR VISIT" : "خطوتك التالية"}</p><h2>{english ? "Your next visit, made easy." : "نرتب زيارتك بكل سهولة."}</h2><p>{english ? "Ask us about a service or arrange your next appointment." : "تواصل معنا للاستفسار عن الخدمة المناسبة أو لتنسيق موعدك القادم."}</p>{wa && <a className={styles.primaryButton} target="_blank" rel="noopener noreferrer" href={waHref(english ? "Hello, I would like to ask about your salon services." : "مرحبًا، أرغب في الاستفسار عن "+salon.name_ar)}>{english ? "Chat on WhatsApp" : "تواصل عبر واتساب"} ↗</a>}{displayPhone && <a className={styles.phoneLink} href={"tel:"+displayPhone}>{displayPhone}</a>}</div>
      <div className={styles.hoursCard}><h3>{english ? "Opening hours" : "أوقات العمل"}</h3>{shownHours.length ? shownHours.map((day:any)=><div className={styles.hoursRow} key={day.weekday}><span>{"display_day" in day ? day.display_day : (english?["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day.weekday]:weekdays[day.weekday])}</span><strong>{"display_hours" in day ? day.display_hours : (day.is_closed ? (english?"Closed":"مغلق") : time(day.opens_at)+" — "+time(day.closes_at))}</strong></div>) : <p className={styles.empty}>{english?"Contact us for current opening hours.":"تواصل معنا لمعرفة أوقات العمل."}</p>}{location && <p className={styles.location}>⌖ {mapHref ? <a href={mapHref} target="_blank" rel="noopener noreferrer">{location} — {english ? "Open in Google Maps" : "الاتجاهات"} ↗</a> : location}</p>}{socialLinks.length>0 && <div className={styles.socialLinks} aria-label="روابط التواصل الاجتماعي">{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>}</div></section>
    <section className={styles.locationFeature}><div className={styles.locationPhoto}><SalonImage src={locationPhoto?.public_url || LOCATION_IMAGE.src} alt={english?(locationPhoto ? "Salon interior and location photography" : LOCATION_IMAGE.alt_en):(locationPhoto?.alt_ar || LOCATION_IMAGE.alt_ar)} loading="lazy"/></div><div className={styles.locationFeatureCopy}><p className={styles.eyebrow}>{english?"FIND YOUR WAY":"موقعنا"}</p><h2>{english?"A place for your next reset.":"مساحة تستحق زيارتك القادمة."}</h2><p>{location}</p><div className={styles.heroActions}>{mapHref&&<a className={styles.primaryButton} href={mapHref} target="_blank" rel="noopener noreferrer">{english?"Open in Google Maps":"افتح الموقع على خرائط Google"} ↗</a>}{displayPhone&&<a className={styles.secondaryButton} href={"tel:"+displayPhone}>{english?"Call the salon":"اتصل بالصالون"}</a>}{wa&&<a className={styles.secondaryButton} href={waHref(english?"Hello, I would like to book an appointment.":"مرحبًا، أرغب في حجز موعد.")} target="_blank" rel="noopener noreferrer">{english?"WhatsApp":"واتساب"} ↗</a>}</div></div></section>
    <footer className={styles.footer}><a className={styles.footerBrand} href="#home">{salon.name_ar} <span>✳</span></a>{socialLinks.length>0 && <nav className={styles.footerSocials} aria-label={english ? "Social links" : "روابط التواصل"}>{socialLinks.map(link=><a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</nav>}<span>{english ? "A salon experience by Menuun" : "تجربة صالون عبر Menuun"}</span><a href="#home">{english ? "Back to top" : "العودة للأعلى"} ↑</a></footer>
  </main>;
}