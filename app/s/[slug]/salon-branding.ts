export type SalonBrandInput = {
  name_ar: string | null | undefined;
  name_en: string | null | undefined;
};

const legacyDemoNames = new Set([
  "atelier", "atelier 09", "atelier grooming studio", "أتولييه للحلاقة والعناية", "أتيليه 09",
  "oasis", "oasis grooming studio", "واحة العناية الرجالية",
  "forge", "forge men", "فورج", "فورج للرجال"
]);

const unfinished = /صورة\s*(إرشادية|استرشادية)|يرجى استبدالها|ملف تجريبي|بيانات تجريبية|بانتظار الإعداد|أضف (اسم|خدمات|السعر)|نموذج استرشادي|placeholder|add (your|a) (barber|service|photo)/i;

function usable(value: string | null | undefined, demo: boolean): string | null {
  const name = value?.trim();
  if (!name || unfinished.test(name)) return null;
  if (demo && legacyDemoNames.has(name.toLocaleLowerCase())) return null;
  return name;
}

/** Resolve visible brand names from salon data; template identity is never the brand. */
export function resolveSalonBrandNames(salon: SalonBrandInput, isDemoSalon = false) {
  return {
    nameAr: usable(salon.name_ar, isDemoSalon) || "صالون العناية",
    nameEn: usable(salon.name_en, isDemoSalon) || "Grooming Studio"
  };
}
