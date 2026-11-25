export type PlanType = "free" | "pro";

export const FREE_DAILY_SECONDS = 15 * 60; // 15 minutes per day
export const PRO_DAILY_SECONDS = 2 * 60 * 60; // 120 minutes (2 hours/day)
export const FREE_LESSONS_LIMIT = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Computes the timestamp (ms) of the most recent 12:00 PM (noon) boundary
 * in the user's timezone (where tzOffsetMinutes matches Date.getTimezoneOffset()).
 */
export function getLastNoonTimestamp(
  now: Date = new Date(),
  tzOffsetMinutes: number = 0
): number {
  const localMs = now.getTime() - tzOffsetMinutes * 60_000;
  const localDate = new Date(localMs);

  const todayNoonLocalMs = Date.UTC(
    localDate.getUTCFullYear(),
    localDate.getUTCMonth(),
    localDate.getUTCDate(),
    12,
    0,
    0,
    0
  );

  const targetNoonLocalMs =
    localMs < todayNoonLocalMs ? todayNoonLocalMs - DAY_MS : todayNoonLocalMs;

  return targetNoonLocalMs + tzOffsetMinutes * 60_000;
}

/**
 * Computes the timestamp (ms) of the upcoming 12:00 PM (noon) reset.
 */
export function getNextNoonTimestamp(
  now: Date = new Date(),
  tzOffsetMinutes: number = 0
): number {
  return getLastNoonTimestamp(now, tzOffsetMinutes) + DAY_MS;
}

/**
 * Returns true if the user's daily practice counter should reset
 * because a 12:00 PM noon boundary has passed since lastResetAt.
 */
export function shouldResetDailyQuota(
  lastResetAt: number,
  now: Date = new Date(),
  tzOffsetMinutes: number = 0
): boolean {
  const lastNoon = getLastNoonTimestamp(now, tzOffsetMinutes);
  return lastResetAt < lastNoon;
}

export function getDailyLimitSeconds(plan: PlanType): number {
  return plan === "pro" ? PRO_DAILY_SECONDS : FREE_DAILY_SECONDS;
}

export function canAccessLesson(plan: PlanType, isLessonFree: boolean): boolean {
  return plan === "pro" || isLessonFree;
}

export function getQuotaStatus(params: {
  plan: PlanType;
  usedSecondsToday: number;
  lastResetAt: number;
  tzOffsetMinutes?: number;
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const tzOffset = params.tzOffsetMinutes ?? 0;
  const resetNeeded = shouldResetDailyQuota(params.lastResetAt, now, tzOffset);
  const usedSeconds = resetNeeded ? 0 : params.usedSecondsToday;
  const limitSeconds = getDailyLimitSeconds(params.plan);
  const remainingSeconds = Math.max(0, limitSeconds - usedSeconds);

  return {
    resetNeeded,
    usedSeconds,
    limitSeconds,
    remainingSeconds,
    limitReached: remainingSeconds <= 0,
    nextResetAt: getNextNoonTimestamp(now, tzOffset),
  };
}
