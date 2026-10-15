"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpLeft, Check, ChevronDown, CirclePlay, Menu, Sparkles, X } from "lucide-react";

type Language = "ar" | "en";

const copy = {
  ar: {
    nav: ["كيف يعمل", "المزايا", "القوالب", "الأسئلة الشائعة"],
    login: "تسجيل الدخول",
    signup: "ابدأ الآن",
    badge: "مساحة رقمية أرقى لأعمال الخدمات",
    heroA: "أعمالك تستحق",
    heroB: "تجربة تليق بها.",
    heroText: "أنشئ حضورك الرقمي، نظّم خدماتك ومواعيدك، وامنح عملاءك طريقة أسهل للتعامل معك — من مكان واحد.",
    primary: "اكتشف Menuun",
    secondary: "شاهد كيف يعمل",
    note: "مصمم للأعمال التي تبدأ من تجربة العميل",
    previewLabel: "مساحة عملك، ببساطة",
    previewStatus: "واجهة تجريبية",
    previewTitle: "ATELIER 09",
    previewSub: "تفاصيل تصنع الفرق",
    today: "نظرة سريعة",
    bookings: "المواعيد",
    services: "الخدمات",
    team: "فريق العمل",
    serviceOne: "قصة شعر كلاسيكية",
    serviceTwo: "قص وتصفيف",
    serviceThree: "العناية باللحية",
    open: "متاح للحجز",
    sectionEyebrow: "من الفكرة إلى حضور متكامل",
    sectionTitle: "كل شيء يبدأ بتجربة أفضل.",
    sectionText: "الأدوات الرقمية لا ينبغي أن تزيد عملك تعقيداً. Menuun يجمع واجهتك وخدماتك وخطوات العميل في تجربة واضحة وقابلة للنمو.",
    feature1Title: "حضور يحمل هويتك",
    feature1Text: "واجهة مرتبة تعكس أسلوب عملك وتساعد العملاء على فهم خدماتك بسرعة.",
    feature2Title: "رحلة عميل أوضح",
    feature2Text: "اجعل الوصول إلى الخدمة والمعلومات والخطوة التالية أكثر سهولة.",
    feature3Title: "مساحة تنمو معك",
    feature3Text: "ابدأ بالأساسيات، ثم وسّع تجربتك مع تطور احتياجات عملك.",
    stepsLabel: "بداية سهلة",
    stepsTitle: "من عملك اليوم، إلى تجربة أفضل غداً.",
    step1Title: "عرّف عملك",
    step1Text: "ابدأ بمعلوماتك وخدماتك وما يجعل تجربتك مختلفة.",
    step2Title: "اختر مظهرك",
    step2Text: "تأتي القوالب لتمنحك نقطة بداية أنيقة قابلة للتخصيص.",
    step3Title: "استعد للنمو",
    step3Text: "نطوّر مساحة العمل لتجمع حضورك الرقمي وإدارة تجربة العميل.",
    templatesLabel: "مصممة لتناسب هويتك",
    templatesTitle: "أسلوبك أولاً. والقالب يتبعه.",
    templatesText: "نعمل على مجموعة قوالب متنوعة، من الهادئ والبسيط إلى التحريري والجريء، لتبدأ من تصميم مناسب لطبيعة عملك.",
    templateNames: ["Essential", "Editorial", "Atelier"],
    templateTaglines: ["واضح ومتوازن", "تحريري وأنيق", "حرفية معاصرة"],
    templateNote: "معاينة القوالب ستكون متاحة ضمن مساحة العميل.",
    faqLabel: "أسئلة شائعة",
    faqTitle: "قبل أن تبدأ.",
    faqs: [
      ["ما هي Menuun؟", "Menuun منصة تساعد أعمال الخدمات على بناء حضور رقمي منظم وتقديم تجربة أوضح لعملائها، مع تطوير مساحة عمل وأدوات قابلة للتوسع."],
      ["لمن صُممت المنصة؟", "نبدأ بأعمال الخدمات التي تعتمد على المواعيد، مثل الصالونات والحلاقة، مع بنية قابلة للتوسع إلى قطاعات أخرى."],
      ["هل يمكنني اختيار شكل موقعي؟", "نعم، القوالب جزء من خارطة الطريق. سيصبح بإمكانك استعراض الأنماط المتاحة واختيار ما يناسب هوية عملك عندما تُطلق مساحة القوالب."],
      ["هل التسجيل متاح الآن؟", "نعمل حالياً على بناء تجربة الحسابات بشكل آمن. يمكنك استعراض الموقع العام الآن، وستظهر مساحة الدخول والتسجيل عند اكتمال المرحلة التالية."]
    ],
    finalTitle: "جاهز لتجربة أكثر ترتيباً؟",
    finalText: "ابدأ بالتعرّف على Menuun، واكتشف كيف يمكن لحضور رقمي أفضل أن يخدم عملك.",
    finalCta: "تعرّف على المنصة",
    footerText: "تجربة رقمية أفضل، تبدأ من هنا.",
    footerLinks: ["المنصة", "القوالب", "الأسئلة الشائعة"],
    stagedTitle: "مساحة الحسابات قيد البناء",
    stagedText: "نجهّز تجربة دخول وتسجيل آمنة مرتبطة بمساحة عملك. لم يتم إنشاء حساب أو إرسال بيانات في هذه المرحلة.",
    backHome: "العودة إلى الصفحة الرئيسية",
    signInTitle: "أهلاً بعودتك",
    signUpTitle: "ابدأ مع Menuun",
    stagedLabel: "المرحلة التالية",
    menuLabel: "فتح القائمة",
    closeLabel: "إغلاق القائمة"
  },
  en: {
    nav: ["How it works", "Benefits", "Templates", "FAQs"],
    login: "Sign in",
    signup: "Get started",
    badge: "A more considered digital home for service businesses",
    heroA: "Your business deserves",
    heroB: "a better experience.",
    heroText: "Build your digital presence, organise your services, and give customers a clearer way to work with you — all in one place.",
    primary: "Explore Menuun",
    secondary: "See how it works",
    note: "Designed around the customer experience",
    previewLabel: "Your workspace, simplified",
    previewStatus: "Concept preview",
    previewTitle: "ATELIER 09",
    previewSub: "Craft is in the details",
    today: "A quick overview",
    bookings: "Appointments",
    services: "Services",
    team: "Team",
    serviceOne: "Classic haircut",
    serviceTwo: "Cut & styling",
    serviceThree: "Beard grooming",
    open: "Available",
    sectionEyebrow: "From an idea to a considered presence",
    sectionTitle: "Better experiences start here.",
    sectionText: "Digital tools should make business simpler, not more complicated. Menuun brings your presence, services, and customer journey into one clear experience.",
    feature1Title: "A presence that feels like you",
    feature1Text: "A considered interface that reflects your style and helps customers understand your services.",
    feature2Title: "A clearer customer journey",
    feature2Text: "Make it easier to discover a service, find the details, and understand what comes next.",
    feature3Title: "Room to grow",
    feature3Text: "Start with the essentials, then expand as your business and needs evolve.",
    stepsLabel: "A simple beginning",
    stepsTitle: "Your business today. A better experience tomorrow.",
    step1Title: "Introduce your business",
    step1Text: "Start with your details, services, and what makes your experience different.",
    step2Title: "Choose your look",
    step2Text: "Templates give you a thoughtful, adaptable starting point.",
    step3Title: "Get ready to grow",
    step3Text: "We are shaping a workspace that brings your digital presence and customer experience together.",
    templatesLabel: "Made to fit your identity",
    templatesTitle: "Your style comes first.",
    templatesText: "We are building a varied template collection, from quiet minimalism to expressive editorial styles, so your business can start with the right feel.",
    templateNames: ["Essential", "Editorial", "Atelier"],
    templateTaglines: ["Clear & balanced", "Editorial & refined", "Contemporary craft"],
    templateNote: "Template previews will be available in the customer workspace.",
    faqLabel: "Frequently asked questions",
    faqTitle: "Before you begin.",
    faqs: [
      ["What is Menuun?", "Menuun helps service businesses build a considered digital presence and a clearer customer experience, with a workspace designed to grow over time."],
      ["Who is it for?", "We are starting with appointment-led businesses such as salons and barbershops, with an architecture that can support more categories over time."],
      ["Can I choose my website style?", "Yes. Templates are part of the roadmap. You will be able to explore available styles and choose one that fits your brand when the template workspace launches."],
      ["Can I sign up today?", "We are building the account experience with security as a priority. You can explore the public website now; sign-in and registration will open with the next phase."]
    ],
    finalTitle: "Ready for a more considered experience?",
    finalText: "Discover Menuun and see how a better digital presence can support your business.",
    finalCta: "Explore the platform",
    footerText: "A better digital experience starts here.",
    footerLinks: ["Platform", "Templates", "FAQs"],
    stagedTitle: "The account workspace is in progress",
    stagedText: "We are preparing a secure sign-in and registration experience connected to your workspace. No account has been created and no data has been submitted at this stage.",
    backHome: "Back to the homepage",
    signInTitle: "Welcome back",
    signUpTitle: "Get started with Menuun",
    stagedLabel: "Coming in the next phase",
    menuLabel: "Open menu",
    closeLabel: "Close menu"
  }
} as const;

