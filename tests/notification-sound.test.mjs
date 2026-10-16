import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { appointmentInsertIsNewPending, notificationInsertIsNewBooking } from "../app/owner/notification-sound.mjs";
const soundSource = readFileSync(new URL("../app/owner/notifications-stats.tsx", import.meta.url), "utf8");

test("database appointment INSERT shape only chimes for a pending appointment in this salon", () => {
  const base = { new: { id: "appointment-1", salon_id: "salon-1", status: "pending" } };
  assert.equal(appointmentInsertIsNewPending(base, "salon-1"), true);
  assert.equal(appointmentInsertIsNewPending(base, "salon-2"), false);
  assert.equal(appointmentInsertIsNewPending({ new: {...base.new, status: "confirmed"} }, "salon-1"), false);
  assert.equal(appointmentInsertIsNewPending({ old: base.new }, "salon-1"), false);
});

test("notification insert deduplication uses appointment_id and ignores lifecycle updates", () => {
  const row = { new: { id: "notice-1", salon_id: "salon-1", kind: "appointment_created", appointment_id: "appointment-1" } };
  assert.equal(notificationInsertIsNewBooking(row, "salon-1"), true);
  assert.equal(notificationInsertIsNewBooking({new:{...row.new,kind:"appointment_updated"}}, "salon-1"), false);
  assert.equal(notificationInsertIsNewBooking({new:{...row.new,salon_id:"salon-2"}}, "salon-1"), false);
});

test("sound control resumes AudioContext and polling fallback only considers post-mount pending bookings", () => {
  assert.match(soundSource, /ctx\.resume\(\)/);
  assert.match(soundSource, /Test sound|اختبار الصوت/);
  assert.match(soundSource, /startedAt=useRef\(new Date\(\)\.toISOString\(\)\)/);
  assert.match(soundSource, /\.gt\("created_at",startedAt\.current\)/);
  assert.match(soundSource, /seen\.current\.has\(key\)/);
});
