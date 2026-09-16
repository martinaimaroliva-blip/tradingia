"use client";

import * as React from "react";
import { Loader2, NotebookPen } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "loading" | "success" | "error";

export function StrategyDetailsForm({
  defaultEmail,
}: {
  defaultEmail?: string;
}) {
  const { t } = useI18n();
  const [status, setStatus] = React.useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    try {
      const res = await fetch("/api/orders/strategy-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") ?? ""),
          asset: String(data.get("asset") ?? ""),
          timeframe: String(data.get("timeframe") ?? ""),
          entryRules: String(data.get("entryRules") ?? ""),
          exitRules: String(data.get("exitRules") ?? ""),
          riskManagement: String(data.get("riskManagement") ?? ""),
          tools: String(data.get("tools") ?? ""),
          notes: String(data.get("notes") ?? ""),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-8 w-full rounded-xl border border-border bg-card p-6 text-start">
      <div className="flex items-center gap-2 font-medium">
        <NotebookPen className="size-4 text-primary" />
        {t.checkout.strategyForm.title}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {t.checkout.strategyForm.subtitle}
      </p>

      {status === "success" ? (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          {t.checkout.strategyForm.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="sd-email">{t.contact.form.email}</Label>
            <Input
              id="sd-email"
              name="email"
              type="email"
              required
              defaultValue={defaultEmail}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="sd-asset">{t.checkout.strategyForm.asset}</Label>
              <Input id="sd-asset" name="asset" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sd-timeframe">
                {t.checkout.strategyForm.timeframe}
              </Label>
              <Input id="sd-timeframe" name="timeframe" required />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sd-entry">
              {t.checkout.strategyForm.entryRules}
            </Label>
            <Textarea id="sd-entry" name="entryRules" required rows={3} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sd-exit">{t.checkout.strategyForm.exitRules}</Label>
            <Textarea id="sd-exit" name="exitRules" required rows={3} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sd-risk">
              {t.checkout.strategyForm.riskManagement}
            </Label>
            <Textarea id="sd-risk" name="riskManagement" required rows={3} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sd-tools">{t.checkout.strategyForm.tools}</Label>
            <Input id="sd-tools" name="tools" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sd-notes">{t.checkout.strategyForm.notes}</Label>
            <Textarea id="sd-notes" name="notes" rows={2} />
          </div>

          {status === "error" && (
            <p className="text-sm text-destructive">
              {t.checkout.strategyForm.error}
            </p>
          )}

          <Button type="submit" disabled={status === "loading"} className="w-full">
            {status === "loading" && <Loader2 className="size-4 animate-spin" />}
            {status === "loading"
              ? t.checkout.strategyForm.sending
              : t.checkout.strategyForm.submit}
          </Button>
        </form>
      )}
    </div>
  );
}
