import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { indicators, getProduct } from "@/lib/products";
import { ProductDetail } from "@/components/marketing/product-detail";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    indicators.map((i) => ({ locale, slug: i.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(locale) || !product || product.kind !== "indicator") return {};
  return {
    title: `${product.name} — ${product.assetLabel[locale]}`,
    description: product.tagline[locale],
  };
}

export default async function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product || product.kind !== "indicator") notFound();
  const t = await getDictionary(locale);
  return <ProductDetail product={product} locale={locale as Locale} t={t} />;
}
