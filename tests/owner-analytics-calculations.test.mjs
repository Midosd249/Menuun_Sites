import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCustomerPhone, calculateBookingRates, comparePeriod, buildInsights } from "../app/owner/analytics-calculations.mjs";

test("Saudi phone numbers normalize across spaces, punctuation, and local leading zero", () => {
  assert.equal(normalizeCustomerPhone("+966 55 123 4567"), "966551234567");
  assert.equal(normalizeCustomerPhone("055-123-4567"), "966551234567");
  assert.equal(normalizeCustomerPhone("551234567"), "966551234567");
  assert.equal(normalizeCustomerPhone(""), null);
});

test("booking rates use the total and avoid dividing by zero", () => {
  assert.deepEqual(calculateBookingRates({completed: 6,cancelled: 2,no_show: 2}), {total:10,completionRatePct:60,cancellationRatePct:20,noShowRatePct:20});
  assert.deepEqual(calculateBookingRates({}), {total:0,completionRatePct:null,cancellationRatePct:null,noShowRatePct:null});
});

test("equal-period comparisons are null when the prior period is zero", () => {
  assert.equal(comparePeriod(120,100),20);
  assert.equal(comparePeriod(20,40),-50);
  assert.equal(comparePeriod(10,0),null);
});

test("insights are suppressed for thin data and use only measured rules", () => {
  assert.deepEqual(buildInsights({total:4,noShowRatePct:50,awaitingCollectionCount:2,unassignedCompleted:1}),[]);
  const insights=buildInsights({total:20,noShowRatePct:15,awaitingCollectionCount:3,unassignedCompleted:2});
  assert.deepEqual(insights.map(x=>x.code),["high_no_show_rate","awaiting_collection","unassigned_completed_jobs"]);
});
