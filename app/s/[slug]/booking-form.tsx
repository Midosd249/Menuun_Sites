"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import styles from "./public-salon.module.css";

type Service = { id: string; name_ar: string; price_sar: number; duration_minutes: number };
type Barber = { id: string; display_name: string };

type Slot = { starts_at: string; barber_id: string; barber_name: string };
type Props = { slug: string; services: Service[]; barbers: Barber[]; timezone: string; language?: "ar" | "en" };

function dateInZone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return part("year") + "-" + part("month") + "-" + part("day");
}

function localDateTime(value: string, timeZone: string, language: "ar" | "en") {
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "ar-SA", {
    timeZone, weekday: "short", day: "numeric", month: "short",
    hour: "numeric", minute: "2-digit",
  }).format(new Date(value));
}

function errorMessage(message: string, english: boolean) {
  if (/SLOT|EXCLUSION|duplicate key|no rows/i.test(message)) return english ? "That time is no longer available. Refresh and choose another." : "هذا الموعد لم يعد متاحًا. حدّث الأوقات واختر موعدًا آخر.";
  if (/SALON_NOT_AVAILABLE|SERVICE_NOT_AVAILABLE|BARBER_NOT_AVAILABLE/i.test(message)) return english ? "The salon or service is no longer available." : "تعذّر إتمام الطلب لأن الصالون أو الخدمة لم تعد متاحة.";
  if (/OUTSIDE_BUSINESS_HOURS|INVALID_APPOINTMENT_TIME|INVALID_AVAILABILITY_DATE/i.test(message)) return english ? "That time is unavailable. Choose another time." : "الوقت المختار غير متاح. اختر وقتًا آخر.";
  if (/INVALID_CUSTOMER_PHONE/i.test(message)) return english ? "Check the phone number and try again." : "تحقق من رقم الجوال وأعد المحاولة.";
  return english ? "We could not send your request. Please try again." : "لم نتمكن من إرسال طلب الحجز الآن. يرجى المحاولة مرة أخرى.";
}

