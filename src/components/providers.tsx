"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { dictionary, type Locale } from "@/lib/i18n";
import type { PlanType } from "@/lib/quota";

export interface QuotaState {
  usedSeconds: number;
  limitSeconds: number;
  remainingSeconds: number;
  limitReached: boolean;
  nextResetAt: number;
}

export interface UserProfile {
  id: string;
  email: string;
  plan: PlanType;
  completedLessons: string[];
  solvedTasks: string[];
  quizScores: Record<string, number>;
}

interface AppContextValue {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (typeof dictionary)[Locale];
  user: UserProfile | null;
  quota: QuotaState | null;
  loadingUser: boolean;
  refreshUser: () => Promise<void>;
  startStripeCheckout: () => Promise<void>;
  toggleDemoPlan: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside Providers");
  }
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quota, setQuota] = useState<QuotaState | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("vibecode_locale");
    if (saved === "en" || saved === "ru") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    window.localStorage.setItem("vibecode_locale", loc);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const tzOffsetMinutes = new Date().getTimezoneOffset();
      const res = await fetch("/api/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tzOffsetMinutes }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setQuota(data.quota);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const startStripeCheckout = useCallback(async () => {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }, []);

  const toggleDemoPlan = useCallback(async () => {
    await fetch("/api/stripe/demo-toggle", { method: "POST" });
    await refreshUser();
  }, [refreshUser]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AppContext.Provider
        value={{
          locale,
          setLocale,
          t: dictionary[locale],
          user,
          quota,
          loadingUser,
          refreshUser,
          startStripeCheckout,
          toggleDemoPlan,
        }}
      >
        {children}
      </AppContext.Provider>
    </NextThemesProvider>
  );
}
