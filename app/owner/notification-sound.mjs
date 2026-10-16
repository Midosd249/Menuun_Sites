export function appointmentInsertIsNewPending(payload, salonId) {
  const row = payload?.new;
  return Boolean(row && typeof row.id === "string" && row.id.length > 0 &&
    row.salon_id === salonId && row.status === "pending");
}

export function notificationInsertIsNewBooking(payload, salonId) {
  const row = payload?.new;
  return Boolean(row && typeof row.id === "string" && row.id.length > 0 &&
    row.salon_id === salonId && row.kind === "appointment_created" &&
    typeof row.appointment_id === "string" && row.appointment_id.length > 0);
}
