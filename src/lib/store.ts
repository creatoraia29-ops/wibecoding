import fs from "node:fs";
import path from "node:path";
import { getQuotaStatus, type PlanType } from "@/lib/quota";

export interface UserRecord {
  id: string;
  email: string;
  plan: PlanType;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  usedSecondsToday: number;
  lastResetAt: number;
  tzOffsetMinutes: number;
  completedLessons: string[];
  solvedTasks: string[];
  quizScores: Record<string, number>;
  createdAt: number;
}

interface StoreData {
  users: Record<string, UserRecord>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function ensureStore(): StoreData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const empty: StoreData = { users: {} };
    fs.writeFileSync(STORE_PATH, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreData;
    return parsed?.users ? parsed : { users: {} };
  } catch {
    return { users: {} };
  }
}

function saveStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getOrCreateUser(
  userId: string,
  tzOffsetMinutes: number = -300
): UserRecord {
  const store = ensureStore();
  let user = store.users[userId];

  if (!user) {
    user = {
      id: userId,
      email: "student@vibecode.ai",
      plan: "free",
      usedSecondsToday: 0,
      lastResetAt: Date.now(),
      tzOffsetMinutes,
      completedLessons: [],
      solvedTasks: [],
      quizScores: {},
      createdAt: Date.now(),
    };
    store.users[userId] = user;
    saveStore(store);
    return user;
  }

  // Apply 12:00 PM noon reset if boundary passed
  const quota = getQuotaStatus({
    plan: user.plan,
    usedSecondsToday: user.usedSecondsToday,
    lastResetAt: user.lastResetAt,
    tzOffsetMinutes: user.tzOffsetMinutes,
  });

  if (quota.resetNeeded) {
    user.usedSecondsToday = 0;
    user.lastResetAt = Date.now();
    store.users[userId] = user;
    saveStore(store);
  }

  return user;
}

export function updateUser(
  userId: string,
  updater: (user: UserRecord) => UserRecord
): UserRecord {
  const store = ensureStore();
  const current = getOrCreateUser(userId);
  const updated = updater({ ...current });
  store.users[userId] = updated;
  saveStore(store);
  return updated;
}

export function findUserByStripeCustomer(
  customerId: string
): UserRecord | undefined {
  const store = ensureStore();
  return Object.values(store.users).find(
    (u) => u.stripeCustomerId === customerId
  );
}
