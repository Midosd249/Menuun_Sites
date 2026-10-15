export type DemoService = {
  key: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  duration_minutes: number;
  price_sar: number;
  image_url: string;
};

export type PortfolioImage = {
  src: string;
  alt_ar: string;
  alt_en: string;
  category_ar: string;
  category_en: string;
};

export const THEME_IDENTITIES = {
  atelier: { nameAr: "أتولييه للحلاقة والعناية", nameEn: "Atelier Grooming Studio", taglineAr: "تفاصيل صغيرة، تجربة مختلفة." },
  oasis: { nameAr: "واحة العناية الرجالية", nameEn: "Oasis Grooming Studio", taglineAr: "عناية طبيعية، وأناقة بلا تكلّف." },
  rose: { nameAr: "فورج للرجال", nameEn: "Forge Men", taglineAr: "حضور هادئ، وتفاصيل تصنع الفرق." },
} as const;

export const DEMO_CONTACT = {
  phone: "+966549598318",
  whatsapp: "966549598318",
  address_ar: "حي الياسمين، طريق أنس بن مالك، الرياض، المملكة العربية السعودية",
  address_en: "Al Yasmin District, Anas Bin Malik Road, Riyadh, Saudi Arabia",
  hours_ar: [
    { day: "الأحد – الخميس", hours: "١٢:٠٠ م – ١١:٠٠ م" },
    { day: "الجمعة", hours: "٢:٠٠ م – ١١:٠٠ م" },
    { day: "السبت", hours: "١٢:٠٠ م – ١١:٠٠ م" },
  ],
  hours_en: [
    { day: "Sunday – Thursday", hours: "12:00 PM – 11:00 PM" },
    { day: "Friday", hours: "2:00 PM – 11:00 PM" },
    { day: "Saturday", hours: "12:00 PM – 11:00 PM" },
  ],
  map_url: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Al Yasmin District, Anas Bin Malik Road, Riyadh, Saudi Arabia"),
};

export const DEMO_SERVICES: DemoService[] = [
  { key: "classic-cut", name_ar: "قص كلاسيكي", name_en: "Classic Haircut", description_ar: "قصة دقيقة تناسب نوع شعرك، بلمسة نهائية بالمقص والموس.", description_en: "A precise cut tailored to your hair, finished with scissors and a clean razor detail.", duration_minutes: 30, price_sar: 60, image_url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=82" },
  { key: "cut-beard", name_ar: "قص ولحية", name_en: "Haircut & Beard", description_ar: "قص مخصص وتشذيب للحية مع لمسة ختامية بالمنشفة الدافئة.", description_en: "A tailored haircut and beard trim, finished with a warm towel.", duration_minutes: 45, price_sar: 95, image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=82" },
  { key: "beard-shape", name_ar: "تهذيب اللحية المميز", name_en: "Signature Beard Grooming", description_ar: "تحديد وترطيب وتشذيب للحية لمظهر أنيق ومتناسق.", description_en: "Defined lines, hydration and careful trimming for a balanced, polished beard.", duration_minutes: 20, price_sar: 50, image_url: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=1000&q=82" },
  { key: "fade-style", name_ar: "فيد وتصفيف", name_en: "Fade & Styling", description_ar: "تدريج دقيق مع تصفيف عصري ولمسة ختامية نظيفة.", description_en: "A precise fade with contemporary styling and a clean finish.", duration_minutes: 40, price_sar: 75, image_url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=82" },
  { key: "kids-cut", name_ar: "قص الأطفال", name_en: "Kids’ Haircut", description_ar: "قصة مريحة للصغار بعناية وصبر واهتمام بالتفاصيل.", description_en: "A relaxed, thoughtful haircut for younger guests, with patience and attention to detail.", duration_minutes: 30, price_sar: 40, image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=82" },
];

export const GROOM_PACKAGE = {
  name_ar: "باقة العريس",
  name_en: "Groom’s Signature Package",
  description_ar: "تجربة عناية متكاملة قبل الزفاف تشمل قص الشعر، وتهذيب اللحية، والعناية بالبشرة، ولمسة ختامية بالمنشفة الدافئة والعطر.",
  description_en: "A complete pre-wedding grooming experience with a tailored haircut, beard shaping, skincare, and a warm-towel and fragrance finish.",
  included_ar: ["قص شعر مخصص", "تحديد وتهذيب اللحية", "عناية بالبشرة", "لمسة ختامية بالمنشفة الدافئة والعطر"],
  included_en: ["Tailored haircut", "Beard shaping and trim", "Skincare treatment", "Warm-towel and fragrance finish"],
  duration_minutes: 90,
  price_sar: 450,
  image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=84",
};

export const OUR_WORK_IMAGES: PortfolioImage[] = [
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1000&q=82", alt_ar: "تدرّج عصري بتفاصيل دقيقة حول الجانبين", alt_en: "Modern fade with precise detailing around the sides", category_ar: "تدرّج عصري", category_en: "Modern fade" },
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=82", alt_ar: "قصة كلاسيكية بتصفيف مرتب ولمسة نظيفة", alt_en: "Classic haircut with a neat style and clean finish", category_ar: "قصة كلاسيكية", category_en: "Classic haircut" },
  { src: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?auto=format&fit=crop&w=1000&q=82", alt_ar: "تهذيب لحية بخطوط متناسقة ومحددة", alt_en: "Beard grooming with balanced, defined lines", category_ar: "تهذيب اللحية", category_en: "Beard shaping" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=82", alt_ar: "تصفيف شعر بقوام عصري وحركة طبيعية", alt_en: "Textured contemporary styling with natural movement", category_ar: "تصفيف بقوام", category_en: "Textured styling" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=82", alt_ar: "لمسات العناية النهائية داخل صالون رجالي", alt_en: "Finishing grooming details inside a men's salon", category_ar: "اللمسات النهائية", category_en: "Grooming finish" },
  { src: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1000&q=82", alt_ar: "إطلالة أنيقة لمناسبة خاصة", alt_en: "A polished look for a special occasion", category_ar: "إطلالة المناسبات", category_en: "Premium occasion look" },
];

export const LOCATION_IMAGES = {
  atelier: {
    src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=84",
    alt_ar: "أجواء صالون رجالي بتفاصيل داكنة وأنيقة",
    alt_en: "Dark, editorial men's salon atmosphere",
    objectPosition: "center 48%",
  },
  oasis: {
    src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1800&q=84",
    alt_ar: "مساحة صالون مشرقة بمواد طبيعية ودرجات هادئة",
    alt_en: "Bright salon interior with natural textures and calm tones",
    objectPosition: "center 52%",
  },
  rose: {
    src: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1800&q=84",
    alt_ar: "مساحة عناية رجالية بتفاصيل فحمية ولمسات برونزية",
    alt_en: "Men’s grooming space with charcoal details and bronze accents",
    objectPosition: "center 48%",
  },
} as const;

export const LOCATION_IMAGE = LOCATION_IMAGES.atelier;
export const HERO_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=88";
export const SERVICE_IMAGE_FALLBACKS = DEMO_SERVICES.map((service) => service.image_url);
export const BARBER_IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=700&q=80",
];
