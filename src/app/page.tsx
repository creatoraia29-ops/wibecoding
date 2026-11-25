"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Code2,
  Crown,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useApp } from "@/components/providers";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const { locale, t, user, startStripeCheckout } = useApp();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    try {
      await startStripeCheckout();
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden border-b border-border/60 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(236,72,153,0.16),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(244,114,182,0.10),_transparent_55%)]" />
        <div className="relative mx-auto grid w-full max-w-[1440px] gap-14 px-4 sm:px-8 lg:grid-cols-12 lg:items-center">
          <div className="space-y-7 lg:col-span-7">
            <Badge className="border border-pink-500/30 bg-pink-500/10 text-foreground px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-pink-500" />
              {t.hero.badge}
            </Badge>

            <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              {t.hero.title}
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 text-sm bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold shadow-lg shadow-pink-500/20 border-0 transition-all"
                )}
              >
                {t.hero.ctaPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#pricing"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 px-7 text-sm border-border hover:border-pink-500/50 hover:bg-pink-500/5 transition-all"
                )}
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-pink-500" />
                <span>{t.hero.stats.stages}</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-pink-500" />
                <span>{t.hero.stats.levels}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-pink-500" />
                <span>{t.hero.stats.reset}</span>
              </div>
            </div>
          </div>

          {/* Interactive Tutor Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-br from-pink-500/25 via-border/40 to-rose-400/20 p-[1px] shadow-2xl">
            <Card className="border-0 bg-card/95 backdrop-blur-xl">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-400 text-white">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {t.lesson.tutorTitle}
                      </CardTitle>
                      <CardDescription className="font-mono text-xs text-pink-500">
                        gemini-3.5-flash-lite
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-pink-500/40 text-xs">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-5 text-sm">
                <div className="rounded-xl border border-border/60 bg-muted/60 p-3 font-mono text-xs">
                  <span className="text-pink-500">student&gt;</span>{" "}
                  {locale === "ru"
                    ? "Сделай Stripe-подписку и сброс лимита в 12:00 дня в Next.js"
                    : "Build Stripe subscription & 12:00 PM noon quota reset in Next.js"}
                </div>
                <div className="rounded-xl border border-pink-500/25 bg-gradient-to-br from-pink-500/5 to-rose-400/10 p-3.5 leading-relaxed">
                  <p className="font-semibold text-foreground mb-1.5">
                    {locale === "ru" ? "Оценка промпта: 8/10" : "Prompt Score: 8/10"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {locale === "ru"
                      ? "Отличная цель! Добавь: 1) какие файлы создать (/api/stripe/checkout, webhook), 2) обработку таймзоны для 12:00 и 3) команду проверки `npm run build`."
                      : "Great goal! Add: 1) exact file paths (/api/stripe/checkout, webhook), 2) timezone handling for 12:00 PM noon, and 3) `npm run build` verification."}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/60 pt-4">
                <Link
                  href="/learn/vibe-intro"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-between text-xs"
                  )}
                >
                  <span>
                    {locale === "ru"
                      ? "Попробовать в первом уроке"
                      : "Try it in Lesson 1"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardFooter>
            </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Learning Stages Section */}
      <section id="stages" className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {t.stages.title}
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              {t.stages.subtitle}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Beginner */}
            <Card className="border-border bg-card p-2 transition-all hover:-translate-y-0.5 hover:border-foreground/30">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{t.stages.beginner.tag}</Badge>
                </div>
                <CardTitle className="font-heading text-xl">
                  {t.stages.beginner.name}
                </CardTitle>
                <CardDescription className="pt-1 leading-relaxed">
                  {t.stages.beginner.desc}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Advanced */}
            <Card className="border-pink-500/40 bg-card p-2 shadow-md transition-all hover:-translate-y-0.5 hover:border-pink-500/70">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-400/20 text-pink-500">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-400 text-white border-0">
                    {t.stages.advanced.tag}
                  </Badge>
                </div>
                <CardTitle className="font-heading text-xl">
                  {t.stages.advanced.name}
                </CardTitle>
                <CardDescription className="pt-1 leading-relaxed">
                  {t.stages.advanced.desc}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Expert */}
            <Card className="border-pink-500/30 bg-gradient-to-br from-card via-card to-pink-500/10 p-2 transition-all hover:-translate-y-0.5 hover:border-pink-500/60">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <Badge className="bg-foreground text-background border border-pink-500/40">
                    {t.stages.expert.tag}
                  </Badge>
                </div>
                <CardTitle className="font-heading text-xl">
                  {t.stages.expert.name}
                </CardTitle>
                <CardDescription className="pt-1 leading-relaxed">
                  {t.stages.expert.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="border-t border-border/60 bg-muted/35 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-14">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {t.pricing.title}
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <Card className="flex flex-col justify-between border-border">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">
                  {t.pricing.free.name}
                </CardTitle>
                <CardDescription>{t.pricing.free.desc}</CardDescription>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold">
                    {t.pricing.free.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t.pricing.free.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.pricing.free.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full"
                  )}
                >
                  {t.pricing.free.cta}
                </Link>
              </CardFooter>
            </Card>

            {/* PRO Plan */}
            <Card className="relative flex flex-col justify-between border-2 border-pink-500/70 bg-card shadow-xl">
              <div className="absolute -top-3.5 right-6">
                <Badge className="bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold px-3 py-1 border-0">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  {t.pricing.pro.badge}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">
                  {t.pricing.pro.name}
                </CardTitle>
                <CardDescription>{t.pricing.pro.desc}</CardDescription>
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
                    {t.pricing.pro.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t.pricing.pro.period}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {t.pricing.pro.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 text-sm">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {user?.plan === "pro" ? (
                  <Button disabled className="w-full" size="lg">
                    {t.pricing.pro.activeCta}
                  </Button>
                ) : (
                  <Button
                    onClick={handleUpgrade}
                    disabled={checkoutLoading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
                  >
                    {checkoutLoading ? "..." : t.pricing.pro.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
