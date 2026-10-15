import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const sql = readFileSync(new URL("../supabase/migrations/20261016080100_owner_scheduled_jobs_collection_stats.sql", import.meta.url), "utf8");
test("statistics count all completed work by scheduled date and separate collections by paid date", () => {
  assert.match(sql, /'completed_jobs'/);
  assert.match(sql, /'awaiting_collection_sar'/);
  assert.match(sql, /a\.status='completed' AND NOT a\.is_paid/);
  assert.match(sql, /a\.paid_at AT TIME ZONE 'Asia\/Riyadh'/);
  assert.match(sql, /LEFT JOIN public\.barbers/);
  assert.match(sql, /private\.is_salon_member\(p_salon_id\)/);
});
