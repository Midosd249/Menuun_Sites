const statusCopy = {
  pending: { ar: "قيد الانتظار", en: "Pending" },
  confirmed: { ar: "مؤكد", en: "Confirmed" },
  completed: { ar: "مكتمل", en: "Completed" },
  cancelled: { ar: "ملغي", en: "Cancelled" },
  no_show: { ar: "لم يحضر", en: "No-show" },
  reschedule_requested: { ar: "طلب تغيير الموعد", en: "Reschedule requested" }
};

export function localizeNotification(row, locale) {
  const ar = locale === "ar";
  const payload = row?.payload && typeof row.payload === "object" ? row.payload : {};
  if (row?.kind === "appointment_created") {
    return { title: ar ? "حجز جديد" : "New booking", body: ar ? "يوجد طلب حجز جديد بانتظار المراجعة." : "A new booking request is waiting for salon confirmation." };
  }
  if (row?.kind === "appointment_updated") {
    const status = statusCopy[payload.status]?.[ar ? "ar" : "en"];
    if (status) return { title: ar ? "تحديث الموعد" : "Appointment updated", body: ar ? "حالة الموعد: " + status + "." : "Appointment status: " + status + "." };
  }
  return { title: row?.title || (ar ? "إشعار" : "Notification"), body: row?.body || (ar ? "لديك إشعار جديد." : "You have a new notification.") };
}
