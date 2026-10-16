export type SalonBrandInput = {
  name_ar: string | null | undefined;
  name_en: string | null | undefined;
};

const genericArabicName = "صالون العناية";
const genericEnglishName = "Grooming Studio";

function nonEmpty(value: string | null | undefined): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

/**
 * The salon record is the source of truth for every public brand surface.
 * Preserve the owner's exact value; only use the other language when the
 * requested language is empty. Template/demo identity must never override it.
 */
export function resolveSalonBrandNames(salon: SalonBrandInput, _isDemoSalon = false) {
  const nameAr = nonEmpty(salon.name_ar);
  const nameEn = nonEmpty(salon.name_en);
  return {
    nameAr: nameAr ?? nameEn ?? genericArabicName,
    nameEn: nameEn ?? nameAr ?? genericEnglishName
  };
}
