"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Code2, Crown, Globe, Moon, Sun, Timer } from "lucide-react";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function Navbar() {
  const { locale, setLocale, t, user, quota } = useApp();
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const remainingMin = quota ? Math.ceil(quota.remainingSeconds / 60) : 15;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 via-rose-400 to-pink-300 text-white shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="font-heading text-base font-bold tracking-tight sm:text-lg">
              {t.brand}
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/" className="transition-colors hover:text-foreground">
              {t.nav.home}
            </Link>
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.dashboard}
            </Link>
            <Link
              href="/#stages"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.curriculum}
            </Link>
            <Link
              href="/#pricing"
              className="transition-colors hover:text-foreground"
            >
              {t.nav.pricing}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <Link href="/dashboard" className="hidden sm:flex items-center gap-2">
              <Badge
                variant={user.plan === "pro" ? "default" : "secondary"}
                className={
                  user.plan === "pro"
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
                    : "border border-pink-500/30 bg-secondary text-foreground"
                }
              >
                {user.plan === "pro" ? (
                  <Crown className="mr-1 h-3 w-3" />
                ) : (
                  <Timer className="mr-1 h-3 w-3 text-pink-500" />
                )}
                {user.plan === "pro"
                  ? "PRO"
                  : `FREE • ${remainingMin} ${t.dashboard.minutesShort}`}
              </Badge>
            </Link>
          )}

          {/* Language Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocale(locale === "ru" ? "en" : "ru")}
            aria-label="Toggle language"
            className="h-9 gap-1.5 px-2.5 text-xs font-semibold"
          >
            <Globe className="h-3.5 w-3.5 text-pink-500" />
            <span>{locale === "ru" ? "RU" : "EN"}</span>
          </Button>

          {/* Theme Switcher */}
          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-pink-300" />
              ) : (
                <Moon className="h-4 w-4 text-foreground" />
              )}
            </Button>
          )}

          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
            )}
          >
            {t.nav.startLearning}
          </Link>
        </div>
      </div>
    </header>
  );
}
