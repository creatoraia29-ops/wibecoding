import { NextResponse } from "next/server";
import { getQuotaStatus } from "@/lib/quota";
import { getSessionUserId, SESSION_COOKIE_NAME } from "@/lib/session";
import { getOrCreateUser, updateUser } from "@/lib/store";

function formatUserResponse(user: ReturnType<typeof getOrCreateUser>) {
  const quota = getQuotaStatus({
    plan: user.plan,
    usedSecondsToday: user.usedSecondsToday,
    lastResetAt: user.lastResetAt,
    tzOffsetMinutes: user.tzOffsetMinutes,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan,
      completedLessons: user.completedLessons,
      solvedTasks: user.solvedTasks,
      quizScores: user.quizScores,
    },
    quota,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  };
}

export async function GET() {
  const { userId, isNew } = await getSessionUserId();
  const user = getOrCreateUser(userId);
  const res = NextResponse.json(formatUserResponse(user));

  if (isNew) {
    res.cookies.set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export async function POST(req: Request) {
  const { userId, isNew } = await getSessionUserId();
  const body = (await req.json().catch(() => ({}))) as {
    tzOffsetMinutes?: number;
    email?: string;
  };

  const user = updateUser(userId, (u) => ({
    ...u,
    tzOffsetMinutes:
      typeof body.tzOffsetMinutes === "number"
        ? body.tzOffsetMinutes
        : u.tzOffsetMinutes,
    email:
      typeof body.email === "string" && body.email.includes("@")
        ? body.email.trim()
        : u.email,
  }));

  const res = NextResponse.json(formatUserResponse(user));
  if (isNew) {
    res.cookies.set(SESSION_COOKIE_NAME, userId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}
