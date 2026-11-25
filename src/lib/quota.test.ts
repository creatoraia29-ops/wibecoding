import assert from "node:assert/strict";
import test from "node:test";
import { LESSONS } from "../data/curriculum.ts";
import {
  canAccessLesson,
  FREE_DAILY_SECONDS,
  getLastNoonTimestamp,
  getNextNoonTimestamp,
  getQuotaStatus,
  PRO_DAILY_SECONDS,
  shouldResetDailyQuota,
} from "./quota.ts";

test("Free tier has 5 free lessons and 15 min daily limit", () => {
  const freeCount = LESSONS.filter((l) => l.isFree).length;
  assert.equal(freeCount, 5);
  assert.equal(FREE_DAILY_SECONDS, 900);
  assert.equal(PRO_DAILY_SECONDS, 7200);
});

test("Noon reset triggers when lastResetAt is before 12:00 PM today", () => {
  // 2026-11-21 14:00:00 UTC (tzOffset = 0)
  const nowAfterNoon = new Date("2026-11-21T14:00:00.000Z");
  const lastNoon = getLastNoonTimestamp(nowAfterNoon, 0);
  assert.equal(new Date(lastNoon).toISOString(), "2026-11-21T12:00:00.000Z");

  const resetBeforeNoon = new Date("2026-11-21T11:30:00.000Z").getTime();
  const resetAfterNoon = new Date("2026-11-21T12:05:00.000Z").getTime();

  assert.equal(shouldResetDailyQuota(resetBeforeNoon, nowAfterNoon, 0), true);
  assert.equal(shouldResetDailyQuota(resetAfterNoon, nowAfterNoon, 0), false);
});

test("Before 12:00 PM noon, last noon boundary is yesterday 12:00 PM", () => {
  const nowBeforeNoon = new Date("2026-11-21T09:00:00.000Z");
  const lastNoon = getLastNoonTimestamp(nowBeforeNoon, 0);
  const nextNoon = getNextNoonTimestamp(nowBeforeNoon, 0);

  assert.equal(new Date(lastNoon).toISOString(), "2026-11-20T12:00:00.000Z");
  assert.equal(new Date(nextNoon).toISOString(), "2026-11-21T12:00:00.000Z");
});

test("Quota status resets usedSecondsToday after passing 12:00 PM", () => {
  const status = getQuotaStatus({
    plan: "free",
    usedSecondsToday: 900,
    lastResetAt: new Date("2026-11-21T11:59:00.000Z").getTime(),
    now: new Date("2026-11-21T12:01:00.000Z"),
    tzOffsetMinutes: 0,
  });

  assert.equal(status.resetNeeded, true);
  assert.equal(status.usedSeconds, 0);
  assert.equal(status.remainingSeconds, 900);
  assert.equal(status.limitReached, false);
});

test("Access control blocks PRO lessons on Free plan", () => {
  assert.equal(canAccessLesson("free", true), true);
  assert.equal(canAccessLesson("free", false), false);
  assert.equal(canAccessLesson("pro", false), true);
});
