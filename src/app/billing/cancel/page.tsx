"use client";

import React from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { useApp } from "@/components/providers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BillingCancelPage() {
  const { t } = useApp();

  return (
    <div className="mx-auto flex max-w-lg items-center justify-center px-4 py-20">
      <Card className="w-full text-center">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <XCircle className="h-7 w-7" />
          </div>
          <CardTitle className="font-heading text-2xl">
            {t.billing.cancelTitle}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t.billing.cancelDesc}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center pt-2">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t.billing.goDashboard}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
