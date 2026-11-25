import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { updateUser } from "@/lib/store";

export async function POST() {
  const { userId } = await getSessionUserId();
  const user = updateUser(userId, (u) => ({
    ...u,
    plan: u.plan === "pro" ? "free" : "pro",
  }));
  return NextResponse.json({ plan: user.plan });
}
