"use client";

import * as React from "react";
import { Loader2, Mail } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

export function InterestForm({
  slug,
  topic,
}: {
  slug: string;
  topic: "signals" | "bots" | "indicators";
}) {
  const { t, locale } = useI18n();
  const [status, setStatus] = React.useState<Status>("idle");
  const [email, setEmail] = React.useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          source: "coming_soon_interest",
          topic,
          path: slug,
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
        <Mail className="size-4 shrink-0" />
        {t.common.interestSuccess}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          placeholder={t.common.interestEmailLabel}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={status === "loading"} className="shrink-0">
          {status === "loading" && <Loader2 className="size-4 animate-spin" />}
          {status === "loading" ? t.common.interestSending : t.common.interestSubmit}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-destructive">{t.common.interestError}</p>
      )}
    </form>
  );
}
