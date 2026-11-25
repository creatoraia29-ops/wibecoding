"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Crown } from "lucide-react";
import { useApp } from "@/components/providers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BillingSuccessContent() {
  const { t, refreshUser } = useApp();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    let active = true;
    const sync = async () => {
      if (sessionId) {
        await fetch("/api/stripe/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }).catch(() => {});
      }
      if (active) {
        await refreshUser();
      }
    };
    void sync();
    return () => {
      active = false;
    };
  }, [sessionId, refreshUser]);

  return (
    <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-20">
      <Card className="w-full border-pink-500/50 text-center shadow-xl">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-400/20 text-pink-500">
            <Crown className="h-7 w-7" />
          </div>
          <CardTitle className="font-heading text-2xl">
            {t.billing.successTitle}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t.billing.successDesc}
          </CardDescription>
        </CardHeader>
        {isDemo && (
          <CardContent>
            <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-3 text-xs text-muted-foreground">
              {t.billing.demoNote}
            </div>
          </CardContent>
        )}
        <CardFooter className="justify-center pt-2">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:opacity-90 font-semibold border-0"
            )}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {t.billing.goDashboard}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <BillingSuccessContent />
    </Suspense>
  );
}
