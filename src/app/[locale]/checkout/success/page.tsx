import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale);

  return (
    <div className="container-page flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-20 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-accent/12 text-accent">
        <CheckCircle2 className="size-7" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
        {t.checkout.success.title}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
        {t.checkout.success.subtitle}
      </p>
      <Button asChild className="mt-7">
        <Link href={`/${locale}`}>{t.checkout.success.cta}</Link>
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">
        {t.checkout.success.note}
      </p>
    </div>
  );
}
