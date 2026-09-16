import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { signals, getProduct } from "@/lib/products";
import { verifyExnessToken } from "@/lib/exness";
import { ProductDetail } from "@/components/marketing/product-detail";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    signals.map((s) => ({ locale, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(locale) || !product || product.kind !== "signal") return {};
  return {
    title: `${product.name} — ${product.assetLabel[locale]}`,
    description: product.tagline[locale],
  };
}

export default async function SignalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ exnessEmail?: string; exnessToken?: string }>;
}) {
  const { locale, slug } = await params;
  const { exnessEmail, exnessToken } = await searchParams;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product || product.kind !== "signal") notFound();
  const t = await getDictionary(locale);

  const verified =
    exnessEmail && verifyExnessToken(slug, exnessEmail, exnessToken)
      ? { email: exnessEmail, token: exnessToken! }
      : null;

  return (
    <ProductDetail
      product={product}
      locale={locale as Locale}
      t={t}
      verifiedExness={verified}
    />
  );
}
