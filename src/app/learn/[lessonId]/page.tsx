"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Bot,
  CheckCircle2,
  Clock,
  Crown,
  Send,
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getLessonById } from "@/data/curriculum";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function LessonPageContent() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params?.lessonId ?? "";
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);

  const { locale, t, user, quota, refreshUser, startStripeCheckout } =
    useApp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);

  const [promptDraft, setPromptDraft] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lesson) {
      setPromptDraft(lesson.promptTask.starterPrompt[locale]);
      setMessages([
        {
          role: "assistant",
          content: t.lesson.tutorWelcome,
        },
      ]);
      setSelectedAnswers({});
      setQuizSubmitted(false);
    }
  }, [lesson, locale, t.lesson.tutorWelcome]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isLockedByPlan = Boolean(
    user && lesson && user.plan === "free" && !lesson.isFree
  );
  const isLimitReached = Boolean(quota?.limitReached);
  const showPaywall = isLockedByPlan || isLimitReached;

  // Practice heartbeat every 15 seconds while lesson is open and unlocked
  useEffect(() => {
    if (!lesson || !user || showPaywall) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/practice/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seconds: 15,
            tzOffsetMinutes: new Date().getTimezoneOffset(),
          }),
        });
        if (res.ok) {
          await refreshUser();
        }
      } catch {
        // Ignore transient network errors
      }
    }, 15_000);

    return () => clearInterval(interval);
  }, [lesson, user, showPaywall, refreshUser]);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Lesson not found.</p>
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          {t.lesson.backToDashboard}
        </Link>
      </div>
    );
  }

  const isCompleted = user?.completedLessons.includes(lesson.id) ?? false;

  const sendToTutor = async (text: string, isPromptReview = false) => {
    if (!text.trim() || sending || showPaywall) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];
    setMessages(nextMessages);
    if (!isPromptReview) setChatInput("");
    setSending(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          locale,
          messages: nextMessages,
          isPromptReview,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error ?? "Error" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (isPromptReview) {
          await fetch("/api/practice/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lessonId: lesson.id, type: "task" }),
          });
          await refreshUser();
        }
      }
    } finally {
      setSending(false);
    }
  };

  const handleCompleteLesson = async () => {
    await fetch("/api/practice/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, type: "lesson" }),
    });
    await refreshUser();
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    const correctCount = lesson.quiz.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
    }, 0);
    const scorePct = Math.round((correctCount / lesson.quiz.length) * 100);
    await fetch("/api/practice/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lessonId: lesson.id,
        type: "quiz",
        score: scorePct,
      }),
    });
    await refreshUser();
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await startStripeCheckout();
    } finally {
      setUpgrading(false);
    }
  };

  const remainingMin = quota ? Math.ceil(quota.remainingSeconds / 60) : 15;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8">
      {/* Top Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="text-xs font-medium text-pink-500 hover:underline"
          >
            {t.lesson.backToDashboard}
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading text-xl font-bold sm:text-2xl">
              {lesson.title[locale]}
            </h1>
            <Badge
              className={
                lesson.isFree
                  ? "bg-secondary text-foreground"
                  : "bg-gradient-to-r from-pink-500 to-rose-400 text-white border-0"
              }
            >
              {lesson.isFree ? t.dashboard.freeBadge : t.dashboard.proBadge}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {lesson.subtitle[locale]}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5 py-1.5 px-3">
            <Clock className="h-3.5 w-3.5 text-pink-500" />
            <span>
              {t.dashboard.remaining}: {remainingMin} {t.dashboard.minutesShort}
            </span>
          </Badge>

          <Button
            onClick={handleCompleteLesson}
            disabled={isCompleted || showPaywall}
            variant={isCompleted ? "secondary" : "default"}
            className={
              !isCompleted
                ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
                : ""
            }
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            {isCompleted ? t.lesson.completedLabel : t.lesson.markComplete}
          </Button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Panel: Theory, Quiz, Prompt Task */}
        <div className="lg:col-span-7">
          <Tabs defaultValue="theory" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="theory">{t.lesson.tabs.theory}</TabsTrigger>
              <TabsTrigger value="quiz">{t.lesson.tabs.quiz}</TabsTrigger>
              <TabsTrigger value="task">{t.lesson.tabs.task}</TabsTrigger>
            </TabsList>

            <TabsContent value="theory" className="mt-4 space-y-4">
              {lesson.theory.map((sec, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-lg">
                      {sec.heading[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {sec.body[locale]}
                    </p>
                    {sec.codeExample && (
                      <pre className="overflow-x-auto rounded-xl border border-pink-500/25 bg-zinc-950 p-4 font-mono text-xs text-zinc-100">
                        <code>{sec.codeExample}</code>
                      </pre>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="quiz" className="mt-4 space-y-4">
              {lesson.quiz.map((q, qIdx) => (
                <Card key={qIdx}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      {qIdx + 1}. {q.question[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {q.options[locale].map((opt, oIdx) => {
                      const selected = selectedAnswers[qIdx] === oIdx;
                      const isCorrect = oIdx === q.correctIndex;
                      let borderClass = "border-border";
                      if (quizSubmitted) {
                        if (isCorrect) borderClass = "border-emerald-500 bg-emerald-500/10";
                        else if (selected) borderClass = "border-destructive bg-destructive/10";
                      } else if (selected) {
                        borderClass = "border-pink-500 bg-pink-500/10";
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() =>
                            !quizSubmitted &&
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [qIdx]: oIdx,
                            }))
                          }
                          className={`w-full rounded-xl border p-3 text-left text-sm transition ${borderClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                    {quizSubmitted && (
                      <p className="pt-2 text-xs text-muted-foreground">
                        {q.explanation[locale]}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button
                onClick={handleSubmitQuiz}
                disabled={quizSubmitted || showPaywall}
                className="bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
              >
                {t.lesson.quizSubmit}
              </Button>
            </TabsContent>

            <TabsContent value="task" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-lg flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-pink-500" />
                    {t.lesson.taskLabel}
                  </CardTitle>
                  <CardDescription className="pt-1 text-sm">
                    {lesson.promptTask.goal[locale]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {lesson.promptTask.requirements[locale].map((req) => (
                      <li key={req} className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-pink-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>

                  <Textarea
                    rows={7}
                    value={promptDraft}
                    onChange={(e) => setPromptDraft(e.target.value)}
                    placeholder={t.lesson.taskPlaceholder}
                    className="font-mono text-xs"
                  />

                  <Button
                    onClick={() => sendToTutor(promptDraft, true)}
                    disabled={sending || showPaywall || !promptDraft.trim()}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t.lesson.taskSubmit}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel: Personal AI Tutor */}
        <div className="lg:col-span-5">
          <Card className="flex h-[600px] lg:h-[calc(100vh-12rem)] flex-col border-pink-500/30 shadow-lg">
            <CardHeader className="border-b border-border/70 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-400 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      {t.lesson.tutorTitle}
                    </CardTitle>
                    <CardDescription className="font-mono text-[11px] text-pink-500">
                      {t.lesson.tutorModel}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "ml-6 bg-pink-500/15 border border-pink-500/30"
                        : "mr-4 bg-muted/70 border border-border/60"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
                {sending && (
                  <div className="mr-4 rounded-xl border border-border/60 bg-muted/50 p-3 text-xs text-muted-foreground">
                    ...
                  </div>
                )}
                <div ref={scrollEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border/70 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void sendToTutor(chatInput, false);
                }}
                className="flex gap-2"
              >
                <Textarea
                  rows={2}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={t.lesson.tutorPlaceholder}
                  className="min-h-[44px] resize-none text-sm"
                />
                <Button
                  type="submit"
                  disabled={sending || !chatInput.trim() || showPaywall}
                  size="icon"
                  className="h-auto w-11 shrink-0 bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 border-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>

      {/* Paywall Dialog (15-min Free Limit or PRO-only Lesson) */}
      <Dialog open={showPaywall}>
        <DialogContent className="sm:max-w-md border-pink-500/50">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-400/20 text-pink-500">
              <Crown className="h-5 w-5" />
            </div>
            <DialogTitle className="font-heading text-xl">
              {isLimitReached
                ? t.lesson.paywall.limitTitle
                : t.lesson.paywall.lessonTitle}
            </DialogTitle>
            <DialogDescription className="pt-1 leading-relaxed">
              {isLimitReached
                ? t.lesson.paywall.limitDesc
                : t.lesson.paywall.lessonDesc}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {t.lesson.paywall.backCta}
            </Link>
            <Button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
            >
              {upgrading ? "..." : t.lesson.paywall.upgradeCta}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <LessonPageContent />
    </Suspense>
  );
}