export default function PublicBookingForm({ slug, services, barbers, timezone, language = "ar" }: Props) {
  const english = language === "en";
  const today = useMemo(() => dateInZone(timezone || "Asia/Riyadh"), [timezone]);
  const maxDate = useMemo(() => {
    const date = new Date(today + "T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + 90);
    return date.toISOString().slice(0, 10);
  }, [today]);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState(today);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [appointmentId, setAppointmentId] = useState("");

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && services.some((service) => service.id === requestedService)) setServiceId(requestedService);
  }, [services]);

  useEffect(() => {
    let cancelled = false;
    setSlots([]);
    setSelectedSlot("");
    setNotice(null);
    if (!serviceId || !date) return;
    setLoadingSlots(true);
    const db = createSupabaseBrowserClient();
    db.rpc("get_public_booking_slots", {
      p_salon_slug: slug,
      p_service_id: serviceId,
      p_date: date,
      p_barber_id: barberId || null,
    }).then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setSlots([]);
        setNotice({ kind: "error", text: english ? "Could not load available times. Try refreshing the date." : "تعذّر تحميل المواعيد المتاحة. حاول تحديث اليوم." });
      } else {
        setSlots((data ?? []) as Slot[]);
      }
      setLoadingSlots(false);
    });
    return () => { cancelled = true; };
  }, [slug, serviceId, date, barberId]);

  const uniqueSlots = useMemo(() => {
    const seen = new Set<string>();
    return slots.filter((slot) => {
      if (seen.has(slot.starts_at)) return false;
      seen.add(slot.starts_at);
      return true;
    });
  }, [slots]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId || !selectedSlot) {
      setNotice({ kind: "error", text: english ? "Choose a service and time first." : "اختر الخدمة والموعد أولًا." });
      return;
    }
    const slot = slots.find((item) => item.starts_at === selectedSlot);
    if (!slot) {
      setNotice({ kind: "error", text: english ? "Refresh the available times and choose one." : "حدّث المواعيد واختر وقتًا متاحًا." });
      return;
    }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("customer_name") ?? "").trim();
    const phone = String(form.get("customer_phone") ?? "").trim();
    const note = String(form.get("customer_note") ?? "").trim();
    if (name.length < 2 || name.length > 120) {
      setNotice({ kind: "error", text: english ? "Enter a name between 2 and 120 characters." : "اكتب الاسم من حرفين إلى 120 حرفًا." });
      return;
    }
    if (phone.replace(/[^0-9+]/g, "").length < 8 || phone.replace(/[^0-9+]/g, "").length > 16) {
      setNotice({ kind: "error", text: english ? "Enter a valid phone number, including country code if needed." : "أدخل رقم جوال صحيحًا مع مفتاح الدولة عند الحاجة." });
      return;
    }
    if (note.length > 1000) {
      setNotice({ kind: "error", text: english ? "Notes must be 1,000 characters or fewer." : "الملاحظات يجب ألا تتجاوز 1000 حرف." });
      return;
    }

    setSubmitting(true);
    setNotice(null);
    const db = createSupabaseBrowserClient();
    const { data, error } = await db.rpc("request_salon_appointment", {
      p_salon_slug: slug,
      p_service_id: serviceId,
      p_barber_id: slot.barber_id,
      p_customer_name: name,
      p_customer_phone: phone,
      p_starts_at: slot.starts_at,
      p_customer_note: note || null,
    });
    setSubmitting(false);
    if (error || !data) {
      setNotice({ kind: "error", text: errorMessage(error?.message ?? "BOOKING_FAILED", english) });
      setSelectedSlot("");
      const refreshed = await db.rpc("get_public_booking_slots", {
        p_salon_slug: slug, p_service_id: serviceId, p_date: date, p_barber_id: barberId || null,
      });
      if (!refreshed.error) setSlots((refreshed.data ?? []) as Slot[]);
      return;
    }
    setAppointmentId(String(data));
    setNotice({ kind: "success", text: english ? "Your request was sent and is awaiting salon confirmation." : "وصل طلبك بنجاح. حالة الطلب: بانتظار تأكيد الصالون." });
    setSelectedSlot("");
    formElement.reset();
  }

  if (!services.length) {
    return <section className={styles.bookingSection} id="booking"><p className={styles.eyebrow}>{english ? "BOOKING" : "الحجز المباشر"}</p><h2>{english ? "Start by choosing a service." : "ابدأ باختيار خدمتك."}</h2><p className={styles.bookingHint}>{english ? "No services are available for online booking. Contact the salon for assistance." : "لا توجد خدمات متاحة للحجز حاليًا. تواصل مع الصالون للاستفسار."}</p></section>;
  }

  return <section className={styles.bookingSection} id="booking">
    <div className={styles.sectionHeading}>
      <div><p className={styles.eyebrow}>{english ? "BOOKING" : "الحجز المباشر"}</p><h2>{english ? "Your next appointment, made simple." : "موعدك القادم، بخطوات بسيطة."}</h2></div>
      <p>{english ? "Choose a service and a convenient time. The salon will review your request." : "اختر الخدمة والوقت المناسب. سيصل طلبك إلى الصالون بانتظار التأكيد."}</p>
    </div>
    {notice?.kind === "success" ? <div className={styles.bookingSuccess} role="status">
      <span className={styles.successMark}>✓</span><h3>{english ? "Booking request sent" : "تم إرسال طلب الحجز"}</h3><p>{notice.text}</p>
      {appointmentId && <small>{english ? "Request ID: " : "رقم الطلب: "}{appointmentId.slice(0, 8).toUpperCase()}</small>}
      <button type="button" className={styles.secondaryButton} onClick={() => { setNotice(null); setAppointmentId(""); }}>{english ? "Request another appointment" : "طلب موعد آخر"}</button>
    </div> : <form className={styles.bookingForm} onSubmit={submit}>
      <div className={styles.bookingFields}>
        <label>{english ? "Service" : "الخدمة"}<select value={serviceId} onChange={(event) => setServiceId(event.target.value)} required>{services.map((service) => <option key={service.id} value={service.id}>{service.name_ar} · {service.duration_minutes} دقيقة</option>)}</select></label>
        <label>{english ? "Barber" : "مقدم الخدمة"}<select value={barberId} onChange={(event) => setBarberId(event.target.value)}><option value="">{english ? "Any available barber" : "أقرب موعد متاح"}</option>{barbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.display_name}</option>)}</select></label>
        <label>{english ? "Date" : "التاريخ"}<input type="date" value={date} min={today} max={maxDate} onChange={(event) => setDate(event.target.value)} required /></label>
      </div>
      <div className={styles.slotBlock}><div className={styles.slotHeading}><h3>{english ? "Available times" : "الأوقات المتاحة"}</h3><span>{date}</span></div>
        {loadingSlots ? <p className={styles.bookingHint} role="status">{english ? "Loading available times..." : "جارٍ تحميل المواعيد..."}</p>
          : uniqueSlots.length ? <div className={styles.slotGrid}>{uniqueSlots.map((slot) => <button key={slot.starts_at} type="button" className={selectedSlot === slot.starts_at ? styles.slotSelected : styles.slotButton} onClick={() => setSelectedSlot(slot.starts_at)} aria-pressed={selectedSlot === slot.starts_at}><strong>{localDateTime(slot.starts_at, timezone || "Asia/Riyadh", language).split("، ").slice(-1)[0]}</strong><small>{slot.barber_name}</small></button>)}</div>
          : <p className={styles.bookingHint}>{english ? "No appointments available that day. Try another date." : "لا توجد مواعيد متاحة في هذا اليوم. جرّب تاريخًا آخر."}</p>}
      </div>
      <div className={styles.bookingFields}>
        <label>{english ? "Full name" : "الاسم الكامل"}<input name="customer_name" autoComplete="name" minLength={2} maxLength={120} required /></label>
        <label>{english ? "Phone number" : "رقم الجوال"}<input name="customer_phone" type="tel" autoComplete="tel" inputMode="tel" minLength={8} maxLength={24} placeholder="+966 5X XXX XXXX" required /></label>
        <label className={styles.noteField}>{english ? "Notes (optional)" : "ملاحظات (اختياري)"}<textarea name="customer_note" maxLength={1000} rows={3} placeholder=english ? "Anything that will help us prepare for your visit" : "أي تفاصيل تساعدنا على تجهيز زيارتك" /></label>
      </div>
      {notice?.kind === "error" && <p className={styles.bookingError} role="alert">{notice.text}</p>}
      <button type="submit" className={styles.bookingSubmit} disabled={submitting || loadingSlots || !selectedSlot}>{submitting ? english ? "Sending request..." : "جارٍ إرسال الطلب..." : english ? "Submit booking request ↙" : "تأكيد طلب الموعد ↙"}</button>
      <p className={styles.bookingDisclaimer}>{english ? "Submitting a request does not automatically confirm the appointment. The salon must review and confirm it." : "إرسال الطلب لا يعني تأكيد الموعد تلقائيًا؛ سيظهر للصالون بانتظار المراجعة والتأكيد."}</p>
    </form>}
  </section>;
}
