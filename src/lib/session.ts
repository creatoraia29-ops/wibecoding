import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "vibecode_uid";

export async function getSessionUserId(): Promise<{
  userId: string;
  isNew: boolean;
}> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (existing && existing.length >= 8) {
    return { userId: existing, isNew: false };
  }
  return { userId: crypto.randomUUID(), isNew: true };
}
