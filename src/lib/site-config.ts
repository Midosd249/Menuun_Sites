export const salonSite = {
  brand: "Luma Studio",
  eyebrow: "BEAUTY, WITH INTENTION",
  title: "Your moment.\nYour glow.",
  description:
    "A considered space for hair, skin and self-care. Thoughtful treatments, expert hands, and time that belongs entirely to you.",
  location: "Al Olaya, Riyadh",
  hours: "Daily · 10 AM – 10 PM",
  phone: "+966 55 000 0000",
  services: [
    { number: "01", name: "Signature haircut", detail: "Consultation, cut & finish", price: "From SAR 180", duration: "60 min" },
    { number: "02", name: "Color ritual", detail: "Personalized color & gloss", price: "From SAR 420", duration: "120 min" },
    { number: "03", name: "Skin reset facial", detail: "Deep cleanse & hydration", price: "From SAR 290", duration: "75 min" },
  ],
  values: [
    { number: "01", title: "Considered care", detail: "Every treatment begins with listening. Your routine, your goals, your pace." },
    { number: "02", title: "Expert hands", detail: "A close-knit team combining thoughtful technique with a personal touch." },
    { number: "03", title: "Room to reset", detail: "A calm, warm space designed to help you step out feeling like yourself." },
  ],
} as const;

export type BusinessVertical = "salon" | "clinic" | "restaurant" | "professional";

export const verticalLabels: Record<BusinessVertical, string> = {
  salon: "Salon & beauty",
  clinic: "Clinics & wellness",
  restaurant: "Restaurants & cafés",
  professional: "Professional services",
};
