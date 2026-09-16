import Link from "next/link";
import { ArrowRight, Clock, Layers } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Product } from "@/lib/products";
import { formatUSD } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BuyDialog } from "@/components/commerce/buy-dialog";

export function ProductCard({
  product,
  locale,
  t,
}: {
  product: Product;
  locale: Locale;
  t: Dictionary;
}) {
  const base = product.kind === "bot" ? "/bots" : "/indicators";
  const href = `/${locale}${base}/${product.slug}`;
  const detail = product.kind === "bot" ? t.bots.detail : t.indicators.detail;
  const discounted = product.exnessPriceUSD < product.priceUSD;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline">{product.assetLabel[locale]}</Badge>
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

      <Link href={href} className="mt-4 block">
        <h3 className="text-lg font-semibold transition-colors hover:text-primary">
          {product.name}
        </h3>
      </Link>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {product.tagline[locale]}
      </p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" />
          {product.strategyTag[locale]}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {product.timeframe} · {product.platform}
        </span>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-baseline gap-2">
          {discounted && (
            <span className="text-sm text-muted-foreground line-through">
              {formatUSD(product.priceUSD, locale)}
            </span>
          )}
          <span className="text-xl font-semibold text-foreground">
            {formatUSD(
              discounted ? product.exnessPriceUSD : product.priceUSD,
              locale,
            )}
          </span>
          <span className="text-xs text-muted-foreground">{t.common.oneTime}</span>
        </div>
        {discounted && (
          <p className="mt-1 text-xs text-accent">{detail.exnessPriceLabel}</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        {product.requiresConsultation ? (
          <Link
            href={`/${locale}/contact?topic=${product.kind === "bot" ? "bots" : "indicators"}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.bots.detail.customCta}
          </Link>
        ) : (
          <BuyDialog
            slug={product.slug}
            kind={product.kind}
            label={detail.buyCta}
            priceUSD={product.priceUSD}
            exnessPriceUSD={product.exnessPriceUSD}
            size="sm"
            block
          />
        )}
        <Link
          href={href}
          className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.common.viewDetails}
          <ArrowRight className="size-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
