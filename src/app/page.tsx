"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpLeft,
  ArrowUpRight, Check, Clock3, MapPin, Menu, Scissors, Sparkles, X,
} from "lucide-react";

type Locale = "ar" | "en";
type Service = { id: string; ar: string; en: string; detailAr: string; detailEn: string; duration: string; price: string; number: string };
type Barber = { id: string; ar: string; en: string; roleAr: string; roleEn: string; image: string };

const services: Service[] = [
  { id: "classic", number: "01", ar: "قص كلاسيكي", en: "The classic cut", detailAr: "قصة متقنة تبدأ باستشارة قصيرة وتنتهي بتصفيف يناسبك.", detailEn: "A considered cut, from a quick consultation to a finish that feels like you.", duration: "30", price: "60" },
  { id: "fade", number: "02", ar: "فيد وتدرّج", en: "Fade & texture", detailAr: "تدرّج نظيف وتفاصيل دقيقة بتوازن محسوب.", detailEn: "A clean fade with precise detail and considered texture.", duration: "40", price: "75" },
  { id: "beard", number: "03", ar: "تهذيب اللحية", en: "Beard sculpt", detailAr: "تحديد متوازن، منشفة دافئة، ولمسة نهائية هادئة.", detailEn: "Balanced shaping, a warm towel, and a clean finish.", duration: "20", price: "50" },
  { id: "combo", number: "04", ar: "قص ولحية", en: "Cut + beard", detailAr: "جلسة متكاملة للشعر واللحية في موعد واحد.", detailEn: "A complete hair and beard reset in one appointment.", duration: "45", price: "95" },
  { id: "groom", number: "05", ar: "طقس العريس", en: "The groom ritual", detailAr: "عناية متكاملة قبل يومك الكبير، بتفاصيل تستحقها.", detailEn: "A considered grooming ritual for the day that matters.", duration: "90", price: "250" },
];

