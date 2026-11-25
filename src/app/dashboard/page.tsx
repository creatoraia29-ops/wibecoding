"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Crown,
  Lock,
  Play,
  RefreshCw,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LESSONS, LEVELS, STAGES } from "@/data/curriculum";

function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}h ${String(mins).padStart(2, "0")}m`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const {
    locale,
    t,
    user,
    quota,
    loadingUser,
    startStripeCheckout,
    toggleDemoPlan,
  } = useApp();
  const [countdown, setCountdown] = useState("00:00:00");
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!quota?.nextResetAt) return;

    const update = () => {
      const diffMs = Math.max(0, quota.nextResetAt - Date.now());
      const totalSec = Math.floor(diffMs / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
          s
        ).padStart(2, "0")}`
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [quota?.nextResetAt]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await startStripeCheckout();
    } finally {
      setUpgrading(false);
    }
  };

  if (loadingUser || !user || !quota) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const usedPercent = Math.min(
    100,
    Math.round((quota.usedSeconds / quota.limitSeconds) * 100)
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-12 px-4 py-12 sm:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-2xl font-bold sm:text-3xl">
            {t.dashboard.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDemoPlan}
            className="gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t.dashboard.demoToggle}
          </Button>
          {user.plan === "free" && (
            <Button
              size="sm"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
            >
              <Crown className="mr-1.5 h-3.5 w-3.5" />
              {t.dashboard.upgradeBtn}
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Practice Quota & Noon Reset */}
        <Card className="border-pink-500/35">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>{t.dashboard.practiceToday}</CardDescription>
              <Badge
                className={
                  user.plan === "pro"
                    ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white border-0"
                    : "bg-secondary text-foreground border border-border"
                }
              >
                {user.plan.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="font-heading text-2xl">
              {formatDuration(quota.usedSeconds)} /{" "}
              {Math.round(quota.limitSeconds / 60)} {t.dashboard.minutesShort}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={usedPercent} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-pink-500" />
                {t.dashboard.nextReset}
              </span>
              <span className="font-mono font-semibold text-foreground">
                {countdown}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed Lessons */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.dashboard.lessonsCompleted}</CardDescription>
            <CardTitle className="font-heading text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-pink-500" />
              <span>
                {user.completedLessons.length} / {LESSONS.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={Math.round(
                (user.completedLessons.length / LESSONS.length) * 100
              )}
              className="h-2"
            />
          </CardContent>
        </Card>

        {/* Solved Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t.dashboard.tasksSolved}</CardDescription>
            <CardTitle className="font-heading text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-pink-500" />
              <span>
                {user.solvedTasks.length} / {LESSONS.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={Math.round(
                (user.solvedTasks.length / LESSONS.length) * 100
              )}
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Banner for Free users */}
      {user.plan === "free" && (
        <Card className="border-pink-500/40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-pink-950/60 text-white">
          <CardContent className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-heading text-lg font-bold">
                <Sparkles className="h-5 w-5 text-pink-400" />
                <span>{t.dashboard.upgradeBannerTitle}</span>
              </div>
              <p className="text-sm text-zinc-300">
                {t.dashboard.upgradeBannerDesc}
              </p>
            </div>
            <Button
              onClick={handleUpgrade}
              disabled={upgrading}
              size="lg"
              className="shrink-0 bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
            >
              {t.dashboard.upgradeBtn}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stages, Levels & Lessons */}
      <div className="space-y-10">
        {STAGES.map((stage) => (
          <section key={stage.id} className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-3">
              <h2 className="font-heading text-xl font-bold sm:text-2xl">
                {stage.title[locale]}
              </h2>
              <Badge variant="outline" className="border-pink-500/40">
                {stage.badge[locale]}
              </Badge>
            </div>

            <div className="space-y-6">
              {stage.levels.map((levelNum) => {
                const levelInfo = LEVELS[levelNum];
                const levelLessons = LESSONS.filter(
                  (l) => l.level === levelNum
                );

                return (
                  <div key={levelNum} className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {levelInfo.title[locale]}
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {levelLessons.map((lesson) => {
                        const isCompleted = user.completedLessons.includes(
                          lesson.id
                        );
                        const locked =
                          user.plan === "free" && !lesson.isFree;

                        return (
                          <Card
                            key={lesson.id}
                            className={`flex flex-col justify-between transition-all ${
                              locked
                                ? "opacity-80 border-border/60"
                                : "hover:border-pink-500/60"
                            }`}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <Badge
                                  variant={
                                    lesson.isFree ? "secondary" : "default"
                                  }
                                  className={
                                    lesson.isFree
                                      ? "bg-secondary text-foreground"
                                      : "bg-gradient-to-r from-pink-500 to-rose-400 text-white border-0"
                                  }
                                >
                                  {lesson.isFree
                                    ? t.dashboard.freeBadge
                                    : t.dashboard.proBadge}
                                </Badge>

                                {isCompleted ? (
                                  <span className="flex items-center gap-1 text-xs font-medium text-pink-500">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {t.dashboard.completed}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.durationMin}{" "}
                                    {t.dashboard.minutesShort}
                                  </span>
                                )}
                              </div>

                              <CardTitle className="font-heading text-base leading-snug">
                                {lesson.title[locale]}
                              </CardTitle>
                              <CardDescription className="text-xs leading-relaxed pt-1">
                                {lesson.subtitle[locale]}
                              </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-0">
                              {locked ? (
                                <Button
                                  onClick={handleUpgrade}
                                  variant="outline"
                                  size="sm"
                                  className="w-full gap-1.5 border-pink-500/40 hover:bg-pink-500/10"
                                >
                                  <Lock className="h-3.5 w-3.5 text-pink-500" />
                                  {t.dashboard.lockedPro}
                                </Button>
                              ) : (
                                <Link
                                  href={`/learn/${lesson.id}`}
                                  className={cn(
                                    buttonVariants({ size: "sm" }),
                                    "w-full bg-primary text-primary-foreground hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white transition-all"
                                  )}
                                >
                                  <Play className="mr-1.5 h-3.5 w-3.5" />
                                  {t.dashboard.openLesson}
                                </Link>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