function Logo({ lang = "ar" }: { lang?: Language }) {
  const isArabic = lang === "ar";
  return <a className="brand" href="/" aria-label={isArabic ? "الصفحة الرئيسية Menuun" : "Menuun home"}>
    <img
      src={isArabic ? "/assets/brand/menuun/final/menuun-logo-ar.svg" : "/assets/brand/menuun/final/menuun-logo-en.svg"}
      alt={isArabic ? "شعار Menuun" : "Menuun"}
      width={160}
      height={58}
    />
  </a>;
}

function AccountPage({ lang, mode }: { lang: Language; mode: "login" | "signup" }) {
  const t = copy[lang];
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [ready, setReady] = useState(false);
  const nextPath = params.get("next") || "/owner/";
  const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/owner/";

  useEffect(() => {
    try {
      // Use the same @supabase/ssr browser client as the owner workspace.
      // This persists auth in cookies so middleware and Server Components can
      // verify the session after the redirect to /owner.
      setClient(createSupabaseBrowserClient());
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setNotice(lang === "ar"
        ? (message.includes("Supabase is not configured")
          ? "إعدادات الاتصال بقاعدة البيانات غير مكتملة على الخادم. يرجى ضبط متغيرات NEXT_PUBLIC_SUPABASE_URL وNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY في Vercel."
          : "تعذر تهيئة الاتصال الآمن. تحقق من إعدادات Supabase.")
        : (message || "Supabase is not configured. Set the public Supabase URL and publishable key in Vercel."));
    }
    setReady(true);
  }, [lang]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client) {
      setNotice(lang === "ar" ? "اتصال Supabase غير جاهز. تحقق من إعدادات النشر ثم أعد المحاولة." : "Supabase is not ready. Check deployment configuration and retry.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      if (mode === "login") {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.replace(safeNext);
        router.refresh();
      } else {
        const { data, error } = await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/login/" : undefined } });
        if (error) throw error;
        setNotice(data.session
          ? (lang === "ar" ? "تم إنشاء الحساب بنجاح. يمكنك الآن تسجيل الدخول." : "Account created successfully. You can now sign in.")
          : (lang === "ar" ? "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. أكّد البريد ثم سجّل الدخول." : "A confirmation email was sent. Confirm your email, then sign in."));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setNotice(lang === "ar" ? (message.includes("Invalid login credentials") ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : message.includes("Email not confirmed") ? "يرجى تأكيد بريدك الإلكتروني من الرسالة المرسلة إليك أولاً." : "تعذر إكمال العملية. تحقق من بيانات الدخول وإعدادات مصادقة Supabase ثم أعد المحاولة.") : (message || "Authentication failed. Check your credentials and Supabase Auth settings."));
    } finally {
      setBusy(false);
    }
  }

  return <main className="account-stage">
    <Logo lang={lang} />
    <div className="account-card">
      <div className="account-icon"><Sparkles size={22} /></div>
      <p className="eyebrow">{lang === "ar" ? "حسابك في Menuun" : "YOUR MENUUN ACCOUNT"}</p>
      <h1>{mode === "login" ? t.signInTitle : t.signUpTitle}</h1>
      <p className="account-title">{mode === "login" ? (lang === "ar" ? "سجّل الدخول إلى مساحة عملك" : "Sign in to your workspace") : (lang === "ar" ? "أنشئ حسابك للبدء" : "Create your account to begin")}</p>
      <form onSubmit={submit} className="account-form">
        <label htmlFor="account-email">{lang === "ar" ? "البريد الإلكتروني" : "Email address"}</label>
        <input id="account-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
        <label htmlFor="account-password">{lang === "ar" ? "كلمة المرور" : "Password"}</label>
        <input id="account-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} />
        <button className="button button-dark" type="submit" disabled={busy || !ready || !client}>{busy ? (lang === "ar" ? "جارٍ المعالجة..." : "Please wait...") : mode === "login" ? (lang === "ar" ? "تسجيل الدخول" : "Sign in") : (lang === "ar" ? "إنشاء حساب" : "Create account")}<ArrowLeft size={16} /></button>
      </form>
      {notice && <p role="status" aria-live="polite" className="muted account-notice">{notice}</p>}
      <p className="muted">{mode === "login" ? (lang === "ar" ? "ليس لديك حساب؟" : "New to Menuun?") : (lang === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?")} <a href={mode === "login" ? "/signup/" : "/login/"}>{mode === "login" ? (lang === "ar" ? "إنشاء حساب" : "Create account") : (lang === "ar" ? "تسجيل الدخول" : "Sign in")}</a></p>
      <a className="button button-dark" href="/">{t.backHome}<ArrowLeft size={16} /></a>
    </div>
  </main>;
}

function AppContent() {
  const [lang, setLang] = useState<Language>("ar");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const path = usePathname().replace(/\/+$/, "") || "/";
  const isAccount = path === "/login" || path === "/signup";
  const mode = path === "/signup" ? "signup" : "login";
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = isAccount
      ? (mode === "login" ? t.signInTitle : t.signUpTitle) + " — Menuun"
      : "Menuun — تجربة رقمية أفضل لأعمال الخدمات";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", lang === "ar"
      ? "Menuun منصة رقمية تساعد أعمال الخدمات على بناء حضور احترافي وتقديم تجربة أوضح لعملائها."
      : "Menuun helps service businesses build a professional digital presence and a clearer customer experience.");
  }, [lang, isAccount, mode, t.signInTitle, t.signUpTitle]);

  if (isAccount) return <AccountPage lang={lang} mode={mode} />;

  const navIds = ["how-it-works", "benefits", "templates", "faq"];

  return <div className="site-shell">
    <a className="skip-link" href="#main">{lang === "ar" ? "تجاوز إلى المحتوى" : "Skip to content"}</a>
    <header className="topbar">
      <Logo lang={lang} />
      <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label={lang === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
        {t.nav.map((label, i) => <a key={label} href={"#" + navIds[i]} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="top-actions">
        <button className="language-toggle" onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}>{lang === "ar" ? "EN" : "عربي"} <span>↗</span></button>
        <a className="login-link" href="/login/">{t.login}</a>
        <a className="button button-dark top-cta" href="/signup/">{t.signup}<ArrowUpLeft size={16} /></a>
        <button className="mobile-menu" aria-label={menuOpen ? t.closeLabel : t.menuLabel} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main id="main">
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />{t.badge}</div>
          <h1>{t.heroA}<br /><span>{t.heroB}</span></h1>
          <p className="hero-description">{t.heroText}</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#how-it-works">{t.primary}<ArrowUpLeft size={17} /></a>
            <a className="text-link" href="#benefits"><CirclePlay size={18} />{t.secondary}</a>
          </div>
          <div className="hero-note"><span className="note-line" />{t.note}</div>
        </div>

        <div className="hero-visual" aria-label={lang === "ar" ? "معاينة توضيحية لمساحة عمل Menuun" : "Illustrative preview of a Menuun workspace"}>
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="floating-chip chip-top"><Sparkles size={15} />{t.previewLabel}</div>
          <div className="product-window">
            <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>menuun.com</span><span className="window-lock">✳</span></div>
            <div className="salon-preview">
              <div className="preview-head"><span className="preview-monogram">A<span>09</span></span><span className="preview-status">{t.previewStatus}</span></div>
              <div className="preview-hero"><span className="preview-kicker">ATELIER / 09</span><h2>{t.previewTitle}</h2><p>{t.previewSub}</p><div className="preview-rule" /></div>
              <div className="preview-stats"><div><span>{t.bookings}</span><strong>—</strong></div><div><span>{t.services}</span><strong>03</strong></div><div><span>{t.team}</span><strong>02</strong></div></div>
              <div className="preview-list">
                <div className="preview-list-heading"><strong>{t.today}</strong><span>↗</span></div>
                {[t.serviceOne, t.serviceTwo, t.serviceThree].map((service, i) => <div className="preview-service" key={service}><span className={"service-index index-" + i}>0{i + 1}</span><span>{service}</span><span className="service-dot" /></div>)}
              </div>
            </div>
          </div>
          <div className="floating-chip chip-bottom"><span className="live-dot" />{t.open}</div>
          <div className="visual-caption">{lang === "ar" ? "تصميم مبدئي — ليس صفحة منشورة" : "Concept design — not a published page"}</div>
        </div>
      </section>

      <section className="intro-band">
        <div className="section-wrap intro-inner"><span className="intro-symbol">✳</span><p>{lang === "ar" ? "مساحة رقمية واحدة، مصممة حول الطريقة التي يكتشف بها عملاؤك خدمتك." : "One digital space, shaped around how customers discover your service."}</p><ArrowDownLeft size={20} /></div>
      </section>

      <section className="benefits section-wrap section-pad" id="benefits">
        <div className="section-heading"><p className="eyebrow">{t.sectionEyebrow}</p><h2>{t.sectionTitle}</h2><p className="section-description">{t.sectionText}</p></div>
        <div className="feature-grid">
          <article className="feature-card feature-dark"><span className="feature-number">01 / PRESENCE</span><div className="feature-art art-presence"><span className="art-frame"><i /><i /><i /></span><span className="art-stamp">m.</span></div><h3>{t.feature1Title}</h3><p>{t.feature1Text}</p><ArrowUpLeft className="feature-arrow" size={18} /></article>
          <article className="feature-card feature-green"><span className="feature-number">02 / EXPERIENCE</span><div className="feature-art art-experience"><span className="art-path"><i /><i /><i /></span><span className="art-spark">✳</span></div><h3>{t.feature2Title}</h3><p>{t.feature2Text}</p><ArrowUpLeft className="feature-arrow" size={18} /></article>
          <article className="feature-card feature-light"><span className="feature-number">03 / GROWTH</span><div className="feature-art art-growth"><span className="growth-bars"><i /><i /><i /><i /></span><span className="growth-circle">↗</span></div><h3>{t.feature3Title}</h3><p>{t.feature3Text}</p><ArrowUpLeft className="feature-arrow" size={18} /></article>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-wrap steps-layout">
          <div className="steps-intro"><p className="eyebrow">{t.stepsLabel}</p><h2>{t.stepsTitle}</h2><p className="section-description">{lang === "ar" ? "نرتّب البداية لتكون واضحة، ثم نمنحك مساحة للتطور دون الحاجة إلى البدء من جديد." : "A clear first step, with room to evolve without starting over."}</p><a className="text-link" href="/signup/">{t.signup}<ArrowUpLeft size={17} /></a></div>
          <div className="step-list">
            {[[t.step1Title, t.step1Text], [t.step2Title, t.step2Text], [t.step3Title, t.step3Text]].map(([title, text], i) => <article className="step-item" key={title}><span className="step-number">0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div><span className="step-check">{i === 0 ? <Check size={17} /> : <ArrowUpLeft size={17} />}</span></article>)}
          </div>
        </div>
      </section>

      <section className="templates-section section-wrap section-pad" id="templates">
        <div className="templates-heading"><div><p className="eyebrow">{t.templatesLabel}</p><h2>{t.templatesTitle}</h2></div><p className="section-description">{t.templatesText}</p></div>
        <div className="template-grid">
          {t.templateNames.map((name, i) => <article className={"template-card template-" + i} key={name}><div className="template-art"><div className="template-paper"><span className="paper-brand">{i === 2 ? "N." : i === 3 ? "H /" : "m."}</span><span className="paper-title">{["Essential", "Editorial", "ATELIER"][i]}</span><span className="paper-line" /><span className="paper-line short" /><span className="paper-shape" /></div><span className="template-number">0{i + 1}</span></div><div className="template-meta"><div><h3>{name}</h3><p>{t.templateTaglines[i]}</p></div><ArrowUpLeft size={17} /></div></article>)}
        </div>
        <p className="template-note"><Sparkles size={16} />{t.templateNote}</p>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-wrap faq-layout"><div><p className="eyebrow">{t.faqLabel}</p><h2>{t.faqTitle}</h2></div><div className="faq-list">{t.faqs.map(([question, answer], i) => <article className={openFaq === i ? "faq-item active" : "faq-item"} key={question}><button aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{question}</span><ChevronDown size={18} /></button>{openFaq === i && <p>{answer}</p>}</article>)}</div></div>
      </section>

      <section className="final-cta section-wrap"><div className="final-cta-inner"><span className="final-star">✳</span><div><p className="eyebrow">{lang === "ar" ? "خطوتك التالية" : "YOUR NEXT STEP"}</p><h2>{t.finalTitle}</h2><p>{t.finalText}</p></div><a className="button button-lime" href="/signup/">{t.finalCta}<ArrowUpLeft size={17} /></a></div></section>
    </main>

    <footer className="footer"><div className="section-wrap footer-main"><div className="footer-brand"><Logo lang={lang} /><p>{t.footerText}</p></div><div className="footer-links">{t.footerLinks.map((label, i) => <a key={label} href={i === 0 ? "#main" : i === 1 ? "#templates" : "#faq"}>{label}</a>)}</div><a className="back-top" href="#main" aria-label={lang === "ar" ? "العودة للأعلى" : "Back to top"}><ArrowRight size={17} /></a></div><div className="section-wrap footer-bottom"><span>© {new Date().getFullYear()} Menuun</span><span>{lang === "ar" ? "صُنع بعناية." : "Made with care."}</span></div></footer>
  </div>;
}


export default function App() {
  return <Suspense fallback={<main className="account-stage"><div className="account-card" role="status">Loading Menuun…</div></main>}><AppContent /></Suspense>;
}
