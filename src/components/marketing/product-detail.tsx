import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  FileText,
  MessageCircleQuestion,
  Sparkles,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getProductsByKind, type Product } from "@/lib/products";
import { formatUSD, cn } from "@/lib/utils";
import { fmt } from "@/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BuyDialog } from "@/components/commerce/buy-dialog";
import { ProductCard } from "@/components/marketing/product-card";

export function ProductDetail({
  product,
  locale,
  t,
  verifiedExness,
}: {
  product: Product;
  locale: Locale;
  t: Dictionary;
  /** Set when the visitor arrived via a signed Exness-verification resume link. */
  verifiedExness?: { email: string; token: string } | null;
}) {
  const isBot = product.kind === "bot";
  const isSignal = product.kind === "signal";
  const listBase = isBot ? "/bots" : isSignal ? "/signals" : "/indicators";
  const detail = isBot
    ? t.bots.detail
    : isSignal
      ? t.signals.detail
      : t.indicators.detail;
  const navLabel = isBot ? t.nav.bots : isSignal ? t.nav.signals : t.nav.indicators;
  const lp = (p: string) => `/${locale}${p}`;
  const discounted = product.exnessPriceUSD < product.priceUSD;
  const saving = product.priceUSD - product.exnessPriceUSD;
  const meetUrl = process.env.NEXT_PUBLIC_MEET_URL || lp("/contact");

  const related = getProductsByKind(product.kind)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const specs: { label: string; value: string }[] = [
    { label: t.common.worksOn, value: product.assetLabel[locale] },
    { label: t.common.timeframe, value: product.timeframe },
    { label: t.common.strategy, value: product.strategyTag[locale] },
    { label: t.common.platform, value: product.platform },
  ];

  return (
    <>
      <section className="border-b border-border">
        <div className="container-page py-10 sm:py-14">
          <Link
            href={lp(listBase)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {navLabel}
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{product.assetLabel[locale]}</Badge>
            <Badge variant="default">{product.timeframe}</Badge>
            {product.badge === "popular" && (
              <Badge variant="accent">{t.common.mostPopular}</Badge>
            )}
            {product.badge === "new" && (
              <Badge variant="primary">{t.common.comingSoon}</Badge>
            )}
            {product.badge === "custom" && (
              <Badge variant="primary">{t.common.customBadge}</Badge>
            )}
            {product.badge === "bundle" && (
              <Badge variant="accent">{t.common.bundleBadge}</Badge>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {product.tagline[locale]}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_360px] lg:py-16">
        {/* Main */}
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="text-lg font-semibold">{detail.overview}</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-muted-foreground">
              {product.description[locale]}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{detail.features}</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {product.features[locale].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{detail.howItWorks}</h2>
            <ol className="mt-4 space-y-3">
              {product.howItWorks[locale].map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-secondary text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{detail.specs}</h2>
            <dl className="mt-4 overflow-hidden rounded-xl border border-border">
              {specs.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "flex items-center justify-between gap-4 px-4 py-3 text-sm",
                    i % 2 === 0 ? "bg-card" : "bg-card/50",
                  )}
                >
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card/50 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="size-4 text-primary" />
              {detail.manual}
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {product.requiresConsultation
                ? t.bots.detail.customDeliveryNote
                : detail.deliveryNote}
            </p>
          </section>
        </div>

        {/* Sticky buy card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-6">
            {product.requiresExnessVerification ? (
              <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <Sparkles className="size-3.5" />
                  {t.common.exnessOnlyBadge}
                </div>
                <div className="mt-1 text-3xl font-bold text-foreground">
                  {formatUSD(product.exnessPriceUSD, locale)}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t.common.exnessOnlyHint}
                </p>
                <Link
                  href={lp("/exness")}
                  className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  {t.nav.whyExness} →
                </Link>
              </div>
            ) : (
              <>
                <div className="text-xs font-medium text-muted-foreground">
                  {detail.basePriceLabel}
                </div>
                <div
                  className={cn(
                    "mt-1 text-2xl font-semibold",
                    discounted && "text-muted-foreground line-through decoration-1",
                  )}
                >
                  {formatUSD(product.priceUSD, locale)}
                </div>

                {discounted && (
                  <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                      <Sparkles className="size-3.5" />
                      {detail.exnessPriceLabel}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        {formatUSD(product.exnessPriceUSD, locale)}
                      </span>
                      <span className="text-xs font-medium text-accent">
                        {fmt(detail.save, { amount: formatUSD(saving, locale) })}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {detail.exnessHint}
                    </p>
                    <Link
                      href={lp("/exness")}
                      className="mt-2 inline-block text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {t.nav.whyExness} →
                    </Link>
                  </div>
                )}
              </>
            )}

            <div className="mt-5 space-y-2.5">
              {product.requiresConsultation ? (
                <Button asChild size="lg" className="w-full">
                  <Link
                    href={lp(
                      `/contact?topic=${isBot ? "bots" : isSignal ? "signals" : "indicators"}`,
                    )}
                  >
                    <MessageCircleQuestion className="size-4" />
                    {t.bots.detail.customCta}
                  </Link>
                </Button>
              ) : (
                <>
                  <BuyDialog
                    slug={product.slug}
                    kind={product.kind}
                    label={detail.buyCta}
                    priceUSD={product.priceUSD}
                    exnessPriceUSD={product.exnessPriceUSD}
                    verifiedExnessEmail={verifiedExness?.email}
                    verifiedExnessToken={verifiedExness?.token}
                    requiresExnessVerification={product.requiresExnessVerification}
                    block
                  />
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href={lp("/contact")}>
                      <MessageCircleQuestion className="size-4" />
                      {detail.contactCta}
                    </Link>
                  </Button>
                </>
              )}
              <Button asChild variant="ghost" size="lg" className="w-full">
                <a href={meetUrl} target={meetUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  <CalendarClock className="size-4" />
                  {detail.scheduleCta}
                </a>
              </Button>
            </div>

            {!product.requiresConsultation && (
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                {t.common.securePayment} · {t.common.instantAccess}
              </p>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="container-page py-14">
            <h2 className="text-lg font-semibold">{detail.relatedTitle}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
