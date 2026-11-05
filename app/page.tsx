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
    templateNames: ["Atelier", "Oasis", "Forge Men"],
    templateTaglines: ["تحريري داكن", "طبيعي هادئ", "فورج للرجال"],
    templateNote: "القوالب الثلاثة متاحة من مساحة المالك.",
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
    templateNames: ["Atelier", "Oasis", "Forge Men"],
    templateTaglines: ["Dark editorial", "Calm and natural", "Forge Men"],
    templateNote: "All three templates are available in the owner workspace.",
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
  const path = (usePathname() || "/").replace(/\/+$/, "") || "/";
  const isAccount = path === "/login" || path === "/signup";
  const mode = path === "/signup" ? "signup" : "login";
  const t = copy[lang];
  const isArabic = lang === "ar";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = isAccount
      ? (mode === "login" ? t.signInTitle : t.signUpTitle) + " — Menuun"
      : isArabic
        ? "Menuun — إدارة صالونك وصفحته الرقمية من مكان واحد"
        : "Menuun — Run your salon and its digital presence in one place";
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", isArabic
      ? "أدر الخدمات والفريق والمواعيد، وانشر صفحة صالون تحمل هويتك وتعرض المعلومات التي تختار نشرها."
      : "Manage services, your team and appointments, then publish a salon website that reflects your brand and the information you choose to share.");
  }, [lang, isAccount, mode, t.signInTitle, t.signUpTitle, isArabic]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  if (isAccount) return <AccountPage lang={lang} mode={mode} />;

  const content = isArabic ? {
    nav: [["المنتج", "#product"], ["كيف يعمل", "#how-it-works"], ["القوالب", "#templates"], ["الأسئلة الشائعة", "#faq"]],
    badge: "منصة لإدارة الصالونات والحلاقة",
    titleA: "أدر صالونك",
    titleB: "وامنحه حضورًا يليق به.",
    lead: "من الخدمات والفريق والمواعيد إلى صفحة رقمية تحمل هويتك؛ Menuun يجمع إدارة الصالون وتجربة العميل في مساحة واحدة.",
    login: "دخول المالك",
    sample: "استكشف صفحة صالون",
    preview: "معاينة توضيحية ببيانات نموذجية",
    workspace: "مساحة المالك",
    workspaceSub: "تحكم في تفاصيل عملك",
    overview: "نظرة عامة",
    appointments: "المواعيد",
    services: "الخدمات",
    team: "الفريق",
    settings: "الإعدادات",
    today: "متابعة المواعيد",
    pending: "بانتظار التأكيد",
    confirmed: "مؤكد",
    serviceName: "الخدمات والأسعار",
    serviceOne: "قص الشعر",
    serviceTwo: "العناية باللحية",
    publicSite: "صفحة الصالون العامة",
    publicSub: "ما يراه عميلك",
    publicName: "ATELIER 09",
    publicTitle: "العناية بالتفاصيل تصنع الفرق",
    publicText: "اكتشف الخدمات واختر ما يناسبك",
    publicCta: "اطلب موعدك",
    connection: "تحدّث عن عملك هنا — وانشر ما تختاره لعميلك هناك",
    productLabel: "مساحة واحدة، تجربتان مترابطتان",
    productTitle: "إدارة واضحة لك. وتجربة مريحة لعميلك.",
    productLead: "تتحكم في معلومات الصالون ومحتواه من مساحة المالك، بينما تعرض الصفحة العامة المعلومات المنشورة فقط وتمنح العميل طريقًا واضحًا للتعرّف على خدماتك وطلب موعد.",
    ownerTitle: "أدِر تفاصيل العمل",
    ownerText: "حدّث بيانات الصالون، الخدمات ومددها وأسعارها، ملفات الفريق، ساعات العمل والصور من مساحة واحدة.",
    bookingTitle: "تابع طلبات المواعيد",
    bookingText: "راجع الطلبات، وابحث بينها، وحدّث حالاتها من لوحة المالك مع إشعارات ومتابعة للنشاط.",
    insightTitle: "افهم أداء العمل",
    insightText: "راجع مؤشرات المواعيد والتحصيل والخدمات الأكثر طلبًا والفترات الأكثر نشاطًا ضمن التحليلات المتاحة.",
    mediaTitle: "اجعل الصفحة تحمل هويتك",
    mediaText: "أضف الشعار والصور ومعرض الأعمال، واختر صورة أو فيديو للواجهة الرئيسية.",
    teamTitle: "عرّف العملاء بفريقك",
    teamText: "اعرض ملفات أعضاء الفريق وتخصصاتهم ومعلوماتهم التي تختار نشرها.",
    shareTitle: "انشر وشارك بسهولة",
    shareText: "اختر القالب، وانشر رابط الصالون، وشارك رمز QR للوصول إلى صفحتك.",
    publicLabel: "تجربة العميل",
    publicTitle2: "صفحة واحدة تجمع ما يحتاج العميل إلى معرفته.",
    publicLead: "هوية الصالون، الخدمات ومددها وأسعارها، الفريق، الصور، ساعات العمل، الموقع ووسائل التواصل — وفق المعلومات التي تنشرها.",
    publicList: ["عرض الخدمات والتفاصيل", "التعرّف على الفريق", "مشاهدة الصور والهوية", "معرفة ساعات العمل والموقع", "التواصل وطلب موعد"],
    templatesLabel: "ثلاث هويات تصميم فعلية",
    templatesTitle: "اختر الأسلوب الذي يشبه صالونك.",
    templatesLead: "القوالب المتاحة في مساحة المالك، وكل قالب يقدم اتجاهًا بصريًا مختلفًا دون تغيير خدماتك أو مواعيدك.",
    template1: "تحريري داكن بلمسات ليمونية",
    template2: "عاجي هادئ ولمسات خضراء",
    template3: "فحمي وزيتوني ولمسات نحاسية",
    howLabel: "من الإعداد إلى النشر",
    howTitle: "خطوات واضحة لإطلاق صفحة صالونك.",
    steps: [
      ["أضف بيانات الصالون", "أدخل الاسم ومعلومات التواصل والموقع وساعات العمل."],
      ["جهّز الخدمات والفريق", "أضف الخدمات والأسعار والمدد وملفات أعضاء الفريق."],
      ["اختر القالب والوسائط", "خصص المظهر وأضف الشعار والصور أو فيديو الواجهة."],
      ["انشر وابدأ المتابعة", "شارك الرابط ورمز QR، وتابع طلبات المواعيد من مساحة المالك."]
    ],
    faqLabel: "إجابات واضحة قبل البدء",
    faqTitle: "أسئلة يطرحها أصحاب الصالونات.",
    faqs: [
      ["ما هي Menuun؟", "منصة تساعد أصحاب الصالونات ومحلات الحلاقة على إدارة تفاصيل العمل وإنشاء صفحة عامة تحمل هوية الصالون."],
      ["ما الذي يمكنني إدارته؟", "يمكنك إدارة بيانات الصالون، الخدمات والأسعار والمدد، الفريق، ساعات العمل، الوسائط، القالب، المواعيد والإشعارات والتحليلات المتاحة."],
      ["ماذا يرى العميل في الصفحة العامة؟", "يرى المعلومات التي نشرتها: الهوية والخدمات والفريق والصور وساعات العمل والموقع ووسائل التواصل، ويمكنه استخدام مسار طلب الموعد المتاح."],
      ["هل تدعم Menuun العربية والإنجليزية؟", "نعم، تتوفر تجربة عربية باتجاه RTL وتجربة إنجليزية باتجاه LTR في الواجهات العامة المدعومة."],
      ["هل تعالج Menuun المدفوعات إلكترونيًا؟", "لا تعرض المنصة حاليًا بوابة دفع إلكتروني. يمكن للمالك تسجيل طريقة التحصيل مثل النقد أو البطاقة أو التحويل عند إكمال الموعد."],
      ["كيف أدخل إلى مساحة المالك؟", "استخدم زر دخول المالك. وإذا لم يكن لديك حساب، يمكنك الانتقال إلى إنشاء حساب."]
    ],
    ctaTitle: "اجعل إدارة صالونك أوضح، وحضوره أقوى.",
    ctaText: "ابدأ من مساحة المالك، وشاهد كيف يمكن أن تبدو صفحة صالونك.",
    ctaButton: "الدخول إلى مساحة المالك",
    footer: "إدارة الصالون وصفحته الرقمية، في تجربة واحدة.",
    note: "المعاينات المرئية توضيحية وليست بيانات تشغيلية حقيقية."
  } : {
    nav: [["The product", "#product"], ["How it works", "#how-it-works"], ["Templates", "#templates"], ["FAQs", "#faq"]],
    badge: "Salon and barbershop management",
    titleA: "Run your salon.",
    titleB: "Give it a presence worth remembering.",
    lead: "From services, team and appointments to a branded digital page, Menuun brings salon management and the customer experience together.",
    login: "Owner sign in",
    sample: "Explore a salon page",
    preview: "Illustrative preview with sample content",
    workspace: "Owner workspace",
    workspaceSub: "Manage the details of your business",
    overview: "Overview",
    appointments: "Appointments",
    services: "Services",
    team: "Team",
    settings: "Settings",
    today: "Appointment activity",
    pending: "Awaiting confirmation",
    confirmed: "Confirmed",
    serviceName: "Services and pricing",
    serviceOne: "Haircut",
    serviceTwo: "Beard care",
    publicSite: "Public salon page",
    publicSub: "What your customers see",
    publicName: "ATELIER 09",
    publicTitle: "Care is found in the details",
    publicText: "Explore the services and find what suits you",
    publicCta: "Request an appointment",
    connection: "Manage your business here — publish the details you choose to share",
    productLabel: "One workspace. Two connected experiences.",
    productTitle: "Clarity for you. A better visit for your customers.",
    productLead: "Manage salon information and content in your owner workspace. Your public page displays only the information you publish and gives customers a clear way to explore your services and request an appointment.",
    ownerTitle: "Manage the details",
    ownerText: "Update salon information, service names, durations and prices, team profiles, opening hours and media in one place.",
    bookingTitle: "Stay on top of appointments",
    bookingText: "Review requests, search appointments and update their status from the owner workspace, with notifications and activity updates.",
    insightTitle: "Understand your business activity",
    insightText: "Review available appointment, collection, popular-service and busy-period insights.",
    mediaTitle: "Make the page feel like your brand",
    mediaText: "Add your logo, photography and gallery, then choose an image or video for the hero.",
    teamTitle: "Introduce your team",
    teamText: "Present team profiles, specialties and the information you choose to publish.",
    shareTitle: "Publish and share",
    shareText: "Choose a template, publish your salon link and share its QR code.",
    publicLabel: "The customer experience",
    publicTitle2: "One page for the details customers need.",
    publicLead: "Your salon identity, services and durations, team, imagery, opening hours, location and contact options — based on the information you choose to publish.",
    publicList: ["Explore services and details", "Meet the team", "View imagery and salon identity", "Find opening hours and location", "Contact the salon or request an appointment"],
    templatesLabel: "Three live design directions",
    templatesTitle: "Choose a look that feels like your salon.",
    templatesLead: "These are the templates available in the owner workspace. Each has its own visual direction without changing your services or appointments.",
    template1: "Dark editorial with lime accents",
    template2: "Calm ivory with sage details",
    template3: "Charcoal, olive and copper",
    howLabel: "From setup to publishing",
    howTitle: "A clear path to your salon page.",
    steps: [
      ["Add your salon details", "Enter your name, contact information, location and opening hours."],
      ["Set up services and team", "Add services, prices, durations and team profiles."],
      ["Choose a template and media", "Personalise the look with your logo, images or a hero video."],
      ["Publish and manage", "Share your link and QR code, then follow appointment requests in your workspace."]
    ],
    faqLabel: "Clear answers before you begin",
    faqTitle: "Questions salon owners ask.",
    faqs: [
      ["What is Menuun?", "Menuun helps salon and barbershop owners manage business details and create a public page that reflects their brand."],
      ["What can I manage?", "You can manage salon details, services, prices and durations, team profiles, opening hours, media, templates, appointments, notifications and available insights."],
      ["What do customers see?", "Customers see the information you publish: your brand, services, team, images, opening hours, location and contact options, along with the supported appointment request flow."],
      ["Does Menuun support Arabic and English?", "Yes. Supported public experiences are available in Arabic RTL and English LTR."],
      ["Does Menuun process online payments?", "There is no online payment gateway at present. Owners can record a collection method such as cash, card or transfer when completing an appointment."],
      ["How do I access the owner workspace?", "Use Owner sign in. If you do not have an account yet, you can continue to account creation."]
    ],
    ctaTitle: "Make salon management clearer — and your presence stronger.",
    ctaText: "Open your owner workspace and explore how your salon page can look.",
    ctaButton: "Go to the owner workspace",
    footer: "Your salon operations and digital presence, working together.",
    note: "Visual previews are illustrative and contain no live operational data."
  };

  const features = [
    { number: "01", title: content.ownerTitle, text: content.ownerText, icon: "01 / WORKSPACE" },
    { number: "02", title: content.bookingTitle, text: content.bookingText, icon: "02 / APPOINTMENTS" },
    { number: "03", title: content.insightTitle, text: content.insightText, icon: "03 / INSIGHTS" },
    { number: "04", title: content.mediaTitle, text: content.mediaText, icon: "04 / BRAND" },
    { number: "05", title: content.teamTitle, text: content.teamText, icon: "05 / TEAM" },
    { number: "06", title: content.shareTitle, text: content.shareText, icon: "06 / PUBLISH" }
  ];

  return <div className="site-shell homepage-product">
    <a className="skip-link" href="#main">{isArabic ? "تجاوز إلى المحتوى" : "Skip to content"}</a>
    <header className="topbar homepage-product-header">
      <Logo lang={lang} />
      <nav id="homepage-navigation" className={menuOpen ? "nav-links open" : "nav-links"} aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}>
        {content.nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="top-actions">
        <button type="button" className="language-toggle" onClick={() => setLang(lang === "ar" ? "en" : "ar")} aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}>{isArabic ? "EN" : "عربي"} <span aria-hidden="true">↗</span></button>
        <a className="login-link" href="/login/">{content.login}</a>
        <button type="button" className="mobile-menu" aria-label={menuOpen ? (isArabic ? "إغلاق القائمة" : "Close menu") : (isArabic ? "فتح القائمة" : "Open menu")} aria-expanded={menuOpen} aria-controls="homepage-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main id="main">
      <section className="homepage-product-hero section-wrap" aria-labelledby="homepage-title">
        <div className="homepage-product-copy">
          <p className="homepage-product-eyebrow"><span />{content.badge}</p>
          <h1 id="homepage-title">{content.titleA}<br /><em>{content.titleB}</em></h1>
          <p className="homepage-product-lead">{content.lead}</p>
          <div className="homepage-product-actions">
            <a className="button button-dark" href="/login/">{content.login}<ArrowUpLeft size={17} /></a>
            <a className="homepage-product-secondary" href="/s/atelier-09" target="_blank" rel="noreferrer"><CirclePlay size={18} />{content.sample}</a>
          </div>
          <p className="homepage-product-micro"><Check size={15} />{isArabic ? "عربي وإنجليزي • صفحة عامة بهوية الصالون • تحكم من مساحة المالك" : "Arabic and English • Branded public page • Owner-controlled content"}</p>
        </div>

        <div className="homepage-product-stage" role="group" aria-label={content.preview}>
          <div className="homepage-product-preview-label"><Sparkles size={14} />{content.preview}</div>
          <div className="homepage-product-linkline"><span />{content.connection}<span /></div>
          <div className="homepage-product-surfaces">
            <article className="homepage-product-window owner-workspace" aria-label={content.workspace}>
              <div className="homepage-window-bar"><span className="homepage-window-brand">menuun <i>●</i></span><span className="homepage-window-dots">•••</span></div>
              <div className="homepage-owner-layout">
                <aside className="homepage-owner-nav" aria-hidden="true"><b>m.</b><span className="selected">▦</span><span>◷</span><span>◇</span><span>⚙</span></aside>
                <div className="homepage-owner-content">
                  <div className="homepage-owner-heading"><div><small>{content.workspace}</small><strong>{content.workspaceSub}</strong></div><span className="homepage-owner-avatar">A</span></div>
                  <div className="homepage-owner-tabs"><span>{content.overview}</span><span>{content.appointments}</span><span>{content.services}</span></div>
                  <div className="homepage-owner-stats"><div><small>{content.appointments}</small><b>◷</b></div><div><small>{content.services}</small><b>◇</b></div><div><small>{content.team}</small><b>♙</b></div></div>
                  <div className="homepage-owner-list"><strong>{content.today}</strong><div><span className="homepage-status-dot" />{content.pending}<small>•••</small></div><div><span className="homepage-status-dot confirmed" />{content.confirmed}<small>•••</small></div></div>
                  <div className="homepage-owner-services"><strong>{content.serviceName}</strong><span>{content.serviceOne}<i>↗</i></span><span>{content.serviceTwo}<i>↗</i></span></div>
                </div>
              </div>
              <span className="homepage-window-caption">{content.workspace}</span>
            </article>

            <article className="homepage-product-window public-salon-preview" aria-label={content.publicSite}>
              <div className="homepage-public-top"><span className="homepage-public-monogram">A.</span><span>{content.publicName}</span><span>☰</span></div>
              <div className="homepage-public-hero"><small>EST. / ATELIER</small><h2>{content.publicTitle}</h2><p>{content.publicText}</p><span className="homepage-public-cta">{content.publicCta}</span></div>
              <div className="homepage-public-details" data-capability="opening-hours"><small>{content.publicSite}</small><strong>{content.serviceName}</strong><div><span>{content.serviceOne}</span><i>↗</i></div><div><span>{content.serviceTwo}</span><i>↗</i></div><div className="homepage-public-gallery"><i /><i /><i /></div></div>
              <span className="homepage-window-caption">{content.publicSite}</span>
            </article>
          </div>
          <p className="homepage-product-note">{content.note}</p>
        </div>
      </section>

      <section className="homepage-product-proof" aria-label={isArabic ? "مبادئ المنصة" : "Platform principles"}>
        <div className="section-wrap homepage-proof-inner">
          <span>{isArabic ? "مصممة للصالونات ومحلات الحلاقة" : "Built for salons and barbershops"}</span>
          <span>{isArabic ? "تجربة عربية وإنجليزية" : "Arabic and English experiences"}</span>
          <span>{isArabic ? "محتوى عام يتحكم به المالك" : "Owner-controlled public content"}</span>
          <span>{isArabic ? "رابط صفحة ورمز QR للمشاركة" : "Shareable page link and QR"}</span>
        </div>
      </section>

      <section className="homepage-product-section section-wrap" id="product" data-section="benefits">
        <div className="homepage-section-heading"><p className="homepage-product-eyebrow">{content.productLabel}</p><h2>{content.productTitle}</h2><p>{content.productLead}</p></div>
        <div className="homepage-feature-grid">
          {features.map(feature => <article className="homepage-feature-card" key={feature.number}><span className="homepage-feature-number">{feature.number}</span><small>{feature.icon}</small><h3>{feature.title}</h3><p>{feature.text}</p><span className="homepage-feature-arrow" aria-hidden="true">↗</span></article>)}
        </div>
      </section>

      <section className="homepage-public-section">
        <div className="section-wrap homepage-public-layout">
          <div className="homepage-public-copy"><p className="homepage-product-eyebrow">{content.publicLabel}</p><h2>{content.publicTitle2}</h2><p>{content.publicLead}</p><ul>{content.publicList.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul><a className="button button-dark" href="/s/atelier-09" target="_blank" rel="noreferrer">{content.sample}<ArrowUpLeft size={17} /></a></div>
          <div className="homepage-public-card" aria-hidden="true"><div className="homepage-public-card-image"><span>ATELIER 09</span><b>THE ART OF DETAIL</b></div><div className="homepage-public-card-body"><small>{isArabic ? "الخدمات المختارة" : "SELECTED SERVICES"}</small><h3>{isArabic ? "خدمات مصممة لتفاصيلك" : "Services shaped around you"}</h3><div><span>{content.serviceOne}</span><i>01</i></div><div><span>{content.serviceTwo}</span><i>02</i></div><div className="homepage-public-card-footer"><span>{isArabic ? "ساعات العمل والموقع والتواصل" : "Hours, location and contact"}</span><span>↗</span></div></div></div>
        </div>
      </section>

      <section className="homepage-templates section-wrap" id="templates">
        <div className="homepage-section-heading"><p className="homepage-product-eyebrow">{content.templatesLabel}</p><h2>{content.templatesTitle}</h2><p>{content.templatesLead}</p></div>
        <div className="homepage-template-grid">
          <article className="homepage-template-card atelier"><div className="homepage-template-art"><span>ATELIER</span><b>CRAFT<br />& DETAIL</b><i /></div><h3>Atelier</h3><p>{content.template1}</p></article>
          <article className="homepage-template-card oasis"><div className="homepage-template-art"><span>OASIS</span><b>YOUR<br />RITUAL</b><i /></div><h3>Oasis</h3><p>{content.template2}</p></article>
          <article className="homepage-template-card forge"><div className="homepage-template-art"><span>FORGE MEN</span><b>BUILT ON<br />PRECISION</b><i /></div><h3>Forge Men</h3><p>{content.template3}</p></article>
        </div>
      </section>

      <section className="homepage-how" id="how-it-works">
        <div className="section-wrap"><div className="homepage-section-heading"><p className="homepage-product-eyebrow">{content.howLabel}</p><h2>{content.howTitle}</h2></div><div className="homepage-step-grid">{content.steps.map(([title, text], index) => <article className="homepage-step" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
      </section>

      <section className="homepage-faq section-wrap" id="faq">
        <div className="homepage-faq-heading"><p className="homepage-product-eyebrow">{content.faqLabel}</p><h2>{content.faqTitle}</h2></div>
        <div className="homepage-faq-list">{content.faqs.map(([question, answer], index) => <article className="homepage-faq-item" key={question}><h3><button type="button" aria-expanded={openFaq === index} aria-controls={"homepage-faq-answer-" + index} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{question}<ChevronDown size={18} /></button></h3>{openFaq === index && <p id={"homepage-faq-answer-" + index}>{answer}</p>}</article>)}</div>
      </section>

      <section className="homepage-final-cta section-wrap"><div><p className="homepage-product-eyebrow">{isArabic ? "ابدأ من مساحة المالك" : "START IN YOUR OWNER WORKSPACE"}</p><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div><a className="button button-lime" href="/login/">{content.ctaButton}<ArrowUpLeft size={17} /></a></section>
    </main>

    <footer className="homepage-footer"><div className="section-wrap homepage-footer-inner"><div><Logo lang={lang} /><p>{content.footer}</p></div><nav aria-label={isArabic ? "روابط الصفحة" : "Page links"}>{content.nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}<a href="/login/">{content.login}</a></nav><small>© {new Date().getFullYear()} Menuun</small></div></footer>
  </div>;
}


export default function App() {
  return <Suspense fallback={<main className="account-stage"><div className="account-card" role="status">Loading Menuun…</div></main>}><AppContent /></Suspense>;
}
