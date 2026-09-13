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
  Copy,
  Check,
  ExternalLink,
  MailCheck,
  Wallet,
  Landmark,
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
import { DEFAULT_EXNESS_REFERRAL_URL } from "@/lib/exness-link";

type Method = "card" | "crypto" | "mercadopago";
type PriceChoice = "standard" | "exness";
type UsdtNetwork = "TRC20" | "BEP20";
type Step =
  | "price"
  | "vps-warning"
  | "details"
  | "exness-gate"
  | "exness-options"
  | "exness-switch"
  | "exness-new"
  | "exness-email"
  | "exness-pending"
  | "payment";

const EXNESS_REFERRAL_URL =
  process.env.NEXT_PUBLIC_EXNESS_REFERRAL_URL || DEFAULT_EXNESS_REFERRAL_URL;

export function BuyDialog({
  slug,
  kind,
  label,
  priceUSD,
  exnessPriceUSD,
  verifiedExnessEmail,
  verifiedExnessToken,
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
  /** Present when the customer arrived via a signed "your Exness account is
   * verified" resume link — lets them skip straight past the Exness gate. */
  verifiedExnessEmail?: string;
  verifiedExnessToken?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  className?: string;
  block?: boolean;
}) {
  const { t, locale } = useI18n();
  const hasDiscount =
    priceUSD != null && exnessPriceUSD != null && exnessPriceUSD < priceUSD;
  const isVerified = Boolean(verifiedExnessEmail && verifiedExnessToken);

  const initialStep: Step = isVerified ? "details" : hasDiscount ? "price" : "details";
  const initialPriceChoice: PriceChoice = isVerified ? "exness" : "standard";

  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState<Step>(initialStep);
  const [priceChoice, setPriceChoice] = React.useState<PriceChoice>(initialPriceChoice);
  const [exnessPath, setExnessPath] = React.useState<"switch" | "new">("new");
  const [method, setMethod] = React.useState<Method>("card");
  const [network, setNetwork] = React.useState<UsdtNetwork>("TRC20");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState(verifiedExnessEmail ?? "");
  const [exnessAccountEmail, setExnessAccountEmail] = React.useState(
    verifiedExnessEmail ?? "",
  );
  // Set when the live Exness Partner API check confirms affiliation during
  // this session (as opposed to `isVerified`, which comes from a resume link
  // opened after a prior, asynchronous confirmation).
  const [liveVerified, setLiveVerified] = React.useState<
    { email: string; token: string } | null
  >(null);

  function reset() {
    setStep(initialStep);
    setPriceChoice(initialPriceChoice);
    setExnessPath("new");
    setMethod("card");
    setNetwork("TRC20");
    setError(null);
    setLoading(false);
    setCopied(false);
    setLiveVerified(null);
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
    if (priceChoice === "exness") {
      if (isVerified) {
        setStep("payment");
      } else {
        setExnessAccountEmail((prev) => prev || email);
        setStep("exness-gate");
      }
    } else {
      setStep("payment");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(EXNESS_REFERRAL_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable — link is still selectable/clickable */
    }
  }

  async function submitExnessEmail() {
    if (exnessAccountEmail.trim() === "") {
      setError(t.checkout.exness.submitError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exness/verify-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          kind,
          name,
          contactEmail: email,
          exnessEmail: exnessAccountEmail,
          path: exnessPath,
          locale,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { verified?: boolean; token?: string };
      if (data.verified && data.token) {
        setLiveVerified({ email: exnessAccountEmail, token: data.token });
        setStep("payment");
      } else {
        setStep("exness-pending");
      }
    } catch {
      setError(t.checkout.exness.submitError);
    } finally {
      setLoading(false);
    }
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
          ...(method === "crypto" ? { cryptoNetwork: network } : {}),
          ...(priceChoice === "exness" && liveVerified
            ? { exnessEmail: liveVerified.email, exnessToken: liveVerified.token }
            : priceChoice === "exness" && isVerified
              ? { exnessEmail: verifiedExnessEmail, exnessToken: verifiedExnessToken }
              : {}),
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
      {
        id: "mercadopago",
        icon: <Wallet className="size-5" />,
        title: t.checkout.dialog.mercadopago,
        hint: t.checkout.dialog.mercadopagoHint,
      },
    ];

  const saving =
    priceUSD != null && exnessPriceUSD != null ? priceUSD - exnessPriceUSD : 0;

  const showBack = step !== initialStep && step !== "exness-pending";

  function back() {
    switch (step) {
      case "payment":
        setStep(isVerified ? "details" : priceChoice === "exness" ? "exness-email" : "details");
        return;
      case "exness-email":
        setStep(exnessPath === "switch" ? "exness-switch" : "exness-new");
        return;
      case "exness-switch":
      case "exness-new":
        setStep("exness-gate");
        return;
      case "exness-options":
        setStep("exness-gate");
        return;
      case "exness-gate":
        setStep("details");
        return;
      case "details":
        setStep(
          priceChoice === "standard" && kind === "bot" ? "vps-warning" : "price",
        );
        return;
      case "vps-warning":
        setStep("price");
        return;
      default:
        return;
    }
  }

  const referralLinkBox = (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-secondary/40 p-2.5">
      <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
        {EXNESS_REFERRAL_URL}
      </span>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium transition-colors hover:bg-secondary"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-accent" /> {t.checkout.exness.copied}
          </>
        ) : (
          <>
            <Copy className="size-3.5" /> {t.checkout.exness.copy}
          </>
        )}
      </button>
    </div>
  );

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

        {step === "exness-gate" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.exness.gateTitle}</DialogTitle>
              <DialogDescription>{t.checkout.exness.gateSubtitle}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2.5">
              <Button onClick={() => setStep("exness-options")} className="w-full">
                {t.checkout.exness.hasAccount}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setExnessPath("new");
                  setStep("exness-new");
                }}
                className="w-full"
              >
                {t.checkout.exness.noAccount}
              </Button>
            </div>
          </>
        )}

        {step === "exness-options" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.exness.optionsTitle}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setExnessPath("switch");
                  setStep("exness-switch");
                }}
                className="rounded-lg border border-border p-4 text-start transition-colors hover:border-primary/40 hover:bg-secondary/40"
              >
                <span className="text-sm font-medium">
                  {t.checkout.exness.switchOption}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t.checkout.exness.switchOptionHint}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setExnessPath("new");
                  setStep("exness-new");
                }}
                className="rounded-lg border border-primary/50 bg-primary/[0.06] p-4 text-start transition-colors hover:bg-primary/10"
              >
                <span className="text-sm font-medium text-primary">
                  {t.checkout.exness.newOption}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t.checkout.exness.newOptionHint}
                </span>
              </button>
            </div>
          </>
        )}

        {step === "exness-switch" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.exness.switchTitle}</DialogTitle>
            </DialogHeader>
            <ol className="grid min-w-0 gap-2.5">
              {[
                t.checkout.exness.switchStep1,
                t.checkout.exness.switchStep2,
                t.checkout.exness.switchStep3,
              ].map((stepText, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-foreground/90">{stepText}</span>
                </li>
              ))}
              <li className="flex gap-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold text-primary">
                  4
                </span>
                <span className="min-w-0 flex-1 pt-0.5">
                  <span className="block text-foreground/90">
                    {t.checkout.exness.switchStep4}
                  </span>
                  <span className="mt-2 block">{referralLinkBox}</span>
                </span>
              </li>
            </ol>
            <p className="rounded-lg bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
              {t.checkout.exness.switchNote}
            </p>
            <Button
              onClick={() => setStep("exness-email")}
              className="w-full"
            >
              {t.checkout.exness.switchDone}
            </Button>
          </>
        )}

        {step === "exness-new" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.exness.newTitle}</DialogTitle>
              <DialogDescription>{t.checkout.exness.newBody}</DialogDescription>
            </DialogHeader>
            <Button asChild className="w-full">
              <a href={EXNESS_REFERRAL_URL} target="_blank" rel="noreferrer nofollow sponsored">
                {t.checkout.exness.newCta}
                <ExternalLink className="size-4" />
              </a>
            </Button>
            {referralLinkBox}
            <Button variant="outline" onClick={() => setStep("exness-email")} className="w-full">
              {t.checkout.exness.newDone}
            </Button>
          </>
        )}

        {step === "exness-email" && (
          <>
            <DialogHeader>
              <span className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MailCheck className="size-5" />
              </span>
              <DialogTitle>{t.checkout.exness.emailTitle}</DialogTitle>
              <DialogDescription>{t.checkout.exness.emailSubtitle}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-1.5">
              <Label htmlFor="exness-email">{t.checkout.exness.emailLabel}</Label>
              <Input
                id="exness-email"
                type="email"
                value={exnessAccountEmail}
                onChange={(e) => setExnessAccountEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={submitExnessEmail} disabled={loading} className="w-full">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? t.checkout.exness.sending : t.checkout.exness.submit}
            </Button>
          </>
        )}

        {step === "exness-pending" && (
          <>
            <DialogHeader>
              <span className="mb-1 inline-flex size-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
                <Check className="size-5" />
              </span>
              <DialogTitle>{t.checkout.exness.pendingTitle}</DialogTitle>
              <DialogDescription>{t.checkout.exness.pendingBody}</DialogDescription>
            </DialogHeader>
            <Button onClick={() => setOpen(false)} className="w-full">
              {t.checkout.exness.pendingCta}
            </Button>
          </>
        )}

        {step === "payment" && (
          <>
            <DialogHeader>
              <DialogTitle>{t.checkout.dialog.title}</DialogTitle>
            </DialogHeader>

            {(liveVerified || (isVerified && priceChoice === "exness")) && (
              <p className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent">
                <Check className="size-3.5" />
                {t.checkout.exness.verifiedBanner}
              </p>
            )}

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

              <div
                aria-disabled
                className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-dashed border-border p-3.5 text-start opacity-60"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-muted-foreground">
                  <Landmark className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {t.checkout.dialog.dlocal}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {t.checkout.dialog.dlocalHint}
                  </span>
                </span>
                <Badge variant="outline" className="ms-auto shrink-0">
                  {t.common.comingSoon}
                </Badge>
              </div>
            </div>

            {method === "crypto" && (
              <div className="grid gap-1.5">
                <Label>{t.checkout.dialog.cryptoNetworkLabel}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["TRC20", "BEP20"] as UsdtNetwork[]).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setNetwork(n)}
                      className={cn(
                        "rounded-lg border py-2 text-sm font-medium transition-colors",
                        network === n
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-secondary/50",
                      )}
                    >
                      {n === "TRC20" ? "USDT (TRC20)" : "USDT (BEP20)"}
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
