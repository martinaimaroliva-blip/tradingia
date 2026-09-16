import { Info } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getProductsByKind, type ProductKind } from "@/lib/products";
import { ProductCard } from "@/components/marketing/product-card";

export function ProductListing({
  kind,
  locale,
  t,
}: {
  kind: ProductKind;
  locale: Locale;
  t: Dictionary;
}) {
  const products = getProductsByKind(kind);
  const copy =
    kind === "bot" ? t.bots : kind === "indicator" ? t.indicators : t.signals;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="container-page relative py-16 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-semibold sm:text-4xl">
            {copy.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {copy.hero.subtitle}
          </p>
        </div>
      </section>

      <div className="container-page py-12 sm:py-16">
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{copy.listNote}</span>
        </div>

        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            {copy.empty}
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                locale={locale}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
