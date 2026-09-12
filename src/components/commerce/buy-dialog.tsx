"use client";

import * as React from "react";
import {
  ArrowLeft,
  CreditCard,
  Bitcoin,
  Loader2,
  ShieldCheck,
  Zap,
  Sparkles,
  ServerCrash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUSD } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Method = "card" | "crypto";
type PriceChoice = "standard" | "exness";
type CryptoCoin = "USDT" | "USDC" | "BNB";
type Step = "price" | "vps-warning" | "details" | "payment";

export function BuyDialog({
  slug,
  kind,
  label,
  priceUSD,
  exnessPriceUSD,
  size = "lg",
  variant = "default",
  className,
  block = true,
}: {
  slug: string;
  kind: "bot" | "indicator" | "signal";
  label: string;
  /** Standard price. Omit for products with a single flat price (signals). */
  priceUSD?: number;
  /** Discounted price with the Exness referral. Equal to priceUSD = no discount. */
  exnessPriceUSD?: number;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  block?: boolean;
}) {
  const { t, locale } = useI18n();
  const hasDiscount =
    priceUSD != null && exnessPriceUSD != null && exnessPriceUSD < priceUSD;

  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>(hasDiscount ? "price" : "details");
  const [priceChoice, setPriceChoice] = React.useState<PriceChoice>("standard");
  const [method, setMethod] = React.useState<Method>("card");
  const [coin, setCoin] = React.useState<CryptoCoin>("USDT");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  function reset() {
    setStep(hasDiscount ? "price" : "details");
    setPriceChoice("standard");
    setMethod("card");
    setCoin("USDT");
    setError(null);
    setLoading(false);
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function pickPrice(choice: PriceChoice) {
    setPriceChoice(choice);
    if (choice === "standard" && kind === "bot") {
      setStep("vps-warning");
    } else {
      setStep("details");
    }
  }

  function submitDetails() {
    if (name.trim() === "" || email.trim() === "") {
      setError(t.checkout.dialog.missingFields);
      return;
    }
    setError(null);
    // Someone who turned down the Exness price is exactly who we want to
    // keep nurturing if they don't finish the purchase.
    if (priceChoice === "standard" && hasDiscount) {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          locale,
          source: "checkout_no_exness",
          topic: kind,
        }),
      }).catch(() => {
        /* best-effort — never block checkout on this */
      });
    }
    setStep("payment");
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          kind,
          method,
          locale,
          name,
          email,
          priceChoice,
          ...(method === "crypto" ? { cryptoCurrency: coin } : {}),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "checkout failed");
      window.location.href = data.url;
    } catch {
      setError(t.checkout.dialog.error);
      setLoading(false);
    }
  }

  const methodOptions: { id: Method; icon: React.ReactNode; title: string; hint: string }[] =
    [
      {
        id: "card",
        icon: <CreditCard className="size-5" />,
        title: t.checkout.dialog.card,
        hint: t.checkout.dialog.cardHint,
      },
      {
        id: "crypto",
        icon: <Bitcoin className="size-5" />,
        title: t.checkout.dialog.crypto,
        hint: t.checkout.dialog.cryptoHint,
      },
    ];

  const saving =
    priceUSD != null && exnessPriceUSD != null ? priceUSD - exnessPriceUSD : 0;

  const showBack = step !== (hasDiscount ? "price" : "details");

  function back() {
    if (step === "payment") setStep("details");
    else if (step === "details" && priceChoice === "standard" && kind === "bot")
      setStep("vps-warning");
    else if (step === "details" || step === "vps-warning") setStep("price");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button
        size={size}
        variant={variant}
        className={cn(block && "w-full", className)}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        {showBack && (
          <button
            type="button"
            onClick={back}
            className="-mb-2 inline-flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            {t.common.back}
          </button>
        )}

        {step === "price" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.priceChoice.title}</DialogTitle>
              <DialogDescription>{t.checkout.priceChoice.subtitle}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2.5">
              <button
                type="button"
                onClick={() => pickPrice("standard")}
                className="rounded-lg border border-border p-4 text-start transition-colors hover:border-primary/40 hover:bg-secondary/40"
              >
                <span className="text-sm font-medium">
                  {t.checkout.priceChoice.standardLabel}
                </span>
                <span className="mt-1 block text-xl font-semibold">
                  {priceUSD != null ? formatUSD(priceUSD, locale) : ""}
                </span>
              </button>
              <button
                type="button"
                onClick={() => pickPrice("exness")}
                className="rounded-lg border border-primary/50 bg-primary/[0.06] p-4 text-start transition-colors hover:bg-primary/10"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Sparkles className="size-4" />
                  {t.checkout.priceChoice.exnessLabel}
                  <Badge variant="accent" className="ms-auto">
                    {t.checkout.priceChoice.exnessBadge}
                  </Badge>
                </span>
                <span className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-semibold">
                    {exnessPriceUSD != null ? formatUSD(exnessPriceUSD, locale) : ""}
                  </span>
                  <span className="text-xs font-medium text-accent">
                    {t.checkout.priceChoice.savingsPrefix} {formatUSD(saving, locale)}
                  </span>
                </span>
              </button>
            </div>
          </>
        )}

        {step === "vps-warning" && (
          <>
            <DialogHeader>
              <span className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <ServerCrash className="size-5" />
              </span>
              <DialogTitle>{t.checkout.vpsWarning.title}</DialogTitle>
              <DialogDescription>{t.checkout.vpsWarning.body}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2.5">
              <Button onClick={() => pickPrice("exness")} className="w-full">
                {t.checkout.vpsWarning.ctaExness}
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep("details")}
                className="w-full"
              >
                {t.checkout.vpsWarning.ctaContinue}
              </Button>
            </div>
          </>
        )}

        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.dialog.detailsTitle}</DialogTitle>
              <DialogDescription>{t.checkout.dialog.subtitle}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="buy-name">{t.contact.form.name}</Label>
                <Input
                  id="buy-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="buy-email">{t.contact.form.email}</Label>
                <Input
                  id="buy-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={submitDetails} className="w-full">
              {t.checkout.dialog.continue}
            </Button>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.dialog.title}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-2.5">
              {methodOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMethod(opt.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3.5 text-start transition-colors",
                    method === opt.id
                      ? "border-primary/60 bg-primary/10"
                      : "border-border hover:bg-secondary/50",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-md",
                      method === opt.id
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {opt.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{opt.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {opt.hint}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "ms-auto size-4 shrink-0 rounded-full border-2",
                      method === opt.id
                        ? "border-primary bg-primary"
                        : "border-border",
                    )}
                  />
                </button>
              ))}
            </div>

            {method === "crypto" && (
              <div className="grid gap-1.5">
                <Label>{t.checkout.dialog.cryptoCurrencyLabel}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["USDT", "USDC", "BNB"] as CryptoCoin[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCoin(c)}
                      className={cn(
                        "rounded-lg border py-2 text-sm font-medium transition-colors",
                        coin === c
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary/50",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button onClick={checkout} disabled={loading} className="w-full">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? t.checkout.dialog.processing : t.checkout.dialog.continue}
            </Button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> {t.common.securePayment}
              </span>
              {kind !== "bot" && (
                <span className="inline-flex items-center gap-1">
                  <Zap className="size-3.5" /> {t.common.instantAccess}
                </span>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
