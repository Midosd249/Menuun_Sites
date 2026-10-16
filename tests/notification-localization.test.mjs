import test from "node:test";
import assert from "node:assert/strict";
import { localizeNotification } from "../app/owner/notification-localization.mjs";

test("structured booking notification payload renders localized copy", () => {
  const row={kind:"appointment_created",payload:{customer_name:"Fixture Customer",status:"pending"},title:"appointment_created",body:"appointment_created"};
  assert.deepEqual(localizeNotification(row,"en"),{title:"New booking",body:"A new booking request is waiting for salon confirmation."});
  assert.deepEqual(localizeNotification(row,"ar"),{title:"حجز جديد",body:"يوجد طلب حجز جديد بانتظار المراجعة."});
});

test("appointment status updates render the status in the active language", () => {
  const row={kind:"appointment_updated",payload:{status:"confirmed"},title:"appointment_updated",body:"appointment_updated"};
  assert.deepEqual(localizeNotification(row,"en"),{title:"Appointment updated",body:"Appointment status: Confirmed."});
  assert.deepEqual(localizeNotification(row,"ar"),{title:"تحديث الموعد",body:"حالة الموعد: مؤكد."});
});

test("legacy rows fall back to stored text for unknown kinds", () => {
  const row={kind:"system",payload:{},title:"Old title",body:"Old body"};
  assert.deepEqual(localizeNotification(row,"en"),{title:"Old title",body:"Old body"});
});