const barbers: Barber[] = [
  { id: "omar", ar: "عمر", en: "Omar", roleAr: "الكلاسيك والمقص", roleEn: "Classic cuts & scissors", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80" },
  { id: "yousef", ar: "يوسف", en: "Yousef", roleAr: "الفيد والتصفيف", roleEn: "Fades & styling", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80" },
  { id: "kareem", ar: "كريم", en: "Kareem", roleAr: "اللحية والعناية", roleEn: "Beard & grooming", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80" },
];

const copy = {
  ar: {
    eyebrow: "حلاقة رجالية • الرياض",
    navServices: "الخدمات", navTeam: "الحلاقون", navPlace: "المكان",
    book: "احجز موعدًا", menu: "فتح القائمة", close: "إغلاق",
    heroKicker: "تفاصيل تصنع الفرق",
    heroTitle: "حلاقة على مهل،<br/> <em>وأثر يبقى.</em>",
    heroDescription: "في سِمت، كل تفصيلة لها وقتها. قصّات متقنة، حوار بسيط، ومكان يمنحك مساحة لتكون على طبيعتك.",
    explore: "اكتشف الخدمات", note: "عرض تجريبي تفاعلي — لا تُرسل حجوزات حقيقية",
    statOne: "خدمات مختارة", statTwo: "حلاقون", statThree: "دقيقة لتجربة الحجز",
    introLabel: "فلسفتنا", introTitle: "مو مجرد قصة.<br/><em>هذا وقتك.</em>",
    introText: "نؤمن أن الحلاقة الجيدة تبدأ بالإنصات، وتظهر في التفاصيل الصغيرة. نترك مساحة للاختيار، ونعطي كل موعد وقته.",
    valueOne: "اهتمام بالتفاصيل", valueOneText: "من أول استشارة إلى آخر لمسة، كل خطوة لها سبب.",
    valueTwo: "وقت يحترم وقتك", valueTwoText: "مدة واضحة لكل خدمة وتجربة مصممة لتكون سهلة.",
    valueThree: "أسلوبك أولًا", valueThreeText: "نسمع منك قبل أن نمسك المقص، لأن القصة لك.",
    serviceLabel: "القائمة", serviceTitle: "خدمات مختارة", serviceIntro: "أسعار ومدد تجريبية للعرض فقط. تُخصّص التفاصيل حسب نشاطك.",
    minutes: "دقيقة", from: "ابتداءً من", sar: "ر.س", chooseService: "اختر الخدمة",
    teamLabel: "الفريق", teamTitle: "أصحاب الأيادي الماهرة", teamIntro: "تعرّف على الفريق التجريبي، واختر الأسلوب الأقرب لك.",
    teamNote: "الأسماء والصور في هذه النسخة توضيحية وليست طاقمًا حقيقيًا.",
    galleryLabel: "داخل سِمت", galleryTitle: "مساحة صُممت لتروق لك",
    galleryText: "إضاءة هادئة، خامات طبيعية، وتفاصيل تترك للزيارة إحساسها الخاص.",
    placeLabel: "زورنا", placeTitle: "خذ وقتك.<br/><em>نحن هنا.</em>",
    location: "الرياض، المملكة العربية السعودية", address: "العنوان التفصيلي يُضاف عند إعداد موقع العميل",
    hoursTitle: "ساعات العمل", hours: "السبت – الخميس · 10 ص – 11 م", friday: "الجمعة · 2 م – 11 م",
    locationNote: "العنوان وساعات العمل المعروضة أمثلة تجريبية.",
    faqLabel: "قبل الزيارة", faqTitle: "أسئلة سريعة",
    faq1: "هل الحجز هنا حقيقي؟", faq1a: "لا. هذه نسخة عرض توضيحي؛ يمكنك استكشاف خطوات الحجز دون إرسال طلب أو حجز موعد فعلي.",
    faq2: "هل يمكن تغيير الخدمات والأسعار؟", faq2a: "نعم، تُبنى النسخة النهائية على بيانات النشاط المعتمدة: الخدمات والأسعار والمدد والصور والموقع.",
    faq3: "هل يدعم الموقع العربية والإنجليزية؟", faq3a: "نعم. يتبدّل المحتوى واتجاه التخطيط بين RTL للعربية وLTR للإنجليزية.",
    ctaTitle: "موعد لنفسك،<br/><em>على مزاجك.</em>", ctaText: "جرّب رحلة الحجز وشاهد كيف يمكن أن تكون سهلة وواضحة لعملائك.",
    footerTag: "تفاصيل محسوبة. تجربة مختلفة.", demo: "موقع تجريبي ببيانات خيالية",
    bookingTitle: "احجز تجربتك", step: "الخطوة", of: "من", step1: "الخدمة", step2: "الحلاق", step3: "الموعد", step4: "التفاصيل",
    selectService: "ما الخدمة التي تناسبك؟", selectBarber: "من تفضّل؟", anyBarber: "أي حلاق متاح", anyBarberDetail: "نختار لك من يناسب الموعد التجريبي.",
    selectDate: "اختر يومًا تجريبيًا", selectTime: "الأوقات المعروضة أمثلة وليست توفرًا مباشرًا.",
    today: "اليوم", tomorrow: "الثلاثاء", thursday: "الخميس",
    next: "التالي", back: "رجوع", continue: "متابعة", detailsTitle: "أكمل بيانات العرض",
    name: "الاسم", namePlaceholder: "اكتب اسمًا تجريبيًا", phone: "رقم الجوال", phonePlaceholder: "05X XXX XXXX",
    demoWarning: "لا يتم إرسال حجز حقيقي، ولا تُحفظ بياناتك. هذه خطوة توضيحية فقط.",
    confirmDemo: "تأكيد تجريبي", successTitle: "وصلت لنهاية التجربة", successText: "هكذا ستبدو خطوة تأكيد الموعد في موقعك. لم يتم إنشاء أي حجز ولم تُرسل بيانات لأي جهة.",
    done: "إنهاء التجربة", required: "أكمل الاسم ورقم الجوال للمتابعة التجريبية.",
    selected: "اختيارك", closeModal: "إغلاق نافذة الحجز", chooseTime: "اختر وقتًا",
  },
  en: {
    eyebrow: "BARBERING • RIYADH",
    navServices: "Services", navTeam: "The barbers", navPlace: "The space",
    book: "Book a visit", menu: "Open menu", close: "Close",
    heroKicker: "The details make the difference",
    heroTitle: "A better kind of cut,<br/> <em>at your own pace.</em>",
    heroDescription: "At SIMT, every detail gets its time. Considered cuts, an easy conversation, and a space that lets you feel like yourself.",
    explore: "Explore services", note: "Interactive demo — no real bookings are sent",
    statOne: "Considered services", statTwo: "Barbers", statThree: "Minutes to try booking",
    introLabel: "Our point of view", introTitle: "More than a cut.<br/><em>It's your time.</em>",
    introText: "Good barbering starts with listening and shows up in the small details. We leave room to choose and give every appointment the time it deserves.",
    valueOne: "Details, considered", valueOneText: "From the first conversation to the final touch, every step has a reason.",
    valueTwo: "Time well respected", valueTwoText: "Clear service durations and an experience designed to feel easy.",
    valueThree: "Your style, first", valueThreeText: "We listen before reaching for the scissors. It's your cut.",
    serviceLabel: "The menu", serviceTitle: "Services, considered", serviceIntro: "Example prices and durations for this demo only. Your real content is tailored to your business.",
    minutes: "min", from: "From", sar: "SAR", chooseService: "Choose service",
    teamLabel: "The people", teamTitle: "Skilled hands, distinct styles", teamIntro: "Meet the demo team and choose the approach that feels right for you.",
    teamNote: "Names and portraits are illustrative and do not represent a real team.",
    galleryLabel: "Inside SIMT", galleryTitle: "A space made to slow down",
    galleryText: "Calm light, tactile materials, and details that make the visit feel considered.",
    placeLabel: "Find us", placeTitle: "Take your time.<br/><em>We're here.</em>",
    location: "Riyadh, Saudi Arabia", address: "The full address is added when a client site is configured",
    hoursTitle: "Opening hours", hours: "Saturday – Thursday · 10 am – 11 pm", friday: "Friday · 2 pm – 11 pm",
    locationNote: "The location and hours shown are illustrative demo details.",
    faqLabel: "Before you visit", faqTitle: "A few quick answers",
    faq1: "Is this a real booking?", faq1a: "No. This is a demo. You can explore the booking steps without submitting a request or making a real appointment.",
    faq2: "Can services and prices be changed?", faq2a: "Yes. The final site uses approved business details: services, prices, durations, images, and location.",
    faq3: "Does the site support Arabic and English?", faq3a: "Yes. Content and layout direction switch between Arabic RTL and English LTR.",
    ctaTitle: "A little time for you,<br/><em>your way.</em>", ctaText: "Try the booking journey and see how simple and clear it can feel for your customers.",
    footerTag: "Considered details. A different experience.", demo: "Demo site with fictional details",
    bookingTitle: "Book your demo visit", step: "Step", of: "of", step1: "Service", step2: "Barber", step3: "Time", step4: "Details",
    selectService: "What would you like today?", selectBarber: "Who would you prefer?", anyBarber: "Any available barber", anyBarberDetail: "We'll choose a match for this demo slot.",
    selectDate: "Choose a demo day", selectTime: "These example times do not reflect live availability.",
    today: "Today", tomorrow: "Tuesday", thursday: "Thursday",
    next: "Next", back: "Back", continue: "Continue", detailsTitle: "Complete the demo details",
    name: "Name", namePlaceholder: "Enter a demo name", phone: "Mobile number", phonePlaceholder: "05X XXX XXXX",
    demoWarning: "No real booking is sent and your details are not saved. This is an illustrative step only.",
    confirmDemo: "Demo confirmation", successTitle: "You've reached the end", successText: "This is how the appointment confirmation could look on your site. No booking was created and no details were sent anywhere.",
    done: "Finish demo", required: "Enter a name and mobile number to continue the demo.",
    selected: "Your selection", closeModal: "Close booking dialog", chooseTime: "Choose a time",
  },
} as const;

const timeSlots = ["10:00 ص", "11:30 ص", "1:00 م", "4:30 م", "6:00 م"];
const englishTimeSlots = ["10:00 am", "11:30 am", "1:00 pm", "4:30 pm", "6:00 pm"];

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState("classic");
  const [selectedBarber, setSelectedBarber] = useState("any");
  const [selectedDay, setSelectedDay] = useState("tomorrow");
  const [selectedTime, setSelectedTime] = useState("10:00 ص");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [complete, setComplete] = useState(false);
  const t = copy[locale];
  const isArabic = locale === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const InlineArrow = isArabic ? ArrowLeft : ArrowRight;
  const times = isArabic ? timeSlots : englishTimeSlots;
  const selectedServiceData = services.find((item) => item.id === selectedService) ?? services[0];
  const selectedBarberData = barbers.find((item) => item.id === selectedBarber);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [locale, isArabic]);

  useEffect(() => {
    if (!bookingOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBookingOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [bookingOpen]);

  function openBooking(serviceId?: string) {
    if (serviceId) setSelectedService(serviceId);
    setStep(0);
    setComplete(false);
    setFormError("");
    setBookingOpen(true);
    setMenuOpen(false);
  }

  function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError(t.required);
      return;
    }
    setFormError("");
    setComplete(true);
    setStep(4);
  }

  function nextStep() {
    if (step === 2 && !selectedTime) {
      setFormError(t.chooseTime);
      return;
    }
    setFormError("");
    setStep((current) => Math.min(current + 1, 3));
  }

  function closeBooking() {
    setBookingOpen(false);
    setFormError("");
  }

  return (
    <main>
      <div className="demo-ribbon"><span className="live-dot" />{t.demo}<span className="ribbon-separator">/</span>{t.eyebrow}</div>
      <header className="site-header">
        <a className="brand-lockup" href="#home" aria-label="SIMT home">
          <span className="brand-symbol"><Scissors size={22} strokeWidth={1.6} /></span>
          <span className="brand-type"><strong>سِمت</strong><small>BARBER HOUSE</small></span>
        </a>
        <nav className="desktop-nav" aria-label={t.navServices}>
          <a href="#services">{t.navServices}</a><a href="#team">{t.navTeam}</a><a href="#place">{t.navPlace}</a>
        </nav>
        <div className="header-actions">
          <button className="language-switch" type="button" onClick={() => setLocale(isArabic ? "en" : "ar")} aria-label={isArabic ? "English" : "العربية"}>{isArabic ? "EN" : "عربي"}</button>
          <button className="header-book" type="button" onClick={() => openBooking()}>{t.book}<Arrow size={16} /></button>
          <button className="mobile-menu" type="button" aria-label={t.menu} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Menu size={22} /></button>
        </div>
      </header>
      <nav className={`mobile-navigation ${menuOpen ? "is-open" : ""}`} aria-label="التنقل الرئيسي">
        <a href="#services" onClick={() => setMenuOpen(false)}>{t.navServices}</a><a href="#team" onClick={() => setMenuOpen(false)}>{t.navTeam}</a><a href="#place" onClick={() => setMenuOpen(false)}>{t.navPlace}</a>
        <button type="button" onClick={() => openBooking()}>{t.book}<Arrow size={16} /></button>
      </nav>

      <section id="home" className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark" />{t.heroKicker}</p>
          <h1 dangerouslySetInnerHTML={{ __html: t.heroTitle }} />
          <p className="hero-description">{t.heroDescription}</p>
          <div className="hero-actions">
            <button className="button button-copper" type="button" onClick={() => openBooking()}>{t.book}<Arrow size={17} /></button>
            <a className="text-link" href="#services">{t.explore}<InlineArrow size={16} /></a>
          </div>
          <div className="hero-note"><Sparkles size={15} /><span>{t.note}</span></div>
        </div>
        <div className="hero-visual" role="img" aria-label={isArabic ? "تفاصيل أدوات حلاقة في صالون رجالي" : "Barber tools and details inside a barbershop"}>
          <div className="hero-image-shade" />
          <div className="hero-image-top"><span>SIMT / 001</span><span>EST. FOR YOUR STYLE</span></div>
          <div className="hero-image-caption"><span>THE CRAFT OF A GOOD CUT</span><span>01 — 03</span></div>
          <div className="hero-stamp"><span>سِمت</span><small>YOUR TIME.<br />YOUR STYLE.</small></div>
        </div>
        <div className="hero-bottomline"><span>24° 49′ N — 46° 38′ E</span><span>RIYADH · SAUDI ARABIA</span></div>
      </section>

      <section className="intro-section section-wrap">
        <div className="section-label"><span>01</span><span>{t.introLabel}</span></div>
        <div className="intro-grid">
          <h2 dangerouslySetInnerHTML={{ __html: t.introTitle }} />
          <p>{t.introText}</p>
        </div>
        <div className="principles">
          <article><span className="principle-number">A / 01</span><h3>{t.valueOne}</h3><p>{t.valueOneText}</p></article>
          <article><span className="principle-number">A / 02</span><h3>{t.valueTwo}</h3><p>{t.valueTwoText}</p></article>
          <article><span className="principle-number">A / 03</span><h3>{t.valueThree}</h3><p>{t.valueThreeText}</p></article>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="section-wrap">
          <div className="section-label"><span>02</span><span>{t.serviceLabel}</span></div>
          <div className="section-heading"><div><h2>{t.serviceTitle}</h2><p>{t.serviceIntro}</p></div><span className="heading-side-note">CUT / SHAPE / RESET</span></div>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-row" key={service.id}>
                <span className="service-number">{service.number}</span>
                <div className="service-copy"><h3>{isArabic ? service.ar : service.en}</h3><p>{isArabic ? service.detailAr : service.detailEn}</p></div>
                <span className="service-duration"><Clock3 size={14} />{service.duration} {t.minutes}</span>
                <span className="service-price"><small>{t.from}</small>{service.price} <small>{t.sar}</small></span>
                <button className="service-select" type="button" onClick={() => openBooking(service.id)} aria-label={`${t.chooseService}: ${isArabic ? service.ar : service.en}`}><Arrow size={18} /></button>
              </article>
            ))}
          </div>
          <div className="services-foot"><span>ALL SERVICES / MADE PERSONAL</span><button className="underlined-action" type="button" onClick={() => openBooking()}>{t.book}<InlineArrow size={15} /></button></div>
        </div>
      </section>

      <section id="team" className="team-section section-wrap">
        <div className="section-label"><span>03</span><span>{t.teamLabel}</span></div>
        <div className="section-heading"><div><h2>{t.teamTitle}</h2><p>{t.teamIntro}</p></div><span className="heading-side-note">THE HANDS BEHIND THE CRAFT</span></div>
        <div className="barber-grid">
          {barbers.map((barber, index) => (
            <article className="barber-card" key={barber.id}>
              <div className={`barber-photo barber-photo-${index + 1}`} style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(15,17,16,.45)), url("${barber.image}")` }}>
                <span className="barber-index">SIMT / 0{index + 1}</span>
                <button type="button" className="barber-book" onClick={() => { setSelectedBarber(barber.id); openBooking(); }} aria-label={`${t.book}: ${isArabic ? barber.ar : barber.en}`}><Arrow size={18} /></button>
              </div>
              <div className="barber-info"><div><h3>{isArabic ? barber.ar : barber.en}</h3><p>{isArabic ? barber.roleAr : barber.roleEn}</p></div><span>0{index + 1}</span></div>
            </article>
          ))}
        </div>
        <p className="demo-disclaimer">{t.teamNote}</p>
      </section>

      <section className="gallery-section">
        <div className="gallery-intro"><div className="section-label"><span>04</span><span>{t.galleryLabel}</span></div><h2>{t.galleryTitle}</h2><p>{t.galleryText}</p></div>
        <div className="gallery-image gallery-image-one" role="img" aria-label={isArabic ? "تفاصيل داخلية دافئة" : "Warm, considered interior details"} />
        <div className="gallery-image gallery-image-two" role="img" aria-label={isArabic ? "أدوات حلاقة احترافية" : "Professional barber tools"} />
        <div className="gallery-image gallery-image-three" role="img" aria-label={isArabic ? "كرسي حلاقة كلاسيكي" : "Classic barber chair"} />
        <span className="gallery-index">THE SPACE / 04—06</span>
      </section>

      <section id="place" className="place-section section-wrap">
        <div className="place-image" role="img" aria-label={isArabic ? "كرسي حلاقة في مساحة هادئة" : "Barber chair in a calm studio"} />
        <div className="place-copy"><div className="section-label"><span>05</span><span>{t.placeLabel}</span></div><h2 dangerouslySetInnerHTML={{ __html: t.placeTitle }} />
          <div className="place-detail"><MapPin size={17} /><div><strong>{t.location}</strong><p>{t.address}</p></div></div>
          <div className="place-detail"><Clock3 size={17} /><div><strong>{t.hoursTitle}</strong><p>{t.hours}<br />{t.friday}</p></div></div>
          <p className="demo-disclaimer">{t.locationNote}</p>
          <button className="underlined-action" type="button" onClick={() => openBooking()}>{t.book}<InlineArrow size={15} /></button>
        </div>
      </section>

      <section className="faq-section section-wrap">
        <div className="section-label"><span>06</span><span>{t.faqLabel}</span></div>
        <div className="faq-grid"><h2>{t.faqTitle}</h2><div className="faq-list">
          <details><summary>{t.faq1}<span>+</span></summary><p>{t.faq1a}</p></details>
          <details><summary>{t.faq2}<span>+</span></summary><p>{t.faq2a}</p></details>
          <details><summary>{t.faq3}<span>+</span></summary><p>{t.faq3a}</p></details>
        </div></div>
      </section>

      <section className="booking-cta"><div className="cta-ring cta-ring-one" /><div className="cta-ring cta-ring-two" /><p className="eyebrow">{t.heroKicker}</p><h2 dangerouslySetInnerHTML={{ __html: t.ctaTitle }} /><p>{t.ctaText}</p><button className="button button-light" type="button" onClick={() => openBooking()}>{t.book}<Arrow size={17} /></button><span className="cta-footnote">SIMT BARBER HOUSE · RIYADH</span></section>
      <footer className="site-footer"><a className="brand-lockup" href="#home"><span className="brand-symbol"><Scissors size={20} /></span><span className="brand-type"><strong>سِمت</strong><small>BARBER HOUSE</small></span></a><p>{t.footerTag}</p><div className="footer-links"><a href="#services">{t.navServices}</a><a href="#team">{t.navTeam}</a><a href="#place">{t.navPlace}</a></div><span className="copyright">© 2026 SIMT / {t.demo}</span></footer>

      {bookingOpen && (
        <div className="booking-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeBooking(); }}>
          <section className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title">
            <header className="booking-dialog-header"><div><span className="booking-kicker">SIMT / BOOKING DEMO</span><h2 id="booking-dialog-title">{complete ? t.successTitle : t.bookingTitle}</h2></div><button type="button" className="dialog-close" onClick={closeBooking} aria-label={t.closeModal}><X size={20} /></button></header>
            {!complete && <div className="booking-steps" aria-label={t.bookingTitle}>{[t.step1, t.step2, t.step3, t.step4].map((label, index) => <div className={`booking-step ${step === index ? "active" : ""} ${step > index ? "done" : ""}`} key={label}><span>{step > index ? <Check size={13} /> : `0${index + 1}`}</span><small>{label}</small></div>)}</div>}
            {complete ? <div className="booking-success"><span className="success-mark"><Check size={25} /></span><p>{t.successText}</p><div className="summary-box"><strong>{t.selected}</strong><span>{isArabic ? selectedServiceData.ar : selectedServiceData.en} · {selectedServiceData.price} {t.sar}</span><span>{selectedBarberData ? (isArabic ? selectedBarberData.ar : selectedBarberData.en) : t.anyBarber}</span><span>{selectedDay === "today" ? t.today : selectedDay === "tomorrow" ? t.tomorrow : t.thursday} · {selectedTime}</span></div><button type="button" className="button button-copper full-width" onClick={closeBooking}>{t.done}<Check size={16} /></button></div> : <>
              {step === 0 && <div className="booking-panel"><h3>{t.selectService}</h3><div className="booking-options service-options">{services.map((service) => <button type="button" className={`booking-option ${selectedService === service.id ? "selected" : ""}`} key={service.id} aria-pressed={selectedService === service.id} onClick={() => setSelectedService(service.id)}><span className="option-check">{selectedService === service.id ? <Check size={13} /> : null}</span><span><strong>{isArabic ? service.ar : service.en}</strong><small>{service.duration} {t.minutes}</small></span><b>{service.price} <small>{t.sar}</small></b></button>)}</div></div>}
              {step === 1 && <div className="booking-panel"><h3>{t.selectBarber}</h3><div className="booking-options barber-options"><button type="button" className={`booking-option ${selectedBarber === "any" ? "selected" : ""}`} aria-pressed={selectedBarber === "any"} onClick={() => setSelectedBarber("any")}><span className="option-check">{selectedBarber === "any" ? <Check size={13} /> : null}</span><span><strong>{t.anyBarber}</strong><small>{t.anyBarberDetail}</small></span></button>{barbers.map((barber) => <button type="button" className={`booking-option ${selectedBarber === barber.id ? "selected" : ""}`} key={barber.id} aria-pressed={selectedBarber === barber.id} onClick={() => setSelectedBarber(barber.id)}><span className="option-check">{selectedBarber === barber.id ? <Check size={13} /> : null}</span><span><strong>{isArabic ? barber.ar : barber.en}</strong><small>{isArabic ? barber.roleAr : barber.roleEn}</small></span></button>)}</div></div>}
              {step === 2 && <div className="booking-panel"><h3>{t.selectDate}</h3><div className="date-options">{[{ id: "today", label: t.today }, { id: "tomorrow", label: t.tomorrow }, { id: "thursday", label: t.thursday }].map((day) => <button type="button" className={`date-option ${selectedDay === day.id ? "selected" : ""}`} aria-pressed={selectedDay === day.id} key={day.id} onClick={() => setSelectedDay(day.id)}>{day.label}</button>)}</div><h3 className="time-heading">{t.chooseTime}</h3><div className="time-options">{times.map((time) => <button type="button" className={`time-option ${selectedTime === time ? "selected" : ""}`} aria-pressed={selectedTime === time} key={time} onClick={() => setSelectedTime(time)}>{time}</button>)}</div><p className="demo-disclaimer">{t.selectTime}</p></div>}
              {step === 3 && <form className="booking-panel details-panel" onSubmit={submitDemo}><h3>{t.detailsTitle}</h3><label>{t.name}<input autoComplete="name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder={t.namePlaceholder} /></label><label>{t.phone}<input autoComplete="tel" inputMode="tel" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder={t.phonePlaceholder} /></label><p className="demo-warning"><Sparkles size={15} />{t.demoWarning}</p><button className="button button-copper full-width" type="submit">{t.confirmDemo}<Arrow size={16} /></button></form>}
              {formError && <p className="booking-error" role="alert">{formError}</p>}
              {step < 3 && <div className="booking-dialog-footer">{step > 0 && <button type="button" className="back-button" onClick={() => { setStep((current) => current - 1); setFormError(""); }}><ArrowLeft size={15} />{t.back}</button>}<button type="button" className="button button-copper" onClick={nextStep}>{step === 2 ? t.continue : t.next}<Arrow size={16} /></button></div>}
            </>}
          </section>
        </div>
      )}
    </main>
  );
}
