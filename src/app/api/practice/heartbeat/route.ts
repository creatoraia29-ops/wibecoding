import { NextResponse } from "next/server";
import { getDailyLimitSeconds, getQuotaStatus } from "@/lib/quota";
import { getSessionUserId } from "@/lib/session";
import { updateUser } from "@/lib/store";

export async function POST(req: Request) {
  const { userId } = await getSessionUserId();
  const body = (await req.json().catch(() => ({}))) as {
    seconds?: number;
    tzOffsetMinutes?: number;
  };

  const delta = Math.min(Math.max(Number(body.seconds) || 0, 0), 60);

  const user = updateUser(userId, (u) => {
    const tz =
      typeof body.tzOffsetMinutes === "number"
        ? body.tzOffsetMinutes
        : u.tzOffsetMinutes;
    const status = getQuotaStatus({
      plan: u.plan,
      usedSecondsToday: u.usedSecondsToday,
      lastResetAt: u.lastResetAt,
      tzOffsetMinutes: tz,
    });

    const limit = getDailyLimitSeconds(u.plan);
    const nextUsed = Math.min(limit, status.usedSeconds + delta);

    return {
      ...u,
      tzOffsetMinutes: tz,
      usedSecondsToday: nextUsed,
      lastResetAt: status.resetNeeded ? Date.now() : u.lastResetAt,
    };
  });

  const quota = getQuotaStatus({
    plan: user.plan,
    usedSecondsToday: user.usedSecondsToday,
    lastResetAt: user.lastResetAt,
    tzOffsetMinutes: user.tzOffsetMinutes,
  });

  return NextResponse.json({ quota, plan: user.plan });
}
