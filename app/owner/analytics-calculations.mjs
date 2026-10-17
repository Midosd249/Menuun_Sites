export function normalizeCustomerPhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return "966" + digits.slice(1);
  if (/^5\d{8}$/.test(digits)) return "966" + digits;
  return digits;
}

export function calculateBookingRates(counts = {}) {
  const total = Object.values(counts).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const rate = key => total ? Math.round((Number(counts[key]) || 0) / total * 10000) / 100 : null;
  return {
    total,
    completionRatePct: rate("completed"),
    cancellationRatePct: rate("cancelled") ?? rate("canceled"),
    noShowRatePct: rate("no_show") ?? rate("noshow")
  };
}

export function comparePeriod(current, previous) {
  const before = Number(previous) || 0;
  if (!before) return null;
  return Math.round(((Number(current) - before) / before) * 10000) / 100;
}

export function buildInsights({ total = 0, noShowRatePct = null, awaitingCollectionCount = 0, unassignedCompleted = 0 } = {}) {
  if (total < 10) return [];
  const insights = [];
  if (Number(noShowRatePct) >= 10) insights.push({ code: "high_no_show_rate", value: noShowRatePct });
  if (awaitingCollectionCount > 0) insights.push({ code: "awaiting_collection", value: awaitingCollectionCount });
  if (unassignedCompleted > 0) insights.push({ code: "unassigned_completed_jobs", value: unassignedCompleted });
  return insights.slice(0, 5);
}
